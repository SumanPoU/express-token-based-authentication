import app from './app';
import config from './config/config';
import logger from './middleware/logger';

const server = app.listen(config.server.port, () => {
  logger.info(`🚀 Server running on port ${config.server.port}`);
});

// Graceful shutdown
const shutdown = (signal: string) => {
  logger.warn(`${signal} received. Shutting down gracefully...`);

  server.close((err) => {
    if (err) {
      logger.error('Error during server shutdown', err);
      process.exit(1);
    }

    logger.info('Server closed successfully.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
