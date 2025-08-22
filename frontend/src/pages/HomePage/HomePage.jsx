import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Welcome to Our Shop</h1>
        <p className="hero-description">
          Discover our amazing collection of products at great prices.
        </p>
        <div className="hero-buttons">
          <Link to="/products" className="hero-button primary-button">
            Shop Now
          </Link>
          <Link to="/categories" className="hero-button secondary-button">
            Browse Categories
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <h2 className="section-title">Featured Products</h2>
        <div className="products-grid">
          {/* Example Product Card */}
          <div className="product-card">
            <div className="product-image">
              Product Image
            </div>
            <div className="product-info">
              <h3 className="product-title">Example Product</h3>
              <p className="product-category">Category</p>
              <p className="product-price">$35.00</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
