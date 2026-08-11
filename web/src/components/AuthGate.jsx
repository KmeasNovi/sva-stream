'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';
import LoadingScreen from './LoadingScreen';

const PUBLIC_PATHS = [
  '/',
  '/entrar',
  '/cadastro',
  '/verificar-email',
  '/esqueci-senha',
  '/redefinir-senha',
  '/privacidade',
  '/doacao',
  '/catalogo',
];

export default function AuthGate({ children }) {
  const { user, loading } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = PUBLIC_PATHS.includes(pathname) || pathname.startsWith('/admin') || pathname.startsWith('/movie/');

  useEffect(() => {
    if (loading || isPublic || user) return;
    router.replace(`/entrar?next=${encodeURIComponent(pathname)}`);
  }, [loading, isPublic, user, pathname, router]);

  if (isPublic) return children;

  if (loading || !user) {
    return <LoadingScreen />;
  }

  return children;
}
