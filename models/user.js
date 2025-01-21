import bcrypt from 'bcryptjs';

import logger from '../utils/logger.js';

// Simple in-memory user storage (replace with database in production)
const users = new Map();

class User {
  static async create({ username, password }) {
    logger.debug('Creating new user', { username });

    if (users.has(username)) {
      logger.warn('User creation failed: username already exists', { username });
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      username,
      password: hashedPassword,
      createdAt: new Date(),
    };

    users.set(username, user);
    logger.info('User created successfully', { username });
    return user;
  }

  static async findByCredentials(username, password) {
    logger.debug('Attempting to find user', { username });

    const user = users.get(username);
    if (!user) {
      logger.warn('User not found during login attempt', { username });
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn('Invalid password attempt', { username });
      throw new Error('Invalid password');
    }

    logger.info('User authenticated successfully', { username });
    return user;
  }

  // Debug method to list all users
  static listUsers() {
    const userList = Array.from(users.keys());
    logger.debug('Current users in system', { users: userList });
    return userList;
  }
}

export default User;
