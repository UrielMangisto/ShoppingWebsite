// src/hooks/useOrders.js
import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../services/orderService';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // טעינת הזמנות של המשתמש
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Load orders error:', error);
      setError(error.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // יצירת הזמנה חדשה
  const createOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.createOrder();
      await loadOrders(); // רענון רשימת הזמנות
      return { success: true, orderId: response.orderId };
    } catch (error) {
      console.error('Create order error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // טעינה ראשונית
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return {
    orders,
    loading,
    error,
    loadOrders,
    createOrder,
    refetch: loadOrders
  };
};

export const useOrder = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // טעינת הזמנה בודדת
  const loadOrder = useCallback(async () => {
    if (!orderId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Load order error:', error);
      setError(error.message);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  // טעינה ראשונית
  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  return {
    order,
    loading,
    error,
    loadOrder,
    refetch: loadOrder
  };
};

// Hook להזמנות לאדמין
export const useAdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // טעינת כל ההזמנות (אדמין)
  const loadAllOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Load all orders error:', error);
      setError(error.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // עדכון סטטוס הזמנה
  const updateOrderStatus = async (orderId, status) => {
    try {
      setLoading(true);
      setError(null);
      await orderService.updateOrderStatus(orderId, status);
      await loadAllOrders(); // רענון רשימת הזמנות
      return { success: true };
    } catch (error) {
      console.error('Update order status error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // טעינה ראשונית
  useEffect(() => {
    loadAllOrders();
  }, [loadAllOrders]);

  return {
    orders,
    loading,
    error,
    loadAllOrders,
    updateOrderStatus,
    refetch: loadAllOrders
  };
};