import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { categoriesService } from '../../services/categoriesService';
import ProductList from '../../components/products/ProductList/ProductList';
import CategoryFilter from '../../components/categories/CategoryFilter/CategoryFilter';
import './CategoryPage.css';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const { execute, loading, error } = useApi();

  useEffect(() => {
    loadCategory();
  }, [categoryId]);

  const loadCategory = async () => {
    const { success, data } = await execute(() => 
      categoriesService.getCategoryById(categoryId)
    );
    if (success) {
      setCategory(data);
    }
  };

  if (loading) return <div className="loading">Loading category...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="category-page">
      <aside className="category-sidebar">
        <CategoryFilter selectedCategory={categoryId} />
      </aside>
      <main className="category-content">
        {category && (
          <>
            <h1>{category.name}</h1>
            <ProductList categoryId={categoryId} />
          </>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;