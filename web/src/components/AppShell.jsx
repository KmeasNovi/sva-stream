'use client';

import Navbar from './Navbar';
import AuthGate from './AuthGate';
import { useUser } from '../context/UserContext';

export default function AppShell({ children }) {
  const { user } = useUser();

  return (
    <>
      <Navbar />
      <main className={`pt-[72px] min-h-screen pb-20 md:pb-0 ${user ? 'md:pl-[280px]' : ''}`}>
        <AuthGate>{children}</AuthGate>
      </main>
    </>
  );
}
