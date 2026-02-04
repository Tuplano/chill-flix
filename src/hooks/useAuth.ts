import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import type { User, AuthState } from '@/types';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: true,
  });

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      // Example API call to validate token / get user
      // const user = await api.get<User>('/auth/me'); 
      
      // Mocked success for demonstration
      const user: User = { id: '1', name: 'Demo User', email: 'demo@example.com', role: 'user' };

      setAuthState({
        isAuthenticated: true,
        user,
        token,
        isLoading: false,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isAuthenticated: false, user: null, token: null, isLoading: false }));
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: unknown) => {
    // const res = await api.post<{ token: string, user: User }>('/auth/login', credentials);
    // localStorage.setItem('token', res.token);
    // setAuthState(...)
    console.log('Login implementation pending', credentials);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({ isAuthenticated: false, user: null, token: null, isLoading: false });
  };

  return {
    ...authState,
    login,
    logout,
  };
}
