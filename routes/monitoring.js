/**
 * Monitoring routes for health checks and metrics
 * @module routes/monitoring
 */

import express from 'express';

import { register } from '../utils/metrics.js';

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     responses:
 *       200:
 *         description: Application is healthy
 *       503:
 *         description: Application is unhealthy
 */
router.get('/health', (req, res) => {
  // Add any health checks here (e.g., database connection)
  const isHealthy = true;

  if (isHealthy) {
    res.json({
      status: 'healthy',
      timestamp: new Date(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    });
  } else {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date(),
    });
  }
});

/**
 * @swagger
 * /metrics:
 *   get:
 *     summary: Prometheus metrics endpoint
 *     responses:
 *       200:
 *         description: Application metrics in Prometheus format
 */
router.get('/metrics', async (req, res) => {
  try {
    const metrics = await register.metrics();
    res.set('Content-Type', register.contentType);
    res.send(metrics);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error retrieving metrics', 
      error: error.message 
    });
  }
});

export default router;
