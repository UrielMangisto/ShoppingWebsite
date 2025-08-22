import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useApi } from '../../../hooks/useApi';
import { orderService } from '../../../services/orderService';

// Import components
import OrderManagementHeader from '../../../components/admin/OrderManagement/OrderManagementHeader/OrderManagementHeader';
import OrderStats from '../../../components/admin/OrderManagement/OrderStats/OrderStats';
import OrderSearch from '../../../components/admin/OrderManagement/OrderSearch/OrderSearch';
import OrderTable from '../../../components/admin/OrderManagement/OrderTable/OrderTable';
import OrderDetailsModal from '../../../components/admin/OrderManagement/OrderDetailsModal/OrderDetailsModal';
import LoadingSpinner from '../../../components/admin/Dashboard/LoadingSpinner/LoadingSpinner';
import AccessDenied from '../../../components/admin/Dashboard/AccessDenied/AccessDenied';

import './OrderManagement.css';

const OrderManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const { loading: apiLoading, execute } = useApi();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchOrders();
    }
  }, [isAuthenticated, user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const orderData = await orderService.getAllOrdersAdmin();
      const ordersWithDetails = Array.isArray(orderData) ? orderData : [];
      
      // For each order, fetch its details to get the items and total
      const detailedOrders = await Promise.all(
        ordersWithDetails.map(async (order) => {
          try {
            const details = await orderService.getOrder(order.id);
            return {
              ...order,
              items: details.items || [],
              total_amount: details.items?.reduce((sum, item) => 
                sum + (item.price * item.quantity), 0) || 0
            };
          } catch (error) {
            console.error(`Error fetching details for order ${order.id}:`, error);
            return order;
          }
        })
      );
      
      setOrders(detailedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const orderDetails = await execute(() => orderService.getOrder(orderId));
      setSelectedOrder(orderDetails);
      setShowOrderDetails(true);
    } catch (error) {
      alert(`Error fetching order details: ${error.message}`);
    }
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter(order =>
    order.id.toString().includes(searchTerm) ||
    order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getOrderStats = () => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => {
      // Get the total amount for this order
      const orderTotal = order.total_amount || order.items?.reduce((itemSum, item) => 
        itemSum + (item.price * item.quantity), 0) || 0;
      return sum + orderTotal;
    }, 0);
    // Calculate average order value
    const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    return { totalOrders, totalRevenue, averageOrder };
  };

  const stats = getOrderStats();

  if (!isAuthenticated || user?.role !== 'admin') {
    return <AccessDenied message="Admin privileges required." />;
  }

  return (
    <div className="admin-page">
      <div className="container">
        <OrderManagementHeader />
        
        <OrderStats
          totalOrders={stats.totalOrders}
          totalRevenue={stats.totalRevenue}
          averageOrder={stats.averageOrder}
          formatCurrency={formatCurrency}
        />
        
        <OrderSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {loading ? (
          <LoadingSpinner message="Loading orders..." />
        ) : (
          <OrderTable
            orders={filteredOrders}
            onViewDetails={fetchOrderDetails}
            formatDate={formatDate}
          />
        )}

        {showOrderDetails && selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => {
              setShowOrderDetails(false);
              setSelectedOrder(null);
            }}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
          />
        )}
      </div>
    </div>
  );
};

export default OrderManagement;