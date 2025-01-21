const express = require('express');
const { body } = require('express-validator');
const TodoController = require('../controllers/todoController');
const auth = require('../middleware/auth');
const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Validation middleware
const validateTodo = [
  body('title').trim().notEmpty().escape(),
  body('description').optional().trim().escape()
];

// Routes
router.get('/', TodoController.getAllTodos);
router.post('/', validateTodo, TodoController.createTodo);
router.put('/:id', validateTodo, TodoController.updateTodo);
router.delete('/:id', TodoController.deleteTodo);

module.exports = router;
