import { useState, useCallback } from 'react';
import { adminService } from '../services/adminService';

export const useAdmin = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  // Products
  const fetchProducts = useCallback(async () => {
    const response = await adminService.getProducts();
    setProducts(response.data);
    return response.data;
  }, []);

  const createProduct = useCallback(async (productData) => {
    const response = await adminService.createProduct(productData);
    setProducts(prev => [...prev, response.data]);
    return response.data;
  }, []);

  const updateProduct = useCallback(async (productId, productData) => {
    const response = await adminService.updateProduct(productId, productData);
    setProducts(prev => prev.map(p => p._id === productId ? response.data : p));
    return response.data;
  }, []);

  const deleteProduct = useCallback(async (productId) => {
    await adminService.deleteProduct(productId);
    setProducts(prev => prev.filter(p => p._id !== productId));
  }, []);

  // Categories
  const fetchCategories = useCallback(async () => {
    const response = await adminService.getCategories();
    setCategories(response.data);
    return response.data;
  }, []);

  const createCategory = useCallback(async (categoryData) => {
    const response = await adminService.createCategory(categoryData);
    setCategories(prev => [...prev, response.data]);
    return response.data;
  }, []);

  const updateCategory = useCallback(async (categoryId, categoryData) => {
    const response = await adminService.updateCategory(categoryId, categoryData);
    setCategories(prev => prev.map(c => c._id === categoryId ? response.data : c));
    return response.data;
  }, []);

  const deleteCategory = useCallback(async (categoryId) => {
    await adminService.deleteCategory(categoryId);
    setCategories(prev => prev.filter(c => c._id !== categoryId));
  }, []);

  // Users
  const fetchUsers = useCallback(async () => {
    const response = await adminService.getUsers();
    setUsers(response.data);
    return response.data;
  }, []);

  const updateUser = useCallback(async (userId, userData) => {
    const response = await adminService.updateUser(userId, userData);
    setUsers(prev => prev.map(u => u._id === userId ? response.data : u));
    return response.data;
  }, []);

  const deleteUser = useCallback(async (userId) => {
    await adminService.deleteUser(userId);
    setUsers(prev => prev.filter(u => u._id !== userId));
  }, []);

  // Orders
  const fetchOrders = useCallback(async () => {
    const response = await adminService.getOrders();
    setOrders(response.data);
    return response.data;
  }, []);

  const updateOrderStatus = useCallback(async (orderId, status) => {
    const response = await adminService.updateOrderStatus(orderId, status);
    setOrders(prev => prev.map(o => o._id === orderId ? response.data : o));
    return response.data;
  }, []);

  return {
    // Data
    products,
    categories,
    users,
    orders,
    
    // Product methods
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    
    // Category methods
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    
    // User methods
    fetchUsers,
    updateUser,
    deleteUser,
    
    // Order methods
    fetchOrders,
    updateOrderStatus
  };
};
