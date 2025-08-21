import { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';

export const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.login(email, password);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  const register = useCallback(async ({ name, email, password, role }) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.register({ name, email, password, role });
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  const logout = useCallback(() => {
    try {
      authService.logout();
      setUser(null);
    } catch (err) {
      setError(err.message || 'Failed to logout');
    }
  }, [setUser]);

  const resetPassword = useCallback(async (email, oldPassword, newPassword) => {
    try {
      setError(null);
      setLoading(true);
      await authService.resetPassword(email, oldPassword, newPassword);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = authService.getToken();
        if (token) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [setUser]);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };
};

export default useAuth;
