'use client';

import Script from 'next/script';
import { useUser } from '../context/UserContext';

const SCRIPT_SRC = process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_SCRIPT_SRC;
const CONTAINER_ID = process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_CONTAINER_ID;

// Native Banner do Adsterra — ao contrário do Banner (AdsterraBanner.jsx),
// o script alvo procura um id de container fixo no DOM (não recebe key por
// parâmetro), então só faz sentido montado uma vez por página — repetir o
// componente na mesma página duplicaria o id e só o primeiro seria
// preenchido. Hoje só é usado no meio da página de filme.
export default function AdsterraNativeBanner({ className = '' }) {
  const { user } = useUser();
  const isPremium = Boolean(user?.isPremium);

  if (!SCRIPT_SRC || !CONTAINER_ID || isPremium) return null;

  return (
    <div className={className}>
      <div id={CONTAINER_ID} />
      <Script async data-cfasync="false" src={SCRIPT_SRC} strategy="afterInteractive" />
    </div>
  );
}
