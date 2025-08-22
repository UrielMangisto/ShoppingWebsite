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
    setIsProfileDropdownOpen(false);
  }, [location]);

  // Handle category selection - Navigate to individual category page
  const handleCategoryClick = (categoryId, categoryName) => {
    setIsCategoriesOpen(false);
    // Navigate to individual category page: /category/electronics
    const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/category/${categorySlug}`, { 
      state: { categoryId, categoryName } 
    });
  };

  // Handle all categories click
  const handleAllCategoriesClick = () => {
    setIsCategoriesOpen(false);
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
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo">
          <Link to="/" className="logo-link">
            <div className="logo">
              <span className="logo-icon">🛍️</span>
              <span className="logo-text">ShopEasy</span>
            </div>
          </Link>
        </div>

        {/* Search Bar - Desktop */}
        <div className="header-search">
          <GlobalSearch />
        </div>

        {/* Desktop Navigation */}
        <nav className="header-nav desktop-nav">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          
          {/* Categories Dropdown - CLICK ONLY */}
          <div 
            className="categories-dropdown" 
            ref={categoriesDropdownRef}
          >
            <button
              onClick={toggleCategoriesDropdown}
              className="categories-trigger"
              aria-expanded={isCategoriesOpen}
              aria-haspopup="true"
            >
              Categories
              <span className={`dropdown-arrow ${isCategoriesOpen ? 'open' : ''}`}>
                ▼
              </span>
            </button>

            {isCategoriesOpen && (
              <div className="categories-menu">
                <div className="categories-header">
                  <h3>Shop by Category</h3>
                </div>
                
                <div className="categories-list">
                  <button
                    onClick={handleAllCategoriesClick}
                    className="category-item all-categories"
                  >
                    <span className="category-icon">🛍️</span>
                    <span className="category-name">All Categories</span>
                  </button>
                  
                  {categoriesLoading ? (
                    <div className="categories-loading">
                      <div className="mini-spinner"></div>
                      <span>Loading categories...</span>
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="no-categories">
                      <span>No categories available</span>
                    </div>
                  ) : (
                    categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id, category.name)}
                        className="category-item"
                      >
                        <span className="category-icon">📱</span>
                        <span className="category-name">{category.name}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          <Link 
            to="/products" 
            className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}
          >
            Products
          </Link>
          
          {isAuthenticated ? (
            <>
              {/* Cart Link */}
              <Link to="/cart" className="cart-link">
                <span className="cart-icon">🛒</span>
                {totalItems > 0 && (
                  <span className="cart-badge">{totalItems}</span>
                )}
              </Link>

              {/* Profile Dropdown */}
              <div className="profile-dropdown" ref={profileDropdownRef}>
                <button 
                  onClick={toggleProfileDropdown}
                  className="profile-button"
                  aria-expanded={isProfileDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="profile-avatar">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="profile-name">{user?.name || 'User'}</span>
                  <span className={`dropdown-arrow ${isProfileDropdownOpen ? 'open' : ''}`}>
                    ▼
                  </span>
                </button>

                {isProfileDropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <div className="user-info">
                        <div className="user-name">{user?.name || 'User'}</div>
                        <div className="user-email">{user?.email}</div>
                        <div className="user-role">
                          <span className={`role-badge ${user?.role}`}>
                            {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <Link to="/profile" className="dropdown-item">
                      <span className="item-icon">👤</span>
                      My Profile
                    </Link>
                    
                    <Link to="/profile" className="dropdown-item">
                      <span className="item-icon">📦</span>
                      My Orders
                    </Link>
                    
                    <Link to="/cart" className="dropdown-item">
                      <span className="item-icon">🛒</span>
                      Shopping Cart
                      {totalItems > 0 && (
                        <span className="item-badge">{totalItems}</span>
                      )}
                    </Link>
                    
                    {isAdmin() && (
                      <>
                        <div className="dropdown-divider"></div>
                        <Link to="/admin" className="dropdown-item admin-item">
                          <span className="item-icon">⚙️</span>
                          Admin Panel
                        </Link>
                      </>
                    )}
                    
                    <div className="dropdown-divider"></div>
                    
                    <button onClick={handleLogout} className="dropdown-item logout-item">
                      <span className="item-icon">🚪</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link login-link">
                Login
              </Link>
              <Link to="/register" className="nav-link register-link">
                Register
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-button"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-content">
          {/* Mobile Search */}
          <div className="mobile-search">
            <GlobalSearch />
          </div>

          {/* Mobile Menu Items */}
          <nav className="mobile-menu">
            <Link to="/" className="mobile-nav-link">
              <span className="mobile-icon">🏠</span>
              Home
            </Link>
            
            {/* Mobile Categories */}
            <div className="mobile-categories">
              <div className="mobile-categories-header">
                <span className="mobile-icon">📂</span>
                Categories
              </div>
              <div className="mobile-categories-list">
                <button
                  onClick={handleAllCategoriesClick}
                  className="mobile-category-item"
                >
                  <span className="mobile-category-icon">🛍️</span>
                  All Categories
                </button>
                
                {categoriesLoading ? (
                  <div className="mobile-categories-loading">
                    <div className="mini-spinner"></div>
                    <span>Loading...</span>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="mobile-no-categories">
                    <span>No categories available</span>
                  </div>
                ) : (
                  categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id, category.name)}
                      className="mobile-category-item"
                    >
                      <span className="mobile-category-icon">📱</span>
                      {category.name}
                    </button>
                  ))
                )}
              </div>
            </div>
            
            <Link to="/products" className="mobile-nav-link">
              <span className="mobile-icon">📱</span>
              Products
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="mobile-nav-link">
                  <span className="mobile-icon">👤</span>
                  Profile
                </Link>
                <Link to="/cart" className="mobile-nav-link">
                  <span className="mobile-icon">🛒</span>
                  Cart
                  {totalItems > 0 && (
                    <span className="mobile-badge">{totalItems}</span>
                  )}
                </Link>
                {isAdmin() && (
                  <Link to="/admin" className="mobile-nav-link admin-link">
                    <span className="mobile-icon">⚙️</span>
                    Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="mobile-nav-link logout-link">
                  <span className="mobile-icon">🚪</span>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-nav-link">
                  <span className="mobile-icon">🔑</span>
                  Login
                </Link>
                <Link to="/register" className="mobile-nav-link">
                  <span className="mobile-icon">📝</span>
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* User Info in Mobile */}
          {isAuthenticated && (
            <div className="mobile-user-info">
              <div className="mobile-user-avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="mobile-user-details">
                <div className="mobile-user-name">{user?.name || 'User'}</div>
                <div className="mobile-user-email">{user?.email}</div>
                <span className={`mobile-role-badge ${user?.role}`}>
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