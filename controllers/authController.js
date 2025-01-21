const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../utils/logger');
const config = require('../config/config');

class AuthController {
    static async register(req, res) {
        try {
            logger.info('Registration attempt', { username: req.body.username });

            const { username, password } = req.body;

            if (!username || !password) {
                logger.warn('Registration failed: Missing credentials');
                return res.status(400).json({ message: 'Username and password are required' });
            }

            const user = await User.create({ username, password });
            logger.info('User registered successfully', { username });

            const token = jwt.sign({ username: user.username }, config.jwtSecret, {
                expiresIn: config.jwtExpiration
            });

            res.status(201).json({ token, username: user.username });
        } catch (error) {
            logger.error('Registration error', { 
                error: error.message,
                stack: error.stack
            });

            if (error.message === 'User already exists') {
                return res.status(409).json({ message: 'Username already taken' });
            }

            res.status(500).json({ message: 'Error during registration' });
        }
    }

    static async login(req, res) {
        try {
            logger.info('Login attempt', { username: req.body.username });

            const { username, password } = req.body;

            if (!username || !password) {
                logger.warn('Login failed: Missing credentials');
                return res.status(400).json({ message: 'Username and password are required' });
            }

            const user = await User.findByCredentials(username, password);
            logger.info('User logged in successfully', { username });

            const token = jwt.sign({ username: user.username }, config.jwtSecret, {
                expiresIn: config.jwtExpiration
            });

            res.json({ token, username: user.username });
        } catch (error) {
            logger.error('Login error', {
                error: error.message,
                username: req.body.username
            });

            if (error.message === 'User not found' || error.message === 'Invalid password') {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            res.status(500).json({ message: 'Error during login' });
        }
    }
}

module.exports = AuthController;
