'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useUser } from '../context/UserContext';
import useIsPro from '../lib/useIsPro';
import { api } from '../lib/api';

const PREMIUM_PRICE_LABEL = 'R$ 5,00/mês';
const SUPPORT_EMAIL = 'contato@sepiastream.com';

function formatDate(value) {
  if (!value) return null;
  return new Date(value).toLocaleDateString('pt-BR');
}

export default function SubscribeCard() {
  const { user, token, loading, refreshUser } = useUser();
  const isPro = useIsPro();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  if (loading) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setNotice('');
    setSubmitting(true);

    try {
      const { data } = await api.subscribePremium({}, token);
      if (data.invoiceUrl) {
        window.location.href = data.invoiceUrl;
        return;
      }
      setNotice('Assinatura criada! Estamos gerando sua cobrança — confira seu email em instantes.');
      refreshUser();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCancel() {
    if (!window.confirm('Cancelar a renovação da sua assinatura? Você continua com acesso Premium até o fim do período já pago.')) {
      return;
    }

    setError('');
    setNotice('');
    setSubmitting(true);

    try {
      await api.cancelPremium(token);
      setNotice('Renovação cancelada. Seu acesso Premium continua ativo até o fim do período já pago.');
      refreshUser();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-8 md:p-10 h-full space-y-5 sm:space-y-6">
      <div className="text-center space-y-2">
        <span className="material-symbols-outlined text-primary text-4xl sm:text-5xl inline-block">workspace_premium</span>
        <h2 className="font-display text-headline-sm sm:text-headline-md text-on-background">Assine o Premium</h2>
        <p className="font-body text-body-md text-on-surface-variant">
          Por {PREMIUM_PRICE_LABEL}, sem anúncios em todo o site.
        </p>
      </div>

      {user?.isPremium ? (
        <div className="space-y-4">
          <p className="text-center font-body text-label-bold text-primary">
            Você já é assinante Premium. Obrigado por apoiar o SepiaStream! 🎉
          </p>

          {isPro ? (
            <>
              <div className="glass-panel rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-body text-body-sm text-on-surface-variant">Validade do plano</span>
                  <span className="font-body text-label-bold text-on-background text-right">
                    {formatDate(user.subscription?.currentPeriodEnd) || 'Sem data de expiração'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-body text-body-sm text-on-surface-variant">Renovação</span>
                  <span className="font-body text-label-bold text-on-background text-right">
                    {user.subscription?.cancelAtPeriodEnd ? 'Não renova' : 'Automática'}
                  </span>
                </div>
              </div>

              {error ? <p className="text-error font-body text-body-sm text-center">{error}</p> : null}
              {notice ? <p className="text-primary font-body text-body-sm text-center">{notice}</p> : null}

              {!user.subscription?.cancelAtPeriodEnd ? (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={submitting}
                  className="w-full border border-error/30 text-error font-body text-label-bold px-6 py-3 rounded-lg hover:bg-error/10 transition-colors disabled:opacity-60"
                >
                  Cancelar assinatura
                </button>
              ) : null}

              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="flex items-center justify-center gap-2 font-body text-body-sm text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-base">support_agent</span>
                Fale com o suporte: {SUPPORT_EMAIL}
              </a>
            </>
          ) : null}
        </div>
      ) : user ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-3 text-on-surface-variant font-body text-body-md cursor-not-allowed"
          />
          {error ? <p className="text-error font-body text-body-sm">{error}</p> : null}
          {notice ? <p className="text-primary font-body text-body-sm">{notice}</p> : null}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-on-primary font-body text-label-bold px-6 py-4 rounded-xl hover:shadow-[0_0_20px_rgba(var(--glow-primary),0.4)] transition-all disabled:opacity-60"
          >
            {submitting ? 'Preparando...' : `Assinar por ${PREMIUM_PRICE_LABEL}`}
          </button>
          <p className="font-body text-body-sm text-on-surface-variant text-center">
            Assinatura mensal processada com segurança pelo Asaas.
          </p>
        </form>
      ) : (
        <div className="text-center space-y-4">
          <p className="font-body text-body-md text-on-surface-variant">Entre na sua conta pra assinar.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/entrar?next=/doacao"
              className="bg-primary text-on-primary font-body text-label-bold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(var(--glow-primary),0.4)] transition-all"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="border border-primary/30 text-primary font-body text-label-bold px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors"
            >
              Criar conta
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
