const SITE_URL = 'https://sepiastream.com';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Tudo daqui pra baixo exige login (a API de filmes também exige, ver
      // hardening de segurança) — não tem conteúdo pra indexar mesmo.
      disallow: ['/home', '/catalogo', '/movie/', '/genre/', '/search', '/minha-lista', '/admin/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
