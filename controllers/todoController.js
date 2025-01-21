const TodoService = require('../services/todoService');
const logger = require('../utils/logger');

class TodoController {
  static async getAllTodos(req, res) {
    try {
      const todos = await TodoService.getAllTodos(req.user.username);
      res.json(todos);
    } catch (error) {
      logger.error('Error in getAllTodos:', error);
      res.status(500).json({ message: 'Error fetching todos' });
    }
  }

  static async createTodo(req, res) {
    try {
      const todo = await TodoService.createTodo({
        ...req.body,
        username: req.user.username
      });
      res.status(201).json(todo);
    } catch (error) {
      logger.error('Error in createTodo:', error);
      res.status(400).json({ message: error.message });
    }
  }

  static async updateTodo(req, res) {
    try {
      const todo = await TodoService.updateTodo(
        parseInt(req.params.id),
        req.body,
        req.user.username
      );
      res.json(todo);
    } catch (error) {
      logger.error('Error in updateTodo:', error);
      res.status(404).json({ message: error.message });
    }
  }

  static async deleteTodo(req, res) {
    try {
      await TodoService.deleteTodo(parseInt(req.params.id), req.user.username);
      res.status(204).send();
    } catch (error) {
      logger.error('Error in deleteTodo:', error);
      res.status(404).json({ message: error.message });
    }
  }
}

module.exports = TodoController;
