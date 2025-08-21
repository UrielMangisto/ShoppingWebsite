import { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { productsService } from '../../services/productsService';
import CategoryList from '../../components/categories/CategoryList/CategoryList';
import ProductList from '../../components/products/ProductList/ProductList';
import './HomePage.css';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { execute } = useApi();

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    const { success, data } = await execute(productsService.getFeaturedProducts);
    if (success) {
      setFeaturedProducts(data);
    }
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Our Shop</h1>
          <p>Discover amazing products at great prices</p>
        </div>
      </section>

      <section className="categories-section">
        <h2>Shop by Category</h2>
        <CategoryList />
      </section>

      <section className="featured-section">
        <h2>Featured Products</h2>
        <ProductList products={featuredProducts} />
      </section>
    </div>
  );
};

export default HomePage;