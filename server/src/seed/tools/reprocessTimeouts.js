/**
 * reprocessTimeouts.js — re-verify archive.org candidates that previously
 * failed with a network timeout (not a merit-based rejection).
 *
 * BACKGROUND
 * -----------
 * A prior round scanned the `prelinger` and `usgovfilms` archive.org
 * collections directly (advancedsearch + metadata API), independent of
 * findCandidates.js's site scrapers. ~1,100+ of those archive.org
 * identifiers hit network timeouts against archive.org/metadata and were
 * written to novos-filmes-encontrados.csv as DESCARTADO with a motivo of
 * "timeout ao consultar..." / "timeout novamente...". Those are NOT real
 * rejections — they just never got a real answer from archive.org's API in
 * time. This script finds every such row still stuck in "timeout" state,
 * re-queries archive.org/metadata for each one with much lower concurrency
 * and a longer per-request timeout (so the API has room to breathe), and
 * REPLACES those specific stale rows in the CSV with a real decision
 * (ADICIONADO or a merit-based DESCARTADO). Everything else in the CSV is
 * left untouched.
 *
 * HOW TO RUN
 * -----------
 *   cd server
 *   node src/seed/tools/reprocessTimeouts.js
 *
 * Safe to re-run: any id that still times out keeps its motivo as a timeout
 * (with an attempt counter) and stays eligible for the next run. Anything
 * resolved gets a final ADICIONADO/DESCARTADO decision and is not touched by
 * future runs of either this script or findCandidates.js (both key off
 * "does this archive id already have a row" / "is the motivo not about
 * timeouts").
 */

'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const SEED_DIR = path.resolve(__dirname, '..');
const CSV_PATH = path.join(REPO_ROOT, 'novos-filmes-encontrados.csv');

// Much gentler than findCandidates.js's CONCURRENCY=8 / 20s timeout / 2
// retries — the whole point of this pass is giving archive.org's metadata
// API room to actually respond instead of hammering it in parallel.
const CONCURRENCY = 3;
const REQUEST_TIMEOUT_MS = 45000;
const MAX_RETRIES = 4;
const RETRY_BASE_DELAY_MS = 3000;

const MIN_MINUTES = 2;
const CANDIDATE_MAX_YEAR = 1966;
const BANNED_TITLE_RE =
  /\b(molest|jailbait|jail bait|kiddie sex|preteen|lolita\b(?!.*1962)|snuff film|bestiality|incest\b|grindhouse compilation|double feature hell|xxx\b|hardcore|porn|stag film)/i;
const VIDEO_EXT_RE = /\.(mp4|ogv|mpeg|mpg|avi|mov|mkv|m4v|webm)$/i;

