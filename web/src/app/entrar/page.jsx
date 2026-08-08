'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '../../context/UserContext';
import { api } from '../../lib/api';

export default function EntrarPage() {
  return (
    <Suspense fallback={null}>
      <EntrarForm />
    </Suspense>
  );
}

function EntrarForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendStatus, setResendStatus] = useState('idle');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setNeedsVerification(false);
    setLoading(true);
    try {
      await login(email, password);
      router.push(searchParams.get('next') || '/minha-lista');
    } catch (err) {
      setError(err.message);
      if (err.message.includes('Confirme seu email')) {
        setNeedsVerification(true);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResendStatus('loading');
    try {
      await api.resendVerification(email);
      setResendStatus('sent');
    } catch {
      setResendStatus('idle');
    }
  }

  return (
    <div className="container mx-auto px-container-margin py-16 max-w-md">
      <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-8 space-y-4">
        <h1 className="font-display text-headline-md text-on-background mb-2">Entrar</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-3 text-on-background font-body text-body-md focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-3 text-on-background font-body text-body-md focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {error ? <p className="text-error font-body text-body-md">{error}</p> : null}
        {needsVerification ? (
          <button
            type="button"
            onClick={handleResend}
            disabled={resendStatus !== 'idle'}
            className="w-full border border-primary/30 text-primary font-body text-label-bold px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors disabled:opacity-50"
          >
            {resendStatus === 'sent' ? 'Email reenviado!' : resendStatus === 'loading' ? 'Reenviando...' : 'Reenviar email de confirmação'}
          </button>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-on-primary font-body text-label-bold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <p className="font-body text-body-md text-on-surface-variant text-center">
          Ainda não tem conta?{' '}
          <Link href="/cadastro" className="text-primary hover:text-primary-fixed transition-colors">
            Criar conta
          </Link>
        </p>
      </form>
    </div>
  );
}
