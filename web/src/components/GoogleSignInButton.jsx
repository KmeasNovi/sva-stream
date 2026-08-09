'use client';

import { useCallback, useEffect, useRef } from 'react';
import Script from 'next/script';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

// Botão oficial do Google (Google Identity Services) — só aparece quando
// NEXT_PUBLIC_GOOGLE_CLIENT_ID está configurado (ver web/.env.example),
// mesmo padrão de "no-op até a env existir" usado pro AdSense em layout.jsx.
export default function GoogleSignInButton({ onCredential }) {
  const buttonRef = useRef(null);

  const renderButton = useCallback(() => {
    if (!window.google?.accounts?.id || !buttonRef.current) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => onCredential(response.credential),
    });
    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: 'filled_black',
      size: 'large',
      shape: 'pill',
      text: 'continue_with',
      locale: 'pt-BR',
      width: 320,
    });
  }, [onCredential]);

  useEffect(() => {
    if (window.google?.accounts?.id) renderButton();
  }, [renderButton]);

  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onReady={renderButton} onLoad={renderButton} />
      <div className="flex items-center gap-3 text-on-surface-variant">
        <span className="h-px flex-1 bg-white/10" />
        <span className="font-body text-body-sm">ou</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <div ref={buttonRef} className="flex justify-center" />
    </>
  );
}
