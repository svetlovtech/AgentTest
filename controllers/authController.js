import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import config from '../config/config.js';
import User from '../models/user.js';
import logger from '../utils/logger.js';

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id, username: newUser.username }, config.jwtSecret, {
      expiresIn: config.jwtExpiration,
    });

    logger.info(`User registered: ${username}`);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    logger.error('Registration error', {
      username: req.body.username,
      stack: error.stack,
    });
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, username: user.username }, config.jwtSecret, {
      expiresIn: config.jwtExpiration,
    });

    logger.info(`User logged in: ${username}`);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    logger.error('Login error', {
      username: req.body.username,
      stack: error.stack,
    });
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

export { registerUser, loginUser };
