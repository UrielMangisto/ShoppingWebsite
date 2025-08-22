// src/pages/CategoriesPage/CategoriesPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import './CategoriesPage.css';

const CategoriesPage = () => {
  const navigate = useNavigate();
  const { categories, loading, error } = useCategories();

  // Handle category click
  const handleCategoryClick = (categoryId, categoryName) => {
    const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/category/${categorySlug}`, { 
      state: { categoryId, categoryName } 
    });
  };

  // Get category icon based on name (you can customize this)
  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes('electronic') || name.includes('tech')) return '📱';
    if (name.includes('cloth') || name.includes('fashion')) return '👕';
    if (name.includes('book')) return '📚';
    if (name.includes('home') || name.includes('furniture')) return '🏠';
    if (name.includes('sport')) return '⚽';
    if (name.includes('beauty') || name.includes('cosmetic')) return '💄';
    if (name.includes('food') || name.includes('grocery')) return '🍎';
    if (name.includes('toy')) return '🧸';
    if (name.includes('automotive') || name.includes('car')) return '🚗';
    if (name.includes('health')) return '🏥';
    if (name.includes('music') || name.includes('instrument')) return '🎵';
    if (name.includes('garden')) return '🌿';
    return '🛍️'; // Default icon
  };

  return (
    <div className="categories-page-wrapper">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="page-breadcrumb">
          <span onClick={() => navigate('/')} className="page-breadcrumb-item">
            Home
          </span>
          <span className="page-breadcrumb-separator">›</span>
          <span className="page-breadcrumb-item active">Categories</span>
        </nav>

        {/* Page Header */}
        <div className="page-categories-header">
          <h1 className="page-categories-title">Shop by Categories</h1>
          <p className="page-categories-description">
            Explore our wide range of product categories and find exactly what you're looking for
          </p>
        </div>

        {/* Categories Content */}
        <div className="page-categories-content">
          {loading && (
            <div className="page-loading-container">
              <div className="page-loading-spinner"></div>
              <p>Loading categories...</p>
            </div>
          )}

          {error && (
            <div className="page-error-container">
              <h3>Error Loading Categories</h3>
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="page-btn page-btn-primary"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              {categories.length > 0 ? (
                <>
                  <div className="page-categories-stats">
                    <span className="page-categories-count">
                      {categories.length} Categories Available
                    </span>
                  </div>

                  <div className="page-categories-grid">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="page-category-card"
                        onClick={() => handleCategoryClick(category.id, category.name)}
                      >
                        <div className="page-category-icon">
                          {getCategoryIcon(category.name)}
                        </div>
                        <div className="page-category-content">
                          <h3 className="page-category-name">{category.name}</h3>
                          <p className="page-category-info">
                            Explore {category.name.toLowerCase()} products
                          </p>
                        </div>
                        <div className="page-category-arrow">
                          →
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="page-quick-actions">
                    <h3>Can't find what you're looking for?</h3>
                    <div className="page-action-buttons">
                      <button 
                        onClick={() => navigate('/products')}
                        className="page-btn page-btn-primary"
                      >
                        Browse All Products
                      </button>
                      <button 
                        onClick={() => navigate('/search')}
                        className="page-btn page-btn-outline"
                      >
                        Search Products
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="page-no-categories">
                  <div className="page-no-categories-icon">🛍️</div>
                  <h3>No Categories Available</h3>
                  <p>Categories will appear here once they are added to the store.</p>
                  <button 
                    onClick={() => navigate('/products')}
                    className="page-btn page-btn-primary"
                  >
                    Browse All Products
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Features Section */}
        <div className="page-categories-features">
          <div className="page-features-grid">
            <div className="page-feature-item">
              <div className="page-feature-icon">🔍</div>
              <h4>Easy Navigation</h4>
              <p>Find products quickly with our organized category system</p>
            </div>
            <div className="page-feature-item">
              <div className="page-feature-icon">🏷️</div>
              <h4>Filtered Results</h4>
              <p>Each category shows only relevant products for better shopping</p>
            </div>
            <div className="page-feature-item">
              <div className="page-feature-icon">⚡</div>
              <h4>Quick Access</h4>
              <p>Jump directly to your favorite product categories</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;