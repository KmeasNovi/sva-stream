'use client';

import { useEffect, useRef } from 'react';

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

// Unidade de anúncio manual do AdSense num ponto fixo da página (ex: abaixo
// do player). Só renderiza quando existe client ID (conta aprovada) E o slot
// específico foi criado no painel do AdSense e colado aqui via prop — até lá
// é um no-op silencioso, mesmo padrão usado pro resto do AdSense no site
// (ver layout.jsx).
export default function AdSlot({ slotId, className = '' }) {
  const insRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!ADSENSE_CLIENT_ID || !slotId || pushed.current || !window.adsbygoogle) return;
    try {
      window.adsbygoogle.push({});
      pushed.current = true;
    } catch {
      // se o script do AdSense ainda não carregou/falhou, não quebra a página
    }
  }, [slotId]);

  if (!ADSENSE_CLIENT_ID || !slotId) return null;

  return (
    <ins
      ref={insRef}
      className={`adsbygoogle block ${className}`}
      style={{ display: 'block' }}
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-slot={slotId}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
