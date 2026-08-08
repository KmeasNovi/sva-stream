'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { api } from '../../lib/api';

export default function VerificarEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Link de verificação inválido — falta o token.');
      return;
    }
    api
      .verifyEmail(token)
      .then((res) => {
        setStatus('success');
        setMessage(res.message);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message);
      });
  }, [token]);

  return (
    <div className="container mx-auto px-container-margin py-16 max-w-md">
      <div className="glass-panel rounded-2xl p-8 space-y-4 text-center">
        {status === 'loading' ? (
          <p className="font-body text-body-md text-on-surface-variant">Confirmando seu email...</p>
        ) : (
          <>
            <span
              className={`material-symbols-outlined text-5xl ${status === 'success' ? 'text-secondary' : 'text-error'}`}
            >
              {status === 'success' ? 'check_circle' : 'error'}
            </span>
            <p className="font-body text-body-md text-on-background">{message}</p>
            <Link
              href="/entrar"
              className="inline-block font-body text-label-bold text-primary hover:text-primary-fixed transition-colors"
            >
              Ir para o login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
