import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/products/ProductCard/ProductCard';
import './CategoryPage.css';

const CategoryPage = () => {
  const { id } = useParams();
  const { getProductsByCategory } = useProducts();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const data = await getProductsByCategory(id);
        setProducts(data.products);
        setCategory(data.category);
      } catch (err) {
        setError('Failed to load category products');
        console.error('Error loading category products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [id, getProductsByCategory]);

  if (loading) {
    return (
      <div className="category-page">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="category-page">
        <div className="not-found-message">Category not found</div>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>{category.name}</h1>
        <p className="category-description">{category.description}</p>
      </div>

      {products.length === 0 ? (
        <div className="no-products-message">
          No products found in this category
        </div>
      ) : (
        <div className="category-products">
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
