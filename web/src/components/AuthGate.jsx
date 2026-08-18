'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';
import useIsPro from '../lib/useIsPro';
import LoadingScreen from './LoadingScreen';
import ProLockScreen from './ProLockScreen';

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

// Páginas de autenticação/admin ficam sempre acessíveis, em qualquer host —
// no Pro, é por elas que dá pra entrar/criar conta antes de existir sessão;
// /admin usa login próprio (Admin, não User), nunca depende de assinatura.
const AUTH_EXEMPT_PATHS = ['/entrar', '/cadastro', '/verificar-email', '/esqueci-senha', '/redefinir-senha'];

export default function AuthGate({ children }) {
  const { user, loading } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  // pro.sepiastream.com é o mesmo deploy do site normal, só com acesso
  // fechado pra quem não é assinante Premium (mesmo catálogo, mesmos
  // recursos, sem anúncios — ver server/src/config/plans.js).
  const isPro = useIsPro();

  const isAdminOrAuthExempt = pathname.startsWith('/admin') || AUTH_EXEMPT_PATHS.includes(pathname);
  // No site normal, PUBLIC_PATHS continua liberando navegação sem login. No
  // Pro, isso não vale — só as páginas de auth/admin acima ficam de fora do
  // bloqueio, tudo o resto exige login E assinatura ativa.
  const isPublic = isAdminOrAuthExempt || (!isPro && PUBLIC_PATHS.includes(pathname)) || (!isPro && pathname.startsWith('/movie/'));

  useEffect(() => {
    if (loading || isPublic || user) return;
    router.replace(`/entrar?next=${encodeURIComponent(pathname)}`);
  }, [loading, isPublic, user, pathname, router]);

  if (isPublic) return children;

  if (loading || !user) {
    return <LoadingScreen />;
  }

  if (isPro && !user.isPremium) {
    return <ProLockScreen />;
  }

  return children;
}
