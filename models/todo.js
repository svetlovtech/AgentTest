/**
 * Todo model representing a task in the system
 * @module models/todo
 */

const todos = new Map();

class Todo {
  /**
   * Create a new todo
   * @param {Object} todoData - The todo data
   * @param {string} todoData.title - The title of the todo
   * @param {string} todoData.description - The description of the todo
   * @param {string} todoData.userId - The ID of the user who owns the todo
   * @param {string[]} [todoData.tags=[]] - Array of tags associated with the todo
   * @param {Date} [todoData.deadline=null] - Deadline for the todo
   * @param {string[]} [todoData.sharedWith=[]] - Array of user IDs with whom the todo is shared
   * @returns {Object} Created todo object
   */
  static create(todoData) {
    const todo = {
      id: Date.now().toString(),
      title: todoData.title,
      description: todoData.description,
      completed: false,
      userId: todoData.userId,
      tags: todoData.tags || [],
      deadline: todoData.deadline || null,
      sharedWith: todoData.sharedWith || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    todos.set(todo.id, todo);
    return todo;
  }

  /**
   * Find todos by various criteria
   * @param {Object} filters - The search filters
   * @param {string} [filters.userId] - Filter by user ID
   * @param {string} [filters.search] - Search in title and description
   * @param {string[]} [filters.tags] - Filter by tags
   * @param {boolean} [filters.completed] - Filter by completion status
   * @param {Date} [filters.deadlineBefore] - Filter by deadline before date
   * @returns {Object[]} Array of matching todos
   */
  static find(filters = {}) {
    let results = Array.from(todos.values());

    if (filters.userId) {
      results = results.filter(
        (todo) => todo.userId === filters.userId || todo.sharedWith.includes(filters.userId)
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchLower) ||
          todo.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      results = results.filter((todo) => filters.tags.some((tag) => todo.tags.includes(tag)));
    }

    if (typeof filters.completed === 'boolean') {
      results = results.filter((todo) => todo.completed === filters.completed);
    }

    if (filters.deadlineBefore) {
      results = results.filter(
        (todo) => todo.deadline && new Date(todo.deadline) <= new Date(filters.deadlineBefore)
      );
    }

    return results;
  }

  /**
   * Update a todo
   * @param {string} id - The todo ID
   * @param {Object} updates - The updates to apply
   * @returns {Object} Updated todo object
   */
  static update(id, updates) {
    const todo = todos.get(id);
    if (!todo) {
      throw new Error('Todo not found');
    }

    const updatedTodo = {
      ...todo,
      ...updates,
      updatedAt: new Date(),
    };

    todos.set(id, updatedTodo);
    return updatedTodo;
  }

  /**
   * Share a todo with other users
   * @param {string} id - The todo ID
   * @param {string[]} userIds - Array of user IDs to share with
   * @returns {Object} Updated todo object
   */
  static share(id, userIds) {
    const todo = todos.get(id);
    if (!todo) {
      throw new Error('Todo not found');
    }

    const updatedTodo = {
      ...todo,
      sharedWith: [...new Set([...todo.sharedWith, ...userIds])],
      updatedAt: new Date(),
    };

    todos.set(id, updatedTodo);
    return updatedTodo;
  }

  /**
   * Delete a todo
   * @param {string} id - The todo ID
   * @returns {boolean} True if todo was deleted
   */
  static delete(id) {
    return todos.delete(id);
  }
}

module.exports = Todo;
