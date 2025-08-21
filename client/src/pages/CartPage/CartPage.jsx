// src/pages/CartPage/CartPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import CartItem from '../../components/cart/CartItem/CartItem';
import CartSummary from '../../components/cart/CartSummary/CartSummary';
import './CartPage.css';

const CartPage = () => {
  const { items, totalAmount, totalItems, loading, error } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="auth-required">
            <h2>Please Login</h2>
            <p>You need to be logged in to view your cart.</p>
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="error-container">
            <h2>Error Loading Cart</h2>
            <p>{error}</p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <p>{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
        </div>

        {items.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-content">
              <div className="empty-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p>Start shopping to add items to your cart</p>
              <Link to="/products" className="btn btn-primary btn-large">
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-section">
              <div className="cart-items-header">
                <h3>Items in your cart</h3>
              </div>
              <div className="cart-items-list">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            <div className="cart-sidebar">
              <CartSummary
                totalAmount={totalAmount}
                totalItems={totalItems}
                items={items}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;