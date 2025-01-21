/**
 * Todo service handling business logic for todos
 * @module services/todoService
 */

const Todo = require('../models/todo');
const logger = require('../utils/logger');

class TodoService {
  /**
   * Create a new todo
   * @param {Object} todoData - Todo data
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Created todo
   */
  static async createTodo(todoData, userId) {
    try {
      const todo = Todo.create({ ...todoData, userId });
      logger.info('Todo created successfully', { todoId: todo.id, userId });
      return todo;
    } catch (error) {
      logger.error('Error creating todo', { error: error.message, userId });
      throw error;
    }
  }

  /**
   * Get todos with filters
   * @param {Object} filters - Search and filter criteria
   * @param {string} userId - User ID
   * @returns {Promise<Object[]>} Array of todos
   */
  static async getTodos(filters, userId) {
    try {
      const todos = Todo.find({ ...filters, userId });
      logger.info('Todos retrieved successfully', { 
        count: todos.length,
        filters,
        userId 
      });
      return todos;
    } catch (error) {
      logger.error('Error retrieving todos', { error: error.message, userId });
      throw error;
    }
  }

  /**
   * Update a todo
   * @param {string} todoId - Todo ID
   * @param {Object} updates - Updates to apply
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Updated todo
   */
  static async updateTodo(todoId, updates, userId) {
    try {
      const todo = Todo.update(todoId, updates);
      if (todo.userId !== userId && !todo.sharedWith.includes(userId)) {
        throw new Error('Unauthorized');
      }
      logger.info('Todo updated successfully', { todoId, userId });
      return todo;
    } catch (error) {
      logger.error('Error updating todo', { 
        error: error.message,
        todoId,
        userId 
      });
      throw error;
    }
  }

  /**
   * Share a todo with other users
   * @param {string} todoId - Todo ID
   * @param {string[]} userIds - User IDs to share with
   * @param {string} userId - Owner user ID
   * @returns {Promise<Object>} Updated todo
   */
  static async shareTodo(todoId, userIds, userId) {
    try {
      const todo = Todo.share(todoId, userIds);
      if (todo.userId !== userId) {
        throw new Error('Unauthorized');
      }
      logger.info('Todo shared successfully', { 
        todoId,
        sharedWith: userIds,
        userId 
      });
      return todo;
    } catch (error) {
      logger.error('Error sharing todo', { 
        error: error.message,
        todoId,
        userId 
      });
      throw error;
    }
  }

  /**
   * Delete a todo
   * @param {string} todoId - Todo ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} True if deleted
   */
  static async deleteTodo(todoId, userId) {
    try {
      const todo = Todo.find({ id: todoId })[0];
      if (!todo || (todo.userId !== userId && !todo.sharedWith.includes(userId))) {
        throw new Error('Unauthorized');
      }
      const result = Todo.delete(todoId);
      logger.info('Todo deleted successfully', { todoId, userId });
      return result;
    } catch (error) {
      logger.error('Error deleting todo', { 
        error: error.message,
        todoId,
        userId 
      });
      throw error;
    }
  }
}

module.exports = TodoService;
