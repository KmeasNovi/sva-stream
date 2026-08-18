import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

// Chamado pelo backend (nunca pelo navegador) logo depois de criar/editar/
// remover um filme — limpa o cache de página estática (revalidate: 300 em
// movieController) daquele filme específico, pra a edição no admin
// aparecer no site na hora em vez de esperar até 5 min. Autenticado por um
// segredo compartilhado só entre os dois servidores (nunca exposto ao
// navegador), não pelo token de admin.
export async function POST(request) {
  const secret = request.headers.get('x-revalidate-secret');
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 });
  }

  const { slug } = await request.json().catch(() => ({}));

  revalidatePath('/');
  revalidatePath('/home');
  revalidatePath('/catalogo');
  if (slug) revalidatePath(`/movie/${slug}`);

  return NextResponse.json({ success: true });
}
