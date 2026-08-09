'use client';

import DonationContent from './DonationContent';

export default function DonationModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl my-8 animate-hero-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-surface-container-highest border border-white/10 text-on-background flex items-center justify-center hover:text-error transition-colors z-10"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <DonationContent HeadingTag="h2" />
      </div>
    </div>
  );
}
