import React, { useState, useEffect } from 'react';
import { useProducts } from '../../../hooks/useProducts';

const CategoryFilter = ({ onFilterChange, selectedCategories = [] }) => {
  const { categories, loading, error } = useProducts();
  const [selected, setSelected] = useState(selectedCategories);

  useEffect(() => {
    setSelected(selectedCategories);
  }, [selectedCategories]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        Error loading categories
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  const handleCategoryChange = (categoryId) => {
    let newSelected;
    if (selected.includes(categoryId)) {
      newSelected = selected.filter(id => id !== categoryId);
    } else {
      newSelected = [...selected, categoryId];
    }
    setSelected(newSelected);
    onFilterChange(newSelected);
  };

  const handleSelectAll = () => {
    const allCategoryIds = categories.map(category => category.id);
    setSelected(allCategoryIds);
    onFilterChange(allCategoryIds);
  };

  const handleClearAll = () => {
    setSelected([]);
    onFilterChange([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Categories</h3>
        <div className="space-x-2">
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Select All
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={handleClearAll}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center">
            <input
              id={`category-${category.id}`}
              name={`category-${category.id}`}
              type="checkbox"
              checked={selected.includes(category.id)}
              onChange={() => handleCategoryChange(category.id)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor={`category-${category.id}`}
              className="ml-3 text-sm text-gray-600 cursor-pointer hover:text-gray-800"
            >
              {category.name}
              <span className="ml-1 text-gray-400">
                ({category.productCount})
              </span>
            </label>
          </div>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="pt-2">
          <p className="text-sm text-gray-500">
            {selected.length} {selected.length === 1 ? 'category' : 'categories'} selected
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
