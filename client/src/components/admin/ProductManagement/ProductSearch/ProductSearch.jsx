import React from 'react';
import './ProductSearch.css';

const ProductSearch = ({ searchTerm, onSearchChange, totalProducts }) => {
  return (
    <div className="management-controls">
      <div className="search-section">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="stats">
        <span>Total Products: {totalProducts}</span>
      </div>
    </div>
  );
};

export default ProductSearch;
