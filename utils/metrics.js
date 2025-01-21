/**
 * Prometheus metrics configuration
 * @module utils/metrics
 */

const promClient = require('prom-client');

// Create a Registry to register the metrics
const register = new promClient.Registry();

// Enable the collection of default metrics
promClient.collectDefaultMetrics({
  register,
  prefix: 'todo_app_'
});

// HTTP request duration metric
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

// Todo operations counter
const todoOperationsCounter = new promClient.Counter({
  name: 'todo_operations_total',
  help: 'Counter for todo operations',
  labelNames: ['operation']
});

// Active users gauge
const activeUsersGauge = new promClient.Gauge({
  name: 'active_users',
  help: 'Number of active users in the last 5 minutes'
});

// Register custom metrics
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(todoOperationsCounter);
register.registerMetric(activeUsersGauge);

module.exports = {
  register,
  metrics: {
    httpRequestDurationMicroseconds,
    todoOperationsCounter,
    activeUsersGauge
  }
};
