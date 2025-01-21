import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from 'react-query';

import { api } from '../api/client';
import TodoFilter from '../components/TodoFilter';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';
import type { Todo } from '../types';

function TodoList() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    search: '',
    tags: [] as string[],
    completed: undefined as boolean | undefined,
  });

  // Fetch todos
  const { data: todos, isLoading } = useQuery(['todos', filters], () => api.getTodos(filters));

  // Create todo mutation
  const createTodoMutation = useMutation(
    (newTodo: Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => api.createTodo(newTodo),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('todos');
        toast.success('Todo created successfully!');
      },
      onError: (error: Error) => {
        toast.error(`Failed to create todo: ${error.message}`);
      },
    }
  );

  // Update todo mutation
  const updateTodoMutation = useMutation(
    ({ id, updates }: { id: string; updates: Partial<Todo> }) => api.updateTodo(id, updates),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('todos');
        toast.success('Todo updated successfully!');
      },
      onError: (error: Error) => {
        toast.error(`Failed to update todo: ${error.message}`);
      },
    }
  );

  // Delete todo mutation
  const deleteTodoMutation = useMutation((id: string) => api.deleteTodo(id), {
    onSuccess: () => {
      queryClient.invalidateQueries('todos');
      toast.success('Todo deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete todo: ${error.message}`);
    },
  });

  // Share todo mutation
  const shareTodoMutation = useMutation(
    ({ id, userIds }: { id: string; userIds: string[] }) => api.shareTodo(id, userIds),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('todos');
        toast.success('Todo shared successfully!');
      },
      onError: (error: Error) => {
        toast.error(`Failed to share todo: ${error.message}`);
      },
    }
  );

  const handleCreateTodo = async (
    todo: Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => {
    await createTodoMutation.mutateAsync(todo);
  };

  const handleUpdateTodo = async (id: string, updates: Partial<Todo>) => {
    await updateTodoMutation.mutateAsync({ id, updates });
  };

  const handleDeleteTodo = async (id: string) => {
    await deleteTodoMutation.mutateAsync(id);
  };

  const handleShareTodo = async (id: string, userIds: string[]) => {
    await shareTodoMutation.mutateAsync({ id, userIds });
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Todo</h2>
        <TodoForm onSubmit={handleCreateTodo} />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
        <TodoFilter filters={filters} onChange={handleFilterChange} />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Your Todos</h2>
        <div className="space-y-4">
          {todos?.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={handleUpdateTodo}
              onDelete={handleDeleteTodo}
              onShare={handleShareTodo}
            />
          ))}
          {todos?.length === 0 && <p className="text-gray-500 text-center py-4">No todos found</p>}
        </div>
      </div>
    </div>
  );
}

export default TodoList;
