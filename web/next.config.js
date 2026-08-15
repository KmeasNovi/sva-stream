/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'archive.org' },
      { protocol: 'https', hostname: 'ia*.us.archive.org' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'image.tmdb.org' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      // Proxy de cache pros pôsteres (ver web/src/lib/imageProxy.js) — a
      // origem real (archive.org) é lenta/instável, então servimos as
      // imagens através do wsrv.nl, que busca uma vez e cacheia.
      { protocol: 'https', hostname: 'wsrv.nl' },
    ],
    // Com quase mil pôsteres vindos de fontes externas, a otimização de
    // imagem do Vercel (cota mensal do plano Hobby) estourou e passou a
    // quebrar imagem em vez de servir. Essas fontes já entregam imagem em
    // tamanho razoável, então desligamos o reprocessamento — serve a URL
    // original direto, sem contar pra cota.
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
