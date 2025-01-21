const express = require('express');
const router = express.Router();

// In-memory todo storage (replace with database in a real app)
let todos = [];
let nextId = 1;

// Get all todos
router.get('/', (req, res) => {
  res.json(todos);
});

// Create a new todo
router.post('/', (req, res) => {
  const { title, description, completed } = req.body;
  const newTodo = {
    id: nextId++,
    title,
    description: description || '',
    completed: completed || false,
    createdAt: new Date()
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Update a todo
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  todos[todoIndex] = { ...todos[todoIndex], ...req.body };
  res.json(todos[todoIndex]);
});

// Delete a todo
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter(todo => todo.id !== id);
  res.status(204).send();
});

module.exports = router;
