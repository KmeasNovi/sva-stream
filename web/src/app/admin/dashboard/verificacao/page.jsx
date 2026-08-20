'use client';

import { useEffect, useRef, useState } from 'react';
import AdminNav from '../../AdminNav';
import useAdminToken from '../../useAdminToken';
import { api } from '../../../../lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const JOB_STORAGE_KEY = 'sva_admin_healthcheck_job';
const POLL_INTERVAL_MS = 5000;

async function downloadCsv(jobId, token) {
  const res = await fetch(`${API_URL}/api/health-check/${jobId}/csv`, {
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
  a.download = `filmes-quebrados-${jobId.slice(0, 8)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function AdminHealthCheckPage() {
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
    if (!token || !jobId) return undefined;

    async function poll() {
      try {
        const { data } = await api.getHealthCheckStatus(jobId, token);
        setJob(data);
        setError('');
        if (data.status !== 'running') {
          clearInterval(pollRef.current);
        }
      } catch (err) {
        // Job some da memória do servidor se ele reiniciar (deploy novo) —
        // sem isso a tela ficaria presa pra sempre tentando de novo.
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
      const { data } = await api.startHealthCheck(token);
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
  const pct = job?.total ? Math.round((job.checked / job.total) * 100) : 0;

  return (
    <div className="container mx-auto px-container-margin py-12 space-y-10">
      <AdminNav />
      <h1 className="font-display text-headline-lg text-on-background">Verificar links</h1>

      <div className="glass-panel rounded-2xl p-8 max-w-2xl space-y-6">
        <p className="font-body text-body-md text-on-surface-variant">
          Passa por todo o catálogo checando se o pôster, o backdrop e o vídeo de cada filme ainda
          carregam de verdade (arquivo removido/link quebrado na fonte original — archive.org, YouTube,
          etc.). Não altera nada no catálogo, só gera uma planilha (CSV) com o que encontrar de errado.
          Com o catálogo atual isso pode levar de 10 a 20 minutos — pode fechar essa aba e voltar depois,
          o progresso continua salvo.
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleStart}
            disabled={starting || isRunning}
            className="bg-primary text-on-primary font-body text-label-bold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(var(--glow-primary),0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? 'Verificação em andamento…' : 'Iniciar verificação'}
          </button>
          {jobId && !isRunning ? (
            <button
              onClick={handleForget}
              className="px-4 py-2 rounded-lg border border-white/20 text-on-surface-variant hover:bg-white/10 transition-colors font-body text-label-bold"
            >
              Esquecer essa verificação
            </button>
          ) : null}
        </div>
      </div>

      {error || job ? (
        <div className="glass-panel rounded-2xl p-8 max-w-2xl space-y-4">
          <h2 className="font-display text-headline-md text-on-background">Status</h2>
          {error ? <p className="text-error font-body text-body-md">{error}</p> : null}

          {job ? (
            <div className="space-y-4">
              {job.status === 'running' ? (
                <div className="space-y-2">
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="font-body text-body-sm text-on-surface-variant">
                    {job.checked}/{job.total} filmes verificados ({pct}%) · {job.brokenCount} problema(s)
                    encontrado(s) até agora
                  </p>
                </div>
              ) : null}

              {job.status === 'done' ? (
                <div className="space-y-3">
                  <p className="font-body text-body-md text-on-background">
                    Concluído — {job.total} filmes verificados, {job.brokenCount} problema(s) encontrado(s).
                  </p>
                  <button
                    onClick={handleDownload}
                    className="bg-primary text-on-primary font-body text-label-bold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(var(--glow-primary),0.4)] transition-all"
                  >
                    Baixar planilha (CSV)
                  </button>
                </div>
              ) : null}

              {job.status === 'error' ? (
                <p className="text-error font-body text-body-md">Erro na verificação: {job.error}</p>
              ) : null}
            </div>
          ) : jobId ? (
            <p className="font-body text-body-md text-on-surface-variant">Carregando status…</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
