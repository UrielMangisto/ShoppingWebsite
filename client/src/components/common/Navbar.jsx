import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { categoryService } from '../../services/categoryService';
import SearchBar from './SearchBar';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data.slice(0, 6)); // Show first 6 categories
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  const closeCategories = () => {
    setIsCategoriesOpen(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
      if (!event.target.closest('.categories-dropdown')) {
        setIsCategoriesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/" className="logo-link" onClick={closeDropdown}>
            <span className="logo-icon">=Í</span>
            <span className="logo-text">E-Store</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="navbar-nav">
          <Link
            to="/"
            className={`nav-link ${isActiveRoute('/') ? 'active' : ''}`}
            onClick={closeDropdown}
          >
            Home
          </Link>

          {/* Categories Dropdown */}
          <div className="categories-dropdown">
            <button
              className={`nav-link dropdown-trigger ${
                location.pathname.includes('/products') ? 'active' : ''
              }`}
              onClick={toggleCategories}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleCategories();
                }
              }}
            >
              Products
              <span className={`dropdown-arrow ${isCategoriesOpen ? 'open' : ''}`}>
                ¼
              </span>
            </button>

            {isCategoriesOpen && (
              <div className="categories-menu">
                <Link
                  to="/products"
                  className="category-item all-products"
                  onClick={closeCategories}
                >
                  <span className="category-icon"><ê</span>
                  All Products
                </Link>
                <div className="categories-divider"></div>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.id}`}
                    className="category-item"
                    onClick={closeCategories}
                  >
                    <span className="category-icon">=æ</span>
                    {category.name}
                  </Link>
                ))}
                {categories.length > 0 && (
                  <>
                    <div className="categories-divider"></div>
                    <Link
                      to="/products"
                      className="category-item view-all"
                      onClick={closeCategories}
                    >
                      View All Categories ’
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <Link
            to="/about"
            className={`nav-link ${isActiveRoute('/about') ? 'active' : ''}`}
            onClick={closeDropdown}
          >
            About
          </Link>

          <Link
            to="/contact"
            className={`nav-link ${isActiveRoute('/contact') ? 'active' : ''}`}
            onClick={closeDropdown}
          >
            Contact
          </Link>
        </div>

        {/* Search Bar */}
        <div className="navbar-search">
          <SearchBar placeholder="Search products..." />
        </div>

        {/* Right Side Actions */}
        <div className="navbar-actions">
          {/* Cart (only for authenticated users) */}
          {isAuthenticated && (
            <Link to="/cart" className="cart-link" onClick={closeDropdown}>
              <div className="cart-icon-container">
                <span className="cart-icon">=Ò</span>
                {totalItems > 0 && (
                  <span className="cart-badge">{totalItems}</span>
                )}
              </div>
              <span className="cart-text">Cart</span>
            </Link>
          )}

          {/* User Menu */}
          <div className="dropdown-container">
            {isAuthenticated ? (
              <>
                <button
                  className="user-button"
                  onClick={toggleDropdown}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      toggleDropdown();
                    }
                  }}
                >
                  <span className="user-avatar">=d</span>
                  <span className="user-name">{user?.name || 'User'}</span>
                  <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>
                    ¼
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="dropdown-menu user-dropdown">
                    <div className="dropdown-header">
                      <div className="user-info">
                        <span className="user-avatar-large">=d</span>
                        <div className="user-details">
                          <span className="user-name">{user?.name}</span>
                          <span className="user-email">{user?.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="dropdown-divider"></div>

                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={closeDropdown}
                    >
                      <span className="dropdown-icon">=d</span>
                      My Profile
                    </Link>

                    <Link
                      to="/orders"
                      className="dropdown-item"
                      onClick={closeDropdown}
                    >
                      <span className="dropdown-icon">=æ</span>
                      Order History
                    </Link>

                    <Link
                      to="/wishlist"
                      className="dropdown-item"
                      onClick={closeDropdown}
                    >
                      <span className="dropdown-icon">d</span>
                      Wishlist
                    </Link>

                    <Link
                      to="/settings"
                      className="dropdown-item"
                      onClick={closeDropdown}
                    >
                      <span className="dropdown-icon">™</span>
                      Settings
                    </Link>

                    {/* Admin Panel for Admin Users */}
                    {isAdmin() && (
                      <>
                        <div className="dropdown-divider"></div>
                        <Link
                          to="/admin"
                          className="dropdown-item admin-item"
                          onClick={closeDropdown}
                        >
                          <span className="dropdown-icon">™</span>
                          Admin Panel
                        </Link>
                      </>
                    )}

                    <div className="dropdown-divider"></div>

                    <button
                      onClick={handleLogout}
                      className="dropdown-item logout-item"
                    >
                      <span className="dropdown-icon">=ª</span>
                      Sign Out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="auth-buttons">
                <Link
                  to="/login"
                  className="btn btn-outline btn-sm"
                  onClick={closeDropdown}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-sm"
                  onClick={closeDropdown}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation (could be enhanced later) */}
      <div className="mobile-nav-hint">
        <p className="mobile-text">
          =¡ Mobile navigation is available in the main Header component
        </p>
      </div>
    </nav>
  );
};

export default Navbar;