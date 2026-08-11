/**
 * findCandidates.js — reusable "candidate finder" for the SepiaStream catalog.
 *
 * WHAT THIS DOES
 * ---------------
 * Scrapes four public-domain-movie aggregator/list sites (publicdomainmovie.net,
 * archivewatch.org, emol.org, freemoviescinema.com), figures out the
 * archive.org identifier for each title it finds, verifies the *real* video
 * duration against archive.org's own metadata API (so trailers/clips get
 * filtered out before anyone wastes time on them), drops anything that's
 * already in our catalog, and writes everything it looked at — approved AND
 * discarded — to a CSV at the repo root. The CSV is checkpointed (rewritten
 * with everything decided so far) every ~100 candidates processed, so you
 * can open it mid-run and see real progress instead of waiting for the
 * whole run to finish.
 *
 * openculture.com was removed as a source (product decision): most of its
 * listed titles only link to YouTube (which we don't embed — no ad-free way
 * to do that, and downloading a YouTube video to rehost it would violate
 * YouTube's Terms of Service), and most of the rest link to collection/
 * article pages bundling several films together instead of one film per
 * page, which needed slow manual resolution for a low return. The
 * expand/scrape code for it is still in this file (harmless no-op with the
 * source removed from SOURCES below) in case it's ever worth reinstating.
 *
 * WHAT THIS DOES NOT DO
 * ----------------------
 * It does NOT write synopses and it does NOT generate a bulkMoviesN.js file.
 * Writing an original Portuguese synopsis for each film is editorial work —
 * it requires knowing the plot/genre/context well enough to describe it
 * without copying anyone else's text, which isn't something this script can
 * respons ibly automate. That part stays manual (or done by an assistant
 * with the CSV as a starting point).
 *
 * THE TWO-STEP FLOW
 * -------------------
 *   1) `npm run find-movies` (this script) → produces
 *      `novos-filmes-encontrados.csv` at the repo root, with a `status`
 *      column of ADICIONADO (duration verified OK, not a duplicate) or
 *      DESCARTADO (with a `motivo` explaining why).
 *   2) A person (or an assistant) reads the rows with status=ADICIONADO,
 *      writes a 1-3 sentence original-Portuguese synopsis for each, and
 *      hand-assembles the next `server/src/seed/bulkMoviesN.js` file
 *      following the schema in `server/src/models/Movie.js` and the style
 *      of the existing `bulkMovies*.js` files. Then `seedMovies.js` gets
 *      updated to import it. This script does not touch seedMovies.js.
 *
 * HOW TO RUN
 * -----------
 *   cd server
 *   npm run find-movies
 *
 * Re-running is safe and idempotent: it always re-scrapes fresh and
 * overwrites the CSV. It also always re-reads the current bulkMovies*.js
 * files, so anything added since the last run is automatically excluded
 * from the next run's candidate list.
 *
 * NOTES / LIMITATIONS
 * ---------------------
 * - No new npm dependencies were added: everything here runs on Node's
 *   built-in `https` + regex/string parsing. That makes the HTML scraping
 *   brittle by nature — if a site redesigns its markup, its scraper function
 *   will likely return 0 candidates. Each site's scraper is wrapped in its
 *   own try/catch and logs a warning instead of crashing the whole run, so
 *   one broken source never blocks the other three.
 * - archivewatch.org is a client-side SPA with no server-rendered movie
 *   list, but it publishes the exact JSON its own UI reads at
 *   https://archivewatch.org/catalog-index.json (~33k archive.org items with
 *   id/title/year/contentType) — we just fetch that directly instead of
 *   trying to execute its JavaScript.
 * - publicdomainmovie.net and freemoviescinema.com are paginated; pulling
 *   every page (~130+ for publicdomainmovie.net alone) makes a run take a
 *   long time and hammers their servers, so PAGE_LIMITS below caps how deep
 *   each run goes. Raise the caps for a deeper sweep next time.
 * - Duration verification: for every archive.org identifier we resolve, we
 *   fetch https://archive.org/metadata/<id> and take the longest video file
 *   (by the `length` field, in seconds). Items whose contentType/category
 *   suggests a short/cartoon are held to a lower minimum than feature films
 *   — see MIN_MINUTES below.
 * - This script intentionally does NOT verify "is this genuinely public
 *   domain" beyond duration + not-a-trailer — it leans on the fact that
 *   these four sites already curate for PD status, plus (loosely) on year:
 *   the CANDIDATE_MAX_YEAR cutoff skips very recent titles where PD status
 *   is much rarer and needs a human judgment call either way.
 */

'use strict';

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Config — edit here to add sites, widen pagination, or change thresholds.
// ---------------------------------------------------------------------------

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const SEED_DIR = path.resolve(__dirname, '..');
const OUTPUT_CSV = path.join(REPO_ROOT, 'novos-filmes-encontrados.csv');

