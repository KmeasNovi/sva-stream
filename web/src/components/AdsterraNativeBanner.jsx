'use client';

import Script from 'next/script';
import useIsPro from '../lib/useIsPro';

const SCRIPT_SRC = process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_SCRIPT_SRC;
const CONTAINER_ID = process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_CONTAINER_ID;

// Native Banner do Adsterra — ao contrário do Banner (AdsterraBanner.jsx),
// o script alvo procura um id de container fixo no DOM (não recebe key por
// parâmetro), então só faz sentido montado uma vez por página — repetir o
// componente na mesma página duplicaria o id e só o primeiro seria
// preenchido. Hoje só é usado no meio da página de filme.
export default function AdsterraNativeBanner({ className = '' }) {
  // Mesma regra do AdSlot.jsx: nunca tem anúncio em pro.sepiastream.com.
  const isPro = useIsPro();
  const hideAds = isPro;

  if (!SCRIPT_SRC || !CONTAINER_ID || hideAds) return null;

  return (
    <div className={className}>
      <div id={CONTAINER_ID} />
      <Script async data-cfasync="false" src={SCRIPT_SRC} strategy="afterInteractive" />
    </div>
  );
}
