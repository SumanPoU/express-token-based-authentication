import type { Request, Response, NextFunction } from 'express';
import logger from './logger';

/**
 * Global Express error handler
 * @param err - error object (any type, since errors can be custom)
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
const errorHandler = (err: unknown, _req: Request, res: Response, _next?: NextFunction): void => {
  // Normalize error
  const statusCode = (err as any)?.status || 500;
  const message = (err as any)?.message || 'Internal Server Error';

  // Log full error for debugging
  logger.error(err);

  // Send standardized response
  res.status(statusCode).json({ message });
};

export default errorHandler;
