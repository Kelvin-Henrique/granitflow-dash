import React, { useEffect, useState } from 'react';
import { authService, User, LoginCredentials, RegisterData, AuthResponse } from '../services/authService';
import { AuthContext, AuthContextType } from './AuthContext';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const initAuth = async () => {
      try {
        const token = authService.getToken();
        const savedUser = authService.getUser();
        
        if (token && savedUser) {
          // Verify token is still valid by fetching current user
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        // Token is invalid, clear storage
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const authResponse: AuthResponse = await authService.login(credentials);
    authService.setAuth(authResponse);
    setUser(authResponse.user);
  };

  const register = async (data: RegisterData) => {
    const authResponse: AuthResponse = await authService.register(data);
    authService.setAuth(authResponse);
    setUser(authResponse.user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};