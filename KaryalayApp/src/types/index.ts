export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
} 