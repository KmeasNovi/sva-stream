'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';

const PUBLIC_PATHS = ['/entrar', '/cadastro', '/verificar-email'];

export default function AuthGate({ children }) {
  const { user, loading } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = PUBLIC_PATHS.includes(pathname) || pathname.startsWith('/admin');

  useEffect(() => {
    if (loading || isPublic || user) return;
    router.replace(`/entrar?next=${encodeURIComponent(pathname)}`);
  }, [loading, isPublic, user, pathname, router]);

  if (isPublic) return children;

  if (loading || !user) {
    return (
      <div className="container mx-auto px-container-margin py-16">
        <p className="font-body text-body-md text-on-surface-variant">Carregando...</p>
      </div>
    );
  }

  return children;
}
