const crypto = require('crypto');
const Movie = require('../models/Movie');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { revalidateMovie } = require('../utils/revalidate');

// Job em memória (não no banco) — ferramenta de manutenção pontual do
// admin, não precisa sobreviver a um restart do servidor. Mesmo padrão de
// "job assíncrono + polling de status + download de CSV" já usado pelo
// serviço de busca (ver scraper/app.py e /admin/dashboard/busca), só que
// aqui dentro do próprio backend Node — não precisa de serviço separado,
// as checagens são só requisições HTTP simples.
const jobs = new Map();
const CONCURRENCY = 8;
const TIMEOUT_MS = 10000;
const JOB_TTL_MS = 2 * 60 * 60 * 1000; // 2h — limpa job velho da memória

function cleanupOldJobs() {
  const now = Date.now();
  for (const [id, job] of jobs) {
    if (now - job.startedAt.getTime() > JOB_TTL_MS) jobs.delete(id);
  }
}

async function urlIsOk(url) {
  if (!url) return true; // ausente não é "quebrado" — só o que existe e não carrega
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (res.ok) return true;
  } catch {
    // alguns servidores não respondem HEAD direito — tenta GET antes de desistir
  }
  try {
    const res = await fetch(url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(TIMEOUT_MS) });
    return res.ok;
  } catch {
    return false;
  }
}

// Mesmo princípio do comentário em feedback_archiveorg_debugging (memória
// do projeto): checar /metadata/<id> é a forma confiável de saber se um
// item do archive.org ainda existe/tem arquivo, em vez de confiar só no
// player. Item removido/dark devolve "files" vazio.
async function archiveItemIsOk(identifier) {
  try {
    const res = await fetch(`https://archive.org/metadata/${identifier}`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) return false;
    const json = await res.json();
    return Boolean(json?.files?.length);
  } catch {
    return false;
  }
}

async function youtubeVideoIsOk(videoId) {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}&format=json`,
      { signal: AbortSignal.timeout(TIMEOUT_MS) }
    );
    return res.ok;
  } catch {
    return false;
  }
}

async function checkMovie(movie) {
  const issues = [];

  if (movie.posterUrl && !(await urlIsOk(movie.posterUrl))) {
    issues.push({ field: 'Pôster', url: movie.posterUrl });
  }
  if (movie.backdropUrl && !(await urlIsOk(movie.backdropUrl))) {
    issues.push({ field: 'Backdrop', url: movie.backdropUrl });
  }

  if (movie.videoFileUrl) {
    if (!(await urlIsOk(movie.videoFileUrl))) {
      issues.push({ field: 'Vídeo (link direto)', url: movie.videoFileUrl });
    }
  } else if (movie.source?.provider === 'archive' && movie.source?.id) {
    const identifier = movie.source.id.split('/')[0];
    if (!(await archiveItemIsOk(identifier))) {
      issues.push({ field: 'Vídeo (archive.org)', url: `https://archive.org/metadata/${identifier}` });
    }
  } else if (movie.source?.provider === 'youtube' && movie.source?.id) {
    if (!(await youtubeVideoIsOk(movie.source.id))) {
      issues.push({ field: 'Vídeo (YouTube)', url: `https://youtube.com/watch?v=${movie.source.id}` });
    }
  }

  return issues;
}

async function runJob(jobId) {
  const job = jobs.get(jobId);
  const movies = await Movie.find({}, 'title slug posterUrl backdropUrl videoFileUrl source').lean();
  job.total = movies.length;

  let nextIndex = 0;
  async function worker() {
    while (nextIndex < movies.length) {
      const movie = movies[nextIndex];
      nextIndex += 1;
      try {
        const issues = await checkMovie(movie);
        for (const issue of issues) {
          job.broken.push({ title: movie.title, slug: movie.slug, field: issue.field, url: issue.url });
        }
      } catch (err) {
        job.broken.push({ title: movie.title, slug: movie.slug, field: 'Erro na verificação', url: err.message });
      }
      job.checked += 1;
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  job.status = 'done';
}

exports.startCheck = catchAsync(async (req, res) => {
  cleanupOldJobs();

  const jobId = crypto.randomUUID();
  jobs.set(jobId, { status: 'running', checked: 0, total: 0, broken: [], startedAt: new Date(), error: null });

  runJob(jobId).catch((err) => {
    const job = jobs.get(jobId);
    if (job) {
      job.status = 'error';
      job.error = err.message;
    }
  });

  res.status(201).json({ success: true, data: { jobId } });
});

exports.getCheckStatus = catchAsync(async (req, res, next) => {
  const job = jobs.get(req.params.jobId);
  if (!job) return next(new AppError('Job não encontrado (o servidor pode ter reiniciado)', 404));

  res.json({
    success: true,
    data: {
      status: job.status,
      checked: job.checked,
      total: job.total,
      brokenCount: job.broken.length,
      error: job.error,
    },
  });
});

exports.downloadCheckCsv = catchAsync(async (req, res, next) => {
  const job = jobs.get(req.params.jobId);
  if (!job) return next(new AppError('Job não encontrado (o servidor pode ter reiniciado)', 404));
  if (job.status === 'running') return next(new AppError('A verificação ainda está em andamento', 409));

  const escapeCsv = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const header = 'Título,Slug,Campo com problema,URL verificada,Link no site\n';
  const rows = job.broken
    .map((b) =>
      [
        escapeCsv(b.title),
        escapeCsv(b.slug),
        escapeCsv(b.field),
        escapeCsv(b.url),
        escapeCsv(`https://sepiastream.com/movie/${b.slug}`),
      ].join(',')
    )
    .join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="filmes-quebrados-${req.params.jobId.slice(0, 8)}.csv"`);
  // BOM no início — sem isso o Excel abre acento errado num CSV UTF-8.
  res.send(`﻿${header}${rows}`);
});

// ---------------------------------------------------------------------------
// Correção automática — recebe a lista de filmes quebrados (o front já
// parseou o CSV baixado da checagem acima e filtrou pelo modo escolhido:
// só pôster, só vídeo, ou ambos), acha um substituto no archive.org e já
// aplica direto no banco (decisão explícita do usuário — sem revisão manual
// antes de salvar, mas com relatório de auditoria no CSV final: nome, link
// antigo, link novo, pra conferir depois).
// ---------------------------------------------------------------------------

const fixJobs = new Map();
const FIX_CONCURRENCY = 4; // menor que a checagem — cada item pode fazer
// várias chamadas ao archive.org (busca + metadata de cada candidato)
const FIX_JOB_TTL_MS = 2 * 60 * 60 * 1000;
const FIX_TIMEOUT_MS = 15000;
const VIDEO_EXT_RE = /\.(mp4|ogv|mpeg|mpg|avi|mov|mkv|m4v|webm)$/i;

function cleanupOldFixJobs() {
  const now = Date.now();
  for (const [id, job] of fixJobs) {
    if (now - job.startedAt.getTime() > FIX_JOB_TTL_MS) fixJobs.delete(id);
  }
}

// Mesma normalização usada pelo scraper (scraper/finder.py norm_title) —
// minúsculo, sem acento, só letras/números/espaço — pra comparar título do
// nosso banco com título devolvido pela busca do archive.org.
function normalizeTitle(value) {
  return (value || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// Busca por título no archive.org, pega os candidatos mais prováveis
// (título exato primeiro, depois ano mais próximo), e confere a duração
// real do vídeo de cada um contra o runtimeMinutes já conhecido do filme —
// só aceita se bater dentro de uma margem, pra não trocar pela obra errada
// (mesmo título, filme diferente). Sem runtimeMinutes conhecido, só exige
// que não seja um clipe/trailer (duração mínima de 2 min).
async function findArchiveVideoReplacement(movie) {
  const currentIdentifier =
    movie.source?.provider === 'archive' && movie.source?.id ? movie.source.id.split('/')[0] : null;

  const q = encodeURIComponent(`title:("${(movie.title || '').replace(/"/g, '')}") AND mediatype:(movies)`);
  const searchUrl = `https://archive.org/advancedsearch.php?q=${q}&fl[]=identifier&fl[]=title&fl[]=year&rows=8&output=json`;

  let docs;
  try {
    const res = await fetch(searchUrl, { signal: AbortSignal.timeout(FIX_TIMEOUT_MS) });
    if (!res.ok) return null;
    const json = await res.json();
    docs = json?.response?.docs || [];
  } catch {
    return null;
  }

  const wantTitle = normalizeTitle(movie.title);
  const sorted = docs
    .filter((d) => d.identifier && d.identifier !== currentIdentifier)
    .sort((a, b) => {
      const aExact = normalizeTitle(a.title) === wantTitle ? 0 : 1;
      const bExact = normalizeTitle(b.title) === wantTitle ? 0 : 1;
      if (aExact !== bExact) return aExact - bExact;
      const aYearDiff = movie.year ? Math.abs((a.year || 0) - movie.year) : 0;
      const bYearDiff = movie.year ? Math.abs((b.year || 0) - movie.year) : 0;
      return aYearDiff - bYearDiff;
    });

  for (const doc of sorted) {
    let meta;
    try {
      const res = await fetch(`https://archive.org/metadata/${doc.identifier}`, {
        signal: AbortSignal.timeout(FIX_TIMEOUT_MS),
      });
      if (!res.ok) continue;
      meta = await res.json();
    } catch {
      continue;
    }

    const files = meta?.files || [];
    const videoFiles = files.filter((f) => VIDEO_EXT_RE.test(f.name || '') && f.source !== 'metadata');
    if (!videoFiles.length) continue;

    let bestFile = null;
    let maxSeconds = 0;
    for (const f of videoFiles) {
      const length = parseFloat(f.length) || 0;
      if (length > maxSeconds) {
        maxSeconds = length;
        bestFile = f;
      }
    }
    const minutes = maxSeconds / 60;

    if (movie.runtimeMinutes) {
      const tolerance = Math.max(5, movie.runtimeMinutes * 0.15);
      if (Math.abs(minutes - movie.runtimeMinutes) > tolerance) continue;
    } else if (minutes < 2) {
      continue;
    }

    return { identifier: doc.identifier, filename: bestFile?.name };
  }

  return null;
}

async function fixMovie(entry) {
  const movie = await Movie.findOne({ slug: entry.slug });
  if (!movie) {
    return { title: entry.title, slug: entry.slug, fixed: false, note: 'Filme não encontrado no banco (slug mudou?)' };
  }

  const changes = [];

  if (entry.needsVideo) {
    const candidate = await findArchiveVideoReplacement(movie);
    if (candidate) {
      const oldVideoRef = movie.videoFileUrl || `${movie.source?.provider || '?'}:${movie.source?.id || '?'}`;
      movie.source = { provider: 'archive', id: candidate.identifier };
      // Se o filme tem legenda pt-BR nossa (subtitleUrl), ela só é usada
      // quando videoFileUrl existe (troca o player pro <video> nativo) — sem
      // isso, a legenda ficaria silenciosamente sem efeito no novo item.
      // Resolve o link direto do novo identifier pra manter a legenda viva.
      movie.videoFileUrl =
        movie.subtitleUrl && candidate.filename
          ? `https://archive.org/download/${candidate.identifier}/${encodeURIComponent(candidate.filename)}`
          : undefined;
      changes.push({
        field: 'Vídeo',
        old: oldVideoRef,
        new: `https://archive.org/details/${candidate.identifier}`,
      });
    }
  }

  if (entry.needsPoster) {
    // Pôster novo do archive.org é gerado pela própria infra deles (thumbnail
    // automático), não um arquivo específico enviado por alguém — muito mais
    // confiável que tentar achar uma imagem em outro lugar, que arrisca pegar
    // capa errada. Usa o identifier novo (se acabou de trocar o vídeo também)
    // ou o que já existia.
    const identifier =
      movie.source?.provider === 'archive' && movie.source?.id ? movie.source.id.split('/')[0] : null;
    if (identifier) {
      const newPoster = `https://archive.org/services/img/${identifier}`;
      const old = movie.posterUrl || movie.backdropUrl || '(vazio)';
      movie.posterUrl = newPoster;
      movie.backdropUrl = newPoster;
      changes.push({ field: 'Pôster/Backdrop', old, new: newPoster });
    }
  }

  if (changes.length) {
    await movie.save();
    await revalidateMovie(movie.slug);
  }

  return { title: movie.title, slug: movie.slug, fixed: changes.length > 0, changes, note: changes.length ? null : 'Nenhum substituto encontrado' };
}

async function runFixJob(jobId, entries) {
  const job = fixJobs.get(jobId);
  job.total = entries.length;

  let nextIndex = 0;
  async function worker() {
    while (nextIndex < entries.length) {
      const entry = entries[nextIndex];
      nextIndex += 1;
      try {
        const result = await fixMovie(entry);
        if (result.fixed) job.fixedResults.push(result);
        else job.unfixedResults.push(result);
      } catch (err) {
        job.unfixedResults.push({ title: entry.title, slug: entry.slug, fixed: false, note: err.message });
      }
      job.checked += 1;
    }
  }

  await Promise.all(Array.from({ length: FIX_CONCURRENCY }, worker));
  job.status = 'done';
}

exports.startFix = catchAsync(async (req, res, next) => {
  const { items } = req.body;
  if (!Array.isArray(items) || !items.length) {
    return next(new AppError('Envie a lista de filmes a corrigir (items)', 400));
  }
  if (items.length > 2000) {
    return next(new AppError('Máximo de 2000 itens por vez', 400));
  }

  cleanupOldFixJobs();

  const jobId = crypto.randomUUID();
  fixJobs.set(jobId, {
    status: 'running',
    checked: 0,
    total: 0,
    fixedResults: [],
    unfixedResults: [],
    startedAt: new Date(),
    error: null,
  });

  runFixJob(jobId, items).catch((err) => {
    const job = fixJobs.get(jobId);
    if (job) {
      job.status = 'error';
      job.error = err.message;
    }
  });

  res.status(201).json({ success: true, data: { jobId } });
});

exports.getFixStatus = catchAsync(async (req, res, next) => {
  const job = fixJobs.get(req.params.jobId);
  if (!job) return next(new AppError('Job não encontrado (o servidor pode ter reiniciado)', 404));

  res.json({
    success: true,
    data: {
      status: job.status,
      checked: job.checked,
      total: job.total,
      fixedCount: job.fixedResults.length,
      unfixedCount: job.unfixedResults.length,
      error: job.error,
    },
  });
});

exports.downloadFixCsv = catchAsync(async (req, res, next) => {
  const job = fixJobs.get(req.params.jobId);
  if (!job) return next(new AppError('Job não encontrado (o servidor pode ter reiniciado)', 404));
  if (job.status === 'running') return next(new AppError('A correção ainda está em andamento', 409));

  const escapeCsv = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const header = 'Título,Slug,Campo,Link antigo,Link novo\n';

  const fixedRows = job.fixedResults.flatMap((r) =>
    r.changes.map((c) => [r.title, r.slug, c.field, c.old, c.new].map(escapeCsv).join(','))
  );
  const unfixedRows = job.unfixedResults.map((r) =>
    [r.title, r.slug, 'NÃO CORRIGIDO', r.note || 'nenhum substituto encontrado', ''].map(escapeCsv).join(',')
  );

  const body = [...fixedRows, ...unfixedRows].join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="filmes-corrigidos-${req.params.jobId.slice(0, 8)}.csv"`);
  res.send(`﻿${header}${body}`);
});
