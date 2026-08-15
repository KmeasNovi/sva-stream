// Pôsteres/backdrops vêm quase todos do archive.org, cuja origem é lenta e
// inconsistente (às vezes 1-2s, às vezes 10-30s pra uma miniatura de poucos
// KB — medido direto, não é lentidão da nossa rede). A otimização de imagem
// do Next/Vercel está desligada (`unoptimized: true` no next.config.js,
// porque a cota mensal do plano Hobby estourou com o catálogo grande), então
// sem isso cada visita de cada pessoa paga o tempo de resposta do archive.org
// direto, sem cache compartilhado nenhum no meio.
//
// wsrv.nl (ex-images.weserv.nl) é um proxy de imagem público e gratuito: ele
// busca a imagem original uma vez, redimensiona/converte pra webp, e serve
// as próximas requisições do cache dele (medido: primeira busca ~1s mesmo
// pra origem lenta, buscas seguintes ~40ms). Não conta pra cota de otimização
// da Vercel porque a URL final já é a imagem pronta, sem reprocessamento.
const PROXY_BASE = 'https://wsrv.nl/';

export function proxiedImage(url, width) {
  if (!url) return url;
  // Já é um asset local nosso (ex: /logo-icon.png) — não precisa de proxy.
  if (url.startsWith('/')) return url;

  const params = new URLSearchParams({ url, output: 'webp' });
  if (width) params.set('w', String(width));
  return `${PROXY_BASE}?${params.toString()}`;
}
