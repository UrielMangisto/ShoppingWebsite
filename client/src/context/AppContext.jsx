import React, { createContext, useContext, useReducer, useEffect } from 'react';

const initialState = {
  theme: 'light',
  language: 'en',
  currency: 'USD',
  notifications: [],
  loading: false,
  error: null,
  sidebarOpen: false,
  searchQuery: '',
  filters: {
    category: '',
    priceRange: [0, 1000],
    sortBy: 'newest'
  }
};

const APP_ACTIONS = {
  SET_THEME: 'SET_THEME',
  SET_LANGUAGE: 'SET_LANGUAGE',
  SET_CURRENCY: 'SET_CURRENCY',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_FILTERS: 'SET_FILTERS',
  RESET_FILTERS: 'RESET_FILTERS'
};

const appReducer = (state, action) => {
  switch (action.type) {
    case APP_ACTIONS.SET_THEME:
      return {
        ...state,
        theme: action.payload
      };
    
    case APP_ACTIONS.SET_LANGUAGE:
      return {
        ...state,
        language: action.payload
      };
    
    case APP_ACTIONS.SET_CURRENCY:
      return {
        ...state,
        currency: action.payload
      };
    
    case APP_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    
    case APP_ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload)
      };
    
    case APP_ACTIONS.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: []
      };
    
    case APP_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case APP_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case APP_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case APP_ACTIONS.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen
      };
    
    case APP_ACTIONS.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload
      };
    
    case APP_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    
    case APP_ACTIONS.RESET_FILTERS:
      return {
        ...state,
        filters: initialState.filters
      };
    
    default:
      return state;
  }
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedLanguage = localStorage.getItem('language');
    const savedCurrency = localStorage.getItem('currency');

    if (savedTheme) {
      dispatch({ type: APP_ACTIONS.SET_THEME, payload: savedTheme });
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    if (savedLanguage) {
      dispatch({ type: APP_ACTIONS.SET_LANGUAGE, payload: savedLanguage });
    }
    
    if (savedCurrency) {
      dispatch({ type: APP_ACTIONS.SET_CURRENCY, payload: savedCurrency });
    }
  }, []);

  const setTheme = (theme) => {
    dispatch({ type: APP_ACTIONS.SET_THEME, payload: theme });
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  };

  const setLanguage = (language) => {
    dispatch({ type: APP_ACTIONS.SET_LANGUAGE, payload: language });
    localStorage.setItem('language', language);
  };

  const setCurrency = (currency) => {
    dispatch({ type: APP_ACTIONS.SET_CURRENCY, payload: currency });
    localStorage.setItem('currency', currency);
  };

  const addNotification = (notification) => {
    const id = Date.now().toString();
    const notificationWithId = { ...notification, id };
    dispatch({ type: APP_ACTIONS.ADD_NOTIFICATION, payload: notificationWithId });

    if (notification.autoRemove !== false) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
  };

  const removeNotification = (id) => {
    dispatch({ type: APP_ACTIONS.REMOVE_NOTIFICATION, payload: id });
  };

  const clearNotifications = () => {
    dispatch({ type: APP_ACTIONS.CLEAR_NOTIFICATIONS });
  };

  const setLoading = (loading) => {
    dispatch({ type: APP_ACTIONS.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: APP_ACTIONS.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: APP_ACTIONS.CLEAR_ERROR });
  };

  const toggleSidebar = () => {
    dispatch({ type: APP_ACTIONS.TOGGLE_SIDEBAR });
  };

  const setSearchQuery = (query) => {
    dispatch({ type: APP_ACTIONS.SET_SEARCH_QUERY, payload: query });
  };

  const setFilters = (filters) => {
    dispatch({ type: APP_ACTIONS.SET_FILTERS, payload: filters });
  };

  const resetFilters = () => {
    dispatch({ type: APP_ACTIONS.RESET_FILTERS });
  };

  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: state.currency,
    });
    return formatter.format(amount);
  };

  const value = {
    ...state,
    setTheme,
    setLanguage,
    setCurrency,
    addNotification,
    removeNotification,
    clearNotifications,
    setLoading,
    setError,
    clearError,
    toggleSidebar,
    setSearchQuery,
    setFilters,
    resetFilters,
    formatCurrency
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;