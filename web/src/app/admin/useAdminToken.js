'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Lê o token salvo no login e manda pra tela de login se não existir. A
// validade de verdade do token é sempre checada pelo backend (requireAdmin)
// em cada chamada — isso aqui é só a experiência de não deixar a tela
// piscar sem dado antes de redirecionar.
export default function useAdminToken() {
  const router = useRouter();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('sva_admin_token');
    if (!stored) {
      router.push('/admin/login');
      return;
    }
    setToken(stored);
  }, [router]);

  return token;
}
