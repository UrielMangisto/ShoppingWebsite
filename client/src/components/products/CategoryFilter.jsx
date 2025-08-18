import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import Loading from '../common/Loading';
import './CategoryFilter.css';

const CategoryFilter = ({ 
  selectedCategory, 
  onCategoryChange, 
  className = '', 
  showAllOption = true,
  layout = 'vertical' // 'vertical' or 'horizontal'
}) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await categoryService.getCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (categoryId) => {
    onCategoryChange(categoryId);
  };

  if (error) {
    return (
      <div className="category-filter-error">
        <p>Unable to load categories</p>
        <button onClick={loadCategories} className="btn btn-sm btn-outline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`category-filter ${layout} ${className}`}>
      <div className="filter-header">
        <h3 className="filter-title">Categories</h3>
        {selectedCategory && (
          <button
            onClick={() => handleCategorySelect('')}
            className="clear-filter-btn"
            title="Clear category filter"
          >
             Clear
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="categories-loading">
          <Loading size="small" text="" />
          <span className="loading-text">Loading categories...</span>
        </div>
      ) : (
        <div className="categories-list">
          {showAllOption && (
            <button
              onClick={() => handleCategorySelect('')}
              className={`category-item ${!selectedCategory ? 'active' : ''}`}
            >
              <span className="category-icon"><ê</span>
              <span className="category-name">All Products</span>
              <span className="category-count">
                ({categories.reduce((sum, cat) => sum + (cat.product_count || 0), 0)})
              </span>
            </button>
          )}

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
            >
              <span className="category-icon">
                {getCategoryIcon(category.name)}
              </span>
              <span className="category-name">{category.name}</span>
              {category.product_count !== undefined && (
                <span className="category-count">
                  ({category.product_count})
                </span>
              )}
            </button>
          ))}

          {categories.length === 0 && (
            <div className="no-categories">
              <p>No categories available</p>
            </div>
          )}
        </div>
      )}

      {layout === 'vertical' && categories.length > 0 && (
        <div className="filter-footer">
          <p className="filter-info">
            {categories.length} {categories.length === 1 ? 'category' : 'categories'} available
          </p>
        </div>
      )}
    </div>
  );
};

// Helper function to get category icons
const getCategoryIcon = (categoryName) => {
  const iconMap = {
    'electronics': '=ñ',
    'clothing': '=U',
    'books': '=Ú',
    'home': '<à',
    'garden': '<1',
    'sports': '½',
    'beauty': '=„',
    'toys': '>ø',
    'automotive': '=—',
    'food': '<U',
    'health': '=Š',
    'music': '<µ',
    'art': '<¨',
    'jewelry': '=Ž',
    'pets': '=>',
    'tools': '='',
    'office': '=Ý',
    'baby': '=v',
    'fitness': '<Ë',
    'outdoor': '<Õ'
  };

  const lowerName = categoryName.toLowerCase();
  
  // Try to find a matching icon
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lowerName.includes(key)) {
      return icon;
    }
  }
  
  // Default icon
  return '=æ';
};

export default CategoryFilter;