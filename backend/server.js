import { createApp } from './src/app.js';
import { config } from './src/config/env.js';
import { logger } from './src/utils/logger.js';

const app = createApp();

const server = app.listen(config.port, () => {
  logger.info(`ClauseNova API Server running on port ${config.port} [${config.nodeEnv}]`);
  logger.info(`API Base URL: http://localhost:${config.port}/api`);
  logger.info(`Health check: http://localhost:${config.port}/api/health`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, closing server gracefully...');
  server.close(() => {
    logger.info('Server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, closing server gracefully...');
  server.close(() => {
    logger.info('Server closed.');
    process.exit(0);
  });
});
