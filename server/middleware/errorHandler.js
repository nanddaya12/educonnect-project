import mongoose from 'mongoose';
import { AppError } from '../utils/AppError.js';

const isProd = process.env.NODE_ENV === 'production';

const normalizeMessage = (err) => {
  if (err instanceof AppError) return err.message;

  if (err.name === 'CastError' || err instanceof mongoose.Error.CastError) {
    return 'Invalid resource identifier';
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || err.keyValue || {})[0];
    return field
      ? `A record with this ${field} already exists`
      : 'Duplicate field value';
  }

  if (err.name === 'ValidationError' && err.errors) {
    return Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  if (err.name === 'JsonWebTokenError') return 'Invalid authentication token';
  if (err.name === 'TokenExpiredError') return 'Session expired, please sign in again';

  if (err.type === 'entity.parse.failed' || (err instanceof SyntaxError && 'body' in err)) {
    return 'Invalid JSON in request body';
  }

  return isProd ? 'Internal server error' : err.message || 'Internal server error';
};

const resolveStatus = (err) => {
  if (err instanceof AppError) return err.statusCode;

  if (err.name === 'CastError' || err instanceof mongoose.Error.CastError) return 400;
  if (err.code === 11000) return 400;
  if (err.name === 'ValidationError') return 400;
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') return 401;
  if (err.type === 'entity.parse.failed' || (err instanceof SyntaxError && 'body' in err)) {
    return 400;
  }

  if (typeof err.statusCode === 'number' && err.statusCode >= 400 && err.statusCode < 600) {
    return err.statusCode;
  }
  if (typeof err.status === 'number' && err.status >= 400 && err.status < 600) {
    return err.status;
  }

  return 500;
};

export default (err, req, res, _next) => {
  const statusCode = resolveStatus(err);
  const message = normalizeMessage(err);

  if (statusCode >= 500 && !isProd) {
    console.error('[error]', err);
  } else if (statusCode >= 500) {
    console.error('[error]', err.name, message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(isProd ? {} : { stack: err.stack }),
  });
};
