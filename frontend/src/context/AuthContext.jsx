// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // בדיקה אם המשתמש מחובר בטעינת האפליקציה
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // אפשר לבדוק את תקינות הטוקן עם השרת
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        logout(); // אם יש שגיאה, התנתק
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      const { token, user: userData } = response;
      
      // שמירה ב-localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      const { token, user: newUser } = response;
      
      // שמירה ב-localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setUser(newUser);
      setIsAuthenticated(true);
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};