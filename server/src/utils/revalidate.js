// Avisa o Next.js (Vercel) pra limpar o cache de página estática de um
// filme assim que ele é criado/editado/removido no admin — sem isso, a
// mudança só aparece no site depois de até 5 min (revalidate: 300 nas
// rotas públicas). Silencioso de propósito: se FRONTEND_URL/
// REVALIDATE_SECRET não estiverem configurados, ou a chamada falhar (rede,
// timeout), a operação principal (salvar no banco) não deve quebrar por
// causa disso — o cache só demora mais pra atualizar, não é um erro fatal.
async function revalidateMovie(slug) {
  const frontendUrl = process.env.FRONTEND_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!frontendUrl || !secret) return;

  try {
    await fetch(`${frontendUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': secret },
      body: JSON.stringify({ slug }),
    });
  } catch {
    // best-effort — ver comentário acima
  }
}

module.exports = { revalidateMovie };
