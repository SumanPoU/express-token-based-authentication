import type { NextFunction, Request, Response } from 'express';
import { z, type ZodObject, ZodError, type ZodIssue } from 'zod';
import httpStatus from 'http-status';
import type { RequireAtLeastOne } from '../types/type';
import { sendError } from './response';

type RequestValidationSchema = RequireAtLeastOne<{
  body?: ZodObject<any>;
  query?: ZodObject<any>;
  params?: ZodObject<any>;
}>;

/**
 * Middleware for validating request body, query, or params using Zod
 * Returns standardized error response using sendError helper
 */
const validate =
  (schema: RequestValidationSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) schema.body.parse(req.body);
      if (schema.query) schema.query.parse(req.query);
      if (schema.params) schema.params.parse(req.params);

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        // Map Zod issues to standardized field-level errors
        const errors = (err.issues as ZodIssue[]).map((issue) => ({
          field: issue.path.join(', '),
          message: issue.message,
        }));

        // Use standardized error response
        return sendError(res, 'Validation failed', errors, httpStatus.BAD_REQUEST);
      }

      // For unexpected errors, pass to global error handler
      next(err);
    }
  };

export default validate;
