import { createContext, useContext, useState, useEffect } from 'react';
import { getUser, loginUser, registerUser, logoutUser } from '../services/authService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const userData = await loginUser(credentials);
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    const newUser = await registerUser(userData);
    setUser(newUser);
    return newUser;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
