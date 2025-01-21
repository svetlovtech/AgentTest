const express = require('express');
const { body, validationResult } = require('express-validator');
const AuthController = require('../controllers/authController');
const logger = require('../utils/logger');

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
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

// Validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn('Validation failed', { 
            errors: errors.array(),
            path: req.path
        });
        return res.status(400).json({ 
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// Routes
router.post('/register',
    validateCredentials,
    handleValidationErrors,
    AuthController.register
);

router.post('/login',
    validateCredentials,
    handleValidationErrors,
    AuthController.login
);

module.exports = router;
