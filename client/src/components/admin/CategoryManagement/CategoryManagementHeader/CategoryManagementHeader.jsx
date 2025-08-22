import React from 'react';
import './CategoryManagementHeader.css';

const CategoryManagementHeader = ({ onAddCategory }) => {
  return (
    <div className="manageCat-header">
      <div className="manageCat-header-content">
        <h1>Category Management</h1>
        <p>Organize your product categories</p>
      </div>
      <button 
        className="btn btn-primary"
        onClick={onAddCategory}
      >
        Add New Category
      </button>
    </div>
  );
};

export default CategoryManagementHeader;
