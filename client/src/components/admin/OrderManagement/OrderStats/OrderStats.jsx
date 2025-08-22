import React from 'react';
import './OrderStats.css';

const OrderStats = ({ totalOrders, totalRevenue, averageOrder, formatCurrency }) => {
  return (
    <div className="order-stats-grid">
      <div className="stat-card">
        <div className="stat-number">{totalOrders}</div>
        <div className="stat-label">Total Orders</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{formatCurrency(totalRevenue)}</div>
        <div className="stat-label">Total Revenue</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{formatCurrency(averageOrder)}</div>
        <div className="stat-label">Average Order</div>
      </div>
    </div>
  );
};

export default OrderStats;
