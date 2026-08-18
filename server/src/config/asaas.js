const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_API_URL = process.env.ASAAS_API_URL || 'https://api-sandbox.asaas.com/v3';

// Cliente HTTP pro Asaas (gateway de pagamento do plano Premium). Só funciona
// com ASAAS_API_KEY definida — sem ela, isAsaasConfigured() é false e quem
// chama decide o que fazer (mesmo padrão de "recurso dormente" do Brevo/
// AdSense: existe no código mas não faz nada até a credencial existir).
//
// Autenticação do Asaas é via header `access_token` (não Authorization:
// Bearer) — https://docs.asaas.com/docs/authentication. Chave de sandbox
// começa com $aact_hmlg_, produção com $aact_prod_.
function isAsaasConfigured() {
  return Boolean(ASAAS_API_KEY);
}

async function asaasRequest(method, path, body) {
  const res = await fetch(`${ASAAS_API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      access_token: ASAAS_API_KEY,
      // Obrigatório pro Asaas em contas criadas após 06/2024.
      'User-Agent': 'SepiaStream/1.0 (Node.js)',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = json.errors?.[0]?.description || `Erro na API do Asaas (${res.status})`;
    throw new Error(message);
  }

  return json;
}

module.exports = { isAsaasConfigured, asaasRequest };
