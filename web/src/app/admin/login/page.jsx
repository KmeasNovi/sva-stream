'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.login(email, password);
      localStorage.setItem('sva_admin_token', data.token);
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container mx-auto px-container-margin py-16 max-w-md">
      <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-8 space-y-4">
        <h1 className="font-display text-headline-md text-on-background mb-2">Login admin</h1>
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
        <button
          type="submit"
          className="w-full bg-primary text-on-primary font-body text-label-bold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(var(--glow-primary),0.4)] transition-all"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
