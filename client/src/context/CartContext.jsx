import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useAuth } from './AuthContext'

// Types d'actions pour le reducer
const CART_ACTIONS = {
  LOAD_CART_START: 'LOAD_CART_START',
  LOAD_CART_SUCCESS: 'LOAD_CART_SUCCESS',
  LOAD_CART_ERROR: 'LOAD_CART_ERROR',
  ADD_TO_CART_START: 'ADD_TO_CART_START',
  ADD_TO_CART_SUCCESS: 'ADD_TO_CART_SUCCESS',
  ADD_TO_CART_ERROR: 'ADD_TO_CART_ERROR',
  UPDATE_CART_ITEM_START: 'UPDATE_CART_ITEM_START',
  UPDATE_CART_ITEM_SUCCESS: 'UPDATE_CART_ITEM_SUCCESS',
  UPDATE_CART_ITEM_ERROR: 'UPDATE_CART_ITEM_ERROR',
  REMOVE_FROM_CART_START: 'REMOVE_FROM_CART_START',
  REMOVE_FROM_CART_SUCCESS: 'REMOVE_FROM_CART_SUCCESS',
  REMOVE_FROM_CART_ERROR: 'REMOVE_FROM_CART_ERROR',
  CLEAR_CART: 'CLEAR_CART',
  CLEAR_ERROR: 'CLEAR_ERROR'
}

// État initial
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
  error: null
}

// Fonction pour calculer les totaux
function calculateTotals(items) {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = items.reduce((total, item) => total + (item.productPrice * item.quantity), 0)
  return { totalItems, totalPrice }
}

// Reducer pour gérer les états du panier
function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.LOAD_CART_START:
    case CART_ACTIONS.ADD_TO_CART_START:
    case CART_ACTIONS.UPDATE_CART_ITEM_START:
    case CART_ACTIONS.REMOVE_FROM_CART_START:
      return {
        ...state,
        isLoading: true,
        error: null
      }

    case CART_ACTIONS.LOAD_CART_SUCCESS:
      const { totalItems, totalPrice } = calculateTotals(action.payload)
      return {
        ...state,
        items: action.payload,
        totalItems,
        totalPrice,
        isLoading: false,
        error: null
      }

    case CART_ACTIONS.ADD_TO_CART_SUCCESS:
    case CART_ACTIONS.UPDATE_CART_ITEM_SUCCESS:
    case CART_ACTIONS.REMOVE_FROM_CART_SUCCESS:
      // Recharger le panier après modification
      return {
        ...state,
        isLoading: false,
        error: null
      }

    case CART_ACTIONS.LOAD_CART_ERROR:
    case CART_ACTIONS.ADD_TO_CART_ERROR:
    case CART_ACTIONS.UPDATE_CART_ITEM_ERROR:
    case CART_ACTIONS.REMOVE_FROM_CART_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
        error: null
      }

    case CART_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }

    default:
      return state
  }
}

// Création du Context
const CartContext = createContext()

// Provider component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { isAuthenticated, token } = useAuth()

  // Charger le panier quand l'utilisateur se connecte
  useEffect(() => {
    if (isAuthenticated && token) {
      loadCart()
    } else {
      // Si pas connecté, vider le panier
      dispatch({ type: CART_ACTIONS.CLEAR_CART })
    }
  }, [isAuthenticated, token])

  // Fonction pour charger le panier
  const loadCart = async () => {
    if (!isAuthenticated || !token) return

    dispatch({ type: CART_ACTIONS.LOAD_CART_START })

    try {
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Erreur lors du chargement du panier')
      }

      const data = await response.json()
      
      dispatch({
        type: CART_ACTIONS.LOAD_CART_SUCCESS,
        payload: data.items || []
      })
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.LOAD_CART_ERROR,
        payload: error.message
      })
    }
  }

  // Fonction pour ajouter un produit au panier
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated || !token) {
      throw new Error('Vous devez être connecté pour ajouter des produits au panier')
    }

    dispatch({ type: CART_ACTIONS.ADD_TO_CART_START })

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId, quantity })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erreur lors de l\'ajout au panier')
      }

      dispatch({ type: CART_ACTIONS.ADD_TO_CART_SUCCESS })
      
      // Recharger le panier
      await loadCart()
      
      return { success: true }
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.ADD_TO_CART_ERROR,
        payload: error.message
      })
      return { success: false, error: error.message }
    }
  }

  // Fonction pour mettre à jour la quantité d'un item
  const updateCartItem = async (itemId, quantity) => {
    if (!isAuthenticated || !token) return

    dispatch({ type: CART_ACTIONS.UPDATE_CART_ITEM_START })

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erreur lors de la mise à jour')
      }

      dispatch({ type: CART_ACTIONS.UPDATE_CART_ITEM_SUCCESS })
      
      // Recharger le panier
      await loadCart()
      
      return { success: true }
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.UPDATE_CART_ITEM_ERROR,
        payload: error.message
      })
      return { success: false, error: error.message }
    }
  }

  // Fonction pour supprimer un item du panier
  const removeFromCart = async (itemId) => {
    if (!isAuthenticated || !token) return

    dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART_START })

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erreur lors de la suppression')
      }

      dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART_SUCCESS })
      
      // Recharger le panier
      await loadCart()
      
      return { success: true }
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.REMOVE_FROM_CART_ERROR,
        payload: error.message
      })
      return { success: false, error: error.message }
    }
  }

  // Fonction pour vider le panier (après commande)
  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART })
  }

  // Fonction pour clear les erreurs
  const clearError = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_ERROR })
  }

  // Fonction pour obtenir la quantité d'un produit dans le panier
  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.productId === productId)
    return item ? item.quantity : 0
  }

  // Fonction pour vérifier si un produit est dans le panier
  const isInCart = (productId) => {
    return state.items.some(item => item.productId === productId)
  }

  // Valeurs du context
  const value = {
    ...state,
    loadCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    clearError,
    getItemQuantity,
    isInCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Hook personnalisé pour utiliser le context
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export default CartContext