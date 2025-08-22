// src/pages/HomePage/HomePage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/products/ProductCard/ProductCard';
import { useProducts } from '../../context/ProductsContext';
import './HomePage.css';

const HomePage = () => {
  const { products, loading, error, fetchProducts } = useProducts();

  useEffect(() => {
    // Fetch featured products (limit to first 6)
    const getFeaturedProducts = async () => {
      try {
        await fetchProducts();
      } catch (err) {
        console.error('Error fetching featured products:', err);
      }
    };

    getFeaturedProducts();
  }, []);

  // Show only first 6 products for homepage
  const featuredProducts = products.slice(0, 6);

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to ShopEasy</h1>
            <p className="hero-subtitle">Discover amazing products at unbeatable prices</p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-large">
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading amazing products...</p>
            </div>
          )}
          
          {error && (
            <div className="error-container">
              <h3>Oops! Something went wrong</h3>
              <p>{error}</p>
              <button 
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          )}
          
          {!loading && !error && (
            <>
              <div className="products-grid">
                {featuredProducts.length > 0 ? (
                  featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="no-products">
                    <h3>No products available</h3>
                    <p>Check back later for amazing deals!</p>
                  </div>
                )}
              </div>
              
              {featuredProducts.length > 0 && (
                <div className="view-all-container">
                  <Link to="/products" className="btn btn-outline btn-large">
                    View All Products
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Free Shipping</h3>
              <p>Free shipping on orders over $50</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Payment</h3>
              <p>100% secure payment processing</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📞</div>
              <h3>24/7 Support</h3>
              <p>Round-the-clock customer support</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">↩️</div>
              <h3>Easy Returns</h3>
              <p>30-day hassle-free returns</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;