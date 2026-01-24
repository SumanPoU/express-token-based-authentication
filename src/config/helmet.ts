import helmet from 'helmet';
import config from './config';

const helmetMiddleware = helmet({
  // Prevent clickjacking
  frameguard: {
    action: 'deny',
  },

  // Prevent MIME sniffing
  noSniff: true,

  // Hide X-Powered-By
  hidePoweredBy: true,

  // XSS protection (legacy but still useful)
  xssFilter: true,

  // Strict Transport Security (HTTPS only)
  hsts:
    config.nodeEnv === 'production'
      ? {
          maxAge: 63072000, // 2 years
          includeSubDomains: true,
          preload: true,
        }
      : false,

  // Content Security Policy
  contentSecurityPolicy:
    config.nodeEnv === 'production'
      ? {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'", ...config.cors.origins],
            fontSrc: ["'self'", 'https:', 'data:'],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
          },
        }
      : false,
});

export default helmetMiddleware;
