import type { Response } from 'express';

type ResponseData<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: { field: string; message: string }[];
};

/**
 * Send a successful response
 * @param res - Express Response
 * @param message - Success message
 * @param data - Optional data to send
 * @param statusCode - HTTP status code (default 200)
 */
export const sendSuccess = <T = unknown>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200, // explicitly number
): Response => {
  const payload: ResponseData<T> = {
    success: true,
    message,
    ...(data !== undefined && { data }),
  };
  return res.status(statusCode).json(payload);
};

/**
 * Send an error response
 * @param res - Express Response
 * @param message - Error message
 * @param errors - Optional field-level errors
 * @param statusCode - HTTP status code (default 400)
 */
export const sendError = (
  res: Response,
  message: string,
  errors?: { field: string; message: string }[],
  statusCode: number = 400, // explicitly number
): Response => {
  const payload: ResponseData = {
    success: false,
    message,
    ...(errors && { errors }),
  };
  return res.status(statusCode).json(payload);
};
