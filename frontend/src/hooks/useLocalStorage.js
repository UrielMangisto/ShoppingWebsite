// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // פונקציה לקריאת ערך מ-localStorage
  const readValue = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(readValue);

  // פונקציה לעדכון הערך
  const setValue = (value) => {
    try {
      // אפשר להעביר פונקציה כמו ב-useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // שמירת המצב
      setStoredValue(valueToStore);
      
      // שמירה ב-localStorage
      if (valueToStore === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // מחיקת הערך
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  };

  // האזנה לשינויים ב-localStorage (מחלונות אחרים)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
};