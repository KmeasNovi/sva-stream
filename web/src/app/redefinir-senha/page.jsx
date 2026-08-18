'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { api } from '../../lib/api';

export default function RedefinirSenhaPage() {
  return (
    <Suspense fallback={null}>
      <RedefinirSenhaForm />
    </Suspense>
  );
}

function RedefinirSenhaForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Link de redefinição inválido — falta o token.');
      return;
    }
    if (password.length < 8) {
      setError('A senha precisa ter pelo menos 8 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não são iguais.');
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="container mx-auto px-container-margin py-16 max-w-md">
        <div className="glass-panel rounded-2xl p-8 space-y-4 text-center">
          <span className="material-symbols-outlined text-secondary text-5xl">check_circle</span>
          <h1 className="font-display text-headline-md text-on-background">Senha redefinida!</h1>
          <p className="font-body text-body-md text-on-surface-variant">Você já pode entrar com a nova senha.</p>
          <Link
            href="/entrar"
            className="inline-block font-body text-label-bold text-primary hover:text-primary-fixed transition-colors"
          >
            Ir para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-container-margin py-16 max-w-md">
      <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-8 space-y-4">
        <h1 className="font-display text-headline-md text-on-background mb-2">Nova senha</h1>
        <input
          type="password"
          placeholder="Nova senha (mínimo 8 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-3 text-on-background font-body text-body-md focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <input
          type="password"
          placeholder="Confirme a nova senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-3 text-on-background font-body text-body-md focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {error ? <p className="text-error font-body text-body-md">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-on-primary font-body text-label-bold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(var(--glow-primary),0.4)] transition-all disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Redefinir senha'}
        </button>
      </form>
    </div>
  );
}
