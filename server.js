import path from 'path';

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import config from './config/config.js';
import { httpLogger, metricsMiddleware, activeUsersMiddleware } from './middleware/monitoring.js';
import {
  generalLimiter,
  authLimiter,
  csrfProtection,
  handleCSRFError,
  validatePasswordComplexity,
  securityHeaders,
} from './middleware/security.js';
import logger from './utils/logger.js';

const app = express();
const PORT = config.port;

logger.info('Starting Todo application...', { port: PORT, env: process.env.NODE_ENV });

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://cdn.jsdelivr.net',
          'https://cdnjs.cloudflare.com',
        ],
        fontSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
      },
    },
  })
);
app.use(cors());
app.use(securityHeaders);
app.use(generalLimiter);

// Monitoring middleware
app.use(httpLogger);
app.use(metricsMiddleware);
app.use(activeUsersMiddleware);

// Regular middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// CSRF protection (after body parser)
app.use(csrfProtection);
app.use(handleCSRFError);

// Request logging middleware
app.use((req, res, _next) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  _next();
});

// Routes
const authRoutes = require('./routes/auth.js');
const monitoringRoutes = require('./routes/monitoring.js');
const todoRoutes = require('./routes/todos.js');

// Apply stricter rate limiting to auth routes
app.use('/api/auth', authLimiter);
app.use('/api/auth', validatePasswordComplexity);
app.use('/api/auth', authRoutes);

app.use('/api/todos', todoRoutes);
app.use('/api/monitoring', monitoringRoutes);

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, _next) => {
  logger.error('Server error:', { error: err.message, stack: err.stack });
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

export default app;
