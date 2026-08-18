const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/sendEmail');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1h — mais curto que o de verificação, é reset de senha

function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

function signUserToken(user) {
  return jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
}

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
    return next(new AppError('Preencha nome, email e senha', 400));
  }
  if (!name || !email || !password) {
    return next(new AppError('Preencha nome, email e senha', 400));
  }
  if (password.length < 8) {
    return next(new AppError('A senha precisa ter pelo menos 8 caracteres', 400));
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing && existing.emailVerified) {
    return next(new AppError('Este email já está cadastrado', 400));
  }

  const passwordHash = await User.hashPassword(password);
  const verificationToken = generateVerificationToken();
  const verificationTokenExpires = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);

  let user;
  if (existing) {
    // Cadastro anterior nunca foi verificado — atualiza os dados e reenvia.
    existing.name = name;
    existing.passwordHash = passwordHash;
    existing.verificationToken = verificationToken;
    existing.verificationTokenExpires = verificationTokenExpires;
    user = await existing.save();
  } else {
    user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      verificationToken,
      verificationTokenExpires,
    });
  }

  try {
    await sendVerificationEmail(user.email, user.name, verificationToken);
  } catch (err) {
    console.error('Erro ao enviar email de verificação:', err);
  }

  res.status(201).json({
    success: true,
    message: 'Cadastro realizado! Confira seu email para confirmar a conta.',
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return next(new AppError('Informe email e senha', 400));
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Credenciais inválidas', 401));
  }

  if (!user.emailVerified) {
    return next(new AppError('Confirme seu email antes de entrar. Verifique sua caixa de entrada.', 403));
  }

  const token = signUserToken(user);
  await user.populate({ path: 'favorites', select: 'title slug posterUrl backdropUrl year' });
  res.json({
    success: true,
    data: {
      token,
      user: { id: user._id, name: user.name, email: user.email, favorites: user.favorites },
    },
  });
});

exports.googleAuth = catchAsync(async (req, res, next) => {
  const { idToken } = req.body;
  if (typeof idToken !== 'string' || !idToken) {
    return next(new AppError('Token do Google ausente', 400));
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
    payload = ticket.getPayload();
  } catch (err) {
    return next(new AppError('Token do Google inválido', 401));
  }

  if (!payload.email_verified) {
    return next(new AppError('Email do Google não verificado', 401));
  }

  const email = payload.email.toLowerCase();
  let user = await User.findOne({ $or: [{ googleId: payload.sub }, { email }] });

  if (user) {
    // Conta local existente com o mesmo email verificado pelo Google —
    // vincula em vez de criar duplicata (usuário pediu esse comportamento).
    if (!user.googleId) {
      user.googleId = payload.sub;
      user.emailVerified = true;
      if (!user.avatarUrl && payload.picture) user.avatarUrl = payload.picture;
      await user.save();
    }
  } else {
    user = await User.create({
      name: payload.name || email.split('@')[0],
      email,
      googleId: payload.sub,
      authProvider: 'google',
      emailVerified: true,
      avatarUrl: payload.picture,
    });
  }

  const token = signUserToken(user);
  await user.populate({ path: 'favorites', select: 'title slug posterUrl backdropUrl year' });
  res.json({
    success: true,
    data: {
      token,
      user: { id: user._id, name: user.name, email: user.email, favorites: user.favorites },
    },
  });
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.body;
  if (typeof token !== 'string' || !token) return next(new AppError('Token de verificação ausente', 400));

  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: new Date() },
  });

  if (!user) {
    return next(new AppError('Link de verificação inválido ou expirado', 400));
  }

  user.emailVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  res.json({ success: true, message: 'Email confirmado! Você já pode entrar.' });
});

