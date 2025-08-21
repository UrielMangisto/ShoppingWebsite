import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { orderService } from '../../../services/OrderService';
import { formatDate } from '../../../utils/formatters';
import OrderStatus from '../OrderStatus/OrderStatus';
import OrderItems from '../OrderItems/OrderItems';
import './OrderDetails.css';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="order-details">
      <div className="order-header">
        <h2>Order #{order._id}</h2>
        <OrderStatus status={order.status} />
      </div>

      <div className="order-info">
        <p>Ordered on: {formatDate(order.createdAt)}</p>
        <p>Shipping Address: {order.shippingAddress}</p>
      </div>

      <OrderItems items={order.items} />

      <div className="order-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>${order.subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping:</span>
          <span>${order.shipping.toFixed(2)}</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;