import './globals.css';
import AppShell from '../components/AppShell';
import CookieConsent from '../components/CookieConsent';
import { UserProvider } from '../context/UserContext';

export const metadata = {
  metadataBase: new URL('https://sepiastream.com'),
  title: 'SepiaStream',
  description: 'Clássicos do cinema e curtas de animação, de graça, para todo mundo.',
};

// Só declara a tag de verificação de propriedade quando a conta existir de
// verdade (ver web/.env.example) — até lá, isso é um no-op silencioso.
//
// O script do AdSense (adsbygoogle.js) NÃO é carregado aqui de propósito —
// carregá-lo globalmente serviria anúncio em toda página do site, inclusive
// telas de login/cadastro, o painel /admin, e telas de "Carregando..." que
// um visitante sem login vê em rotas que exigem conta (/home, /catalogo
// etc). Isso violou a política do AdSense de "anúncios em telas sem
// conteúdo do editor" na primeira revisão. Agora cada página decide por
// conta própria se carrega o script, só onde há conteúdo de verdade — ver
// AdSlot.jsx, usado hoje só em /movie/[slug].
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
        <UserProvider>
          <AppShell>{children}</AppShell>
          <CookieConsent />
        </UserProvider>
      </body>
    </html>
  );
}
