import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { AuthApi } from '../lib/api.js';
import { useToast } from './ToastContext.jsx';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { addToast } = useToast();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const loadCurrentUser = async () => {
      try {
        const response = await AuthApi.me({ signal: controller.signal });
        if (response?.user) {
          setUser(response.user);
        }
      } catch (error) {
        if (error.name !== 'AbortError' && error.status !== 401) {
          addToast({ type: 'error', message: error.message || 'Failed to load session' });
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrentUser();

    return () => controller.abort();
  }, [addToast]);

  const handleAuthRequest = async (fn, successMessage) => {
    setIsLoading(true);
    try {
      const response = await fn();
      if (response?.user) {
        setUser(response.user);
      }
      if (successMessage) {
        addToast({ type: 'success', message: successMessage });
      }
      return response;
    } catch (error) {
      addToast({ type: 'error', message: error.message || 'Authentication failed' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = (credentials) => handleAuthRequest(() => AuthApi.login(credentials), 'Logged in successfully');

  const register = (payload) =>
    handleAuthRequest(() => AuthApi.register(payload), 'Account created successfully');

  const logout = async () => {
    try {
      await AuthApi.logout();
      setUser(null);
      addToast({ type: 'info', message: 'Logged out' });
    } catch (error) {
      addToast({ type: 'error', message: error.message || 'Failed to log out' });
      throw error;
    }
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      register,
      logout,
      setUser,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
