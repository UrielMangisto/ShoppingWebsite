// client/src/components/orders/OrderStatus.jsx
import React from 'react';
import { getStatusLabel, getStatusColor, getStatusIcon } from '../../utils/orderUtils';

const OrderStatus = ({ status }) => {
  // Debug log to see what component receives
  console.log('OrderStatus component received status:', status);
  
  return (
    <span className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(status)} whitespace-nowrap`}>
      <span className="mr-1 text-xs sm:text-sm">{getStatusIcon(status)}</span>
      <span className="text-xs sm:text-sm">{getStatusLabel(status)}</span>
    </span>
  );
};

export default OrderStatus;
