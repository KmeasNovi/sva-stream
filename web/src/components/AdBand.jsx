'use client';

import AdSlot from './AdSlot';
import AdsterraBanner from './AdsterraBanner';

// Padrão único de "faixa de anúncio" — usado em todo espaço de Banner do
// site (não no Native Banner da página de filme, que é um formato à parte).
// 4 anúncios do Adsterra formando um bloco só, sem espaço entre eles —
// agrupados por tamanho em vez de misturados: fileira de cima com os dois
// banners largos (mesma altura, encaixam perfeito), fileira de baixo com os
// dois quadrados (mesma altura, encaixam perfeito). Misturar tamanho
// diferente lado a lado (728x90 com 300x250) deixava sobra vazia embaixo do
// banner mais baixo — por isso agrupado, cada fileira é internamente lisa.
// items-center faz cada fileira centralizar na própria largura em vez de
// esticar pra bater com a fileira mais larga (que deixaria vazio do lado).
// O AdSlot do AdSense fica fora do bloco, acima dele (enquanto o slot
// daquele espaço não existir, é um no-op que não afeta o layout).
// overflow-x-auto evita que o bloco (1456px de largura no topo) quebre o
// layout da página em telas estreitas — rola só ele, não a página inteira.
export default function AdBand({ slotId, className = '' }) {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <AdSlot slotId={slotId} />
      <div className="max-w-full overflow-x-auto">
        <div className="flex flex-col items-center w-max mx-auto">
          <div className="flex">
            <AdsterraBanner size="728x90" />
            <AdsterraBanner size="728x90" />
          </div>
          <div className="flex">
            <AdsterraBanner size="300x250" />
            <AdsterraBanner size="300x250" />
          </div>
        </div>
      </div>
    </div>
  );
}
