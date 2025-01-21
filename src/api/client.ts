import type { AuthResponse, Todo } from '../types';

const API_URL = process.env.API_URL || 'http://localhost:3000/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unexpected error occurred');
    }
  }

  // Auth methods
  async login(username: string, password: string): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    this.token = data.token;
    localStorage.setItem('token', data.token);
    return data;
  }

  async register(username: string, password: string): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    this.token = data.token;
    localStorage.setItem('token', data.token);
    return data;
  }

  async logout(): Promise<void> {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Todo methods
  async getTodos(filters?: {
    search?: string;
    tags?: string[];
    completed?: boolean;
    deadlineBefore?: string;
  }): Promise<Todo[]> {
    const queryParams = new URLSearchParams();
    if (filters?.search) queryParams.set('search', filters.search);
    if (filters?.tags) queryParams.set('tags', filters.tags.join(','));
    if (filters?.completed !== undefined) queryParams.set('completed', String(filters.completed));
    if (filters?.deadlineBefore) queryParams.set('deadlineBefore', filters.deadlineBefore);

    return this.request<Todo[]>(`/todos?${queryParams.toString()}`);
  }

  async createTodo(todo: Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Todo> {
    return this.request<Todo>('/todos', {
      method: 'POST',
      body: JSON.stringify(todo),
    });
  }

  async updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
    return this.request<Todo>(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async shareTodo(id: string, userIds: string[]): Promise<Todo> {
    return this.request<Todo>(`/todos/${id}/share`, {
      method: 'POST',
      body: JSON.stringify({ userIds }),
    });
  }

  async deleteTodo(id: string): Promise<void> {
    await this.request(`/todos/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();
