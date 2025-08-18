import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ButtonSpinner } from '../common/Loading';
import './CartSummary.css';

const CartSummary = ({ showCheckoutButton = true, className = '' }) => {
  const navigate = useNavigate();
  const { items, total, totalItems, clearCart, isLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // Calculate various totals
  const subtotal = total || 0;
  const shippingCost = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const taxRate = 0.08; // 8% tax
  const taxAmount = subtotal * taxRate;
  const finalTotal = subtotal + shippingCost + taxAmount - promoDiscount;

  // Handle promo code application
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    setIsApplyingPromo(true);
    setPromoError('');

    try {
      // Simulate promo code validation (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock promo code logic
      const validPromoCodes = {
        'SAVE10': 10, // $10 off
        'SAVE20': 20, // $20 off
        'WELCOME15': subtotal * 0.15, // 15% off
        'FREESHIP': shippingCost // Free shipping
      };

      const discount = validPromoCodes[promoCode.toUpperCase()];
      
      if (discount) {
        setPromoDiscount(Math.min(discount, subtotal)); // Don't exceed subtotal
        setPromoError('');
      } else {
        setPromoError('Invalid promo code');
        setPromoDiscount(0);
      }
    } catch (error) {
      setPromoError('Failed to apply promo code');
      setPromoDiscount(0);
    } finally {
      setIsApplyingPromo(false);
    }
  };

  // Handle remove promo code
  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoDiscount(0);
    setPromoError('');
  };

  // Handle checkout
  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Redirect to login with return path
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    
    navigate('/checkout');
  };

  // Handle clear cart
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart? This action cannot be undone.')) {
      clearCart();
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Check if cart has items
  const hasItems = items && items.length > 0;

  // Check if any items are out of stock
  const hasOutOfStockItems = items?.some(item => item.product?.stock === 0);

  return (
    <div className={`cart-summary ${className}`}>
      <div className="cart-summary-header">
        <h2 className="summary-title">Order Summary</h2>
        {hasItems && (
          <span className="item-count">
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>

      {hasItems ? (
        <>
          {/* Summary Details */}
          <div className="summary-details">
            <div className="summary-line">
              <span className="label">Subtotal:</span>
              <span className="value">{formatPrice(subtotal)}</span>
            </div>

            <div className="summary-line">
              <span className="label">
                Shipping:
                {shippingCost === 0 && (
                  <small className="free-shipping">FREE</small>
                )}
              </span>
              <span className="value">
                {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
              </span>
            </div>

            <div className="summary-line">
              <span className="label">Tax:</span>
              <span className="value">{formatPrice(taxAmount)}</span>
            </div>

            {promoDiscount > 0 && (
              <div className="summary-line discount">
                <span className="label">
                  Discount:
                  <button
                    onClick={handleRemovePromo}
                    className="remove-promo-btn"
                    aria-label="Remove promo code"
                  >
                    
                  </button>
                </span>
                <span className="value">-{formatPrice(promoDiscount)}</span>
              </div>
            )}

            <div className="summary-divider"></div>

            <div className="summary-line total">
              <span className="label">Total:</span>
              <span className="value">{formatPrice(finalTotal)}</span>
            </div>
          </div>

          {/* Promo Code Section */}
          <div className="promo-code-section">
            <div className="promo-input-group">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code"
                className={`promo-input ${promoError ? 'error' : ''}`}
                disabled={isApplyingPromo || promoDiscount > 0}
              />
              {promoDiscount === 0 ? (
                <button
                  onClick={handleApplyPromo}
                  disabled={isApplyingPromo || !promoCode.trim()}
                  className="apply-promo-btn"
                >
                  {isApplyingPromo ? <ButtonSpinner size="small" /> : 'Apply'}
                </button>
              ) : (
                <span className="promo-success"> Applied</span>
              )}
            </div>
            
            {promoError && (
              <div className="promo-error">{promoError}</div>
            )}
            
            {promoDiscount > 0 && (
              <div className="promo-success-message">
                Promo code "{promoCode.toUpperCase()}" applied! You saved {formatPrice(promoDiscount)}
              </div>
            )}
          </div>

          {/* Free Shipping Notice */}
          {shippingCost > 0 && (
            <div className="shipping-notice">
              <span className="shipping-icon">=ö</span>
              <span>
                Add {formatPrice(50 - subtotal)} more for free shipping!
              </span>
            </div>
          )}

          {/* Out of Stock Warning */}
          {hasOutOfStockItems && (
            <div className="stock-warning">
              <span className="warning-icon">†</span>
              <span>Some items in your cart are out of stock</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="summary-actions">
            {showCheckoutButton && (
              <button
                onClick={handleCheckout}
                disabled={isLoading || hasOutOfStockItems}
                className="checkout-btn btn btn-primary btn-full"
              >
                {isLoading ? (
                  <>
                    <ButtonSpinner size="small" />
                    Processing...
                  </>
                ) : !isAuthenticated ? (
                  'Sign In to Checkout'
                ) : (
                  `Checkout " ${formatPrice(finalTotal)}`
                )}
              </button>
            )}

            <div className="secondary-actions">
              <Link to="/products" className="continue-shopping-btn">
                ê Continue Shopping
              </Link>
              
              <button
                onClick={handleClearCart}
                className="clear-cart-btn"
                disabled={isLoading}
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="security-notice">
            <div className="security-icons">
              <span>=</span>
              <span>=·</span>
              <span></span>
            </div>
            <p>Your payment information is secure and encrypted</p>
          </div>

          {/* Sample Promo Codes (for development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="sample-promo-codes">
              <details>
                <summary>Sample Promo Codes (Dev Only)</summary>
                <ul>
                  <li><code>SAVE10</code> - $10 off</li>
                  <li><code>SAVE20</code> - $20 off</li>
                  <li><code>WELCOME15</code> - 15% off</li>
                  <li><code>FREESHIP</code> - Free shipping</li>
                </ul>
              </details>
            </div>
          )}
        </>
      ) : (
        /* Empty Cart */
        <div className="empty-cart-summary">
          <div className="empty-icon">=“</div>
          <h3>Your cart is empty</h3>
          <p>Add some items to get started!</p>
          <Link to="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartSummary;