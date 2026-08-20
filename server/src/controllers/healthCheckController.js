const crypto = require('crypto');
const Movie = require('../models/Movie');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

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
