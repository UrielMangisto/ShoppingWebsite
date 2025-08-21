// src/components/common/Header/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
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
  }, [location]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
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

        {/* Search Bar */}
        <div className="header-search">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <span className="search-icon">🔍</span>
            </button>
          </form>
        </div>

        {/* Desktop Navigation */}
        <nav className="header-nav desktop-nav">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
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
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                <span className="search-icon">🔍</span>
              </button>
            </form>
          </div>

          {/* Mobile Menu Items */}
          <nav className="mobile-menu">
            <Link to="/" className="mobile-nav-link">
              <span className="mobile-icon">🏠</span>
              Home
            </Link>
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