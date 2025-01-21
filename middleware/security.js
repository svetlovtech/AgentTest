/**
 * Security middleware configurations
 * @module middleware/security
 */

import csrf from 'csurf';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';

import logger from '../utils/logger.js';

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
    });
    res.status(429).json({
      message: 'Too many requests from this IP, please try again later',
    });
  },
});

// Stricter rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 login attempts per hour
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Auth rate limit exceeded', {
      ip: req.ip,
      path: req.path,
    });
    res.status(429).json({
      message: 'Too many login attempts, please try again later',
    });
  },
});

// Custom CSRF token generation and validation
const createCSRFToken = () => {
  // Generate a cryptographically strong random token
  return crypto.randomBytes(32).toString('hex');
};

// CSRF protection middleware
const csrfProtection = (req, res, next) => {
  // Ensure session and CSRF token exist
  req.session = req.session || {};
  
  // Always generate a token if not present
  req.session.csrfToken = req.session.csrfToken || createCSRFToken();
  req.session.csrfTokenCreatedAt = req.session.csrfTokenCreatedAt || Date.now();

  // Set CSRF token in cookie for client-side access
  res.cookie('XSRF-TOKEN', req.session.csrfToken, {
    httpOnly: false, // Allow client-side access
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000, // 1 hour
  });

  // Attach csrfToken method to request for logging and other uses
  req.csrfToken = () => req.session.csrfToken;

  // Validate CSRF token for non-safe methods
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    // Check token in multiple locations
    const tokenFromHeader = 
      req.headers['x-csrf-token'] || 
      req.headers['x-xsrf-token'];
    const tokenFromBody = req.body ? req.body._csrf : null;
    const tokenFromCookie = req.cookies['XSRF-TOKEN'];

    // Validate token
    const providedToken = tokenFromHeader || tokenFromBody || tokenFromCookie;
    
    if (!providedToken || providedToken !== req.session.csrfToken) {
      logger.error('CSRF Token Validation Failed', {
        method: req.method,
        path: req.path,
        headerToken: tokenFromHeader,
        bodyToken: tokenFromBody,
        cookieToken: tokenFromCookie,
        sessionToken: req.session.csrfToken,
      });

      return res.status(403).json({
        message: 'CSRF token validation failed',
        error: 'Invalid or missing CSRF token',
        guidance: [
          'Retrieve a new CSRF token from /api/csrf-token',
          'Include the token in X-CSRF-Token header',
          'Ensure cookies are enabled',
        ]
      });
    }
  }

  next();
};

// Password complexity middleware
const validatePasswordComplexity = (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      message: 'Password is required',
    });
  }

  // Password requirements
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];
  if (password.length < minLength)
    errors.push(`Password must be at least ${minLength} characters long`);
  if (!hasUpperCase) errors.push('Password must contain at least one uppercase letter');
  if (!hasLowerCase) errors.push('Password must contain at least one lowercase letter');
  if (!hasNumbers) errors.push('Password must contain at least one number');
  if (!hasSpecialChar) errors.push('Password must contain at least one special character');

  if (errors.length > 0) {
    logger.warn('Password complexity check failed', {
      ip: req.ip,
      errors,
    });
    return res.status(400).json({
      message: 'Password does not meet complexity requirements',
      errors,
    });
  }

  next();
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Enable XSS protection in browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');

  next();
};

export {
  generalLimiter,
  authLimiter,
  csrfProtection,
  validatePasswordComplexity,
  securityHeaders,
};
