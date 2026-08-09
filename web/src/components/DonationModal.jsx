'use client';

import DonationContent from './DonationContent';

export default function DonationModal({ onClose }) {
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
        <div className="w-full max-w-lg animate-hero-in" onClick={(e) => e.stopPropagation()}>
          <DonationContent HeadingTag="h2" />
        </div>
      </div>
    </div>
  );
}