exports.resendVerification = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (typeof email !== 'string' || !email) return next(new AppError('Informe um email', 400));

  const user = await User.findOne({ email: email.toLowerCase() });

  // Resposta genérica independente de o email existir ou já estar verificado,
  // pra não vazar quais emails têm conta cadastrada.
  const genericMessage = 'Se esse email tiver uma conta pendente de confirmação, reenviamos o link agora.';

  if (!user || user.emailVerified) {
    return res.json({ success: true, message: genericMessage });
  }

  user.verificationToken = generateVerificationToken();
  user.verificationTokenExpires = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);
  await user.save();

  try {
    await sendVerificationEmail(user.email, user.name, user.verificationToken);
  } catch (err) {
    console.error('Erro ao reenviar email de verificação:', err);
  }

  res.json({ success: true, message: genericMessage });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (typeof email !== 'string' || !email) return next(new AppError('Informe um email', 400));

  const user = await User.findOne({ email: email.toLowerCase() });

  // Resposta genérica independente de o email existir, pra não vazar quais
  // emails têm conta cadastrada (mesmo espírito do resendVerification).
  const genericMessage = 'Se esse email tiver uma conta, mandamos um link de redefinição de senha agora.';

  if (!user) {
    return res.json({ success: true, message: genericMessage });
  }

  user.resetPasswordToken = generateVerificationToken();
  user.resetPasswordTokenExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  await user.save();

  try {
    await sendPasswordResetEmail(user.email, user.name, user.resetPasswordToken);
  } catch (err) {
    console.error('Erro ao enviar email de redefinição de senha:', err);
  }

  res.json({ success: true, message: genericMessage });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token, password } = req.body;
  if (typeof token !== 'string' || !token) return next(new AppError('Token de redefinição ausente', 400));
  if (typeof password !== 'string' || password.length < 8) {
    return next(new AppError('A senha precisa ter pelo menos 8 caracteres', 400));
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordTokenExpires: { $gt: new Date() },
  });

  if (!user) {
    return next(new AppError('Link de redefinição inválido ou expirado', 400));
  }

  user.passwordHash = await User.hashPassword(password);
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpires = undefined;
  await user.save();

  res.json({ success: true, message: 'Senha redefinida! Você já pode entrar com a nova senha.' });
});

exports.getMe = catchAsync(async (req, res) => {
  const user = await req.user.populate({
    path: 'favorites',
    select: 'title slug posterUrl backdropUrl year',
  });

  res.json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      favorites: user.favorites,
      isPremium: user.isPremiumActive(),
      // Só o suficiente pra tela "Assine o Premium" mostrar validade/cancelamento
      // — nunca os IDs do provedor (providerCustomerId/providerSubscriptionId).
      subscription: {
        status: user.subscription?.status || 'none',
        currentPeriodEnd: user.subscription?.currentPeriodEnd || null,
        cancelAtPeriodEnd: Boolean(user.subscription?.cancelAtPeriodEnd),
      },
    },
  });
});

exports.addFavorite = catchAsync(async (req, res) => {
  await User.updateOne({ _id: req.user._id }, { $addToSet: { favorites: req.params.movieId } });
  res.json({ success: true });
});

exports.removeFavorite = catchAsync(async (req, res) => {
  await User.updateOne({ _id: req.user._id }, { $pull: { favorites: req.params.movieId } });
  res.json({ success: true });
});

// ---------------------------------------------------------------------------
// Módulo administrativo — gestão de usuários pelo admin (/admin/dashboard).
// Nunca devolve passwordHash nem tokens de verificação/reset.
// ---------------------------------------------------------------------------

const ADMIN_SAFE_FIELDS =
  'name email authProvider emailVerified avatarUrl favorites subscription createdAt updatedAt';

exports.adminListUsers = catchAsync(async (req, res) => {
  const { search, page = 1, limit = 50 } = req.query;
  const query = {};
  if (search && typeof search === 'string') {
    const re = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [{ name: re }, { email: re }];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(500, Math.max(1, parseInt(limit, 10) || 50));

  const [users, total] = await Promise.all([
    User.find(query)
      .select(ADMIN_SAFE_FIELDS)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(),
    User.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: users,
    pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
  });
});

exports.adminGetUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select(ADMIN_SAFE_FIELDS).lean();
  if (!user) return next(new AppError('Usuário não encontrado', 404));
  res.json({ success: true, data: user });
});

// Cadastro feito diretamente pelo admin (ex: liberar acesso manual pra
// alguém) — pula o fluxo de verificação por email, já entra com
// emailVerified: true. Senha é opcional: se não vier, geramos uma aleatória
// e devolvemos na resposta (única vez que ela aparece em texto plano), pro
// admin poder repassar pra pessoa.
exports.adminCreateUser = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;
  let { password } = req.body;

  if (typeof name !== 'string' || !name || typeof email !== 'string' || !email) {
    return next(new AppError('Preencha nome e email', 400));
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return next(new AppError('Este email já está cadastrado', 400));

  let generatedPassword;
  if (!password) {
    generatedPassword = crypto.randomBytes(9).toString('base64url');
    password = generatedPassword;
  } else if (password.length < 8) {
    return next(new AppError('A senha precisa ter pelo menos 8 caracteres', 400));
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash: await User.hashPassword(password),
    emailVerified: true,
  });

  res.status(201).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      ...(generatedPassword ? { generatedPassword } : {}),
    },
  });
});

