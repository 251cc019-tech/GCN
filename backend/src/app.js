import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import errorHandler from './middleware/errorHandler.middleware.js';
import { seedSampleAudits } from './db/seeds/sample_audits.js';
import { logger } from './utils/logger.js';

export function createApp() {
  const app = express();

  // Enable CORS
  app.use(cors({
    origin: '*', // Allow all origins in local dev/eval
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Body parsers
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Request logger middleware
  app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.originalUrl}`);
    next();
  });

  // Mount API routes
  app.use('/api', routes);

  // Centralized Error Handling
  app.use(errorHandler);

  // Seed sample data on startup
  seedSampleAudits().then(() => {
    logger.info('ClauseNova sample audits seeded successfully.');
  }).catch(err => {
    logger.warn('Sample seed encountered error:', err.message);
  });

  return app;
}

export default createApp;
