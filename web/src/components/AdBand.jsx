'use client';

import AdSlot from './AdSlot';
import AdsterraBanner from './AdsterraBanner';

// Padrão único de "faixa de anúncio" — usado em todo espaço de Banner do
// site (não no Native Banner da página de filme, que é um formato à parte).
// Sempre 3 anúncios juntos: o AdSlot do AdSense (some sozinho enquanto o
// slot daquele espaço não existir) + os dois tamanhos de Banner do Adsterra,
// um deles repetido — garante 3 anúncios visíveis mesmo hoje, com o AdSense
// ainda sem slot configurado na maioria das páginas. slotId é opcional.
export default function AdBand({ slotId, className = '' }) {
  return (
    <div className={`flex flex-wrap items-start justify-center gap-4 ${className}`}>
      <AdSlot slotId={slotId} />
      <AdsterraBanner size="728x90" />
      <AdsterraBanner size="300x250" />
      <AdsterraBanner size="300x250" />
    </div>
  );
}
