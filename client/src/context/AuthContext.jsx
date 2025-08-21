import React, { createContext, useContext, useReducer, useEffect } from 'react'

// Types d'actions pour le reducer
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGOUT: 'LOGOUT',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_ERROR: 'REGISTER_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
}

// État initial
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false,
  error: null
}

// Reducer pour gérer les états d'auth
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null
      }

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }

    case AUTH_ACTIONS.LOGIN_ERROR:
    case AUTH_ACTIONS.REGISTER_ERROR:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      }

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      }

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }

    default:
      return state
  }
}

// Création du Context
const AuthContext = createContext()

// Provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Vérifier le token au chargement de l'app
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Décoder le token pour récupérer les infos utilisateur
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        
        // Vérifier si le token n'est pas expiré
        if (payload.exp * 1000 > Date.now()) {
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              token,
              user: {
                id: payload.id,
                email: payload.email,
                role: payload.role
              }
            }
          })
        } else {
          // Token expiré, le supprimer
          localStorage.removeItem('token')
        }
      } catch (error) {
        // Token invalide, le supprimer
        localStorage.removeItem('token')
      }
    }
  }, [])

  // Fonction de login
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START })

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erreur de connexion')
      }

      // Stocker le token dans localStorage
      localStorage.setItem('token', data.token)

      // Décoder le token pour récupérer les infos utilisateur
      const payload = JSON.parse(atob(data.token.split('.')[1]))

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          token: data.token,
          user: {
            id: payload.id,
            email: payload.email,
            role: payload.role
          }
        }
      })

      return { success: true }
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_ERROR,
        payload: error.message
      })
      return { success: false, error: error.message }
    }
  }

  // Fonction de register
  const register = async (name, email, password, role = 'user') => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START })

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, role })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'inscription')
      }

      // Stocker le token dans localStorage
      localStorage.setItem('token', data.token)

      // Décoder le token pour récupérer les infos utilisateur
      const payload = JSON.parse(atob(data.token.split('.')[1]))

      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: {
          token: data.token,
          user: {
            id: payload.id,
            email: payload.email,
            role: payload.role
          }
        }
      })

      return { success: true }
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.REGISTER_ERROR,
        payload: error.message
      })
      return { success: false, error: error.message }
    }
  }

  // Fonction de logout
  const logout = () => {
    localStorage.removeItem('token')
    dispatch({ type: AUTH_ACTIONS.LOGOUT })
  }

  // Fonction pour clear les erreurs
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })
  }

  // Fonctions utilitaires pour vérifier les rôles
  const isAdmin = () => {
    return state.user?.role === 'admin'
  }

  const isUser = () => {
    return state.user?.role === 'user'
  }

  // Valeurs du context
  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    isAdmin,
    isUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personnalisé pour utiliser le context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext