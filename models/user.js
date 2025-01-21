// Simple in-memory user storage (replace with database in production)
const users = new Map();
const bcrypt = require('bcryptjs');

class User {
  static async create({ username, password }) {
    if (users.has(username)) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      username,
      password: hashedPassword,
      createdAt: new Date()
    };

    users.set(username, user);
    return user;
  }

  static async findByCredentials(username, password) {
    const user = users.get(username);
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid password');
    }

    return user;
  }
}

module.exports = User;
