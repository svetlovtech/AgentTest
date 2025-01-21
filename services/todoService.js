/**
 * Todo service handling business logic for todos
 * @module services/todoService
 */

import Todo from '../models/todo.js';
import logger from '../utils/logger.js';

class TodoService {
  /**
   * Create a new todo
   * @param {Object} todoData - Todo data
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Created todo
   */
  static async createTodo(todoData, userId) {
    try {
      const todo = await Todo.create({ ...todoData, userId });
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
      const todos = await Todo.find({ ...filters, userId });
      logger.info('Todos retrieved successfully', {
        count: todos.length,
        filters,
        userId,
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
      const todo = await Todo.findOneAndUpdate(
        { _id: todoId, userId },
        { $set: updates },
        { new: true }
      );

      if (!todo) {
        throw new Error('Todo not found or unauthorized');
      }

      logger.info('Todo updated successfully', { todoId, userId });
      return todo;
    } catch (error) {
      logger.error('Error updating todo', { error: error.message, todoId, userId });
      throw error;
    }
  }

  /**
   * Share a todo with other users
   * @param {string} todoId - Todo ID
   * @param {string[]} userIds - User IDs to share with
   * @param {string} ownerId - Current owner's user ID
   * @returns {Promise<Object>} Updated todo
   */
  static async shareTodo(todoId, userIds, ownerId) {
    try {
      const todo = await Todo.findOneAndUpdate(
        { _id: todoId, userId: ownerId },
        { $addToSet: { sharedWith: { $each: userIds } } },
        { new: true }
      );

      if (!todo) {
        throw new Error('Todo not found or unauthorized');
      }

      logger.info('Todo shared successfully', { todoId, sharedWith: userIds, ownerId });
      return todo;
    } catch (error) {
      logger.error('Error sharing todo', { error: error.message, todoId, ownerId });
      throw error;
    }
  }

  /**
   * Delete a todo
   * @param {string} todoId - Todo ID
   * @param {string} userId - User ID
   */
  static async deleteTodo(todoId, userId) {
    try {
      const result = await Todo.deleteOne({ _id: todoId, userId });

      if (result.deletedCount === 0) {
        throw new Error('Todo not found or unauthorized');
      }

      logger.info('Todo deleted successfully', { todoId, userId });
    } catch (error) {
      logger.error('Error deleting todo', { error: error.message, todoId, userId });
      throw error;
    }
  }
}

export default TodoService;
