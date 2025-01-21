import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication required' });
  }
};

export default auth;
