// src/components/common/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          🛍️ חנות אונליין
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-links hidden-mobile">
          <Link 
            to="/" 
            className={`nav-link ${isActivePath('/') ? 'active' : ''}`}
          >
            בית
          </Link>
          <Link 
            to="/products" 
            className={`nav-link ${isActivePath('/products') ? 'active' : ''}`}
          >
            מוצרים
          </Link>
          {isAuthenticated && isAdmin() && (
            <Link 
              to="/admin" 
              className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
            >
              ניהול
            </Link>
          )}
        </nav>

        {/* Search Bar */}
        <div className="search-container">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="חיפוש מוצרים..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              🔍
            </button>
          </form>
        </div>

        {/* User Menu */}
        <div className="user-menu">
          {/* Cart */}
          {isAuthenticated && (
            <Link to="/cart" className="cart-button">
              🛒
              {itemCount > 0 && (
                <span className="cart-badge">{itemCount}</span>
              )}
            </Link>
          )}

          {/* User Actions */}
          {isAuthenticated ? (
            <div className="dropdown">
              <button
                className="user-avatar"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                {getInitials(user?.name)}
              </button>
              
              {isUserMenuOpen && (
                <div className="dropdown-menu">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  
                  <Link 
                    to="/profile" 
                    className="dropdown-item"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    👤 פרופיל
                  </Link>
                  
                  <Link 
                    to="/orders" 
                    className="dropdown-item"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    📦 ההזמנות שלי
                  </Link>

                  {isAdmin() && (
                    <>
                      <div className="dropdown-divider"></div>
                      <Link 
                        to="/admin" 
                        className="dropdown-item"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        ⚙️ ניהול
                      </Link>
                    </>
                  )}
                  
                  <div className="dropdown-divider"></div>
                  
                  <button 
                    onClick={handleLogout}
                    className="dropdown-item text-error-600"
                  >
                    🚪 התנתק
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn btn-outline btn-sm">
                התחבר
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                הירשם
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-button"
            onClick={toggleMobileMenu}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu open">
            <nav className="mobile-nav-links">
              <Link 
                to="/" 
                className={isActivePath('/') ? 'active' : ''}
                onClick={closeMobileMenu}
              >
                🏠 בית
              </Link>
              
              <Link 
                to="/products" 
                className={isActivePath('/products') ? 'active' : ''}
                onClick={closeMobileMenu}
              >
                🛍️ מוצרים
              </Link>

              {isAuthenticated && (
                <>
                  <Link 
                    to="/cart" 
                    className={isActivePath('/cart') ? 'active' : ''}
                    onClick={closeMobileMenu}
                  >
                    🛒 עגלה {itemCount > 0 && `(${itemCount})`}
                  </Link>
                  
                  <Link 
                    to="/profile" 
                    className={isActivePath('/profile') ? 'active' : ''}
                    onClick={closeMobileMenu}
                  >
                    👤 פרופיל
                  </Link>
                  
                  <Link 
                    to="/orders" 
                    className={isActivePath('/orders') ? 'active' : ''}
                    onClick={closeMobileMenu}
                  >
                    📦 ההזמנות שלי
                  </Link>

                  {isAdmin() && (
                    <Link 
                      to="/admin" 
                      className={location.pathname.startsWith('/admin') ? 'active' : ''}
                      onClick={closeMobileMenu}
                    >
                      ⚙️ ניהול
                    </Link>
                  )}

                  <div className="border-t border-gray-200 my-2"></div>
                  
                  <button 
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className="w-full text-right px-4 py-2 text-error-600 hover:bg-error-50"
                  >
                    🚪 התנתק
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <>
                  <Link 
                    to="/login" 
                    className={isActivePath('/login') ? 'active' : ''}
                    onClick={closeMobileMenu}
                  >
                    🔑 התחבר
                  </Link>
                  
                  <Link 
                    to="/register" 
                    className={isActivePath('/register') ? 'active' : ''}
                    onClick={closeMobileMenu}
                  >
                    📝 הירשם
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Click outside to close menus */}
      {(isUserMenuOpen || isMenuOpen) && (
        <div 
          className="fixed inset-0 z-10"
          onClick={() => {
            setIsUserMenuOpen(false);
            setIsMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;