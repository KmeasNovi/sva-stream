'use client';

import { useLayoutEffect, useState } from 'react';

// Selo "PRO" ao lado da marca no Navbar, só em pro.sepiastream.com. Mesmo
// padrão de detecção de host client-side do AuthGate.jsx (evita forçar SSR
// dinâmico em todo o site — ver comentário lá).
export default function ProBadge() {
  const [isPro, setIsPro] = useState(false);

  useLayoutEffect(() => {
    if (window.location.hostname.startsWith('pro.')) setIsPro(true);
  }, []);

  if (!isPro) return null;

  return (
    <span className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-primary/25 to-primary-container/25 border border-primary/50 shadow-[0_0_12px_rgba(var(--glow-primary),0.35)] align-middle">
      <span
        className="material-symbols-outlined text-primary text-[13px] leading-none"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        workspace_premium
      </span>
      <span className="font-display text-[11px] font-extrabold tracking-wider text-primary leading-none">PRO</span>
    </span>
  );
}
