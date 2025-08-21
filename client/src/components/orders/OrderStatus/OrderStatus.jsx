import './OrderStatus.css';

const OrderStatus = ({ status }) => {
  const getStatusClass = () => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  return (
    <span className={`order-status ${getStatusClass()}`}>
      {status}
    </span>
  );
};

export default OrderStatus;