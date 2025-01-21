import express from 'express';
import { body, validationResult } from 'express-validator';

import { registerUser, loginUser } from '../controllers/authController.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Validation middleware
const validateCredentials = [
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers and underscores')
    .escape(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation failed', {
      errors: errors.array(),
      path: req.path,
    });
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// Routes
router.post('/register', validateCredentials, handleValidationErrors, async (req, res) => {
  try {
    logger.info('Registration attempt', {
      username: req.body.username,
      email: req.body.email,
      csrfToken: req.csrfToken ? req.csrfToken() : 'No token method',
      headers: req.headers,
    });

    const { username, email, password } = req.body;
    const result = await registerUser(req, res);
    
    return result;
  } catch (error) {
    logger.error('Registration error', {
      error: error.message,
      stack: error.stack,
      username: req.body.username,
    });
    
    return res.status(500).json({
      message: 'Registration failed',
      error: error.message,
    });
  }
});

router.post('/login', validateCredentials, handleValidationErrors, async (req, res) => {
  try {
    logger.info('Login attempt', {
      username: req.body.username,
      csrfToken: req.csrfToken ? req.csrfToken() : 'No token method',
      headers: req.headers,
    });

    const result = await loginUser(req, res);
    
    return result;
  } catch (error) {
    logger.error('Login error', {
      error: error.message,
      stack: error.stack,
      username: req.body.username,
    });
    
    return res.status(500).json({
      message: 'Login failed',
      error: error.message,
    });
  }
});

export default router;
