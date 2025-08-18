import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/products/ProductCard';
import Loading, { CardSkeleton } from '../components/common/Loading';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load featured products and categories in parallel
      const [productsResponse, categoriesResponse] = await Promise.all([
        productService.getProducts({ limit: 8 }), // Get first 8 products as featured
        categoryService.getCategories()
      ]);

      setFeaturedProducts(productsResponse.data.slice(0, 8));
      setCategories(categoriesResponse.data.slice(0, 6)); // Show first 6 categories
    } catch (err) {
      console.error('Error loading home data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="page-container">
        <div className="error-container">
          <h2 className="error-title">Something went wrong</h2>
          <p className="error-message">{error}</p>
          <button onClick={loadHomeData} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to <span className="brand-name">E-Store</span>
            </h1>
            <p className="hero-subtitle">
              Discover amazing products at unbeatable prices. Shop with confidence and enjoy fast shipping.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                Shop Now
              </Link>
              {!isAuthenticated && (
                <Link to="/register" className="btn btn-outline btn-lg">
                  Join Us
                </Link>
              )}
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-graphic">
              🛍️
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Message for Authenticated Users */}
      {isAuthenticated && (
        <section className="welcome-section">
          <div className="container">
            <div className="welcome-message">
              <h2>Welcome back, {user?.name}! 👋</h2>
              <p>Ready to continue shopping? Check out our latest products below.</p>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3 className="feature-title">Free Shipping</h3>
              <p className="feature-description">
                Free shipping on orders over $50. Fast and reliable delivery.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Secure Payment</h3>
              <p className="feature-description">
                Your payment information is encrypted and secure.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">↩️</div>
              <h3 className="feature-title">Easy Returns</h3>
              <p className="feature-description">
                30-day return policy. No questions asked.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📞</div>
              <h3 className="feature-title">24/7 Support</h3>
              <p className="feature-description">
                Round-the-clock customer support for all your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-description">
              Explore our wide range of product categories
            </p>
          </div>
          
          {isLoading ? (
            <div className="categories-grid">
              {Array(6).fill(0).map((_, index) => (
                <div key={index} className="category-skeleton">
                  <div className="skeleton-line"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="categories-grid">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="category-card"
                >
                  <div className="category-icon">📦</div>
                  <h3 className="category-name">{category.name}</h3>
                </Link>
              ))}
            </div>
          )}
          
          <div className="section-footer">
            <Link to="/products" className="btn btn-outline">
              View All Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <p className="section-description">
              Check out our most popular and trending items
            </p>
          </div>
          
          {isLoading ? (
            <CardSkeleton count={8} />
          ) : featuredProducts.length > 0 ? (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <h3 className="empty-state-title">No products available</h3>
              <p className="empty-state-description">
                Check back later for new products.
              </p>
            </div>
          )}
          
          <div className="section-footer">
            <Link to="/products" className="btn btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2 className="newsletter-title">Stay Updated</h2>
            <p className="newsletter-description">
              Subscribe to our newsletter and get notified about new products and exclusive offers.
            </p>
            <form className="newsletter-form">
              <div className="newsletter-input-group">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="btn btn-primary">
                  Subscribe
                </button>
              </div>
            </form>
            <p className="newsletter-privacy">
              We respect your privacy. You can unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Products</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;