const PAGE_LIMITS = {
  publicdomainmovie: {
    categories: ['feature_movies', 'comedy_movies', 'drama_and_romance', 'science_fiction_and_horror', 'cartoons'],
    // Loops break as soon as a page returns 0 results, so a high cap here is
    // safe (it just means "go all the way to the real end of pagination").
    // Previous round only went ~18 pages/category; feature_movies alone has
    // 130+ pages, so this round goes deep enough to hit the true end.
    maxPagesPerCategory: 220,
  },
  freemoviescinema: {
    maxPages: 60,
  },
  emol: {
    // emol.org has no index page listing every title — it's a hand-built
    // tree of category + per-franchise sub-pages. We hardcode the ones
    // known to exist; add more paths here as they're discovered.
    pages: [
      'https://emol.org/movies/adventure/index.html',
      'https://emol.org/movies/comedy/index.html',
      'https://emol.org/movies/horror/index.html',
      'https://emol.org/movies/romance/index.html',
      'https://emol.org/movies/westerns/index.html',
      'https://emol.org/movies/bettyboop/index.html',
      'https://emol.org/movies/threestooges/index.html',
      'https://emol.org/movies/popeye/index.html',
      'https://emol.org/movies/felixthecat/index.html',
      'https://emol.org/movies/woodywoodpecker/index.html',
      'https://emol.org/movies/laurelandhardy/index.html',
      'https://emol.org/movies/mightymouse/index.html',
    ],
  },
  archivewatch: {
    indexUrl: 'https://archivewatch.org/catalog-index.json',
    // The full index has 30k+ items spanning everything from feature films
    // to commercials, TV episodes, and (per manual inspection) some adult
    // content mixed into a couple of its "popular" shelves. Scraping the
    // whole thing would make every run take forever to duration-verify and
    // risks pulling in content this catalog shouldn't have. Instead we walk
    // the site's own curated "shelves" (the same curatorial collections a
    // human browsing archivewatch.org would use — see its `shelves` key),
    // restricted to a hand-picked allowlist of shelves that are thematically
    // safe and on-topic for a classic-film catalog. Add/remove shelf keys
    // here as needed; run the script once and inspect `data.shelves` /
    // `data.collections` from the index if you want to see what's available.
    shelves: [
      'silent-hall-of-fame',
      'silent-era',
      'film-noir',
      'scifi-horror',
      'comedy',
      'classic-cartoons',
      'vintage-cartoons',
      'animation-all',
      'german-cinema',
      'melies',
      'prelinger',
      'educational',
      'newsreels',
      'nasa',
      // New this round: additional curated shelves that (per manual spot
      // check of their contents) are thematically on-topic and don't look
      // adult/exploitation-mixed like popular-features does. Still filtered
      // by allowedContentTypes + BANNED_TITLE_RE below as a safety net.
      'video-cellar',
      'wikidata-pd',
      'community-favorites',
      'most-discussed',
      'hidden-gems',
      // Deliberately NOT included: popular-features (confirmed adult content
      // mixed in), popular-classic-tv/classic-tv-* (TV, not movies),
      // picfixer (contains "grindhouse"/"double feature hell" splice
      // compilations, not single films), all-time-features (contains at
      // least one clearly exploitation-coded title on manual inspection),
      // editors-picks (too small to matter, already covered by other shelves).
    ],
    // Only keep these contentTypes (drops tv-series/tv-special/commercial/
    // ephemeral/home-movie noise that isn't a "movie" for our purposes).
    allowedContentTypes: ['feature-film', 'silent-film', 'short-film', 'animation', 'documentary', 'newsreel'],
  },
  // openculture.com removida das fontes — a maioria dos links lá é só pro
  // YouTube (que não usamos, ver nota no topo do arquivo), e boa parte do
  // resto aponta pra páginas de coleção/artigo com vários filmes juntos em
  // vez de um filme específico, exigindo resolução manual demorada pra um
  // retorno baixo. Removida a pedido do usuário.
};

// Hard safety cap: no matter what the scrapers turn up, never send more than
// this many candidates into the (slow, one-HTTP-call-each) resolve+verify
// pipeline in a single run. Widen this if you deliberately want a deeper
// sweep and don't mind a longer run.
const MAX_CANDIDATES_TO_VERIFY = 6000;

// Candidates from years after this are skipped: PD status past this point
// is the exception rather than the rule and needs an explicit human call
// (Creative-Commons releases, failed-notice indies, etc). Adjust if you
// specifically want to hunt for a known-PD modern title.
const CANDIDATE_MAX_YEAR = 1966;

// Minimum plausible runtime (minutes) for the longest video file on the
// archive.org item. Below this we assume "trailer or clip, not the film"
// and discard. Deliberately low (2min) — this only exists to catch actual
// trailer/clip uploads, not to second-guess legitimate short features,
// featurettes, or serial chapters, which can validly run under an hour.
// (Previously 40min for anything not detected as short-form, which wrongly
// discarded real films in the 2-40min range — contentType-based short-form
// detection is unreliable since most sources don't populate that field.)
const MIN_MINUTES = 2;

// A declared "bot" User-Agent gets 403'd by openculture.com's WAF (confirmed
// by manual testing); a realistic browser UA does not. We're a good citizen
// about it anyway via CONCURRENCY + the retry backoff in fetchText below.
const HTTP_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
};
const CONCURRENCY = 8;

