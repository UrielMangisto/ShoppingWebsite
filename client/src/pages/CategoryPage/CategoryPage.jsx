// src/pages/CategoryPage/CategoryPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext';
import { useCategories } from '../../hooks/useCategories';
import ProductCard from '../../components/products/ProductCard/ProductCard';
import './CategoryPage.css';

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { products, loading, error, fetchProducts, setFilters, clearFilters } = useProducts();
  const { categories } = useCategories();
  
  const [currentCategory, setCurrentCategory] = useState(null);
  const [sortBy, setSortBy] = useState('name_asc');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Get category info from location state or find by slug
  useEffect(() => {
    if (location.state?.categoryId && location.state?.categoryName) {
      // Category info passed from navigation
      setCurrentCategory({
        id: location.state.categoryId,
        name: location.state.categoryName
      });
    } else if (categorySlug && categories.length > 0) {
      // Find category by slug
      const category = categories.find(cat => 
        cat.name.toLowerCase().replace(/\s+/g, '-') === categorySlug
      );
      if (category) {
        setCurrentCategory(category);
      } else {
        // Category not found, redirect to all categories
        navigate('/categories');
      }
    }
  }, [categorySlug, location.state, categories, navigate]);

  // Fetch products when category changes
  useEffect(() => {
    if (currentCategory) {
      const filters = {
        categories: [currentCategory.id],
        minPrice: priceRange.min || null,
        maxPrice: priceRange.max || null,
        minRating: null,
      };
      
      setFilters(filters);
      fetchProducts(filters);
    }
  }, [currentCategory, priceRange, sortBy]);

  // Handle sort change
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  // Handle price filter
  const handlePriceFilter = () => {
    if (currentCategory) {
      const filters = {
        categories: [currentCategory.id],
        minPrice: priceRange.min || null,
        maxPrice: priceRange.max || null,
        minRating: null,
      };
      
      setFilters(filters);
      fetchProducts(filters);
    }
  };

  // Clear filters
  const handleClearFilters = () => {
    setPriceRange({ min: '', max: '' });
    clearFilters();
    if (currentCategory) {
      const filters = {
        categories: [currentCategory.id],
        minPrice: null,
        maxPrice: null,
        minRating: null,
      };
      fetchProducts(filters);
    }
  };

  // Navigate to other categories
  const handleCategoryChange = (categoryId, categoryName) => {
    const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/category/${categorySlug}`, { 
      state: { categoryId, categoryName } 
    });
  };

  if (!currentCategory && !loading) {
    return (
      <div className="category-page-wrapper">
        <div className="container">
          <div className="category-not-found">
            <h2>Category Not Found</h2>
            <p>The category you're looking for doesn't exist.</p>
            <button 
              onClick={() => navigate('/categories')}
              className="cat-btn cat-btn-primary"
            >
              View All Categories
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page-wrapper">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="cat-breadcrumb">
          <span onClick={() => navigate('/')} className="cat-breadcrumb-item">
            Home
          </span>
          <span className="cat-breadcrumb-separator">›</span>
          <span onClick={() => navigate('/categories')} className="cat-breadcrumb-item">
            Categories
          </span>
          {currentCategory && (
            <>
              <span className="cat-breadcrumb-separator">›</span>
              <span className="cat-breadcrumb-item active">{currentCategory.name}</span>
            </>
          )}
        </nav>

        {/* Category Header */}
        {currentCategory && (
          <div className="cat-header">
            <div className="cat-info">
              <h1 className="cat-title">{currentCategory.name}</h1>
              <p className="cat-description">
                Discover our amazing collection of {currentCategory.name.toLowerCase()} products
              </p>
            </div>
            
            {/* Category Navigation */}
            <div className="cat-navigation">
              <h3>Browse Other Categories</h3>
              <div className="cat-chips">
                {categories
                  .filter(cat => cat.id !== currentCategory.id)
                  .slice(0, 5)
                  .map(category => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id, category.name)}
                      className="cat-chip"
                    >
                      {category.name}
                    </button>
                  ))}
                <button
                  onClick={() => navigate('/categories')}
                  className="cat-chip view-all"
                >
                  View All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Sort */}
        <div className="cat-controls">
          <div className="cat-filters-section">
            <h3>Filters</h3>
            <div className="cat-filter-group">
              
              <label>Price Range</label>
              <div className="cat-price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="cat-price-input"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="cat-price-input"
                />
                <button onClick={handlePriceFilter} className="cat-btn cat-btn-sm cat-btn-primary">
                  Apply
                </button>
              </div>
            </div>
            
            <button onClick={handleClearFilters} className="cat-btn cat-btn-sm cat-btn-outline">
              Clear Filters
            </button>
          </div>

          <div className="cat-sort-section">
            <label htmlFor="cat-sort-select">Sort By:</label>
            <select 
              id="cat-sort-select"
              value={sortBy} 
              onChange={(e) => handleSortChange(e.target.value)}
              className="cat-sort-select"
            >
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="price_asc">Price (Low to High)</option>
              <option value="price_desc">Price (High to Low)</option>
              <option value="rating_desc">Highest Rated</option>
              <option value="created_desc">Newest First</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="cat-products">
          {loading && (
            <div className="cat-loading-container">
              <div className="cat-loading-spinner"></div>
              <p>Loading products...</p>
            </div>
          )}

          {error && (
            <div className="cat-error-container">
              <h3>Error Loading Products</h3>
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="cat-btn cat-btn-primary"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="cat-products-header">
                <h2>
                  {currentCategory?.name} Products 
                  <span className="cat-product-count">({products.length} items)</span>
                </h2>
              </div>

              {products.length > 0 ? (
                <div className="cat-products-grid">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="cat-no-products">
                  <div className="cat-no-products-icon">📦</div>
                  <h3>No Products Found</h3>
                  <p>
                    We couldn't find any products in the {currentCategory?.name} category.
                  </p>
                  <div className="cat-no-products-actions">
                    <button 
                      onClick={handleClearFilters}
                      className="cat-btn cat-btn-outline"
                    >
                      Clear Filters
                    </button>
                    <button 
                      onClick={() => navigate('/products')}
                      className="cat-btn cat-btn-primary"
                    >
                      Browse All Products
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;