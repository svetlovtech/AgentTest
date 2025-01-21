/**
 * Monitoring middleware for HTTP logging and metrics
 * @module middleware/monitoring
 */

const morgan = require('morgan');
const responseTime = require('response-time');

const logger = require('../utils/logger');
const { metrics } = require('../utils/metrics');

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
        operation = 'other';
    }
    metrics.todoOperationsCounter.labels(operation).inc();
  }
});

// Track active users (update every minute)
const activeUsers = new Set();
setInterval(
  () => {
    metrics.activeUsersGauge.set(activeUsers.size);
    activeUsers.clear();
  },
  5 * 60 * 1000
); // Clear every 5 minutes

// Middleware to track active users
const activeUsersMiddleware = (req, res, next) => {
  if (req.user) {
    activeUsers.add(req.user.id);
  }
  next();
};

module.exports = {
  httpLogger,
  metricsMiddleware,
  activeUsersMiddleware,
};
