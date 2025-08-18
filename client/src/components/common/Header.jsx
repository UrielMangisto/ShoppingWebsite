import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import SearchBar from './SearchBar';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo">
          <Link to="/" className="logo-link" onClick={closeMobileMenu}>
            <span className="logo-icon">🛍️</span>
            <span className="logo-text">E-Store</span>
          </Link>
        </div>

        {/* Search Bar - Desktop */}
        <div className="header-search desktop-only">
          <SearchBar />
        </div>

        {/* Navigation - Desktop */}
        <nav className="header-nav desktop-only">
          <Link 
            to="/" 
            className={`nav-link ${isActiveRoute('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/products" 
            className={`nav-link ${isActiveRoute('/products') ? 'active' : ''}`}
          >
            Products
          </Link>
        </nav>

        {/* User Actions */}
        <div className="header-actions">
          {/* Cart Icon */}
          {isAuthenticated && (
            <Link to="/cart" className="cart-link" onClick={closeMobileMenu}>
              <div className="cart-icon">
                🛒
                {totalItems > 0 && (
                  <span className="cart-badge">{totalItems}</span>
                )}
              </div>
            </Link>
          )}

          {/* User Menu - Desktop */}
          <div className="user-menu desktop-only">
            {isAuthenticated ? (
              <div className="user-dropdown">
                <button className="user-button">
                  <span className="user-avatar">👤</span>
                  <span className="user-name">{user?.name}</span>
                  <span className="dropdown-arrow">▼</span>
                </button>
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">
                    👤 Profile
                  </Link>
                  <Link to="/orders" className="dropdown-item">
                    📦 My Orders
                  </Link>
                  {isAdmin() && (
                    <Link to="/admin" className="dropdown-item admin-item">
                      ⚙️ Admin Panel
                    </Link>
                  )}
                  <hr className="dropdown-divider" />
                  <button onClick={handleLogout} className="dropdown-item logout-item">
                    🚪 Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-button mobile-only"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          {/* Search Bar - Mobile */}
          <div className="mobile-search">
            <SearchBar onSearch={closeMobileMenu} />
          </div>

          {/* Navigation - Mobile */}
          <nav className="mobile-nav">
            <Link 
              to="/" 
              className={`mobile-nav-link ${isActiveRoute('/') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              🏠 Home
            </Link>
            <Link 
              to="/products" 
              className={`mobile-nav-link ${isActiveRoute('/products') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              📦 Products
            </Link>

            {isAuthenticated ? (
              <>
                <Link 
                  to="/profile" 
                  className={`mobile-nav-link ${isActiveRoute('/profile') ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  👤 Profile
                </Link>
                <Link 
                  to="/orders" 
                  className={`mobile-nav-link ${isActiveRoute('/orders') ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  📦 My Orders
                </Link>
                {isAdmin() && (
                  <Link 
                    to="/admin" 
                    className={`mobile-nav-link admin-link ${isActiveRoute('/admin') ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    ⚙️ Admin Panel
                  </Link>
                )}
                <button 
                  onClick={handleLogout} 
                  className="mobile-nav-link logout-link"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <div className="mobile-auth-buttons">
                <Link 
                  to="/login" 
                  className="btn btn-outline"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary"
                  onClick={closeMobileMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}
    </header>
  );
};

export default Header;