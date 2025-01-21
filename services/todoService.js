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
      // First, find the todo to ensure it exists and belongs to the user
      const existingTodos = Todo.find({ userId });
      const todoToUpdate = existingTodos.find(todo => todo.id === todoId);

      if (!todoToUpdate) {
        throw new Error('Todo not found or unauthorized');
      }

      // Update the todo using our in-memory method
      const updatedTodo = Todo.update(todoId, updates);

      logger.info('Todo updated successfully', { todoId, userId });
      return updatedTodo;
    } catch (error) {
      logger.error('Error updating todo', { error: error.message, todoId, userId });
      throw error;
    }
  }

  /**
   * Delete a todo
   * @param {string} todoId - Todo ID
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  static async deleteTodo(todoId, userId) {
    try {
      // First, find the todo to ensure it exists and belongs to the user
      const existingTodos = Todo.find({ userId });
      const todoToDelete = existingTodos.find(todo => todo.id === todoId);

      if (!todoToDelete) {
        throw new Error('Todo not found or unauthorized');
      }

      // Delete the todo using our in-memory method
      Todo.delete(todoId);

      logger.info('Todo deleted successfully', { todoId, userId });
    } catch (error) {
      logger.error('Error deleting todo', { error: error.message, todoId, userId });
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
      // First, find the todo to ensure it exists and belongs to the user
      const existingTodos = Todo.find({ userId: ownerId });
      const todoToShare = existingTodos.find(todo => todo.id === todoId);

      if (!todoToShare) {
        throw new Error('Todo not found or unauthorized');
      }

      // Update the todo with shared users
      const updatedTodo = Todo.update(todoId, {
        sharedWith: [...new Set([...(todoToShare.sharedWith || []), ...userIds])]
      });

      logger.info('Todo shared successfully', { todoId, sharedWith: userIds, ownerId });
      return updatedTodo;
    } catch (error) {
      logger.error('Error sharing todo', { error: error.message, todoId, ownerId });
      throw error;
    }
  }
}

export default TodoService;