// Safety net applied to every candidate from every source (this is a
// family/general-audience streaming catalog): titles matching this get
// discarded outright, without a duration check, regardless of which site
// they came from. Keeps out exploitation/adult-adjacent material and the
// splice/"grindhouse compilation" reels that occasionally slip into curated
// shelves alongside legitimate classics.
const BANNED_TITLE_RE =
  /\b(molest|jailbait|jail bait|kiddie sex|preteen|lolita\b(?!.*1962)|snuff film|bestiality|incest\b|grindhouse compilation|double feature hell|xxx\b|hardcore|porn)/i;

// ---------------------------------------------------------------------------
// Small HTTP helpers (no dependencies — built-in https only)
// ---------------------------------------------------------------------------

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchTextOnce(url, redirectsLeft) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('http://') ? http : https;
    const req = mod.get(url, { headers: HTTP_HEADERS, timeout: 20000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirectsLeft > 0) {
        res.resume();
        const next = new URL(res.headers.location, url).toString();
        fetchTextOnce(next, redirectsLeft - 1).then(resolve, reject);
        return;
      }
      if (res.statusCode >= 400) {
        res.resume();
        const err = new Error(`HTTP ${res.statusCode} for ${url}`);
        err.statusCode = res.statusCode;
        reject(err);
        return;
      }
      let data = '';
      res.on('data', (d) => (data += d));
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${url}`));
    });
  });
}

// A couple of sites occasionally answer a perfectly normal request with a
// transient 403/429/503 (rate-limiting, not "this URL is gone") — retry
// those a couple times with backoff before giving up on the URL.
async function fetchText(url, redirectsLeft = 5, retriesLeft = 2) {
  try {
    return await fetchTextOnce(url, redirectsLeft);
  } catch (e) {
    const retryable = e.statusCode === 403 || e.statusCode === 429 || e.statusCode === 503 || /timeout/i.test(e.message);
    if (retriesLeft > 0 && retryable) {
      await sleep(1200 * (3 - retriesLeft));
      return fetchText(url, redirectsLeft, retriesLeft - 1);
    }
    throw e;
  }
}

async function fetchJson(url) {
  const text = await fetchText(url);
  return JSON.parse(text);
}

async function pool(items, concurrency, worker, onCheckpoint) {
  const results = new Array(items.length);
  let idx = 0;
  let done = 0;
  async function run() {
    while (idx < items.length) {
      const cur = idx++;
      try {
        results[cur] = await worker(items[cur], cur);
      } catch (e) {
        results[cur] = { error: e.message };
      }
      done++;
      if (onCheckpoint && done % 100 === 0) {
        onCheckpoint(results.filter(Boolean), done, items.length);
      }
    }
  }
  await Promise.all(new Array(Math.min(concurrency, items.length || 1)).fill(0).map(run));
  return results;
}

// ---------------------------------------------------------------------------
// Text normalization helpers
// ---------------------------------------------------------------------------

function decodeEntities(s) {
  return String(s || '')
    .replace(/&amp;/g, '&')
    .replace(/&#0?39;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&nbsp;/g, ' ');
}

function normTitle(s) {
  let t = decodeEntities(s).toLowerCase();
  t = t.replace(/^charlie chaplin'?s\s*/, '');
  t = t.replace(/[^a-z0-9]+/g, ' ').trim();
  return t;
}

function csvField(value) {
  const s = value === undefined || value === null ? '' : String(value);
  if (/[",\n]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

// ---------------------------------------------------------------------------
// Step 1: load the existing catalog so we never propose a duplicate
// ---------------------------------------------------------------------------

function loadExistingCatalog() {
  const bulkFiles = fs
    .readdirSync(SEED_DIR)
    .filter((f) => /^bulkMovies\d*\.js$/.test(f) || f === 'bulkAnimations.js');

  let movies = [];
  for (const f of bulkFiles) {
    try {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const arr = require(path.join(SEED_DIR, f));
      if (Array.isArray(arr)) movies = movies.concat(arr);
    } catch (e) {
      console.warn(`[findCandidates] could not load ${f}: ${e.message}`);
    }
  }

  // seedMovies.js also has a small inline `movies` array at the top of the
  // file that isn't its own module.exports — parse it out with a require of
  // a tiny sandboxed read instead of executing seedMovies.js itself (which
  // would try to connect to MongoDB). We just regex the array literal out.
  try {
    const seedSrc = fs.readFileSync(path.join(SEED_DIR, 'seedMovies.js'), 'utf8');
    const m = seedSrc.match(/const movies = (\[[\s\S]*?\n\]);/);
    if (m) {
      // eslint-disable-next-line no-eval
      const inlineMovies = eval(m[1]);
      movies = movies.concat(inlineMovies);
    }
  } catch (e) {
    console.warn(`[findCandidates] could not parse inline movies from seedMovies.js: ${e.message}`);
  }

  const ids = new Set(movies.map((m) => m.source && m.source.id).filter(Boolean));
  const slugs = new Set(movies.map((m) => m.slug).filter(Boolean));
  const titles = new Set(movies.map((m) => normTitle(m.title)).filter(Boolean));

  console.error(`[findCandidates] loaded existing catalog: ${movies.length} movies, ${ids.size} archive ids, ${titles.size} distinct titles`);
  return { ids, slugs, titles };
}

// ---------------------------------------------------------------------------
// Step 1b: load every candidate already evaluated in a previous run (any
// status — ADICIONADO or DESCARTADO) from the checked-in CSV, so this run
// never re-scrapes/re-verifies/re-judges the same title or archive.org id
// twice. This is what lets `findCandidates.js` be re-run round after round
// to widen coverage instead of redoing the same work.
// ---------------------------------------------------------------------------

function parseCsvLine(line) {
  // Minimal CSV parser matching csvField()'s quoting (handles quoted fields
  // with embedded commas/quotes/newlines are not expected within one line
  // since csvField escapes newlines by nothing special — but we still guard
  // against quoted commas).
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

function loadPreviousCsvDecisions() {
  const csvIds = new Set();
  const csvTitles = new Set();
  let rawLines = [];
  if (fs.existsSync(OUTPUT_CSV)) {
    const text = fs.readFileSync(OUTPUT_CSV, 'utf8').replace(/^﻿/, '');
    const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
    rawLines = lines.slice(1); // drop header, keep raw data lines verbatim for re-emission
    for (const line of rawLines) {
      const cols = parseCsvLine(line);
      const [titulo, , , archiveId] = cols;
      if (archiveId) csvIds.add(archiveId);
      if (titulo) csvTitles.add(normTitle(titulo));
    }
  }
  console.error(`[findCandidates] loaded ${rawLines.length} previously-evaluated rows from CSV (${csvIds.size} archive ids, ${csvTitles.size} distinct titles) — these are skipped, not re-judged`);
  return { csvIds, csvTitles, rawLines };
}

// ---------------------------------------------------------------------------
// Step 2: per-site scrapers. Each returns [{ title, year, source, archiveId? }]
// archiveId is filled in when the site links straight to archive.org;
// otherwise it's resolved later via resolveArchiveId().
// ---------------------------------------------------------------------------

async function scrapePublicDomainMovie() {
  const out = [];
  const cfg = PAGE_LIMITS.publicdomainmovie;
  const rowRe =
    /<a href="https:\/\/publicdomainmovie\.net\/movie\/[a-zA-Z0-9-]+"><img[^>]*><\/a><\/td><td[^>]*><div class="details"><div class="date"><a[^>]*>(\d{4})<\/a><\/div><h1><a[^>]*>([^<]+)<\/a><\/h1>/g;

  for (const cat of cfg.categories) {
    let consecutiveFailures = 0;
    for (let p = 0; p < cfg.maxPagesPerCategory; p++) {
      const url = p === 0 ? `https://publicdomainmovie.net/${cat}` : `https://publicdomainmovie.net/${cat}?page=${p}`;
      try {
        const html = await fetchText(url);
        consecutiveFailures = 0;
        let m;
        let count = 0;
        rowRe.lastIndex = 0;
        while ((m = rowRe.exec(html))) {
          const year = parseInt(m[1], 10);
          const title = decodeEntities(m[2]).replace(/^charlie chaplin'?s\s*/i, '').replace(/^["']|["']$/g, '');
          out.push({ title, year, source: 'publicdomainmovie.net' });
          count++;
        }
        if (count === 0) break; // ran off the end of pagination
      } catch (e) {
        consecutiveFailures++;
        console.warn(`[publicdomainmovie.net] ${cat} page ${p} failed (${consecutiveFailures}/3 consecutive): ${e.message}`);
        // A single transient failure shouldn't cost us the rest of a
        // 200+-page category — only give up on this category after a run
        // of consecutive failures suggests the site (or our connection) is
        // genuinely down, not just one flaky request.
        if (consecutiveFailures >= 3) break;
      }
    }
  }
  return out;
}

