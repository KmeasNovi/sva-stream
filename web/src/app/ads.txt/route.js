// Gerado a partir do Publisher ID do AdSense (ver web/.env.example) — o
// Google exige esse arquivo pra confirmar que o site é dono da conta que
// está exibindo os anúncios. Enquanto a conta não existir, devolve vazio.
export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const publisherId = clientId?.replace('ca-', '');
  const body = publisherId ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n` : '';

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
