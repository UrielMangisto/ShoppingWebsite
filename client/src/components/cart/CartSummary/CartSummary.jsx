// src/components/cart/CartSummary/CartSummary.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './CartSummary.css';

const CartSummary = ({ totalAmount, totalItems, items }) => {
  const shippingCost = totalAmount >= 50 ? 0 : 5.99;
  const finalTotal = totalAmount + shippingCost;

  return (
    <div className="cart-summary">
      <div className="summary-header">
        <h3>Order Summary</h3>
      </div>

      <div className="summary-details">
        <div className="summary-row">
          <span>Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>

        <div className="summary-row">
          <span>Shipping</span>
          <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
        </div>

        {shippingCost > 0 && (
          <div className="shipping-note">
            💡 Add ${(50 - totalAmount).toFixed(2)} more for free shipping!
          </div>
        )}

        <div className="summary-divider"></div>

        <div className="summary-row total-row">
          <span>Total</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="summary-actions">
        <Link to="/checkout" className="btn btn-primary btn-full">
          Proceed to Checkout
        </Link>
        <Link to="/products" className="btn btn-secondary btn-full">
          Continue Shopping
        </Link>
      </div>

      <div className="summary-features">
        <div className="feature">
          <span className="feature-icon">🔒</span>
          <span>Secure Checkout</span>
        </div>
        <div className="feature">
          <span className="feature-icon">🚚</span>
          <span>Fast Delivery</span>
        </div>
        <div className="feature">
          <span className="feature-icon">↩️</span>
          <span>Easy Returns</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;