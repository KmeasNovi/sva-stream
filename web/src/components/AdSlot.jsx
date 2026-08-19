'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { useUser } from '../context/UserContext';
import useIsPro from '../lib/useIsPro';

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

// Unidade de anúncio manual do AdSense num ponto fixo da página (ex: abaixo
// do player). Só renderiza quando existe client ID (conta aprovada) E o slot
// específico foi criado no painel do AdSense e colado aqui via prop — até lá
// é um no-op silencioso.
//
// O script base do AdSense é carregado AQUI, por instância, e não no layout
// raiz — carregá-lo globalmente serve anúncio em toda página do site
// (login, cadastro, painel admin, telas de carregamento sem conteúdo), o
// que já rendeu uma violação de política ("anúncios em telas sem conteúdo
// do editor") na primeira revisão. Next.js deduplica automaticamente
// `<Script src=...>` repetido com o mesmo src, então várias instâncias de
// AdSlot na mesma página (ver /movie/[slug]) só baixam o arquivo uma vez.
export default function AdSlot({ slotId, className = '' }) {
  const pushed = useRef(false);
  // Quem assina o Premium não vê anúncio — mas só em pro.sepiastream.com.
  // Em sepiastream.com o anúncio aparece pra todo mundo, assinante ou não
  // (decisão explícita do usuário: o "sem anúncio" é um benefício do
  // domínio Pro, não da conta em qualquer lugar).
  const { user } = useUser();
  const isPro = useIsPro();
  const hideAds = Boolean(user?.isPremium) && isPro;

  useEffect(() => {
    if (!ADSENSE_CLIENT_ID || !slotId || hideAds || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // se o script do AdSense falhar ao carregar, não quebra a página
    }
  }, [slotId, hideAds]);

  if (!ADSENSE_CLIENT_ID || !slotId || hideAds) return null;

  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <ins
        className={`adsbygoogle block ${className}`}
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </>
  );
}
