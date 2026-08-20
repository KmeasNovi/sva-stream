'use client';

import AdSlot from './AdSlot';
import AdsterraBanner from './AdsterraBanner';
import useIsNarrowScreen from '../lib/useIsNarrowScreen';

// Padrão único de "faixa de anúncio" — usado em todo espaço de Banner do
// site (não no Native Banner da página de filme, que é um formato à parte).
// 4 anúncios do Adsterra em formato "sanduíche", sem espaço entre eles:
// faixa larga em cima, os dois quadrados lado a lado no meio, outra faixa
// larga embaixo. items-center faz cada fileira centralizar na própria
// largura em vez de esticar pra bater com a fileira mais larga (que
// deixaria vazio do lado). O AdSlot do AdSense fica fora do bloco, acima
// dele (enquanto o slot daquele espaço não existir, é um no-op que não
// afeta o layout).
//
// Em tela estreita (mobile), a faixa larga vira 320x50 em vez de 728x90 —
// 728px não cabe num celular, e antes disso a pessoa precisava arrastar o
// dedo pra ver o resto do banner. Troca via useIsNarrowScreen (não CSS puro)
// pra só carregar UM dos dois tamanhos por vez, não os dois escondendo um.
export default function AdBand({ slotId, className = '' }) {
  const isNarrow = useIsNarrowScreen();
  const wideBannerSize = isNarrow ? '320x50' : '728x90';

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <AdSlot slotId={slotId} />
      <div className="max-w-full overflow-x-auto">
        <div className="flex flex-col items-center w-max mx-auto">
          <AdsterraBanner size={wideBannerSize} />
          <div className="flex">
            <AdsterraBanner size="300x250" />
            <AdsterraBanner size="300x250" />
          </div>
          <AdsterraBanner size={wideBannerSize} />
        </div>
      </div>
    </div>
  );
}
