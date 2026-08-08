const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return next(new AppError('Não autenticado', 401));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = payload;
    next();
  } catch (err) {
    next(new AppError('Token inválido ou expirado', 401));
  }
}

module.exports = { requireAdmin };
