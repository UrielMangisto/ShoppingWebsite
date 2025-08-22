import React, { useState, useEffect } from 'react';
import { useProducts } from '../../../hooks/useProducts';

const ProductFilter = ({ onFilterChange, initialFilters = {} }) => {
  const { categories } = useProducts();
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: {
      min: '',
      max: ''
    },
    rating: 0,
    availability: 'all',
    sortBy: 'newest',
    ...initialFilters
  });

  useEffect(() => {
    onFilterChange(filters);
  }, [filters]);

  const handleCategoryChange = (categoryId) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handlePriceChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: value
      }
    }));
  };

  const handleRatingChange = (value) => {
    setFilters(prev => ({
      ...prev,
      rating: value
    }));
  };

  const handleAvailabilityChange = (value) => {
    setFilters(prev => ({
      ...prev,
      availability: value
    }));
  };

  const handleSortChange = (value) => {
    setFilters(prev => ({
      ...prev,
      sortBy: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: {
        min: '',
        max: ''
      },
      rating: 0,
      availability: 'all',
      sortBy: 'newest'
    });
  };

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Categories</h3>
        <div className="mt-4 space-y-2">
          {categories?.map((category) => (
            <div key={category.id} className="flex items-center">
              <input
                id={`category-${category.id}`}
                name={`category-${category.id}`}
                type="checkbox"
                checked={filters.categories.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor={`category-${category.id}`}
                className="ml-3 text-sm text-gray-600"
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Price Range</h3>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="min-price" className="sr-only">
              Minimum Price
            </label>
            <input
              type="number"
              id="min-price"
              placeholder="Min"
              value={filters.priceRange.min}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="max-price" className="sr-only">
              Maximum Price
            </label>
            <input
              type="number"
              id="max-price"
              placeholder="Max"
              value={filters.priceRange.max}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Minimum Rating</h3>
        <div className="mt-4">
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={filters.rating}
            onChange={(e) => handleRatingChange(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="text-sm text-gray-500 text-center">
            {filters.rating} stars and up
          </div>
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Availability</h3>
        <div className="mt-4">
          <select
            value={filters.availability}
            onChange={(e) => handleAvailabilityChange(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="all">All Products</option>
            <option value="inStock">In Stock</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Sort By</h3>
        <div className="mt-4">
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="popularity">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      <div className="pt-4">
        <button
          type="button"
          onClick={clearFilters}
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;
