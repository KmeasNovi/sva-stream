function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Erro interno do servidor';

  if (!err.isOperational) {
    console.error(err);
  }

  res.status(statusCode).json({ success: false, message, ...(err.isOperational && err.code ? { code: err.code } : {}) });
}

module.exports = errorHandler;
