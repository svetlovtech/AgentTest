const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('./config/config');
const logger = require('./utils/logger');
const { httpLogger, metricsMiddleware, activeUsersMiddleware } = require('./middleware/monitoring');

const app = express();
const PORT = config.port;

logger.info('Starting Todo application...', { port: PORT, env: process.env.NODE_ENV });

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
        },
    },
}));
app.use(cors());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}));

// Monitoring middleware
app.use(httpLogger);
app.use(metricsMiddleware);
app.use(activeUsersMiddleware);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Request logging middleware
app.use((req, res, next) => {
    logger.info('Incoming request', {
        method: req.method,
        path: req.path,
        ip: req.ip
    });
    next();
});

// Routes
const todoRoutes = require('./routes/todos');
const authRoutes = require('./routes/auth');
const monitoringRoutes = require('./routes/monitoring');

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/monitoring', monitoringRoutes);

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Server error:', { error: err.message, stack: err.stack });
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
