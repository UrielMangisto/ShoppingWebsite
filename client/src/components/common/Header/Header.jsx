import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { useCart } from '../../../hooks/useCart'
import './Header.css'

const Header = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="header-logo">
            <h1>E-Store</h1>
          </Link>

          {/* Navigation */}
          <nav className="header-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/products" className="nav-link">Products</Link>
          </nav>

          {/* Right side actions */}
          <div className="header-actions">
            {isAuthenticated ? (
              <>
                {/* Cart Icon */}
                <Link to="/cart" className="cart-link">
                  <span className="cart-icon">🛒</span>
                  {totalItems > 0 && (
                    <span className="cart-badge">{totalItems}</span>
                  )}
                </Link>

                {/* User Menu */}
                <div className="user-menu">
                  <span className="user-greeting">
                    Hi, {user?.name || user?.email}
                  </span>
                  
                  <div className="user-dropdown">
                    <Link to="/orders" className="dropdown-link">My Orders</Link>
                    
                    {isAdmin() && (
                      <Link to="/admin" className="dropdown-link admin-link">
                        Admin Panel
                      </Link>
                    )}
                    
                    <button 
                      onClick={handleLogout} 
                      className="dropdown-link logout-btn"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Login/Register for non-authenticated users */}
                <Link to="/login" className="auth-link">Login</Link>
                <Link to="/register" className="auth-link register">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header