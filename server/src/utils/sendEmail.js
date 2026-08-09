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

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
