'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '../context/UserContext';

const STORAGE_KEY = 'sva_cookie_consent';

export default function CookieConsent() {
  const { user } = useUser();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[60] p-4 md:p-6">
      <div
        className={`glass-panel rounded-2xl p-5 md:p-6 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-4 shadow-2xl shadow-primary/20 ${user ? 'md:ml-[304px]' : ''}`}
      >
        <p className="font-body text-body-md text-on-surface-variant text-center sm:text-left">
          Usamos cookies pra manter você logado e exibir anúncios que ajudam a manter o CulStream gratuito. Saiba
          mais na{' '}
          <Link href="/privacidade" className="text-primary hover:text-primary-fixed transition-colors underline">
            Política de Privacidade
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={accept}
          className="flex-none bg-primary text-on-primary font-body text-label-bold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all whitespace-nowrap"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
