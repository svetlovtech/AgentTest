export interface User {
  id: string;
  username: string;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  userId: string;
  tags: string[];
  deadline: string | null;
  sharedWith: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  errors?: string[];
}
