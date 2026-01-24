import express, { Application, Request, Response } from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import errorHandler from './middleware/errorHandler';
import compressFilter from './lib/compressFilter.utils';
import rateLimiter from './middleware/rateLimiter';
import corsMiddleware from './config/cors';
import helmetMiddleware from './config/helmet';

const app: Application = express();

/* Middleware Order */
// Security first
app.use(helmetMiddleware);

// CORS
app.use(corsMiddleware);

// Rate limiting
app.use(rateLimiter);

// Compression
app.use(compression({ filter: compressFilter }));

// Cookies
app.use(cookieParser());

// Logging
app.use(morgan('dev'));

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Server is running!' });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler
app.use(errorHandler);

export default app;
