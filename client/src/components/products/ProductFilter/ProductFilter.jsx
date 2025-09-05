// src/components/products/ProductFilter/ProductFilter.jsx
import React, { useState, useEffect } from 'react';
import { useCategories } from '../../../hooks/useCategories';
import { useProducts } from '../../../context/ProductsContext';
import './ProductFilter.css';

const ProductFilter = ({ isLoading }) => {
  const { categories, loading: loadingCategories } = useCategories();
  const { filters, setFilters, clearFilters } = useProducts();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Local state for price inputs - no auto-apply
  const [localMinPrice, setLocalMinPrice] = useState(
    filters.minPrice === null || filters.minPrice === undefined ? '' : filters.minPrice
  );
  const [localMaxPrice, setLocalMaxPrice] = useState(
    filters.maxPrice === null || filters.maxPrice === undefined ? '' : filters.maxPrice
  );

  // Update local state when filters change externally
  useEffect(() => {
    setLocalMinPrice(filters.minPrice === null || filters.minPrice === undefined ? '' : filters.minPrice);
    setLocalMaxPrice(filters.maxPrice === null || filters.maxPrice === undefined ? '' : filters.maxPrice);
  }, [filters.minPrice, filters.maxPrice]);

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

  // Apply price filter - only when user clicks the button
  const applyPriceFilter = () => {
    const newFilters = { ...filters };
    
    // Apply min price
    if (localMinPrice === '' || localMinPrice === null || localMinPrice === undefined) {
      newFilters.minPrice = null;
    } else {
      const numValue = parseFloat(localMinPrice);
      newFilters.minPrice = isNaN(numValue) ? null : numValue;
    }
    
    // Apply max price
    if (localMaxPrice === '' || localMaxPrice === null || localMaxPrice === undefined) {
      newFilters.maxPrice = null;
    } else {
      const numValue = parseFloat(localMaxPrice);
      newFilters.maxPrice = isNaN(numValue) ? null : numValue;
    }
    
    setFilters(newFilters);
  };

  // Clear price inputs
  const clearPriceFilter = () => {
    setLocalMinPrice('');
    setLocalMaxPrice('');
    const newFilters = { ...filters };
    newFilters.minPrice = null;
    newFilters.maxPrice = null;
    setFilters(newFilters);
  };

  // Check if price filter has pending changes
  const hasPricePendingChanges = () => {
    const currentMin = filters.minPrice === null || filters.minPrice === undefined ? '' : filters.minPrice.toString();
    const currentMax = filters.maxPrice === null || filters.maxPrice === undefined ? '' : filters.maxPrice.toString();
    return localMinPrice.toString() !== currentMin || localMaxPrice.toString() !== currentMax;
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.categories?.length > 0) count++;
    if (filters.minPrice !== null && filters.minPrice !== undefined) count++;
    if (filters.maxPrice !== null && filters.maxPrice !== undefined) count++;
    if (filters.minRating !== null && filters.minRating !== undefined) count++;
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
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(e.target.value)}
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
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
                disabled={isLoading}
                className="price-input"
              />
            </div>
          </div>
          
          {/* Price Filter Buttons */}
          <div className="price-filter-actions">
            <button
              type="button"
              onClick={applyPriceFilter}
              disabled={isLoading || (!localMinPrice && !localMaxPrice)}
              className={`btn btn-primary btn-sm ${hasPricePendingChanges() ? 'pulse' : ''}`}
            >
              Apply
            </button>
            <button
              type="button"
              onClick={clearPriceFilter}
              disabled={isLoading || (!filters.minPrice && !filters.maxPrice && !localMinPrice && !localMaxPrice)}
              className="btn btn-outline btn-sm"
            >
              Clear
            </button>
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