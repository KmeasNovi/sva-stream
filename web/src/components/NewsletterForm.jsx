'use client';

import { useState } from 'react';
import { api } from '../lib/api';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.subscribeNewsletter(email);
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
    }
  }

  return (
    <section className="container mx-auto px-container-margin pb-20">
      <div className="glass-panel rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-display text-headline-md text-on-background mb-1">Novidades no catálogo</h3>
          <p className="font-body text-body-md text-on-surface-variant">
            Avisamos por email quando novos filmes entrarem no ar.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <input
            type="email"
            required
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 md:w-64 bg-[#111111] text-on-background rounded-full px-5 py-3 border border-white/10 focus:outline-none focus:ring-1 focus:ring-primary font-body text-body-md placeholder:text-on-surface-variant/50"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-primary text-on-primary font-body text-label-bold px-6 py-3 rounded-full hover:shadow-[0_0_20px_rgba(var(--glow-primary),0.4)] hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >
            Inscrever
          </button>
        </form>
      </div>
      {status === 'success' ? <p className="text-secondary font-body text-body-md mt-4">Inscrito com sucesso!</p> : null}
      {status === 'error' ? <p className="text-error font-body text-body-md mt-4">Algo deu errado, tente novamente.</p> : null}
    </section>
  );
}
