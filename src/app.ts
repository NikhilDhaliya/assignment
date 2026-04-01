import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { globalLimiter } from './middleware/rateLimit.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import routes from './routes/index.js';
import { sendSuccess } from './utils/response.js';

const app = express();

// Security
app.use(helmet());
app.use(cors());

// Rate limiting
app.use(globalLimiter);

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

// Health check
app.get('/health', (_req, res) => {
  sendSuccess(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API v1 routes
app.use('/api/v1', routes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    code: 'NOT_FOUND',
  });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
