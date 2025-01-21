import React, { useState } from 'react';

import type { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
  onShare: (id: string, userIds: string[]) => void;
}

function TodoItem({ todo, onUpdate, onDelete, onShare }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description);
  const [isSharing, setIsSharing] = useState(false);
  const [shareEmail, setShareEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(todo.id, {
      title: editedTitle,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  const handleShare = (e: React.FormEvent) => {
    e.preventDefault();
    onShare(todo.id, [shareEmail]);
    setIsSharing(false);
    setShareEmail('');
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor={`todo-edit-title-${todo.id}`} className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id={`todo-edit-title-${todo.id}`}
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor={`todo-edit-description-${todo.id}`} className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id={`todo-edit-description-${todo.id}`}
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onUpdate(todo.id, { completed: !todo.completed })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <h3
                className={`text-lg font-medium ${
                  todo.completed ? 'text-gray-400 line-through' : 'text-gray-900'
                }`}
              >
                {todo.title}
              </h3>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-indigo-600 hover:text-indigo-900"
              >
                Edit
              </button>
              <button
                onClick={() => setIsSharing(true)}
                className="text-green-600 hover:text-green-900"
              >
                Share
              </button>
              <button onClick={() => onDelete(todo.id)} className="text-red-600 hover:text-red-900">
                Delete
              </button>
            </div>
          </div>
          <p className="mt-2 text-gray-600">{todo.description}</p>
          {todo.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {todo.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {todo.deadline && (
            <p className="mt-2 text-sm text-gray-500">
              Due: {new Date(todo.deadline).toLocaleDateString()}
            </p>
          )}
          {todo.sharedWith.length > 0 && (
            <p className="mt-2 text-sm text-gray-500">Shared with: {todo.sharedWith.join(', ')}</p>
          )}
        </div>
      )}

      {isSharing && (
        <div className="mt-4 border-t pt-4">
          <form onSubmit={handleShare} className="flex space-x-2">
            <label htmlFor={`todo-share-email-${todo.id}`} className="sr-only">
              Enter email to share with
            </label>
            <input
              id={`todo-share-email-${todo.id}`}
              type="email"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              placeholder="Enter email to share with"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Share
            </button>
            <button
              type="button"
              onClick={() => setIsSharing(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default TodoItem;
