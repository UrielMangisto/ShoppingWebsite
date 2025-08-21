import { Link } from 'react-router-dom';
import { formatDate } from '../../../utils/formatters';
import OrderStatus from '../OrderStatus/OrderStatus';
import './OrderCard.css';

const OrderCard = ({ order }) => {
  return (
    <div className="order-card">
      <div className="order-header">
        <div className="order-info">
          <h3>Order #{order._id}</h3>
          <p className="order-date">{formatDate(order.createdAt)}</p>
        </div>
        <OrderStatus status={order.status} />
      </div>
      
      <div className="order-summary">
        <p>{order.items.length} items</p>
        <p className="order-total">Total: ${order.total.toFixed(2)}</p>
      </div>
      
      <Link to={`/orders/${order._id}`} className="view-details-btn">
        View Details
      </Link>
    </div>
  );
};

export default OrderCard;