// src/components/products/ProductFilter/ProductFilter.jsx
import React, { useState } from 'react';
import { useCategories } from '../../../hooks/useCategories';
import { useProducts } from '../../../context/ProductsContext';
import './ProductFilter.css';

const ProductFilter = ({ isLoading }) => {
  const { categories, loading: loadingCategories } = useCategories();
  const { filters, setFilters, clearFilters } = useProducts();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters };
    
    if (filterType === 'category') {
      // Handle single category selection (radio behavior)
      if (newFilters.categories?.includes(value)) {
        // Remove selection
        newFilters.categories = [];
      } else {
        // Set single selection
        newFilters.categories = [value];
      }
    } else if (filterType === 'minPrice' || filterType === 'maxPrice') {
      // Handle price inputs properly
      if (value === '' || value === null || value === undefined) {
        newFilters[filterType] = null;
      } else {
        const numValue = parseFloat(value);
        newFilters[filterType] = isNaN(numValue) ? null : numValue;
      }
    } else {
      newFilters[filterType] = value;
    }
    
    setFilters(newFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.categories?.length > 0) count++;
    if (filters.minPrice !== null && filters.minPrice !== undefined) count++;
    if (filters.maxPrice !== null && filters.maxPrice !== undefined) count++;
    if (filters.minRating !== null && filters.minRating !== undefined) count++;
    if (filters.inStock !== null && filters.inStock !== undefined) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className={`product-filter ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="filter-header">
        <h3>Filters</h3>
        <div className="filter-header-actions">
          {activeFilterCount > 0 && (
            <span className="filter-count">{activeFilterCount} active</span>
          )}
          <button
            className="filter-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label="Toggle filters"
          >
            {isCollapsed ? '▼' : '▲'}
          </button>
        </div>
      </div>

      <div className="filter-content">
        {/* Categories Filter */}
        <div className="filter-section">
          <h4>Categories</h4>
          {loadingCategories ? (
            <div className="filter-loading">Loading categories...</div>
          ) : (
            <div className="category-list">
              {categories.map(category => (
                <label key={category.id} className="category-item">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.categories?.includes(category.id) || false}
                    onChange={() => handleFilterChange('category', category.id)}
                    disabled={isLoading}
                  />
                  <span className="radio-custom"></span>
                  <span className="category-name">{category.name}</span>
                </label>
              ))}
              {/* All Categories option */}
              <label className="category-item">
                <input
                  type="radio"
                  name="category"
                  checked={!filters.categories?.length}
                  onChange={() => handleFilterChange('category', null)}
                  disabled={isLoading}
                />
                <span className="radio-custom"></span>
                <span className="category-name">All Categories</span>
              </label>
              {categories.length === 0 && !loadingCategories && (
                <p className="no-categories">No categories available</p>
              )}
            </div>
          )}
        </div>

        {/* Price Range Filter */}
        <div className="filter-section">
          <h4>Price Range</h4>
          <div className="price-inputs">
            <div className="price-input-group">
              <label>Min Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="$0"
                value={filters.minPrice === null || filters.minPrice === undefined ? '' : filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                disabled={isLoading}
                className="price-input"
              />
            </div>
            <div className="price-separator">-</div>
            <div className="price-input-group">
              <label>Max Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="$999"
                value={filters.maxPrice === null || filters.maxPrice === undefined ? '' : filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                disabled={isLoading}
                className="price-input"
              />
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="filter-section">
          <h4>Minimum Rating</h4>
          <div className="rating-filter">
            {[1, 2, 3, 4, 5].map(rating => (
              <label key={rating} className="rating-item">
                <input
                  type="radio"
                  name="minRating"
                  checked={filters.minRating === rating}
                  onChange={() => handleFilterChange('minRating', rating)}
                  disabled={isLoading}
                />
                <span className="rating-stars">
                  {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
                </span>
                <span className="rating-text">& up</span>
              </label>
            ))}
            <label className="rating-item">
              <input
                type="radio"
                name="minRating"
                checked={filters.minRating === null || filters.minRating === undefined}
                onChange={() => handleFilterChange('minRating', null)}
                disabled={isLoading}
              />
              <span className="rating-text">Any rating</span>
            </label>
          </div>
        </div>

        {/* Stock Filter */}
        <div className="filter-section">
          <h4>Availability</h4>
          <div className="stock-filter">
            <label className="stock-item">
              <input
                type="radio"
                name="stockFilter"
                checked={filters.inStock === null || filters.inStock === undefined}
                onChange={() => handleFilterChange('inStock', null)}
                disabled={isLoading}
              />
              <span>All products</span>
            </label>
            <label className="stock-item">
              <input
                type="radio"
                name="stockFilter"
                checked={filters.inStock === true}
                onChange={() => handleFilterChange('inStock', true)}
                disabled={isLoading}
              />
              <span>In stock only</span>
            </label>
            <label className="stock-item">
              <input
                type="radio"
                name="stockFilter"
                checked={filters.inStock === false}
                onChange={() => handleFilterChange('inStock', false)}
                disabled={isLoading}
              />
              <span>Out of stock</span>
            </label>
          </div>
        </div>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <div className="filter-actions">
            <button
              className="btn btn-outline clear-filters"
              onClick={clearFilters}
              disabled={isLoading}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilter;