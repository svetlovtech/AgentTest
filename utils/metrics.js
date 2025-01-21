/**
 * Prometheus metrics configuration
 * @module utils/metrics
 */

import promClient from 'prom-client';

// Create a Registry to register the metrics
const register = new promClient.Registry();

// Enable the collection of default metrics
promClient.collectDefaultMetrics({
  register,
  prefix: 'todo_app_',
});

// HTTP request duration metric
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

// Todo operations total
const todoOperationsTotal = new promClient.Counter({
  name: 'todo_operations_total',
  help: 'Counter for todo operations',
  labelNames: ['operation'],
});

// Active users total
const activeUsersTotal = new promClient.Counter({
  name: 'active_users_total',
  help: 'Total number of active users',
  labelNames: ['user_id'],
});

// Register custom metrics
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(todoOperationsTotal);
register.registerMetric(activeUsersTotal);

const metrics = {
  httpRequestDurationMicroseconds,
  todoOperationsTotal,
  activeUsersTotal,
};

export { register, metrics };
