import React from 'react';
import { useOrders } from '../../../hooks/useOrders';
import OrderStatusBadge from '../OrderStatusBadge/OrderStatusBadge';
import { formatPrice, formatDate } from '../../../utils/formatters';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage';

const OrderDetails = ({ orderId, isAdmin = false }) => {
  const { getOrder, updateOrderStatus } = useOrders();
  const { order, loading, error } = getOrder(orderId);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!order) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">Order not found</p>
      </div>
    );
  }

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      {/* Order Header */}
      <div className="px-4 py-5 sm:px-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Order #{order.orderNumber}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Order Content */}
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          {/* Customer Information */}
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Customer</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <div>{order.customer.name}</div>
              <div>{order.customer.email}</div>
            </dd>
          </div>

          {/* Shipping Address */}
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Shipping Address</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <div>{order.shippingAddress.street}</div>
              <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</div>
              <div>{order.shippingAddress.country}</div>
            </dd>
          </div>

          {/* Order Items */}
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Items</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <div className="border rounded-lg divide-y">
                {order.items.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-16 w-16 rounded object-cover"
                      />
                      <div className="ml-4">
                        <div className="font-medium">{item.product.name}</div>
                        <div className="text-gray-500">
                          Quantity: {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatPrice(item.price)}
                      </div>
                      <div className="text-gray-500">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </dd>
          </div>

          {/* Order Summary */}
          <div className="sm:col-span-2">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span>Shipping</span>
                <span>{formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span>Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between font-medium text-base mt-4 pt-4 border-t">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Update Status</dt>
              <dd className="mt-1">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};

export default OrderDetails;