// Inclusão em lote — mesmo espírito do bulk de filmes: cada linha é
// isolada, upsert por email (atualiza nome/senha se a conta já existir, cria
// senão), erro numa linha não derruba as outras.
exports.adminBulkCreateUsers = catchAsync(async (req, res, next) => {
  const { users } = req.body;
  if (!Array.isArray(users) || users.length === 0) {
    return next(new AppError('Envie um array "users" com pelo menos um usuário', 400));
  }
  if (users.length > 500) {
    return next(new AppError('Máximo de 500 usuários por lote', 400));
  }

  let created = 0;
  let updated = 0;
  const errors = [];
  const generatedPasswords = [];

  for (let i = 0; i < users.length; i += 1) {
    const raw = users[i] || {};
    const label = raw.email || `item #${i + 1}`;
    try {
      if (typeof raw.name !== 'string' || !raw.name) throw new Error('nome ausente');
      if (typeof raw.email !== 'string' || !raw.email) throw new Error('email ausente');

      const email = raw.email.toLowerCase();
      let password = raw.password;
      let generatedPassword;
      if (!password) {
        generatedPassword = crypto.randomBytes(9).toString('base64url');
        password = generatedPassword;
      } else if (password.length < 8) {
        throw new Error('senha precisa ter pelo menos 8 caracteres');
      }

      const existing = await User.findOne({ email }).select('_id').lean();
      await User.updateOne(
        { email },
        { $set: { name: raw.name, passwordHash: await User.hashPassword(password), emailVerified: true } },
        { upsert: true, runValidators: true }
      );

      if (existing) updated += 1;
      else created += 1;
      if (generatedPassword) generatedPasswords.push({ email, password: generatedPassword });
    } catch (err) {
      errors.push({ index: i, email: label, message: err.message });
    }
  }

  res.status(errors.length ? 207 : 201).json({
    success: true,
    data: { created, updated, failed: errors.length, errors, generatedPasswords },
  });
});

const SUBSCRIPTION_STATUSES = ['none', 'pending', 'active', 'canceled', 'past_due'];

exports.adminUpdateUser = catchAsync(async (req, res, next) => {
  const {
    name,
    email,
    password,
    emailVerified,
    isPremium,
    subscriptionStatus,
    subscriptionCurrentPeriodEnd,
    subscriptionProvider,
  } = req.body;
  const update = {};

  if (name !== undefined) {
    if (typeof name !== 'string' || !name) return next(new AppError('Nome inválido', 400));
    update.name = name;
  }
  if (email !== undefined) {
    if (typeof email !== 'string' || !email) return next(new AppError('Email inválido', 400));
    update.email = email.toLowerCase();
  }
  if (emailVerified !== undefined) update.emailVerified = Boolean(emailVerified);
  if (password) {
    if (password.length < 8) return next(new AppError('A senha precisa ter pelo menos 8 caracteres', 400));
    update.passwordHash = await User.hashPassword(password);
  }
  // Outorga manual (via tabela) — atalho pra liberar/revogar acesso rápido,
  // sem precisar preencher os campos individuais abaixo.
  if (isPremium !== undefined) {
    update['subscription.status'] = isPremium ? 'active' : 'none';
    update['subscription.provider'] = isPremium ? 'manual' : null;
    update['subscription.currentPeriodEnd'] = null;
  }
  // Edição granular (via linha em modo de edição) — mexe só nos campos da
  // assinatura enviados, sem resetar os outros como o atalho acima faz.
  if (subscriptionStatus !== undefined) {
    if (!SUBSCRIPTION_STATUSES.includes(subscriptionStatus)) {
      return next(new AppError('Status de assinatura inválido', 400));
    }
    update['subscription.status'] = subscriptionStatus;
  }
  if (subscriptionCurrentPeriodEnd !== undefined) {
    update['subscription.currentPeriodEnd'] = subscriptionCurrentPeriodEnd ? new Date(subscriptionCurrentPeriodEnd) : null;
  }
  if (subscriptionProvider !== undefined) {
    update['subscription.provider'] = subscriptionProvider || null;
  }

  const user = await User.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  }).select(ADMIN_SAFE_FIELDS);

  if (!user) return next(new AppError('Usuário não encontrado', 404));
  res.json({ success: true, data: user });
});

exports.adminDeleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new AppError('Usuário não encontrado', 404));
  res.json({ success: true, data: {} });
});
