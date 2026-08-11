const SITE_URL = 'https://sepiastream.com';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /movie/ e /catalogo são públicas e renderizadas no servidor — precisam
      // ficar indexáveis. O resto continua exigindo login e sem conteúdo pra
      // indexar.
      disallow: ['/home', '/genre/', '/search', '/minha-lista', '/admin/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
