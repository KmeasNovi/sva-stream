'use client';

import { useEffect, useRef, useState } from 'react';
import AdminNav from '../../AdminNav';
import useAdminToken from '../../useAdminToken';

const SCRAPER_URL = process.env.NEXT_PUBLIC_SCRAPER_API_URL;
const JOB_STORAGE_KEY = 'sva_admin_scrape_job';
const POLL_INTERVAL_MS = 5000;

async function scraperFetch(path, token, opts = {}) {
  const res = await fetch(`${SCRAPER_URL}${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(opts.headers || {}) },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || `Erro na requisição (${res.status})`);
  return json;
}

async function downloadCsv(jobId, token) {
  const res = await fetch(`${SCRAPER_URL}/scrape/download/${jobId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || `Erro ao baixar (${res.status})`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `novos-filmes-encontrados-${jobId.slice(0, 8)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function phaseLabel(phase) {
  const labels = {
    iniciando: 'Iniciando…',
    carregando_catalogo: 'Carregando catálogo atual (pra não duplicar filme)…',
    filtrando_duplicatas: 'Removendo duplicata…',
    verificando_duracao: 'Verificando duração real no archive.org…',
    concluido: 'Concluído',
  };
  if (labels[phase]) return labels[phase];
  if (phase?.startsWith('raspando_')) return `Raspando ${phase.replace('raspando_', '')}…`;
  return phase || '';
}

export default function AdminScrapePage() {
  const token = useAdminToken();
  const [jobId, setJobId] = useState(null);
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);
  const pollRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem(JOB_STORAGE_KEY);
    if (stored) setJobId(stored);
  }, []);

  useEffect(() => {
    if (!token || !jobId || !SCRAPER_URL) return undefined;

    async function poll() {
      try {
        const { data } = await scraperFetch(`/scrape/status/${jobId}`, token);
        setJob(data);
        setError('');
        if (data.status !== 'running') {
          clearInterval(pollRef.current);
          // Baixa sozinho assim que termina, em vez de esperar um clique.
          // Enquanto a busca está rodando, o polling a cada 5s mantém o
          // serviço (Render free tier) acordado — mas assim que o job
          // termina o polling para, e se a pessoa demorar mais de ~15min
          // pra clicar "Baixar CSV", o serviço já reciclou por inatividade
          // e o resultado (só em memória, nunca gravado em disco) se perde
          // pra sempre. Baixar na hora elimina essa janela de risco.
          if (data.status === 'done') {
            try {
              await downloadCsv(jobId, token);
            } catch (downloadErr) {
              // Job continua "done" na tela (o botão "Baixar CSV" manual
              // ainda funciona como retentativa) — só o auto-download falhou.
              setError(`Busca terminou, mas o download automático falhou: ${downloadErr.message}`);
            }
          }
        }
      } catch (err) {
        // O job some da memória do serviço quando ele reinicia (deploy novo,
        // ou o free tier do Render reciclando por inatividade) — sem isso,
        // a tela fica presa pra sempre mostrando o último estado visto
        // (ex: "em andamento"), tentando de novo a cada 5s sem nunca
        // desbloquear o botão de iniciar uma busca nova.
        clearInterval(pollRef.current);
        setJob(null);
        setError(err.message);
        localStorage.removeItem(JOB_STORAGE_KEY);
        setJobId(null);
      }
    }

    poll();
    pollRef.current = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(pollRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, jobId]);

  async function handleStart() {
    setError('');
    setStarting(true);
    try {
      const { data } = await scraperFetch('/scrape/start', token, { method: 'POST' });
      localStorage.setItem(JOB_STORAGE_KEY, data.jobId);
      setJobId(data.jobId);
      setJob(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setStarting(false);
    }
  }

  async function handleDownload() {
    try {
      await downloadCsv(jobId, token);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleForget() {
    localStorage.removeItem(JOB_STORAGE_KEY);
    setJobId(null);
    setJob(null);
    clearInterval(pollRef.current);
  }

  if (!token) return null;

  const isRunning = job?.status === 'running';

  return (
    <div className="container mx-auto px-container-margin py-12 space-y-10">
      <AdminNav />
      <h1 className="font-display text-headline-lg text-on-background">Buscar filmes</h1>

      {!SCRAPER_URL ? (
        <div className="glass-panel rounded-2xl p-8 max-w-2xl text-error font-body text-body-md">
          Serviço de busca não configurado (falta <code>NEXT_PUBLIC_SCRAPER_API_URL</code>). Veja{' '}
          <code>scraper/DEPLOY.md</code> no repositório pra publicar o serviço e configurar essa variável.
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-8 max-w-2xl space-y-6">
          <p className="font-body text-body-md text-on-surface-variant">
            Raspa seis fontes (publicdomainmovie.net, archivewatch.org, emol.org, freemoviescinema.com,
            retroflix.org e as coleções prelinger/usgovfilms do archive.org), verifica a duração real de
            cada título no archive.org e remove o que já está no catálogo. Não decide sozinho sobre risco
            de direito autoral (estúdio grande, ano, etc.) — isso continua exigindo revisão manual no CSV
            gerado, igual já é hoje. O CSV baixa sozinho assim que a busca termina.
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleStart}
              disabled={starting || isRunning}
              className="bg-primary text-on-primary font-body text-label-bold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? 'Busca em andamento…' : 'Iniciar busca'}
            </button>
            {jobId ? (
              <button
                onClick={handleForget}
                disabled={isRunning}
                className="px-4 py-2 rounded-lg border border-white/20 text-on-surface-variant hover:bg-white/10 transition-colors font-body text-label-bold disabled:opacity-50"
              >
                Esquecer essa busca
              </button>
            ) : null}
          </div>

          {error ? <p className="text-error font-body text-body-md">{error}</p> : null}

          {job ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="font-body text-label-bold text-on-background">{phaseLabel(job.phase)}</p>
                <p className="font-body text-body-sm text-on-surface-variant">
                  Candidatos encontrados: {job.candidates_found}
                  {job.total_to_verify ? ` · Verificados: ${job.verified_count}/${job.total_to_verify}` : ''}
                </p>
              </div>

              {job.status === 'done' ? (
                <div className="space-y-3">
                  <p className="font-body text-body-md text-on-background">
                    Aprovados: {job.added} · Descartados: {job.discarded}
                  </p>
                  <button
                    onClick={handleDownload}
                    className="bg-primary text-on-primary font-body text-label-bold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
                  >
                    Baixar CSV
                  </button>
                </div>
              ) : null}

              {job.status === 'error' ? (
                <p className="text-error font-body text-body-md">Erro na busca: {job.error}</p>
              ) : null}

              {job.log?.length ? (
                <details className="font-body text-body-sm text-on-surface-variant">
                  <summary className="cursor-pointer text-on-background">Log ({job.log.length} linhas)</summary>
                  <pre className="mt-2 max-h-64 overflow-y-auto whitespace-pre-wrap bg-[#111111] rounded-lg p-4 border border-white/10">
                    {job.log.join('\n')}
                  </pre>
                </details>
              ) : null}
            </div>
          ) : jobId ? (
            <p className="font-body text-body-md text-on-surface-variant">
              Carregando status da busca (o serviço pode estar acordando — pode levar até 1 minuto se
              estava inativo)…
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
