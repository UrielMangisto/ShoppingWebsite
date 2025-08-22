import React from 'react';
import './CategorySearch.css';

const CategorySearch = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="management-controls">
      <div className="search-section">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>
    </div>
  );
};

export default CategorySearch;
