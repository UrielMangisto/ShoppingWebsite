import React from 'react';
import OrderStatus from '../../../orders/OrderStatus';
import './OrderTable.css';

const OrderTable = ({ orders, onViewDetails, formatDate }) => {
  return (
    <div className="orders-table-container">
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Email</th>
            <th>Order Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id}>
                <td className="order-id-cell">#{order.id}</td>
                <td>
                  <div className="customer-cell">
                    <strong>{order.name}</strong>
                  </div>
                </td>
                <td className="email-cell">{order.email}</td>
                <td>{formatDate(order.created_at)}</td>
                <td>
                  <OrderStatus status={order.status} />
                </td>
                <td>
                  <div className="order-action-buttons">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => onViewDetails(order.id)}
                    >
                      View Details
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-data">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
