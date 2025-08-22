import React, { useState } from 'react';
import { useOrders } from '../../../hooks/useOrders';
import OrderStatusBadge from '../OrderStatusBadge/OrderStatusBadge';
import { formatPrice, formatDate } from '../../../utils/formatters';
import Pagination from '../../common/Pagination/Pagination';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage';

const OrderList = ({ isAdmin = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { orders, loading, error, totalPages } = useOrders(currentPage);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">No orders found</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {orders.map((order) => (
          <li key={order.id}>
            <a href={`/orders/${order.id}`} className="block hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="truncate text-sm font-medium text-blue-600">
                      Order #{order.orderNumber}
                    </p>
                    <OrderStatusBadge status={order.status} className="ml-2" />
                  </div>
                  <div className="ml-2 flex flex-shrink-0">
                    <p className="inline-flex text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      <span className="truncate">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </span>
                    </p>
                    {isAdmin && (
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <span className="truncate">
                          {order.customer.name}
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p className="font-medium text-gray-900">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {order.items.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-2 text-sm text-gray-500"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <span className="truncate max-w-[150px]">
                        {item.product.name}
                      </span>
                      <span>×{item.quantity}</span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <span className="text-sm text-gray-500">
                      +{order.items.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>

      <div className="px-4 py-4 sm:px-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default OrderList;
