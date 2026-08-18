'use client';

import useIsPro from '../lib/useIsPro';

// "Pro" estilizado (gradiente + coroa) ao lado da marca no Navbar, só em
// pro.sepiastream.com.
export default function ProBadge() {
  const isPro = useIsPro();

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
