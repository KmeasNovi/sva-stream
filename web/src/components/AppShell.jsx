'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import AuthGate from './AuthGate';
import isChromeLessPath from '../lib/chromeLessPaths';

export default function AppShell({ children }) {
  const pathname = usePathname();
  const showChrome = !isChromeLessPath(pathname);

  return (
    <>
      <Navbar />
      <main className={`pt-[72px] min-h-screen pb-20 md:pb-0 ${showChrome ? 'md:pl-[280px]' : ''}`}>
        <AuthGate>{children}</AuthGate>
      </main>
    </>
  );
}
