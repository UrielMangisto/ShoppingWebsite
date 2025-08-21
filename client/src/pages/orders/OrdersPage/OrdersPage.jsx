import OrderList from '../../../components/orders/OrderList/OrderList';
import './OrdersPage.css';

const OrdersPage = () => {
  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      <OrderList />
    </div>
  );
};

export default OrdersPage;