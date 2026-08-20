'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';
import useIsPro from '../lib/useIsPro';
import LoadingScreen from './LoadingScreen';
import ProLockScreen from './ProLockScreen';

// Navegação livre pra quem não tem conta é igual à de quem tem — a única
// coisa que exige login de verdade é favoritar (ver FavoriteButton.jsx, que
// manda pra /entrar só nesse clique). /minha-lista entra aqui também: sem
// conta, o componente já mostra um prompt de login próprio em vez de listar
// favoritos vazios — não precisa do redirect do gate pra isso.
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
  '/home',
  '/search',
  '/minha-lista',
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
  const isPublic =
    isAdminOrAuthExempt ||
    (!isPro && PUBLIC_PATHS.includes(pathname)) ||
    (!isPro && (pathname.startsWith('/movie/') || pathname.startsWith('/genre/')));

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
