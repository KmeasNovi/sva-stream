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
      sender: { name: 'CulStream', email: process.env.BREVO_SENDER_EMAIL },
      to: [{ email, name }],
      subject: 'Confirme seu email — CulStream',
      htmlContent: `
        <p>Oi, ${name}!</p>
        <p>Falta só confirmar seu email pra ativar sua conta no CulStream.</p>
        <p><a href="${verifyUrl}">Clique aqui para confirmar seu email</a></p>
        <p>Ou copie e cole este link no navegador:<br>${verifyUrl}</p>
        <p>Se você não criou uma conta no CulStream, é só ignorar este email.</p>
      `,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('Falha ao enviar email de verificação via Brevo:', res.status, body);
  }
}

module.exports = { sendVerificationEmail };
