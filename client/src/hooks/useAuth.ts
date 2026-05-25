import { useState, useEffect } from 'react';
import { AuthState, User } from '@/types/auth.types';

const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('app_token');
    const userStr = localStorage.getItem('app_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          loading: false,
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        clearAuth();
      }
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('app_token', token);
    localStorage.setItem('app_user', JSON.stringify(user));
    setAuthState({
      user,
      token,
      isAuthenticated: true,
      loading: false,
    });
  };

  const logout = () => {
    clearAuth();
  };

  const clearAuth = () => {
    localStorage.removeItem('app_token');
    localStorage.removeItem('app_user');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  return {
    ...authState,
    login,
    logout,
  };
};

export default useAuth;
