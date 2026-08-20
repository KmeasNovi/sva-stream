'use client';

import { useEffect, useRef, useState } from 'react';
import AdminNav from '../../AdminNav';
import useAdminToken from '../../useAdminToken';
import { api } from '../../../../lib/api';
import { parseHealthCheckCsv, groupBrokenBySlug } from '../../../../lib/parseHealthCheckCsv';

const SCRAPER_URL = process.env.NEXT_PUBLIC_SCRAPER_API_URL;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const JOB_STORAGE_KEY = 'sva_admin_scrape_job';
const FIX_JOB_STORAGE_KEY = 'sva_admin_fix_job';
const POLL_INTERVAL_MS = 5000;

async function downloadFixCsv(jobId, token) {
  const res = await fetch(`${API_URL}/api/health-check/fix/${jobId}/csv`, {
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
  a.download = `filmes-corrigidos-${jobId.slice(0, 8)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const inputClass =
  'w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-3 text-on-background font-body text-body-md focus:outline-none focus:ring-1 focus:ring-primary';

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
    filtrando_palavras_chave: 'Aplicando filtro de palavras-chave…',
    cancelando: 'Cancelando (terminando o que já estava em andamento)…',
    concluido: 'Concluído',
    cancelado: 'Cancelado',
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
  const [cancelling, setCancelling] = useState(false);
  const pollRef = useRef(null);

  // Busca personalizada (site + palavras-chave)
  const [customUrl, setCustomUrl] = useState('');
  const [customKeywords, setCustomKeywords] = useState('');
  const [customMode, setCustomMode] = useState('links');

  // Corrigir filmes (CSV da aba "Verificar links" → busca substituto no
  // archive.org → aplica direto no banco, ver healthCheckController.js)
  const [csvFileName, setCsvFileName] = useState('');
  const [brokenEntries, setBrokenEntries] = useState(null);
  const [fixMode, setFixMode] = useState('both');
  const [fixJobId, setFixJobId] = useState(null);
  const [fixJob, setFixJob] = useState(null);
  const [fixError, setFixError] = useState('');
  const [fixStarting, setFixStarting] = useState(false);
  const fixPollRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem(JOB_STORAGE_KEY);
    if (stored) setJobId(stored);
    const storedFix = localStorage.getItem(FIX_JOB_STORAGE_KEY);
    if (storedFix) setFixJobId(storedFix);
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
          // Baixa sozinho assim que termina (ou é cancelado), em vez de
          // esperar um clique. Enquanto a busca está rodando, o polling a
          // cada 5s mantém o serviço (Render free tier) acordado — mas
          // assim que o job para, o polling também para, e se a pessoa
          // demorar mais de ~15min pra clicar "Baixar CSV" o serviço já
          // reciclou por inatividade e o resultado (só em memória, nunca
          // gravado em disco) se perde pra sempre. Baixar na hora elimina
          // essa janela de risco.
          if (data.status === 'done' || data.status === 'cancelled') {
            try {
              await downloadCsv(jobId, token);
            } catch (downloadErr) {
              // Job continua na tela (o botão "Baixar CSV" manual ainda
              // funciona como retentativa) — só o auto-download falhou.
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

  async function handleStartCustom(e) {
    e.preventDefault();
    setError('');
    setStarting(true);
    try {
      const keywords = customKeywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);
      const { data } = await scraperFetch('/scrape/custom/start', token, {
        method: 'POST',
        body: JSON.stringify({ url: customUrl.trim(), keywords, mode: customMode }),
      });
      localStorage.setItem(JOB_STORAGE_KEY, data.jobId);
      setJobId(data.jobId);
      setJob(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setStarting(false);
    }
  }

  async function handleCancel() {
    setCancelling(true);
    try {
      await scraperFetch(`/scrape/cancel/${jobId}`, token, { method: 'POST' });
      // não precisa atualizar estado aqui — o próximo poll (em até 5s) já
      // vai trazer phase "cancelando" e, na sequência, o status final.
    } catch (err) {
      setError(err.message);
    } finally {
      setCancelling(false);
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

  // --- Corrigir filmes ---

  async function handleCsvSelected(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFileName(file.name);
    setFixError('');
    try {
      const text = await file.text();
      const rows = parseHealthCheckCsv(text);
      setBrokenEntries(groupBrokenBySlug(rows));
    } catch (err) {
      setFixError(`Não consegui ler esse CSV: ${err.message}`);
      setBrokenEntries(null);
    }
  }

  function filteredFixEntries() {
    if (!brokenEntries) return [];
    return brokenEntries
      .filter((e) => {
        if (fixMode === 'poster') return e.needsPoster;
        if (fixMode === 'video') return e.needsVideo;
        return e.needsPoster || e.needsVideo;
      })
      .map((e) => ({
        slug: e.slug,
        title: e.title,
        needsPoster: fixMode !== 'video' && e.needsPoster,
        needsVideo: fixMode !== 'poster' && e.needsVideo,
      }));
  }

  async function handleStartFix() {
    setFixError('');
    setFixStarting(true);
    try {
      const items = filteredFixEntries();
      const { data } = await api.startHealthCheckFix(items, token);
      localStorage.setItem(FIX_JOB_STORAGE_KEY, data.jobId);
      setFixJobId(data.jobId);
      setFixJob(null);
    } catch (err) {
      setFixError(err.message);
    } finally {
      setFixStarting(false);
    }
  }

  async function handleDownloadFix() {
    try {
      await downloadFixCsv(fixJobId, token);
    } catch (err) {
      setFixError(err.message);
    }
  }

  function handleForgetFix() {
    localStorage.removeItem(FIX_JOB_STORAGE_KEY);
    setFixJobId(null);
    setFixJob(null);
    setBrokenEntries(null);
    setCsvFileName('');
    clearInterval(fixPollRef.current);
  }

  useEffect(() => {
    if (!token || !fixJobId) return undefined;

    async function poll() {
      try {
        const { data } = await api.getHealthCheckFixStatus(fixJobId, token);
        setFixJob(data);
        setFixError('');
        if (data.status !== 'running') {
          clearInterval(fixPollRef.current);
          if (data.status === 'done') {
            try {
              await downloadFixCsv(fixJobId, token);
            } catch (downloadErr) {
              setFixError(`Correção terminou, mas o download automático falhou: ${downloadErr.message}`);
            }
          }
        }
      } catch (err) {
        clearInterval(fixPollRef.current);
        setFixJob(null);
        setFixError(err.message);
        localStorage.removeItem(FIX_JOB_STORAGE_KEY);
        setFixJobId(null);
      }
    }

    poll();
    fixPollRef.current = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(fixPollRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, fixJobId]);

  if (!token) return null;

  const isRunning = job?.status === 'running';
  const isCancelling = job?.phase === 'cancelando';

  const statusPanel = job ? (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="font-body text-label-bold text-on-background">{phaseLabel(job.phase)}</p>
        <p className="font-body text-body-sm text-on-surface-variant">
          Candidatos encontrados: {job.candidates_found}
          {job.total_to_verify ? ` · Verificados: ${job.verified_count}/${job.total_to_verify}` : ''}
        </p>
      </div>

      {isRunning ? (
        <button
          onClick={handleCancel}
          disabled={cancelling || isCancelling}
          className="px-4 py-2 rounded-lg border border-error/30 text-error hover:bg-error/10 transition-colors font-body text-label-bold disabled:opacity-50"
        >
          {isCancelling ? 'Cancelando…' : 'Cancelar busca'}
        </button>
      ) : null}

      {job.status === 'done' || job.status === 'cancelled' ? (
        <div className="space-y-3">
          <p className="font-body text-body-md text-on-background">
            {job.status === 'cancelled' ? 'Cancelado. ' : ''}
            Aprovados: {job.added} · Descartados: {job.discarded}
          </p>
          <button
            onClick={handleDownload}
            className="bg-primary text-on-primary font-body text-label-bold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(var(--glow-primary),0.4)] transition-all"
          >
            Baixar CSV
          </button>
        </div>
      ) : null}

      {job.status === 'error' ? <p className="text-error font-body text-body-md">Erro na busca: {job.error}</p> : null}

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
      Carregando status da busca (o serviço pode estar acordando — pode levar até 1 minuto se estava
      inativo)…
    </p>
  ) : null;

  const isFixRunning = fixJob?.status === 'running';
  const fixCandidateCount = filteredFixEntries().length;
  const fixPct = fixJob?.total ? Math.round((fixJob.checked / fixJob.total) * 100) : 0;

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
        <>
          <div className="glass-panel rounded-2xl p-8 max-w-2xl space-y-6">
            <h2 className="font-display text-headline-md text-on-background">Busca padrão</h2>
            <p className="font-body text-body-md text-on-surface-variant">
              Raspa seis fontes (publicdomainmovie.net, archivewatch.org, emol.org, freemoviescinema.com,
              retroflix.org e as coleções prelinger/usgovfilms do archive.org), verifica a duração real de
              cada título no archive.org e remove o que já está no catálogo. Não decide sozinho sobre
              risco de direito autoral (estúdio grande, ano, etc.) — isso continua exigindo revisão manual
              no CSV gerado, igual já é hoje. O CSV baixa sozinho assim que a busca termina.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleStart}
                disabled={starting || isRunning}
                className="bg-primary text-on-primary font-body text-label-bold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(var(--glow-primary),0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? 'Busca em andamento…' : 'Iniciar busca'}
              </button>
              {jobId && !isRunning ? (
                <button
                  onClick={handleForget}
                  className="px-4 py-2 rounded-lg border border-white/20 text-on-surface-variant hover:bg-white/10 transition-colors font-body text-label-bold"
                >
                  Esquecer essa busca
                </button>
              ) : null}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-8 max-w-2xl space-y-6">
            <h2 className="font-display text-headline-md text-on-background">Busca personalizada</h2>
            <p className="font-body text-body-md text-on-surface-variant">
              Passe um site específico e (opcional) palavras-chave pra filtrar o resultado. Não pagina
              sozinho — só olha a URL exata que você mandar. Sem julgamento de risco jurídico, igual a
              busca padrão — todo resultado ainda precisa de revisão manual.
            </p>

            <form onSubmit={handleStartCustom} className="space-y-4">
              <input
                type="url"
                placeholder="https://exemplo.com/filmes/terror"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                required
                disabled={isRunning}
                className={inputClass}
              />
              <input
                placeholder="Palavras-chave (separadas por vírgula) — opcional"
                value={customKeywords}
                onChange={(e) => setCustomKeywords(e.target.value)}
                disabled={isRunning}
                className={inputClass}
              />

              <div className="space-y-2">
                <label className="flex items-start gap-2 font-body text-body-md text-on-surface-variant">
                  <input
                    type="radio"
                    name="customMode"
                    value="links"
                    checked={customMode === 'links'}
                    onChange={() => setCustomMode('links')}
                    disabled={isRunning}
                    className="mt-1"
                  />
                  <span>
                    <strong className="text-on-background">Só links diretos pro archive.org</strong> — mais
                    confiável, funciona em qualquer site que já linka pro archive.org/details/... Não acha
                    nada em site que só cita o nome do filme sem linkar.
                  </span>
                </label>
                <label className="flex items-start gap-2 font-body text-body-md text-on-surface-variant">
                  <input
                    type="radio"
                    name="customMode"
                    value="text"
                    checked={customMode === 'text'}
                    onChange={() => setCustomMode('text')}
                    disabled={isRunning}
                    className="mt-1"
                  />
                  <span>
                    <strong className="text-on-background">Também tentar ler título no texto da página</strong> —
                    acha mais coisa, mas com bem mais falso positivo (sem estrutura fixa pra confiar).
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={starting || isRunning}
                className="bg-primary text-on-primary font-body text-label-bold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(var(--glow-primary),0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? 'Busca em andamento…' : 'Iniciar busca personalizada'}
              </button>
            </form>
          </div>

          {error || job ? (
            <div className="glass-panel rounded-2xl p-8 max-w-2xl space-y-4">
              <h2 className="font-display text-headline-md text-on-background">Status</h2>
              {error ? <p className="text-error font-body text-body-md">{error}</p> : null}
              {statusPanel}
            </div>
          ) : null}
        </>
      )}

      <div className="glass-panel rounded-2xl p-8 max-w-2xl space-y-6">
        <h2 className="font-display text-headline-md text-on-background">Corrigir filmes</h2>
        <p className="font-body text-body-md text-on-surface-variant">
          Sobe o CSV baixado na aba "Verificar links" (pôster/backdrop/vídeo quebrado). Pra cada filme,
          busca um substituto no archive.org — só aceita se a duração real bater com a já cadastrada
          (evita trocar pela obra errada, mesmo título). O pôster novo é o thumbnail automático do
          próprio archive.org, mais confiável que procurar imagem solta por aí. Aplica direto no banco
          (sem revisão antes) e gera um CSV de auditoria com o que mudou — nome, link antigo, link novo.
        </p>

        <div className="space-y-3">
          <input
            type="file"
            accept=".csv"
            onChange={handleCsvSelected}
            disabled={isFixRunning}
            className="block w-full font-body text-body-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/20 file:text-primary file:font-body file:text-label-bold hover:file:bg-primary/30"
          />
          {csvFileName ? (
            <p className="font-body text-body-sm text-on-surface-variant">
              Arquivo: {csvFileName} — {brokenEntries?.length ?? 0} filme(s) com problema encontrado(s) no CSV
            </p>
          ) : null}
        </div>

        {brokenEntries?.length ? (
          <>
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-body text-body-md text-on-surface-variant">
                <input
                  type="radio"
                  name="fixMode"
                  value="both"
                  checked={fixMode === 'both'}
                  onChange={() => setFixMode('both')}
                  disabled={isFixRunning}
                />
                Corrigir pôster e vídeo
              </label>
              <label className="flex items-center gap-2 font-body text-body-md text-on-surface-variant">
                <input
                  type="radio"
                  name="fixMode"
                  value="poster"
                  checked={fixMode === 'poster'}
                  onChange={() => setFixMode('poster')}
                  disabled={isFixRunning}
                />
                Só pôster/imagem
              </label>
              <label className="flex items-center gap-2 font-body text-body-md text-on-surface-variant">
                <input
                  type="radio"
                  name="fixMode"
                  value="video"
                  checked={fixMode === 'video'}
                  onChange={() => setFixMode('video')}
                  disabled={isFixRunning}
                />
                Só vídeo
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleStartFix}
                disabled={fixStarting || isFixRunning || !fixCandidateCount}
                className="bg-primary text-on-primary font-body text-label-bold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(var(--glow-primary),0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFixRunning ? 'Corrigindo…' : `Corrigir ${fixCandidateCount} filme(s)`}
              </button>
              {fixJobId && !isFixRunning ? (
                <button
                  onClick={handleForgetFix}
                  className="px-4 py-2 rounded-lg border border-white/20 text-on-surface-variant hover:bg-white/10 transition-colors font-body text-label-bold"
                >
                  Esquecer essa correção
                </button>
              ) : null}
            </div>
          </>
        ) : null}

        {fixError ? <p className="text-error font-body text-body-md">{fixError}</p> : null}

        {fixJob ? (
          <div className="space-y-3 pt-2 border-t border-white/10">
            {fixJob.status === 'running' ? (
              <div className="space-y-2">
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${fixPct}%` }} />
                </div>
                <p className="font-body text-body-sm text-on-surface-variant">
                  {fixJob.checked}/{fixJob.total} verificados ({fixPct}%) · {fixJob.fixedCount} corrigido(s) ·{' '}
                  {fixJob.unfixedCount} sem substituto até agora
                </p>
              </div>
            ) : null}

            {fixJob.status === 'done' ? (
              <div className="space-y-3">
                <p className="font-body text-body-md text-on-background">
                  Concluído — {fixJob.fixedCount} corrigido(s), {fixJob.unfixedCount} sem substituto
                  encontrado.
                </p>
                <button
                  onClick={handleDownloadFix}
                  className="bg-primary text-on-primary font-body text-label-bold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(var(--glow-primary),0.4)] transition-all"
                >
                  Baixar relatório (CSV)
                </button>
              </div>
            ) : null}

            {fixJob.status === 'error' ? (
              <p className="text-error font-body text-body-md">Erro na correção: {fixJob.error}</p>
            ) : null}
          </div>
        ) : fixJobId ? (
          <p className="font-body text-body-md text-on-surface-variant">Carregando status da correção…</p>
        ) : null}
      </div>
    </div>
  );
}
