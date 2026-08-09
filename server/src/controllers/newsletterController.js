const Subscriber = require('../models/Subscriber');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// Adiciona o contato na lista do Brevo (opcional — só roda se BREVO_API_KEY estiver definido).
async function addToBrevo(email) {
  if (!process.env.BREVO_API_KEY) return;

  const res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      email,
      listIds: process.env.BREVO_LIST_ID ? [Number(process.env.BREVO_LIST_ID)] : undefined,
      updateEnabled: true,
    }),
  });

  if (!res.ok && res.status !== 400) {
    // 400 geralmente significa "contato já existe" — não é um erro fatal aqui.
    const body = await res.text();
    console.error('Falha ao registrar contato no Brevo:', res.status, body);
  }
}

exports.subscribe = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (typeof email !== 'string' || !email) return next(new AppError('Informe um email', 400));

  await Subscriber.updateOne(
    { email: email.toLowerCase() },
    { $setOnInsert: { email: email.toLowerCase() } },
    { upsert: true }
  );

  await addToBrevo(email.toLowerCase());

  res.status(201).json({ success: true, message: 'Inscrito com sucesso' });
});
