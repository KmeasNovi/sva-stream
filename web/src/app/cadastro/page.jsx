'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { useUser } from '../../context/UserContext';
import GoogleSignInButton from '../../components/GoogleSignInButton';

export default function CadastroPage() {
  const router = useRouter();
  const { loginWithGoogle } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleGoogleCredential(idToken) {
    setError('');
    try {
      await loginWithGoogle(idToken);
      router.push('/home');
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

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
      await api.register({ name, email, password });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="container mx-auto px-container-margin py-16 max-w-md min-h-[calc(100vh-72px)] flex flex-col justify-center">
        <div className="glass-panel rounded-2xl p-8 space-y-4 text-center">
          <span className="material-symbols-outlined text-secondary text-5xl">mark_email_read</span>
          <h1 className="font-display text-headline-md text-on-background">Quase lá!</h1>
          <p className="font-body text-body-md text-on-surface-variant">
            Mandamos um email de confirmação pra <strong className="text-on-background">{email}</strong>. Clique no
            link pra ativar sua conta e poder entrar.
          </p>
          <Link href="/entrar" className="inline-block font-body text-label-bold text-primary hover:text-primary-fixed transition-colors">
            Já confirmei, ir para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-container-margin py-16 max-w-md min-h-[calc(100vh-72px)] flex flex-col justify-center">
      <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-8 space-y-4">
        <h1 className="font-display text-headline-md text-on-background mb-2">Criar conta</h1>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-3 text-on-background font-body text-body-md focus:outline-none focus:ring-1 focus:ring-primary"
        />
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
          placeholder="Senha (mínimo 8 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-3 text-on-background font-body text-body-md focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <input
          type="password"
          placeholder="Confirme a senha"
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
          {loading ? 'Criando conta...' : 'Criar conta'}
        </button>
        <p className="font-body text-body-md text-on-surface-variant text-center">
          Já tem conta?{' '}
          <Link href="/entrar" className="text-primary hover:text-primary-fixed transition-colors">
            Entrar
          </Link>
        </p>
        <GoogleSignInButton onCredential={handleGoogleCredential} />
      </form>
    </div>
  );
}
