'use client';

import useIsPro from '../lib/useIsPro';
import ProWordmark from './ProWordmark';

// "Pro" estilizado ao lado da marca no Navbar, só em pro.sepiastream.com.
export default function ProBadge() {
  const isPro = useIsPro();

  if (!isPro) return null;

  return (
    <span className="ml-1.5">
      <ProWordmark />
    </span>
  );
}
