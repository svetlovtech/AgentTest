/**
 * Todo controller handling HTTP requests for todos
 * @module controllers/todoController
 */

const { validationResult } = require('express-validator');
const TodoService = require('../services/todoService');
const logger = require('../utils/logger');

/**
 * Get todos with filters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getTodos(req, res) {
  try {
    const filters = {
      search: req.query.search,
      tags: req.query.tags ? req.query.tags.split(',') : undefined,
      completed: req.query.completed === 'true' ? true : 
                req.query.completed === 'false' ? false : undefined,
      deadlineBefore: req.query.deadlineBefore
    };

    const todos = await TodoService.getTodos(filters, req.user.id);
    res.json(todos);
  } catch (error) {
    logger.error('Error in getTodos', { error: error.message });
    res.status(500).json({ message: 'Error retrieving todos' });
  }
}

/**
 * Create a new todo
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function createTodo(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const todoData = {
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags || [],
      deadline: req.body.deadline
    };

    const todo = await TodoService.createTodo(todoData, req.user.id);
    res.status(201).json(todo);
  } catch (error) {
    logger.error('Error in createTodo', { error: error.message });
    res.status(500).json({ message: 'Error creating todo' });
  }
}

/**
 * Update a todo
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function updateTodo(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = {
      title: req.body.title,
      description: req.body.description,
      completed: req.body.completed,
      tags: req.body.tags,
      deadline: req.body.deadline
    };

    // Remove undefined values
    Object.keys(updates).forEach(key => 
      updates[key] === undefined && delete updates[key]
    );

    const todo = await TodoService.updateTodo(req.params.id, updates, req.user.id);
    res.json(todo);
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return res.status(403).json({ message: 'Not authorized to update this todo' });
    }
    logger.error('Error in updateTodo', { error: error.message });
    res.status(500).json({ message: 'Error updating todo' });
  }
}

/**
 * Share a todo with other users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function shareTodo(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const todo = await TodoService.shareTodo(
      req.params.id,
      req.body.userIds,
      req.user.id
    );
    res.json(todo);
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return res.status(403).json({ message: 'Not authorized to share this todo' });
    }
    logger.error('Error in shareTodo', { error: error.message });
    res.status(500).json({ message: 'Error sharing todo' });
  }
}

/**
 * Delete a todo
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function deleteTodo(req, res) {
  try {
    await TodoService.deleteTodo(req.params.id, req.user.id);
    res.status(204).send();
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return res.status(403).json({ message: 'Not authorized to delete this todo' });
    }
    logger.error('Error in deleteTodo', { error: error.message });
    res.status(500).json({ message: 'Error deleting todo' });
  }
}

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  shareTodo,
  deleteTodo
};
