'use client';

import { useUser } from '../context/UserContext';

// Mostrado no lugar do conteúdo real quando alguém logado (mas sem
// assinatura Premium ativa) acessa pro.sepiastream.com — ver AuthGate.jsx.
// A assinatura em si é feita no site normal (mesmo fluxo de /doacao já
// existente), não duplicamos esse formulário aqui.
export default function ProLockScreen() {
  const { user, logout } = useUser();

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-24 min-h-[60vh] px-4 text-center">
      <span className="material-symbols-outlined text-primary text-5xl">workspace_premium</span>
      <h1 className="font-display text-headline-md text-on-background">SepiaStream Pro é só pra assinantes</h1>
      <p className="font-body text-body-md text-on-surface-variant max-w-md">
        A conta {user?.email} ainda não tem uma assinatura Premium ativa. Assine no site principal pra liberar o
        acesso aqui.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <a
          href="https://sepiastream.com/doacao"
          className="bg-primary text-on-primary font-body text-label-bold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(var(--glow-primary),0.4)] transition-all"
        >
          Assinar o Premium
        </a>
        <button
          type="button"
          onClick={logout}
          className="border border-primary/30 text-primary font-body text-label-bold px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors"
        >
          Sair e entrar com outra conta
        </button>
      </div>
    </div>
  );
}
