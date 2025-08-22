import React from 'react';
import './ProductManagementHeader.css';

const ProductManagementHeader = ({ onAddProduct }) => {
  return (
    <div className="productmanage-header">
      <div className="header-content">
        <h1>Product Management</h1>
        <p>Manage your product catalog</p>
      </div>
      <button 
        className="btn btn-primary"
        onClick={onAddProduct}
      >
        Add New Product
      </button>
    </div>
  );
};

export default ProductManagementHeader;
