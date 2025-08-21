import { useState, useEffect } from 'react';
import { useApi } from '../../../hooks/useApi';
import { orderService } from '../../../services/OrderService';
import { formatDate } from '../../../utils/formatters';
import './OrderManagement.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const { execute, loading, error } = useApi();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const { success, data } = await execute(orderService.getAllOrders);
    if (success) {
      setOrders(data);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const { success, data } = await execute(() => 
      orderService.updateOrderStatus(orderId, newStatus)
    );
    if (success) {
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    }
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="order-management">
      <h2>Manage Orders</h2>
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user.name}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td>${order.total.toFixed(2)}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => window.location.href = `/admin/orders/${order._id}`}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;