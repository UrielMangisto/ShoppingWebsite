import { useState, useEffect } from 'react';
import { categoriesService } from '../../../services/categoriesService';
import './CategoryFilter.css';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoriesService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading categories...</div>;

  return (
    <div className="category-filter">
      <h3>Categories</h3>
      <div className="category-list">
        <button
          className={`category-button ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => onCategoryChange('all')}
        >
          All Products
        </button>
        {categories.map(category => (
          <button
            key={category._id}
            className={`category-button ${selectedCategory === category._id ? 'active' : ''}`}
            onClick={() => onCategoryChange(category._id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;