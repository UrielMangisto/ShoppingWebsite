// src/components/common/Header/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { useCategories } from '../../../hooks/useCategories';
import GlobalSearch from '../GlobalSearch/GlobalSearch';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const { categories, loading: categoriesLoading } = useCategories();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const categoriesDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (categoriesDropdownRef.current && !categoriesDropdownRef.current.contains(event.target)) {
        setIsCategoriesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsCategoriesOpen(false);
    setIsMobileCategoriesOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location]);

  // Handle category selection - Navigate to individual category page
  const handleCategoryClick = (categoryId, categoryName) => {
    setIsCategoriesOpen(false);
    setIsMobileCategoriesOpen(false);
    // Navigate to individual category page: /category/electronics
    const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/category/${categorySlug}`, { 
      state: { categoryId, categoryName } 
    });
  };

  // Handle all categories click
  const handleAllCategoriesClick = () => {
    setIsCategoriesOpen(false);
    setIsMobileCategoriesOpen(false);
    navigate('/categories');
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    navigate('/');
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Toggle categories dropdown - CLICK ONLY VERSION
  const toggleCategoriesDropdown = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  return (
    <header className="main-header">
      <div className="main-header-container">
        {/* Logo */}
        <div className="main-header-logo">
          <Link to="/" className="main-logo-link">
            <div className="main-logo">
              <span className="main-logo-icon">🛍️</span>
              <span className="main-logo-text">ShopEasy</span>
            </div>
          </Link>
        </div>

        {/* Search Bar - Desktop */}
        <div className="main-header-search">
          <GlobalSearch />
        </div>

        {/* Desktop Navigation */}
        <nav className="main-header-nav main-desktop-nav">
          <Link 
            to="/" 
            className={`main-nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          
          {/* Categories Dropdown - CLICK ONLY */}
          <div 
            className="main-categories-dropdown" 
            ref={categoriesDropdownRef}
          >
            <button
              onClick={toggleCategoriesDropdown}
              className="main-categories-trigger"
              aria-expanded={isCategoriesOpen}
              aria-haspopup="true"
            >
              Categories
              <span className={`main-dropdown-arrow ${isCategoriesOpen ? 'open' : ''}`}>
                ▼
              </span>
            </button>

            {isCategoriesOpen && (
              <div className="main-categories-menu">
                <div className="main-categories-header">
                  <h3>Shop by Category</h3>
                </div>
                
                <div className="main-categories-list">
                  <button
                    onClick={handleAllCategoriesClick}
                    className="main-category-item main-all-categories"
                  >
                    <span className="main-category-icon">🛍️</span>
                    <span className="main-category-name">All Categories</span>
                  </button>
                  
                  {categoriesLoading ? (
                    <div className="main-categories-loading">
                      <div className="main-mini-spinner"></div>
                      <span>Loading categories...</span>
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="main-no-categories">
                      <span>No categories available</span>
                    </div>
                  ) : (
                    categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id, category.name)}
                        className="main-category-item"
                      >
                        <span className="main-category-icon">📱</span>
                        <span className="main-category-name">{category.name}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          <Link 
            to="/products" 
            className={`main-nav-link ${location.pathname === '/products' ? 'active' : ''}`}
          >
            Products
          </Link>
          
          {isAuthenticated ? (
            <>
              {/* Cart Link */}
              <Link to="/cart" className="main-cart-link">
                <span className="main-cart-icon">🛒</span>
                {totalItems > 0 && (
                  <span className="main-cart-badge">{totalItems}</span>
                )}
              </Link>

              {/* Profile Dropdown */}
              <div className="main-profile-dropdown" ref={profileDropdownRef}>
                <button 
                  onClick={toggleProfileDropdown}
                  className="main-profile-button"
                  aria-expanded={isProfileDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="main-profile-avatar">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="main-profile-name">{user?.name || 'User'}</span>
                  <span className={`main-dropdown-arrow ${isProfileDropdownOpen ? 'open' : ''}`}>
                    ▼
                  </span>
                </button>

                {isProfileDropdownOpen && (
                  <div className="main-dropdown-menu">
                    <div className="main-dropdown-header">
                      <div className="main-user-info">
                        <div className="main-user-name">{user?.name || 'User'}</div>
                        <div className="main-user-email">{user?.email}</div>
                        <div className="main-user-role">
                          <span className={`main-role-badge ${user?.role}`}>
                            {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="main-dropdown-divider"></div>
                    
                    <Link to="/profile" className="main-dropdown-item">
                      <span className="main-item-icon">👤</span>
                      My Profile
                    </Link>
                    
                    <Link to="/profile" className="main-dropdown-item">
                      <span className="main-item-icon">📦</span>
                      My Orders
                    </Link>
                    
                    <Link to="/cart" className="main-dropdown-item">
                      <span className="main-item-icon">🛒</span>
                      Shopping Cart
                      {totalItems > 0 && (
                        <span className="main-item-badge">{totalItems}</span>
                      )}
                    </Link>
                    
                    {isAdmin() && (
                      <>
                        <div className="main-dropdown-divider"></div>
                        <Link to="/admin" className="main-dropdown-item main-admin-item">
                          <span className="main-item-icon">⚙️</span>
                          Admin Panel
                        </Link>
                      </>
                    )}
                    
                    <div className="main-dropdown-divider"></div>
                    
                    <button onClick={handleLogout} className="main-dropdown-item main-logout-item">
                      <span className="main-item-icon">🚪</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="main-nav-link main-login-link">
                Login
              </Link>
              <Link to="/register" className="main-nav-link main-register-link">
                Register
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="main-mobile-menu-button"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className={`main-hamburger ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`main-mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        <div className="main-mobile-nav-content">
          {/* Mobile Search */}
          <div className="main-mobile-search">
            <GlobalSearch />
          </div>

          {/* Mobile Menu Items */}
          <nav className="main-mobile-menu">
            <Link to="/" className="main-mobile-nav-link">
              <span className="main-mobile-icon">🏠</span>
              Home
            </Link>
            
            {/* Mobile Categories */}
            <div className="main-mobile-categories">
              <button 
                className="main-mobile-nav-link main-mobile-categories-header" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileCategoriesOpen(!isMobileCategoriesOpen);
                }}
                aria-expanded={isMobileCategoriesOpen}
              >
                <span className="main-mobile-icon">📂</span>
                Categories
                <span className={`main-dropdown-arrow ${isMobileCategoriesOpen ? 'open' : ''}`}>▼</span>
              </button>
              {isMobileCategoriesOpen && (
                <div className="main-mobile-categories-list">
                  <button
                    onClick={handleAllCategoriesClick}
                    className="main-mobile-category-item"
                  >
                    <span className="main-mobile-category-icon">🛍️</span>
                    All Categories
                  </button>
                  
                  {categoriesLoading ? (
                    <div className="main-mobile-categories-loading">
                      <div className="main-mini-spinner"></div>
                      <span>Loading...</span>
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="main-mobile-no-categories">
                      <span>No categories available</span>
                    </div>
                  ) : (
                    categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id, category.name)}
                        className="main-mobile-category-item"
                      >
                        <span className="main-mobile-category-icon">📱</span>
                        {category.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            
            <Link to="/products" className="main-mobile-nav-link">
              <span className="main-mobile-icon">📱</span>
              Products
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="main-mobile-nav-link">
                  <span className="main-mobile-icon">👤</span>
                  Profile
                </Link>
                <Link to="/cart" className="main-mobile-nav-link">
                  <span className="main-mobile-icon">🛒</span>
                  Cart
                  {totalItems > 0 && (
                    <span className="main-mobile-badge">{totalItems}</span>
                  )}
                </Link>
                {isAdmin() && (
                  <Link to="/admin" className="main-mobile-nav-link main-admin-link">
                    <span className="main-mobile-icon">⚙️</span>
                    Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="main-mobile-nav-link main-logout-link">
                  <span className="main-mobile-icon">🚪</span>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="main-mobile-nav-link">
                  <span className="main-mobile-icon">🔑</span>
                  Login
                </Link>
                <Link to="/register" className="main-mobile-nav-link">
                  <span className="main-mobile-icon">📝</span>
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* User Info in Mobile */}
          {isAuthenticated && (
            <div className="main-mobile-user-info">
              <div className="main-mobile-user-avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="main-mobile-user-details">
                <div className="main-mobile-user-name">{user?.name || 'User'}</div>
                <div className="main-mobile-user-email">{user?.email}</div>
                <span className={`main-mobile-role-badge ${user?.role}`}>
                  {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;