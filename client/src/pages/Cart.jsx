import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productService } from '../services/productService';
import Loading from '../components/common/Loading';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { 
    items, 
    total, 
    totalItems, 
    isLoading, 
    error, 
    updateCartItem, 
    removeFromCart, 
    clearError 
  } = useCart();

  const [updatingItems, setUpdatingItems] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    setUpdatingItems(prev => ({ ...prev, [itemId]: true }));
    
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (err) {
      console.error('Error updating cart item:', err);
    } finally {
      setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveItem = async (itemId) => {
    setUpdatingItems(prev => ({ ...prev, [itemId]: true }));
    
    try {
      await removeFromCart(itemId);
    } catch (err) {
      console.error('Error removing cart item:', err);
    } finally {
      setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getImageUrl = (imageName) => {
    if (!imageName) {
      return '/placeholder-image.jpg';
    }
    return productService.getImageUrl(imageName);
  };

  const calculateItemTotal = (price, quantity) => {
    return price * quantity;
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (isLoading) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-loading">
            <Loading size="large" text="Loading your cart..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        {/* Page Header */}
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <p className="cart-subtitle">
            {totalItems === 0 ? (
              'Your cart is empty'
            ) : (
              `${totalItems} ${totalItems === 1 ? 'item' : 'items'} in your cart`
            )}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button onClick={clearError} className="error-close">✕</button>
          </div>
        )}

        {items.length === 0 ? (
          /* Empty Cart */
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2 className="empty-cart-title">Your cart is empty</h2>
            <p className="empty-cart-description">
              Looks like you haven't added anything to your cart yet. 
              Start shopping to fill it up!
            </p>
            <div className="empty-cart-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                <span className="btn-icon">🛍️</span>
                Start Shopping
              </Link>
              <Link to="/" className="btn btn-outline btn-lg">
                <span className="btn-icon">🏠</span>
                Go Home
              </Link>
            </div>
          </div>
        ) : (
          /* Cart with Items */
          <div className="cart-content">
            <div className="cart-main">
              {/* Cart Items */}
              <div className="cart-items">
                <div className="cart-items-header">
                  <h3>Items in your cart</h3>
                </div>
                
                <div className="cart-items-list">
                  {items.map((item) => (
                    <div key={item.id} className="cart-item">
                      {/* Product Image */}
                      <div className="cart-item-image">
                        <Link to={`/products/${item.product_id || item.id}`}>
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            onError={(e) => {
                              e.target.src = '/placeholder-image.jpg';
                            }}
                          />
                        </Link>
                      </div>

                      {/* Product Info */}
                      <div className="cart-item-info">
                        <Link 
                          to={`/products/${item.product_id || item.id}`}
                          className="cart-item-name"
                        >
                          {item.name}
                        </Link>
                        <div className="cart-item-price">
                          {formatPrice(item.price)}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="cart-item-quantity">
                        <label htmlFor={`quantity-${item.id}`} className="sr-only">
                          Quantity for {item.name}
                        </label>
                        <div className="quantity-controls">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={updatingItems[item.id] || item.quantity <= 1}
                            className="quantity-btn"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <input
                            id={`quantity-${item.id}`}
                            type="number"
                            min="1"
                            max="99"
                            value={item.quantity}
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value) || 1;
                              if (newQuantity !== item.quantity) {
                                handleQuantityChange(item.id, newQuantity);
                              }
                            }}
                            disabled={updatingItems[item.id]}
                            className="quantity-input"
                          />
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={updatingItems[item.id]}
                            className="quantity-btn"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="cart-item-total">
                        {formatPrice(calculateItemTotal(item.price, item.quantity))}
                      </div>

                      {/* Remove Button */}
                      <div className="cart-item-actions">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={updatingItems[item.id]}
                          className="remove-item-btn"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          {updatingItems[item.id] ? (
                            <Loading size="small" />
                          ) : (
                            '🗑️'
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="continue-shopping">
                <Link to="/products" className="btn btn-outline">
                  <span className="btn-icon">←</span>
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="cart-sidebar">
              <div className="cart-summary">
                <h3 className="summary-title">Order Summary</h3>
                
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Items ({totalItems}):</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span className="free-shipping">Free</span>
                  </div>
                  
                  <div className="summary-row">
                    <span>Tax:</span>
                    <span>Calculated at checkout</span>
                  </div>
                  
                  <div className="summary-divider"></div>
                  
                  <div className="summary-row total-row">
                    <span>Total:</span>
                    <span className="total-amount">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="checkout-actions">
                  <button
                    onClick={handleProceedToCheckout}
                    className="checkout-btn"
                    disabled={items.length === 0}
                  >
                    <span className="btn-icon">🔒</span>
                    Proceed to Checkout
                  </button>
                  
                  <div className="secure-checkout">
                    <span className="secure-icon">🔒</span>
                    <span>Secure checkout guaranteed</span>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="shipping-info">
                  <h4>Free Shipping</h4>
                  <p>
                    🚚 Free shipping on all orders over $50. 
                    Your order qualifies for free shipping!
                  </p>
                </div>

                {/* Trust Badges */}
                <div className="trust-badges">
                  <div className="trust-badge">
                    <span className="trust-icon">🔒</span>
                    <span>Secure Payment</span>
                  </div>
                  <div className="trust-badge">
                    <span className="trust-icon">↩️</span>
                    <span>Easy Returns</span>
                  </div>
                  <div className="trust-badge">
                    <span className="trust-icon">📞</span>
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recently Viewed (Future Enhancement) */}
        {items.length > 0 && (
          <div className="recently-viewed">
            <h3>You might also like</h3>
            <div className="recently-viewed-placeholder">
              <p>Recommended products will appear here 🌟</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;