import cors, { type CorsOptions } from 'cors';
import config from './config';

const allowedOrigins = [...config.cors.origins];

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Allow non-browser requests (Postman, curl, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    // Allow all in development if '*'
    if (config.nodeEnv === 'development' && allowedOrigins.includes('*')) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },

  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'If-None-Match', 'Trace-Id'],

  exposedHeaders: ['WWW-Authenticate', 'Server-Authorization'],

  credentials: true,

  maxAge: 86400,
};

export default cors(corsOptions);
