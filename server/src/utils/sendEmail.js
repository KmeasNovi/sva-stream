// Envia o email transacional de verificação via Brevo — opcional, mesmo espírito
// do envio pra lista de newsletter em newsletterController.js: se BREVO_API_KEY
// não estiver definida, não bloqueia o cadastro, só loga e segue (útil pra dev
// local sem credenciais do Brevo configuradas).
async function sendVerificationEmail(email, name, token) {
  if (!process.env.BREVO_API_KEY) {
    console.warn('BREVO_API_KEY não definida — pulando envio do email de verificação.');
    return;
  }

  if (!process.env.BREVO_SENDER_EMAIL) {
    console.warn('BREVO_SENDER_EMAIL não definida — pulando envio do email de verificação.');
    return;
  }

  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const verifyUrl = `${baseUrl}/verificar-email?token=${token}`;

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: 'SepiaStream', email: process.env.BREVO_SENDER_EMAIL },
      to: [{ email, name }],
      subject: 'Confirme seu email — SepiaStream',
      htmlContent: `
        <p>Oi, ${name}!</p>
        <p>Falta só confirmar seu email pra ativar sua conta no SepiaStream.</p>
        <p><a href="${verifyUrl}">Clique aqui para confirmar seu email</a></p>
        <p>Ou copie e cole este link no navegador:<br>${verifyUrl}</p>
        <p>Se você não criou uma conta no SepiaStream, é só ignorar este email.</p>
      `,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('Falha ao enviar email de verificação via Brevo:', res.status, body);
  }
}

// Mesmo padrão do e-mail de verificação acima — opcional, não bloqueia o
// fluxo se as credenciais do Brevo não estiverem configuradas.
async function sendPasswordResetEmail(email, name, token) {
  if (!process.env.BREVO_API_KEY) {
    console.warn('BREVO_API_KEY não definida — pulando envio do email de redefinição de senha.');
    return;
  }

  if (!process.env.BREVO_SENDER_EMAIL) {
    console.warn('BREVO_SENDER_EMAIL não definida — pulando envio do email de redefinição de senha.');
    return;
  }

  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/redefinir-senha?token=${token}`;

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: 'SepiaStream', email: process.env.BREVO_SENDER_EMAIL },
      to: [{ email, name }],
      subject: 'Redefinir sua senha — SepiaStream',
      htmlContent: `
        <p>Oi, ${name}!</p>
        <p>Recebemos um pedido pra redefinir a senha da sua conta no SepiaStream. Esse link é válido por 1 hora.</p>
        <p><a href="${resetUrl}">Clique aqui para escolher uma nova senha</a></p>
        <p>Ou copie e cole este link no navegador:<br>${resetUrl}</p>
        <p>Se você não pediu isso, é só ignorar este email — sua senha continua a mesma.</p>
      `,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('Falha ao enviar email de redefinição de senha via Brevo:', res.status, body);
  }
}

// Dados do pedido vêm de formulário público — escapar antes de pôr em HTML.
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

async function sendBrevo(payload, contexto) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': process.env.BREVO_API_KEY },
    body: JSON.stringify({ sender: { name: 'SepiaStream', email: process.env.BREVO_SENDER_EMAIL }, ...payload }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`Falha ao enviar ${contexto} via Brevo:`, res.status, body);
  }
}

// Pedido de contratação do SVA (flyer.sepiastream.com/contratar): avisa o
// comercial (SVA_LEADS_EMAIL, padrão contato@sepiastream.com) e confirma o
// recebimento pro provedor. Opcional como os outros — sem Brevo, o pedido
// continua salvo e visível no admin.
async function sendProviderLeadEmails(lead) {
  if (!process.env.BREVO_API_KEY || !process.env.BREVO_SENDER_EMAIL) {
    console.warn('Brevo não configurado — pulando e-mails do pedido de provedor.');
    return;
  }

  const e = escapeHtml;
  const moeda = (v) => (Number.isFinite(v) ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—');
  const cnpj = lead.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  const linhas = [
    ['Razão social', lead.razaoSocial],
    ['Nome fantasia', lead.nomeFantasia || '—'],
    ['CNPJ', cnpj],
    ['Cidade/UF', `${lead.cidade}/${lead.uf}`],
    ['Responsável', `${lead.responsavel}${lead.cargo ? ` (${lead.cargo})` : ''}`],
    ['E-mail', lead.email],
    ['Telefone', lead.telefone],
    ['Assinantes na base', lead.assinantes.toLocaleString('pt-BR')],
    ['Pacote desejado', lead.pacote],
    ['Ativação', { lista: 'Lista de assinantes', api: 'API / integração com ERP', indefinido: 'Ainda não sabe' }[lead.ativacao]],
    ['ERP', lead.erp || '—'],
    ['Ganho mensal simulado', moeda(lead.simulacao?.ganhoLiquidoMes)],
    ['Observações', lead.observacoes || '—'],
  ];
  const tabela = `<table cellpadding="6" style="border-collapse:collapse">${linhas
    .map(([k, v]) => `<tr><td style="border:1px solid #ddd"><b>${e(k)}</b></td><td style="border:1px solid #ddd">${e(v)}</td></tr>`)
    .join('')}</table>`;

  await Promise.all([
    sendBrevo(
      {
        to: [{ email: process.env.SVA_LEADS_EMAIL || 'contato@sepiastream.com' }],
        replyTo: { email: lead.email, name: lead.responsavel },
        subject: `Novo provedor quer contratar o SVA — ${lead.razaoSocial} (${lead.pacote})`,
        htmlContent: `<p>Novo pedido de contratação recebido em flyer.sepiastream.com/contratar:</p>${tabela}<p>Também disponível no painel admin, aba Provedores.</p>`,
      },
      'aviso de pedido de provedor'
    ),
    sendBrevo(
      {
        to: [{ email: lead.email, name: lead.responsavel }],
        subject: 'Recebemos seu pedido — SVA SepiaStream',
        htmlContent: `<p>Olá, ${e(lead.responsavel)}!</p>
          <p>Recebemos o pedido de contratação do SVA SepiaStream para a <b>${e(lead.razaoSocial)}</b>, pacote <b>${e(lead.pacote)}</b>.</p>
          <p>Nossa equipe vai revisar os dados e enviar a proposta e o contrato em até 1 dia útil. Se quiser adiantar alguma informação, é só responder este e-mail ou escrever para contato@sepiastream.com.</p>
          <p>Resumo do que você enviou:</p>${tabela}
          <p>— Equipe SepiaStream</p>`,
      },
      'confirmação de pedido de provedor'
    ),
  ]);
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendProviderLeadEmails };
