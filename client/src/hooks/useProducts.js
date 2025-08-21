import { useState, useEffect } from 'react'
import * as productsService from '../services/productsService'

export const useProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all products
  const fetchProducts = async (params = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await productsService.getProducts(params)
      setProducts(result)
      return { success: true, data: result }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch products'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Search products
  const searchProducts = async (query) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await productsService.searchProducts(query)
      setProducts(result)
      return { success: true, data: result }
    } catch (err) {
      const errorMessage = err.message || 'Search failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Get recommended products
  const fetchRecommended = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await productsService.getRecommendedProducts()
      return { success: true, data: result }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch recommended products'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Create product (admin)
  const createProduct = async (productData) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await productsService.createProduct(productData)
      await fetchProducts() // Refresh list
      return { success: true, data: result }
    } catch (err) {
      const errorMessage = err.message || 'Failed to create product'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Update product (admin)
  const updateProduct = async (id, productData) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await productsService.updateProduct(id, productData)
      await fetchProducts() // Refresh list
      return { success: true, data: result }
    } catch (err) {
      const errorMessage = err.message || 'Failed to update product'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Delete product (admin)
  const deleteProduct = async (id) => {
    setLoading(true)
    setError(null)
    
    try {
      await productsService.deleteProduct(id)
      await fetchProducts() // Refresh list
      return { success: true }
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete product'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Clear error
  const clearError = () => {
    setError(null)
  }

  // Auto-fetch products on mount
  useEffect(() => {
    fetchProducts()
  }, [])

  return {
    products,
    loading,
    error,
    fetchProducts,
    searchProducts,
    fetchRecommended,
    createProduct,
    updateProduct,
    deleteProduct,
    clearError
  }
}

// Hook for single product
export const useProduct = (productId) => {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchProduct = async () => {
    if (!productId) return

    setLoading(true)
    setError(null)
    
    try {
      const result = await productsService.getProduct(productId)
      setProduct(result)
      return { success: true, data: result }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch product'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [productId])

  return {
    product,
    loading,
    error,
    refetch: fetchProduct
  }
}