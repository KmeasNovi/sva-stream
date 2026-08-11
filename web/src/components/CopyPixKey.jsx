'use client';

import { useState } from 'react';

export default function CopyPixKey({ value }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard indisponível — a chave já está visível pra copiar manualmente
    }
  }

  return (
    <div className="w-full">
      <div className="glass-panel rounded-lg px-4 py-3 flex items-center justify-between gap-3">
        <code className="font-body text-body-md text-on-background break-all">{value}</code>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="mt-3 w-full border border-primary/30 text-primary font-body text-label-bold px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors"
      >
        {copied ? 'Copiado!' : 'Copiar chave PIX'}
      </button>
    </div>
  );
}
