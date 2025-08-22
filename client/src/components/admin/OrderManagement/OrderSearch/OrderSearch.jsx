import React from 'react';
import './OrderSearch.css';

const OrderSearch = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="order-search-controls">
      <div className="search-section">
        <input
          type="text"
          placeholder="Search orders by ID, customer name, or email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>
    </div>
  );
};

export default OrderSearch;
