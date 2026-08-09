const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return next(new AppError('Informe email e senha', 400));
  }

  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin || !(await admin.comparePassword(password))) {
    return next(new AppError('Credenciais inválidas', 401));
  }

  const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.json({ success: true, data: { token, email: admin.email } });
});
