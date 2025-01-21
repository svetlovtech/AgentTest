/**
 * Todo controller handling HTTP requests for todos
 * @module controllers/todoController
 */

import { validationResult } from 'express-validator';

import TodoService from '../services/todoService.js';
import logger from '../utils/logger.js';

/**
 * Get todos with filters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getTodos = async (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      tags: req.query.tags ? req.query.tags.split(',') : undefined,
      completed:
        req.query.completed === 'true' ? true : req.query.completed === 'false' ? false : undefined,
      deadlineBefore: req.query.deadlineBefore,
    };

    const todos = await TodoService.getTodos(filters, req.user.id);
    res.json(todos);
  } catch (error) {
    logger.error('Error in getTodos', { error: error.message });
    res.status(500).json({ message: 'Error retrieving todos' });
  }
};

/**
 * Create a new todo
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createTodo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const todoData = {
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags || [],
      deadline: req.body.deadline,
    };

    const newTodo = await TodoService.createTodo(todoData, req.user.id);
    res.status(201).json(newTodo);
  } catch (error) {
    logger.error('Error in createTodo', { error: error.message });
    res.status(500).json({ message: 'Error creating todo' });
  }
};

/**
 * Update a todo
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateTodo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const todoId = req.params.id;
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags,
      deadline: req.body.deadline,
      completed: req.body.completed,
    };

    const updatedTodo = await TodoService.updateTodo(todoId, updateData, req.user.id);
    res.json(updatedTodo);
  } catch (error) {
    logger.error('Error in updateTodo', { error: error.message });
    res.status(500).json({ message: 'Error updating todo' });
  }
};

/**
 * Share a todo with other users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const shareTodo = async (req, res) => {
  try {
    const todoId = req.params.id;
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ message: 'Invalid user IDs' });
    }

    const sharedTodo = await TodoService.shareTodo(todoId, userIds, req.user.id);
    res.json(sharedTodo);
  } catch (error) {
    logger.error('Error in shareTodo', { error: error.message });
    res.status(500).json({ message: 'Error sharing todo' });
  }
};

/**
 * Delete a todo
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteTodo = async (req, res) => {
  try {
    const todoId = req.params.id;
    await TodoService.deleteTodo(todoId, req.user.id);
    res.status(204).send();
  } catch (error) {
    logger.error('Error in deleteTodo', { error: error.message });
    res.status(500).json({ message: 'Error deleting todo' });
  }
};

export { getTodos, createTodo, updateTodo, shareTodo, deleteTodo };
