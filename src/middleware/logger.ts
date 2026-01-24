import fs from 'fs';
import path from 'path';
import { createLogger, format, transports } from 'winston';
import config from '../config/config';

// Ensure logs directory exists
const logDir = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = createLogger({
  level: config.nodeEnv === 'production' ? 'info' : 'debug',

  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} [${level.toUpperCase()}] ${message}${stack ? `\n${stack}` : ''}`;
    }),
  ),

  transports: [
    new transports.Console(),

    new transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),

    new transports.File({
      filename: path.join(logDir, 'combined.log'),
    }),
  ],

  exitOnError: false,
});

export default logger;
