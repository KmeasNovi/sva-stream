const SITE_URL = 'https://sepiastream.com';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /movie/ é pública e renderizada no servidor (ver web/src/app/movie/[slug]/page.jsx)
      // — precisa ficar indexável pra quem busca o nome de um filme achar o
      // site. O resto continua exigindo login e sem conteúdo pra indexar.
      disallow: ['/home', '/catalogo', '/genre/', '/search', '/minha-lista', '/admin/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