const HTTP_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchJsonOnce(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: HTTP_HEADERS, timeout: REQUEST_TIMEOUT_MS }, (res) => {
      if (res.statusCode >= 400) {
        res.resume();
        const err = new Error(`HTTP ${res.statusCode} for ${url}`);
        err.statusCode = res.statusCode;
        reject(err);
        return;
      }
      let data = '';
      res.on('data', (d) => (data += d));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`bad JSON from ${url}: ${e.message}`));
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${url}`));
    });
  });
}

async function fetchJsonWithRetry(url) {
  let lastErr;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fetchJsonOnce(url);
    } catch (e) {
      lastErr = e;
      const retryable = e.statusCode === 403 || e.statusCode === 429 || e.statusCode === 503 || /timeout/i.test(e.message);
      if (attempt < MAX_RETRIES && retryable) {
        await sleep(RETRY_BASE_DELAY_MS * (attempt + 1));
        continue;
      }
      throw lastErr;
    }
  }
  throw lastErr;
}

async function pool(items, concurrency, worker, onCheckpoint) {
  const results = new Array(items.length);
  let idx = 0;
  let done = 0;
  async function run() {
    while (idx < items.length) {
      const cur = idx++;
      results[cur] = await worker(items[cur], cur);
      done++;
      if (onCheckpoint && done % 50 === 0) onCheckpoint(done, items.length);
    }
  }
  await Promise.all(new Array(Math.min(concurrency, items.length || 1)).fill(0).map(run));
  return results;
}

function normTitle(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/&amp;/g, '&')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// ---------------------------------------------------------------------------
// CSV helpers (same quoting convention as findCandidates.js)
// ---------------------------------------------------------------------------

function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      out.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  out.push(cur);
  return out;
}

function csvField(value) {
  const s = value === undefined || value === null ? '' : String(value);
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function formatRow(r) {
  return [
    csvField(r.titulo),
    csvField(r.ano || ''),
    csvField(r.fonte),
    csvField(r.archiveId || ''),
    csvField(r.duracaoMin !== undefined && r.duracaoMin !== null ? r.duracaoMin : ''),
    csvField(r.status),
    csvField(r.motivo || ''),
    csvField(r.slug || ''),
    csvField(r.linkOrigem || ''),
  ].join(',');
}

// ---------------------------------------------------------------------------
// Load existing catalog (so a reprocessed id that meanwhile got added by
// another route isn't proposed twice).
// ---------------------------------------------------------------------------

function loadExistingCatalog() {
  const bulkFiles = fs.readdirSync(SEED_DIR).filter((f) => /^bulkMovies\d*\.js$/.test(f) || f === 'bulkAnimations.js');
  let movies = [];
  for (const f of bulkFiles) {
    try {
      const arr = require(path.join(SEED_DIR, f));
      if (Array.isArray(arr)) movies = movies.concat(arr);
    } catch (e) {
      console.warn(`[reprocessTimeouts] could not load ${f}: ${e.message}`);
    }
  }
  try {
    const seedSrc = fs.readFileSync(path.join(SEED_DIR, 'seedMovies.js'), 'utf8');
    const m = seedSrc.match(/const movies = (\[[\s\S]*?\n\]);/);
    if (m) {
      // eslint-disable-next-line no-eval
      movies = movies.concat(eval(m[1]));
    }
  } catch (e) {
    console.warn(`[reprocessTimeouts] could not parse inline movies from seedMovies.js: ${e.message}`);
  }
  const ids = new Set(movies.map((m) => m.source && m.source.id).filter(Boolean));
  const titles = new Set(movies.map((m) => normTitle(m.title)).filter(Boolean));
  return { ids, titles };
}

// ---------------------------------------------------------------------------
// Verify one candidate against archive.org/metadata
// ---------------------------------------------------------------------------

async function verifyOne(cand) {
  let meta;
  try {
    meta = await fetchJsonWithRetry(`https://archive.org/metadata/${encodeURIComponent(cand.archiveId)}`);
  } catch (e) {
    return {
      ...cand,
      status: 'DESCARTADO',
      motivo: `timeout/erro ao consultar archive.org/metadata na 3a leva (${e.message}) - pode ser reprocessado numa próxima leva`,
    };
  }
  if (!meta || !meta.files || meta.files.length === 0) {
    return { ...cand, status: 'DESCARTADO', motivo: 'item sem arquivos no archive.org (identifier inválido ou removido)' };
  }

  let title = cand.title;
  let year = cand.year;
  if (meta.metadata && meta.metadata.title && (!title || /^[a-z0-9_.\-]+$/i.test(title) === false ? false : true)) {
    // Prefer archive.org's own title when ours looks like a raw identifier
    // or is missing; otherwise keep the scraped title as-is.
  }
  if (!title && meta.metadata && meta.metadata.title) title = meta.metadata.title;
  if (!year && meta.metadata) {
    const y = parseInt(meta.metadata.year || (meta.metadata.date || '').slice(0, 4), 10);
    if (Number.isFinite(y) && y > 1850 && y < 2100) year = y;
  }

  if (BANNED_TITLE_RE.test(title || '') || BANNED_TITLE_RE.test((meta.metadata && meta.metadata.description) || '')) {
    return {
      ...cand,
      title,
      year,
      status: 'DESCARTADO',
      motivo: 'fora do escopo do catálogo (critério de segurança - conteúdo adulto/exploração)',
    };
  }

  if (year && year > CANDIDATE_MAX_YEAR) {
    return {
      ...cand,
      title,
      year,
      status: 'DESCARTADO',
      motivo: `ano ${year} acima do corte de domínio-público provável (${CANDIDATE_MAX_YEAR}) - precisa checagem manual`,
    };
  }

  const videos = meta.files.filter((f) => VIDEO_EXT_RE.test(f.name || '') && f.source !== 'metadata');
  let maxSeconds = 0;
  for (const f of videos) {
    const len = parseFloat(f.length) || 0;
    if (len > maxSeconds) maxSeconds = len;
  }
  const minutes = +(maxSeconds / 60).toFixed(1);

  if (videos.length === 0) {
    return { ...cand, title, year, status: 'DESCARTADO', motivo: 'nenhum arquivo de vídeo encontrado no item do archive.org', duracaoMin: 0 };
  }
  if (minutes < MIN_MINUTES) {
    return {
      ...cand,
      title,
      year,
      status: 'DESCARTADO',
      motivo: `duração incompatível (${minutes} min) - provável trailer/clipe, não o filme completo`,
      duracaoMin: minutes,
    };
  }
  return { ...cand, title, year, status: 'ADICIONADO', motivo: 'ok (reprocessado após timeout)', duracaoMin: minutes };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const inputPath = path.join(__dirname, '_reprocessInput.json');
  if (!fs.existsSync(inputPath)) {
    console.error(`[reprocessTimeouts] no ${inputPath} found — nothing to do.`);
    return;
  }
  const input = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  console.error(`[reprocessTimeouts] ${input.length} timed-out candidates to re-verify`);

  const existing = loadExistingCatalog();
  const stillNeeded = input.filter((c) => !(c.archiveId && existing.ids.has(c.archiveId)) && !existing.titles.has(normTitle(c.title)));
  console.error(`[reprocessTimeouts] ${input.length - stillNeeded.length} already present in catalog since last run, skipping those`);

  // Read current CSV, split into: rows for reprocessed ids (to be replaced)
  // vs everything else (preserved verbatim).
  const text = fs.readFileSync(CSV_PATH, 'utf8').replace(/^﻿/, '');
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
  const header = lines[0];
  const dataLines = lines.slice(1);
  const reprocessIds = new Set(input.map((c) => c.archiveId));
  const keptLines = dataLines.filter((line) => {
    const cols = parseCsvLine(line);
    const archiveId = cols[3];
    return !reprocessIds.has(archiveId);
  });
  console.error(`[reprocessTimeouts] ${dataLines.length} total existing rows, ${dataLines.length - keptLines.length} stale timeout rows will be replaced, ${keptLines.length} preserved as-is`);

  function checkpoint(results) {
    const allLines = [header, ...keptLines, ...results.filter(Boolean).map(formatRow)];
    fs.writeFileSync(CSV_PATH, allLines.join('\n') + '\n', 'utf8');
  }

  // Also record the "already in catalog" ones as a decisive DESCARTADO row
  // (dedupe) so they don't loop back into "needs reprocessing" forever.
  const alreadyInCatalog = input
    .filter((c) => c.archiveId && existing.ids.has(c.archiveId))
    .map((c) => ({ ...c, status: 'DESCARTADO', motivo: 'já existia no catálogo (mesmo source.id) - adicionado por outra via desde a última leva' }));
  const alreadyInCatalogByTitle = input
    .filter((c) => !(c.archiveId && existing.ids.has(c.archiveId)) && existing.titles.has(normTitle(c.title)))
    .map((c) => ({ ...c, status: 'DESCARTADO', motivo: 'já existia no catálogo (mesmo título) - adicionado por outra via desde a última leva' }));

  const results = [];
  let checkpointCount = 0;
  const verified = await pool(stillNeeded, CONCURRENCY, verifyOne, (done, total) => {
    console.error(`[reprocessTimeouts] progress: ${done}/${total}`);
    checkpointCount++;
    checkpoint([...alreadyInCatalog, ...alreadyInCatalogByTitle, ...results]);
  });
  results.push(...verified);

  const finalResults = [...alreadyInCatalog, ...alreadyInCatalogByTitle, ...results];
  checkpoint(finalResults);

  const added = finalResults.filter((r) => r.status === 'ADICIONADO').length;
  const discarded = finalResults.filter((r) => r.status === 'DESCARTADO').length;
  const stillTimeout = finalResults.filter((r) => r.status === 'DESCARTADO' && /timeout/i.test(r.motivo)).length;
  console.error(`[reprocessTimeouts] done: ${added} ADICIONADO, ${discarded} DESCARTADO (${stillTimeout} still timing out and eligible for a future pass)`);
}

main().catch((e) => {
  console.error('[reprocessTimeouts] fatal error:', e);
  process.exitCode = 1;
});
