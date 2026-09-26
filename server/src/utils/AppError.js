class AppError extends Error {
  // `code` é opcional — só pra erros que o frontend precisa distinguir de
  // outros com o mesmo status (ex: SESSION_REPLACED vs token expirado, 401).
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
