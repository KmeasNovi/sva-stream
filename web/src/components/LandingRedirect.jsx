'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';

// Quem já tem sessão não precisa ver a vitrine pública — manda direto pro
// feed. Roda só no cliente, então não atrapalha a indexação: buscador não
// executa isso, só vê o HTML da landing normalmente.
export default function LandingRedirect() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace('/home');
  }, [loading, user, router]);

  return null;
}
