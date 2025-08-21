import { useState, useEffect } from 'react';
import { useApi } from '../../../hooks/useApi';
import { categoriesService } from '../../../services/categoriesService';
import './CategoryList.css';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const { execute, loading, error } = useApi();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const { success, data } = await execute(categoriesService.getCategories);
    if (success) {
      setCategories(data);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="category-list">
      <h2>Shop by Category</h2>
      <div className="categories-grid">
        {categories.map(category => (
          <Link 
            key={category._id}
            to={`/category/${category._id}`}
            className="category-card"
          >
            {category.image && (
              <img 
                src={category.image} 
                alt={category.name} 
                className="category-image"
              />
            )}
            <div className="category-info">
              <h3>{category.name}</h3>
              {category.description && (
                <p>{category.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;