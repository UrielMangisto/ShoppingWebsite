import React from 'react';
import './CategoryStats.css';

const CategoryStats = ({ totalCategories, filteredCount }) => {
  return (
    <div className="category-stats">
      <div className="stat-card">
        <div className="stat-number">{totalCategories}</div>
        <div className="stat-label">Total Categories</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{filteredCount}</div>
        <div className="stat-label">Filtered Results</div>
      </div>
    </div>
  );
};

export default CategoryStats;
