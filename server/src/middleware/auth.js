const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const Admin = require('../models/Admin');
const User = require('../models/User');

async function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return next(new AppError('Não autenticado', 401));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Confirma que o id do token é realmente um Admin no banco — não basta a
    // assinatura ser válida, já que tokens de usuário comum (rota /api/users)
    // usam o mesmo JWT_SECRET e senão poderiam ser reaproveitados aqui.
    const admin = await Admin.findById(payload.id);
    if (!admin) return next(new AppError('Não autenticado', 401));
    req.admin = payload;
    next();
  } catch (err) {
    next(new AppError('Token inválido ou expirado', 401));
  }
}

async function requireUser(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return next(new AppError('Não autenticado', 401));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return next(new AppError('Não autenticado', 401));
    req.user = user;
    next();
  } catch (err) {
    next(new AppError('Token inválido ou expirado', 401));
  }
}

// Pras rotas de leitura de filmes: tanto o admin (gerenciando o catálogo)
// quanto um usuário comum (navegando o site) precisam poder ler — só a
// escrita (criar/editar/apagar) é admin-only. Tenta achar o id do token
// primeiro como Admin, depois como User, antes de recusar.
async function requireAdminOrUser(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return next(new AppError('Não autenticado', 401));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(payload.id);
    if (admin) {
      req.admin = payload;
      return next();
    }

    const user = await User.findById(payload.id);
    if (user) {
      req.user = user;
      return next();
    }

    return next(new AppError('Não autenticado', 401));
  } catch (err) {
    next(new AppError('Token inválido ou expirado', 401));
  }
}

module.exports = { requireAdmin, requireUser, requireAdminOrUser };
