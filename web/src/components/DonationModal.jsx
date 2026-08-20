'use client';

import DonationContent from './DonationContent';
import AdBand from './AdBand';
import AdsterraBanner from './AdsterraBanner';
import useIsNarrowScreen from '../lib/useIsNarrowScreen';

const ADSENSE_SLOT_DOACAO = process.env.NEXT_PUBLIC_ADSENSE_SLOT_DOACAO;

export default function DonationModal({ onClose }) {
  // Desktop: só as duas faixas 728x90 (sem quadrados, sem AdSlot) em cima e
  // embaixo do conteúdo. Mobile: mantém o AdBand cheio (sanduíche) só
  // embaixo, como já era — o modal já é apertado verticalmente lá.
  const isDesktop = !useIsNarrowScreen();

  return (
    <div className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="fixed top-4 right-4 z-[80] w-10 h-10 rounded-full bg-surface-container-highest border border-white/10 text-on-background flex items-center justify-center hover:text-error transition-colors"
      >
        <span className="material-symbols-outlined">close</span>
      </button>
      <div className="min-h-full flex items-center justify-center p-4 py-16 sm:py-20">
        <div className="w-full max-w-3xl animate-hero-in" onClick={(e) => e.stopPropagation()}>
          {isDesktop ? (
            <>
              <div className="flex justify-center mb-10">
                <AdsterraBanner size="728x90" />
              </div>
              <DonationContent HeadingTag="h2" />
              <div className="flex justify-center mt-10">
                <AdsterraBanner size="728x90" />
              </div>
            </>
          ) : (
            <>
              <DonationContent HeadingTag="h2" />
              <AdBand slotId={ADSENSE_SLOT_DOACAO} className="mt-10" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
