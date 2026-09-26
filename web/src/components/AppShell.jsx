'use client';

import { usePathname, useSelectedLayoutSegment } from 'next/navigation';
import Navbar from './Navbar';
import AuthGate from './AuthGate';
import isChromeLessPath from '../lib/chromeLessPaths';

export default function AppShell({ children }) {
  const pathname = usePathname();
  const segment = useSelectedLayoutSegment();
  const showChrome = !isChromeLessPath(pathname);

  // Flyer pra provedores (flyer.sepiastream.com) — página de venda B2B, sem
  // navbar, login nem gate do app de streaming. Checa o segmento renderizado
  // e não o pathname: o middleware reescreve "/" → /sva, então o pathname
  // continua "/" (ver middleware.js).
  if (segment === 'sva') {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className={`pt-[72px] min-h-screen pb-20 md:pb-0 ${showChrome ? 'md:pl-[280px]' : ''}`}>
        <AuthGate>{children}</AuthGate>
      </main>
    </>
  );
}