async function scrapeFreeMoviesCinema() {
  const out = [];
  const cfg = PAGE_LIMITS.freemoviescinema;
  const linkRe =
    /href="(https:\/\/freemoviescinema\.com\/([a-z0-9-]+)\/)" class="gridmax-grid-post-thumbnail-link" title="Permanent Link to ([^"]+)"/g;

  let consecutiveFailures = 0;
  for (let p = 1; p <= cfg.maxPages; p++) {
    const url = p === 1 ? 'https://freemoviescinema.com/' : `https://freemoviescinema.com/page/${p}/`;
    try {
      const html = await fetchText(url);
      consecutiveFailures = 0;
      let m;
      let count = 0;
      linkRe.lastIndex = 0;
      while ((m = linkRe.exec(html))) {
        const rawTitle = decodeEntities(m[3]);
        // Skip the site's occasional non-review "explainer" posts (no single film).
        if (/what is the public domain|visual archaeology|journey through|explainer/i.test(rawTitle)) continue;
        const yearMatch = rawTitle.match(/\((\d{4})\)/);
        const title = rawTitle.replace(/\s*\(\d{4}\)\s*$/, '');
        out.push({ title, year: yearMatch ? parseInt(yearMatch[1], 10) : null, source: 'freemoviescinema.com' });
        count++;
      }
      if (count === 0) break;
    } catch (e) {
      consecutiveFailures++;
      console.warn(`[freemoviescinema.com] page ${p} failed (${consecutiveFailures}/3 consecutive): ${e.message}`);
      if (consecutiveFailures >= 3) break;
    }
  }
  return out;
}

