const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { sendVerificationEmail } = require('../utils/sendEmail');

const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h

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
