'use client';

import { useLayoutEffect, useState } from 'react';

// Detecta se a página está sendo servida em pro.sepiastream.com. Sempre no
// navegador (nunca via headers() no servidor) pra não forçar todo o site a
// virar dynamic/SSR — ver o comentário em AuthGate.jsx pro porquê. Começa em
// `false` (comportamento padrão do site normal, sem flash de "carregando")
// e usa useLayoutEffect (roda antes do navegador pintar a tela) pra corrigir
// sem chance de mostrar o estado errado.
export default function useIsPro() {
  const [isPro, setIsPro] = useState(false);

  useLayoutEffect(() => {
    if (window.location.hostname.startsWith('pro.')) setIsPro(true);
  }, []);

  return isPro;
}
