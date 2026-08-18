import { NextResponse } from 'next/server';

// Mapeia os caminhos curtos que fazem sentido digitar direto no subdomínio
// pra rota real por trás (que continua existindo em /admin/... — nenhum
// link/redirect interno do painel foi alterado, só ganham esse atalho de
// entrada). Qualquer outro caminho sob o host admin. cai no fallback
// genérico logo abaixo (prefixa /admin/dashboard).
const ADMIN_SHORT_PATHS = {
  '/': '/admin/dashboard',
  '/login': '/admin/login',
  '/usuarios': '/admin/dashboard/usuarios',
  '/busca': '/admin/dashboard/busca',
};

// pro.sepiastream.com e admin.sepiastream.com são o mesmo deploy do site
// normal — isso fica em middleware (em vez de metadata/generateMetadata) de
// propósito: ler o host em generateMetadata forçaria toda página do site a
// virar dynamic/server-rendered a cada request, já que Next.js não sabe em
// build time qual host vai servir cada rota — perderíamos a geração
// estática de /, /catalogo, /movie/[slug] etc. Middleware roda numa camada
// separada e consegue reescrever/anexar headers mesmo em respostas
// estáticas, sem esse custo.
export function middleware(request) {
  const host = request.headers.get('host') || '';
  const isPro = host.startsWith('pro.');
  const isAdminHost = host.startsWith('admin.');
  const { pathname } = request.nextUrl;

  // Arquivos estáticos (logo, ícones, manifest etc.) nunca podem ser
  // reescritos — só rotas de página. Sem essa checagem, /logo-icon.png no
  // subdomínio admin virava /admin/dashboard/logo-icon.png (inexistente).
  const isStaticAsset = /\.[a-zA-Z0-9]+$/.test(pathname);

  if (isAdminHost) {
    if (isStaticAsset) return NextResponse.next();

    const url = request.nextUrl.clone();
    if (!pathname.startsWith('/admin')) {
      url.pathname = ADMIN_SHORT_PATHS[pathname] || `/admin/dashboard${pathname}`;
    }
    const response = NextResponse.rewrite(url);
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  // /admin/* só existe em admin.sepiastream.com agora — em qualquer outro
  // host (site normal ou Pro), nem responde, pra não ficar linkável/
  // descobrível por fora do subdomínio dedicado.
  if (pathname.startsWith('/admin')) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin-indisponivel-neste-dominio';
    return NextResponse.rewrite(url);
  }

  const response = NextResponse.next();
  if (isPro) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
