/**
 * Monitoring middleware for HTTP logging and metrics
 * @module middleware/monitoring
 */

import morgan from 'morgan';
import responseTime from 'response-time';

import logger from '../utils/logger.js';
import { metrics } from '../utils/metrics.js';

// Create a custom Morgan format
morgan.token('user-id', (req) => (req.user ? req.user.id : 'anonymous'));
morgan.token('body', (req) => JSON.stringify(req.body));

// Create HTTP logger using Morgan and Winston
const httpLogger = morgan(
  ':remote-addr - :user-id [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms',
  {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  }
);

// Middleware to track request duration and update metrics
const metricsMiddleware = responseTime((req, res, time) => {
  const route = req.route ? req.route.path : req.path;

  // Record request duration
  metrics.httpRequestDurationMicroseconds
    .labels(req.method, route, res.statusCode)
    .observe(time / 1000); // Convert to seconds

  // Update operation counters for todo endpoints
  if (req.path.startsWith('/api/todos')) {
    let operation;
    switch (req.method) {
      case 'POST':
        operation = 'create';
        break;
      case 'PUT':
        operation = 'update';
        break;
      case 'DELETE':
        operation = 'delete';
        break;
      case 'GET':
        operation = 'read';
        break;
      default:
        operation = 'unknown';
    }

    metrics.todoOperationsTotal.labels(operation).inc();
  }
});

// Middleware to track active users
const activeUsersMiddleware = (req, res, next) => {
  if (req.user) {
    metrics.activeUsersTotal.labels(req.user.id).inc();
  }
  next();
};

export { httpLogger, metricsMiddleware, activeUsersMiddleware };
