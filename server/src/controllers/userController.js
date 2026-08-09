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
