import React from 'react';
import './CategoryGrid.css';

const CategoryGrid = ({ 
  categories, 
  onEdit, 
  onDelete, 
  onCreateFirst, 
  searchTerm 
}) => {
  if (categories.length === 0) {
    return (
      <div className="no-categories">
        <div className="empty-state">
          <div className="empty-icon">🏷️</div>
          <h3>{searchTerm ? 'No matching categories' : 'No categories yet'}</h3>
          <p>
            {searchTerm 
              ? 'Try adjusting your search terms.' 
              : 'Start organizing your products by creating categories.'
            }
          </p>
          {!searchTerm && (
            <button 
              className="btn btn-primary"
              onClick={onCreateFirst}
            >
              Create First Category
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="categories-grid">
      {categories.map((category) => (
        <div key={category.id} className="category-card">
          <div className="category-header">
            <h3>{category.name}</h3>
            <span className="category-id">ID: {category.id}</span>
          </div>
          <div className="category-actions">
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => onEdit(category)}
            >
              Edit
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => onDelete(category)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryGrid;
