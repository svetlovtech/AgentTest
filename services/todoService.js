// In-memory storage (replace with database in production)
const todos = new Map();
let nextId = 1;

class TodoService {
  static getAllTodos(username) {
    return Array.from(todos.values())
      .filter(todo => todo.username === username);
  }

  static createTodo({ title, description, username }) {
    if (!title) {
      throw new Error('Title is required');
    }

    const todo = {
      id: nextId++,
      title,
      description: description || '',
      completed: false,
      createdAt: new Date(),
      username
    };

    todos.set(todo.id, todo);
    return todo;
  }

  static updateTodo(id, updates, username) {
    const todo = todos.get(id);
    
    if (!todo || todo.username !== username) {
      throw new Error('Todo not found');
    }

    const updatedTodo = {
      ...todo,
      ...updates,
      id: todo.id, // prevent id from being updated
      username: todo.username // prevent username from being updated
    };

    todos.set(id, updatedTodo);
    return updatedTodo;
  }

  static deleteTodo(id, username) {
    const todo = todos.get(id);
    
    if (!todo || todo.username !== username) {
      throw new Error('Todo not found');
    }

    todos.delete(id);
  }
}

module.exports = TodoService;
