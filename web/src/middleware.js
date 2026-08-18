import { NextResponse } from 'next/server';

// SepiaStream Pro (pro.sepiastream.com) é uma área fechada por assinatura —
// não faz sentido o Google indexar. Isso fica em middleware (em vez de
// metadata/generateMetadata) de propósito: ler o host em generateMetadata
// forçaria toda página do site a virar dynamic/server-rendered a cada
// request, já que Next.js não sabe em build time qual host vai servir cada
// rota — perderíamos a geração estática de /, /catalogo, /movie/[slug] etc.
// Middleware roda numa camada separada e consegue anexar o header mesmo em
// respostas estáticas, sem esse custo.
export function middleware(request) {
  const host = request.headers.get('host') || '';
  const response = NextResponse.next();

  if (host.startsWith('pro.')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
