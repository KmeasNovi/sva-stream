'use client';

import { useLayoutEffect, useState } from 'react';

// "Pro" estilizado (gradiente + coroa) ao lado da marca no Navbar, só em
// pro.sepiastream.com. Mesmo padrão de detecção de host client-side do
// AuthGate.jsx (evita forçar SSR dinâmico em todo o site — ver comentário lá).
export default function ProBadge() {
  const [isPro, setIsPro] = useState(false);

  useLayoutEffect(() => {
    if (window.location.hostname.startsWith('pro.')) setIsPro(true);
  }, []);

  if (!isPro) return null;

  return (
    <span className="relative inline-flex ml-1.5 align-baseline">
      <span className="bg-gradient-to-r from-[rgb(var(--color-primary))] to-[#ffd54f] bg-clip-text text-transparent font-display font-extrabold italic">
        Pro
      </span>
      <span className="absolute -top-2.5 -right-3 text-xs rotate-12 select-none" aria-hidden="true">
        👑
      </span>
    </span>
  );
}
