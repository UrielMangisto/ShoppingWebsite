import { useParams } from 'react-router-dom';
import OrderDetails from '../../../components/orders/OrderDetails/OrderDetails';
import './OrderDetailPage.css';

const OrderDetailPage = () => {
  const { orderId } = useParams();

  return (
    <div className="order-detail-page">
      <OrderDetails orderId={orderId} />
    </div>
  );
};

export default OrderDetailPage;