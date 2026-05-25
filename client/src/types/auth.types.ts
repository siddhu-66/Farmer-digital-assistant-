// Authentication Types
export interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'farmer' | 'business' | 'admin';
  status: 'pending' | 'verified' | 'approved' | 'rejected' | 'suspended';
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LoginRequest {
  identifier: string; // email or mobile
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: 'farmer' | 'business' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message: string;
}
