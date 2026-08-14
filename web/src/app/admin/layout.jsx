// noindex reforça o disallow de /admin/ já existente em robots.js — o
// disallow só impede o Google de *rastrear* a página, mas se algum link pra
// cá vazar em algum lugar (histórico do navegador sincronizado, referrer de
// algum request, etc.) o Google ainda pode indexar a URL sem conteúdo. Essa
// meta tag garante que, mesmo que a página seja alcançada, ela nunca entra
// no índice nem é seguida a partir daqui.
export const metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdminLayout({ children }) {
  return children;
}
