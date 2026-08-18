'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '../../lib/api';

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="container mx-auto px-container-margin py-16 max-w-md">
        <div className="glass-panel rounded-2xl p-8 space-y-4 text-center">
          <span className="material-symbols-outlined text-secondary text-5xl">mark_email_read</span>
          <h1 className="font-display text-headline-md text-on-background">Confira seu email</h1>
          <p className="font-body text-body-md text-on-surface-variant">
            Se <strong className="text-on-background">{email}</strong> tiver uma conta cadastrada, mandamos um link
            pra redefinir a senha. O link vale por 1 hora.
          </p>
          <Link href="/entrar" className="inline-block font-body text-label-bold text-primary hover:text-primary-fixed transition-colors">
            Voltar para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-container-margin py-16 max-w-md">
      <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-8 space-y-4">
        <h1 className="font-display text-headline-md text-on-background mb-2">Esqueceu a senha?</h1>
        <p className="font-body text-body-md text-on-surface-variant">
          Informe seu email e mandamos um link pra você escolher uma senha nova.
        </p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-3 text-on-background font-body text-body-md focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {error ? <p className="text-error font-body text-body-md">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-on-primary font-body text-label-bold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(var(--glow-primary),0.4)] transition-all disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Enviar link de redefinição'}
        </button>
        <p className="font-body text-body-md text-on-surface-variant text-center">
          <Link href="/entrar" className="text-primary hover:text-primary-fixed transition-colors">
            Voltar para o login
          </Link>
        </p>
      </form>
    </div>
  );
}
