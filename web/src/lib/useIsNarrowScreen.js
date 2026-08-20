'use client';

import { useLayoutEffect, useState } from 'react';

// 639px = limite do breakpoint "sm" do Tailwind, já usado em todo o resto do
// site pra decidir layout mobile vs desktop — mesma régua aqui, pro
// AdBand.jsx trocar o banner largo (728x90) pelo mobile (320x50).
const QUERY = '(max-width: 639px)';

export default function useIsNarrowScreen() {
  const [isNarrow, setIsNarrow] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia(QUERY);
    setIsNarrow(mq.matches);
    const handler = (e) => setIsNarrow(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isNarrow;
}