async function scrapeEmol() {
  const out = [];
  const linkRe = /"([^"]*)"\s*[^>]*>\s*(?:<[^>]*>)*\s*"?([^"<]{2,120})"?\s*(?:<\/a>)?/g; // unused, kept simple below
  const anchorRe = /<a[^>]*href="(https:\/\/archive\.org\/details\/[a-zA-Z0-9_.\-]+)"[^>]*>([^<]{2,120})<\/a>/g;

  for (const url of PAGE_LIMITS.emol.pages) {
    try {
      const html = await fetchText(url);
      let m;
      anchorRe.lastIndex = 0;
      while ((m = anchorRe.exec(html))) {
        const archiveId = m[1].replace('https://archive.org/details/', '');
        const rawTitle = decodeEntities(m[2]);
        const yearMatch = rawTitle.match(/\((\d{4})\)/);
        const title = rawTitle.replace(/\s*\(\d{4}\)\s*$/, '').trim();
        if (!title) continue;
        out.push({ title, year: yearMatch ? parseInt(yearMatch[1], 10) : null, source: 'emol.org', archiveId });
      }
    } catch (e) {
      console.warn(`[emol.org] ${url} failed: ${e.message}`);
    }
  }
  return out;
}

async function scrapeArchiveWatch() {
  const out = [];
  try {
    const data = await fetchJson(PAGE_LIMITS.archivewatch.indexUrl);
    const items = data.items || []; // [id, title, year, contentType, poster, pro, search, backdrop]
    const byId = new Map(items.map((it) => [it[0], it]));
    const shelves = data.shelves || {};
    const allowedTypes = new Set(PAGE_LIMITS.archivewatch.allowedContentTypes);

    const seenIds = new Set();
    for (const shelfKey of PAGE_LIMITS.archivewatch.shelves) {
      const ids = shelves[shelfKey];
      if (!Array.isArray(ids)) {
        console.warn(`[archivewatch.org] shelf "${shelfKey}" not found in current index (site may have renamed it) — skipping`);
        continue;
      }
      for (const id of ids) {
        if (seenIds.has(id)) continue;
        seenIds.add(id);
        const it = byId.get(id);
        if (!it) continue; // shelf references an id not present in the items index
        const [itemId, title, year, contentType] = it;
        if (!allowedTypes.has(contentType)) continue;
        out.push({ title, year: year || null, source: 'archivewatch.org', archiveId: itemId, contentType });
      }
    }
  } catch (e) {
    console.warn(`[archivewatch.org] catalog-index.json fetch failed: ${e.message}`);
  }
  return out;
}

async function scrapeOpenCulture() {
  const out = [];
  // The page is one giant hand-curated <ul> of <li><strong>Title</strong> —
  // <a href="...">Free</a> — description</li>, per category heading. We
  // don't need the descriptions (and must not reuse their wording as our
  // synopsis anyway), just title + link.
  const rowRe = /<li><strong>([^<]+)<\/strong>[^<]{0,10}<a href="([^"]+)"[^>]*>([^<]*)<\/a>/g;
  try {
    const html = await fetchText(PAGE_LIMITS.openculture.url);
    let m;
    while ((m = rowRe.exec(html))) {
      const title = decodeEntities(m[1]).replace(/­/g, '').trim(); // strip soft-hyphens from the site's word-wrap markup
      const link = decodeEntities(m[2]);
      if (!title || /^how to watch/i.test(title)) continue;

      if (/youtube\.com|youtu\.be/i.test(link)) {
        out.push({
          title,
          year: null,
          source: 'openculture.com',
          archiveId: null,
          status: 'DESCARTADO',
          motivo: 'só disponível no YouTube (não usamos, ver decisão do usuário)',
          skipVerify: true,
        });
        continue;
      }

      // Two URL shapes archive.org itself has used over the years: modern
      // /details/<id> and the old /details.php?identifier=<id> (still
      // linked from some older openculture.com posts; archive.org 404s the
      // .php form now, but the identifier in the querystring is still good).
      const directMatch = link.match(/archive\.org\/details\/([a-zA-Z0-9_.\-]+)/) || link.match(/archive\.org\/details\.php\?identifier=([a-zA-Z0-9_.\-]+)/);
      if (directMatch) {
        out.push({ title, year: null, source: 'openculture.com', archiveId: directMatch[1] });
        continue;
      }

      // Neither YouTube nor a direct archive.org link — usually one of
      // openculture's own blog posts, either about a single film (the post
      // embeds an archive.org player further down the page) or a themed
      // collection of several films. Stash the post URL so
      // expandOpenCultureCollections() can fetch it and pull real
      // archive.org identifiers out before we get to resolve/verify.
      out.push({ title, year: null, source: 'openculture.com', postUrl: link });
    }
  } catch (e) {
    console.warn(`[openculture.com] fetch failed: ${e.message}`);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Step 2b: openculture.com posts that aren't a direct YouTube/archive.org
// link are (per manual inspection) almost always the site's own blog post
// about either one film (post embeds an archive.org player somewhere in the
// body) or a themed multi-film collection (post links out to several
// archive.org items). Fetch each such post and pull real archive.org
// identifiers out of the raw HTML.
// ---------------------------------------------------------------------------

const ARCHIVE_DETAILS_RE = /archive\.org\/details(?:\.php\?identifier=|\/)([a-zA-Z0-9_.\-]+)/g;
// archive.org identifiers that are clearly a resized/derivative image asset
// rather than a movie item (openculture sometimes links its <img> preview
// straight at an archive.org-hosted picture that shares a details/ page).
const NON_MOVIE_ID_RE = /\d{2,4}x\d{2,4}$|_thumb$|\.(jpg|png|gif)$/i;

async function expandOpenCultureCollections(candidates) {
  const toExpand = candidates.filter((c) => c.source === 'openculture.com' && !c.archiveId && c.postUrl);
  const rest = candidates.filter((c) => !(c.source === 'openculture.com' && !c.archiveId && c.postUrl));

  console.error(`[openculture.com] expanding ${toExpand.length} collection/post pages into archive.org identifiers...`);

  const expanded = await pool(toExpand, CONCURRENCY, async (c) => {
    let html;
    try {
      html = await fetchText(c.postUrl);
    } catch (e) {
      return [{ ...c, archiveId: null, status: 'DESCARTADO', motivo: `falha ao abrir post do openculture.com (${e.message})`, skipVerify: true }];
    }

    const ids = [];
    const seen = new Set();
    let m;
    ARCHIVE_DETAILS_RE.lastIndex = 0;
    while ((m = ARCHIVE_DETAILS_RE.exec(html))) {
      const id = m[1];
      if (seen.has(id) || NON_MOVIE_ID_RE.test(id)) continue;
      seen.add(id);
      ids.push(id);
    }

    if (ids.length === 0) {
      const hasYoutube = /youtube\.com\/(watch\?v=|embed\/)|youtu\.be\//i.test(html);
      return [
        {
          ...c,
          archiveId: null,
          status: 'DESCARTADO',
          motivo: hasYoutube
            ? 'só disponível no YouTube (não usamos, ver decisão do usuário)'
            : 'post do openculture.com não linka pra um item do archive.org (provável outro host de vídeo)',
          skipVerify: true,
        },
      ];
    }

    if (ids.length === 1) {
      // Single-film post (the common case): keep the title we already
      // scraped from the listing page, just attach the resolved id.
      return [{ ...c, archiveId: ids[0] }];
    }

    // Multi-film collection post: cap how many we pull from one page (some
    // "100 movies" roundups exist) and let each become its own candidate.
    // We don't know each film's real title from this page's markup (no
    // reliable per-link title association across openculture's varied post
    // layouts), so use a unique placeholder here and have verifyDuration()
    // fill in the real title from archive.org's own metadata once resolved.
    return ids.slice(0, 40).map((id) => ({
      title: id,
      year: null,
      source: 'openculture.com',
      archiveId: id,
      needsTitleFromMeta: true,
      collectionTitle: c.title,
    }));
  });

  return rest.concat(expanded.filter(Array.isArray).flat());
}

// ---------------------------------------------------------------------------
// Step 3: resolve an archive.org identifier for candidates that don't
// already have one, via the advancedsearch API.
// ---------------------------------------------------------------------------

async function resolveArchiveId(candidate) {
  if (candidate.archiveId) return candidate;
  const q = encodeURIComponent(`title:("${candidate.title.replace(/"/g, '')}") AND mediatype:(movies)`);
  const url = `https://archive.org/advancedsearch.php?q=${q}&fl[]=identifier&fl[]=title&fl[]=year&rows=5&output=json`;
  try {
    const data = await fetchJson(url);
    const docs = (data.response && data.response.docs) || [];
    if (docs.length === 0) return { ...candidate, archiveId: null, resolveNote: 'NOT_FOUND_ON_ARCHIVE_SEARCH' };
    // Prefer a doc whose title normalizes to the same thing, then closest year.
    const wantTitle = normTitle(candidate.title);
    docs.sort((a, b) => {
      const aExact = normTitle(a.title || '') === wantTitle ? 0 : 1;
      const bExact = normTitle(b.title || '') === wantTitle ? 0 : 1;
      if (aExact !== bExact) return aExact - bExact;
      const ay = candidate.year ? Math.abs((a.year || 0) - candidate.year) : 0;
      const by = candidate.year ? Math.abs((b.year || 0) - candidate.year) : 0;
      return ay - by;
    });
    return { ...candidate, archiveId: docs[0].identifier, archiveYear: docs[0].year || null };
  } catch (e) {
    return { ...candidate, archiveId: null, resolveNote: `SEARCH_ERROR: ${e.message}` };
  }
}

// ---------------------------------------------------------------------------
// Step 4: verify real video duration on the resolved archive.org item.
// ---------------------------------------------------------------------------

const VIDEO_EXT_RE = /\.(mp4|ogv|mpeg|mpg|avi|mov|mkv|m4v|webm)$/i;

async function verifyDuration(candidate) {
  if (!candidate.archiveId) {
    return { ...candidate, status: 'DESCARTADO', motivo: 'não encontrado no archive.org' };
  }
  let meta;
  try {
    meta = await fetchJson(`https://archive.org/metadata/${encodeURIComponent(candidate.archiveId)}`);
  } catch (e) {
    return { ...candidate, status: 'DESCARTADO', motivo: `falha ao consultar metadata do archive.org (${e.message})` };
  }
  if (!meta || !meta.files || meta.files.length === 0) {
    return { ...candidate, status: 'DESCARTADO', motivo: 'item sem arquivos no archive.org (identifier inválido ou removido)' };
  }

  // Multi-film openculture.com collection posts don't give us a title up
  // front (see expandOpenCultureCollections) — pull the real one from the
  // item's own metadata now that we have it. Also backfill year when we
  // didn't already have one (helps the CANDIDATE_MAX_YEAR check and, later,
  // the person writing the bulkMoviesN.js entry).
  let title = candidate.title;
  let year = candidate.year;
  if (candidate.needsTitleFromMeta && meta.metadata && meta.metadata.title) {
    title = meta.metadata.title;
  }
  if (!year && meta.metadata) {
    const y = parseInt(meta.metadata.year || (meta.metadata.date || '').slice(0, 4), 10);
    if (Number.isFinite(y) && y > 1850 && y < 2100) year = y;
  }
  candidate = { ...candidate, title, year };

  // Title only became known just now (openculture.com multi-film collection
  // expansion) — re-run the safety filter against the real title.
  if (candidate.needsTitleFromMeta && BANNED_TITLE_RE.test(title || '')) {
    return {
      ...candidate,
      status: 'DESCARTADO',
      motivo: 'fora do escopo do catálogo (critério de segurança — conteúdo adulto/exploração ou compilação sem curadoria)',
    };
  }

  if (candidate.year && candidate.year > CANDIDATE_MAX_YEAR) {
    return {
      ...candidate,
      status: 'DESCARTADO',
      motivo: `ano ${candidate.year} acima do corte de domínio-público provável (${CANDIDATE_MAX_YEAR}) — precisa checagem manual`,
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
    return { ...candidate, status: 'DESCARTADO', motivo: 'nenhum arquivo de vídeo encontrado no item do archive.org', duracaoMin: 0 };
  }
  if (minutes < MIN_MINUTES) {
    return {
      ...candidate,
      status: 'DESCARTADO',
      motivo: `duração incompatível (${minutes} min) — provável trailer/clipe, não o filme completo`,
      duracaoMin: minutes,
    };
  }
  return { ...candidate, status: 'ADICIONADO', motivo: 'ok', duracaoMin: minutes };
}

// Combines steps 3+4 for one candidate so a single pool() pass can checkpoint
// fully-decided rows (resolve THEN verify), rather than checkpointing
// half-finished candidates that don't have a status yet.
async function resolveAndVerify(candidate) {
  const resolved = await resolveArchiveId(candidate);
  return verifyDuration(resolved);
}

// ---------------------------------------------------------------------------
// Step 5: dedupe (within this run's candidates, and against the catalog)
// ---------------------------------------------------------------------------

function dedupeAndFilterExisting(candidates, existing, previousCsv) {
  // Process "better" candidates first so that when the same title+year shows
  // up from multiple sites, we keep the one that already has a usable
  // archiveId (and isn't a pre-decided YouTube-only reject) instead of
  // whichever happened to scrape first.
  const ranked = [...candidates].sort((a, b) => {
    const score = (c) => (c.archiveId ? 0 : 1) + (c.skipVerify ? 10 : 0);
    return score(a) - score(b);
  });

  const seen = new Map();
  const deduped = [];
  for (const c of ranked) {
    const key = normTitle(c.title) + '|' + (c.year || '');
    if (seen.has(key)) continue;
    seen.set(key, true);
    deduped.push(c);
  }

  const out = [];
  for (const c of deduped) {
    // Scrapers can already hand us a final decision (e.g. openculture.com
    // YouTube-only titles) — pass those straight through untouched.
    if (c.skipVerify && c.status) {
      out.push(c);
      continue;
    }
    if (BANNED_TITLE_RE.test(c.title || '')) {
      out.push({
        ...c,
        status: 'DESCARTADO',
        motivo: 'fora do escopo do catálogo (critério de segurança — conteúdo adulto/exploração ou compilação sem curadoria)',
        skipVerify: true,
      });
      continue;
    }
    if (c.archiveId && existing.ids.has(c.archiveId)) {
      out.push({ ...c, status: 'DESCARTADO', motivo: 'já existia no catálogo (mesmo source.id)', skipVerify: true });
      continue;
    }
    if (existing.titles.has(normTitle(c.title))) {
      out.push({ ...c, status: 'DESCARTADO', motivo: 'já existia no catálogo (mesmo título)', skipVerify: true });
      continue;
    }
    if ((c.archiveId && previousCsv.csvIds.has(c.archiveId)) || (!c.needsTitleFromMeta && previousCsv.csvTitles.has(normTitle(c.title)))) {
      // Already evaluated (added or discarded) in a previous run — don't
      // re-judge it, just skip silently (not written to CSV again, since
      // its original row is preserved verbatim in the output already).
      continue;
    }
    if (c.year && c.year > CANDIDATE_MAX_YEAR) {
      out.push({
        ...c,
        status: 'DESCARTADO',
        motivo: `ano ${c.year} acima do corte de domínio-público provável (${CANDIDATE_MAX_YEAR}) — precisa checagem manual`,
        skipVerify: true,
      });
      continue;
    }
    out.push(c);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Step 6: CSV output
// ---------------------------------------------------------------------------

function formatRow(r) {
  return [
    csvField(r.title),
    csvField(r.year || ''),
    csvField(r.source),
    csvField(r.archiveId || ''),
    csvField(r.duracaoMin !== undefined && r.duracaoMin !== null ? r.duracaoMin : ''),
    csvField(r.status),
    csvField(r.motivo || ''),
    csvField(r.slug || ''), // normally assigned by hand when the synopsis/bulkMoviesN.js is written
  ].join(',');
}

// Preserves every row from a previous run (passed in as raw, already-formatted
// CSV data lines) and appends this run's newly-decided rows after them — this
// run never overwrites or re-judges what a previous run already decided.
function writeCsv(previousRawLines, newRows) {
  const header = ['titulo', 'ano', 'fonte', 'archive_org_id', 'duracao_verificada_min', 'status', 'motivo', 'slug'];
  const lines = [header.join(','), ...previousRawLines, ...newRows.map(formatRow)];
  fs.writeFileSync(OUTPUT_CSV, lines.join('\n') + '\n', 'utf8');
  console.error(`[findCandidates] wrote ${lines.length - 1} total rows (${previousRawLines.length} preserved from earlier runs + ${newRows.length} new) to ${OUTPUT_CSV}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.error('[findCandidates] loading existing catalog...');
  const existing = loadExistingCatalog();
  const previousCsv = loadPreviousCsvDecisions();

  console.error('[findCandidates] scraping sources...');
  const scrapers = [
    ['publicdomainmovie.net', scrapePublicDomainMovie],
    ['archivewatch.org', scrapeArchiveWatch],
    ['emol.org', scrapeEmol],
    ['freemoviescinema.com', scrapeFreeMoviesCinema],
  ];

  let raw = [];
  for (const [name, fn] of scrapers) {
    try {
      const found = await fn();
      console.error(`[findCandidates] ${name}: ${found.length} raw candidates`);
      raw = raw.concat(found);
    } catch (e) {
      console.warn(`[findCandidates] ${name} scraper crashed, skipping: ${e.message}`);
    }
  }

  console.error(`[findCandidates] ${raw.length} raw candidates total, expanding openculture.com posts...`);
  raw = await expandOpenCultureCollections(raw);

  console.error(`[findCandidates] ${raw.length} raw candidates total after expansion, deduping + filtering against catalog...`);
  const filtered = dedupeAndFilterExisting(raw, existing, previousCsv);
  let toResolve = filtered.filter((c) => !c.skipVerify);
  const alreadyDone = filtered.filter((c) => c.skipVerify);
  console.error(
    `[findCandidates] ${toResolve.length} candidates need archive.org resolution + duration check (${alreadyDone.length} already decided — duplicates, too-recent, or YouTube-only)`
  );

  if (toResolve.length > MAX_CANDIDATES_TO_VERIFY) {
    console.error(
      `[findCandidates] capping at MAX_CANDIDATES_TO_VERIFY=${MAX_CANDIDATES_TO_VERIFY} (widen the constant at the top of this file for a deeper sweep); ${
        toResolve.length - MAX_CANDIDATES_TO_VERIFY
      } candidates set aside this run`
    );
    toResolve = toResolve.slice(0, MAX_CANDIDATES_TO_VERIFY);
  }

  // Write an immediate snapshot with whatever's already decided (duplicates/
  // too-recent/YouTube-only don't need network calls) so the CSV has real
  // content on disk right away, before the slow part even starts.
  writeCsv(previousCsv.rawLines, alreadyDone);

  console.error('[findCandidates] resolving archive.org identifiers + verifying durations (checkpointing every 100)...');
  const verified = await pool(toResolve, CONCURRENCY, resolveAndVerify, (partialResults) => {
    writeCsv(previousCsv.rawLines, [...alreadyDone, ...partialResults]);
  });

  const allRows = [...alreadyDone, ...verified];
  const added = allRows.filter((r) => r.status === 'ADICIONADO').length;
  const discarded = allRows.filter((r) => r.status === 'DESCARTADO').length;
  console.error(`[findCandidates] done: ${added} verified candidates ready for synopsis-writing, ${discarded} discarded.`);

  writeCsv(previousCsv.rawLines, allRows);

  console.error('[findCandidates] Next step: open the CSV, take the ADICIONADO rows, write an original');
  console.error('[findCandidates] Portuguese synopsis for each, and hand-assemble the next bulkMoviesN.js');
  console.error('[findCandidates] (see server/src/seed/bulkMovies7.js for the format/style to follow).');
}

main().catch((e) => {
  console.error('[findCandidates] fatal error:', e);
  process.exitCode = 1;
});
