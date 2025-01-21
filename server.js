import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import expressSession from 'express-session';
import helmet from 'helmet';

import config from './config/config.js';
import { httpLogger, metricsMiddleware, activeUsersMiddleware } from './middleware/monitoring.js';
import {
  generalLimiter,
  authLimiter,
  csrfProtection,
  validatePasswordComplexity,
  securityHeaders,
} from './middleware/security.js';
import logger from './utils/logger.js';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use(cookieParser());
app.use(expressSession({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000, // 1 hour
  },
}));

// Middleware to ensure consistent CSRF token
const ensureConsistentCSRFToken = (req, res, next) => {
  // Ensure session exists
  req.session = req.session || {};
  
  // Always generate a token if not present
  req.session.csrfToken = req.session.csrfToken || crypto.randomBytes(32).toString('hex');
  req.session.csrfTokenCreatedAt = req.session.csrfTokenCreatedAt || Date.now();

  // Set CSRF token in cookie for client-side access
  res.cookie('XSRF-TOKEN', req.session.csrfToken, {
    httpOnly: false, // Allow client-side access
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000, // 1 hour
  });

  // Attach csrfToken method to request
  req.csrfToken = () => req.session.csrfToken;

  next();
};

// Apply consistent CSRF token middleware before routes
app.use(ensureConsistentCSRFToken);

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
import authRoutes from './routes/auth.js';
import monitoringRoutes from './routes/monitoring.js';
import todoRoutes from './routes/todos.js';

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

// Add a route to get CSRF token explicitly
app.get('/api/csrf-token', (req, res) => {
  // Regenerate token to ensure freshness
  req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  req.session.csrfTokenCreatedAt = Date.now();
  
  res.json({ 
    csrfToken: req.session.csrfToken,
    tokenName: 'XSRF-TOKEN',
    headerName: 'X-CSRF-Token',
  });
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
