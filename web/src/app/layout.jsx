import './globals.css';
import Script from 'next/script';
import AppShell from '../components/AppShell';
import CookieConsent from '../components/CookieConsent';
import { UserProvider } from '../context/UserContext';

export const metadata = {
  metadataBase: new URL('https://web-ten-tau-67.vercel.app'),
  title: 'CulStream',
  description: 'Clássicos do cinema e curtas de animação, de graça, para todo mundo.',
};

// Só carrega o AdSense quando a conta existir de verdade (ver
// web/.env.example) — até lá, isso é um no-op silencioso.
const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export default function RootLayout({ children }) {
  return (
    <html className="dark" lang="pt-BR">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=Inter:wght@400;600&display=swap" rel="stylesheet" />
        {ADSENSE_CLIENT_ID ? (
          <meta name="google-adsense-account" content={ADSENSE_CLIENT_ID} />
        ) : null}
      </head>
      <body className="bg-background text-on-background min-h-screen overflow-x-hidden selection:bg-primary/30 selection:text-primary">
        {ADSENSE_CLIENT_ID ? (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}
        <UserProvider>
          <AppShell>{children}</AppShell>
          <CookieConsent />
        </UserProvider>
      </body>
    </html>
  );
}
