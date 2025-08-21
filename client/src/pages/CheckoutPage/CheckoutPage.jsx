// src/pages/CheckoutPage/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, totalAmount, totalItems, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    }
  }, [isAuthenticated, navigate]);

  // Redirect if cart is empty
  useEffect(() => {
    if (isAuthenticated && items.length === 0) {
      navigate('/cart');
    }
  }, [isAuthenticated, items.length, navigate]);

  // Handle shipping info changes
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calculate costs
  const shippingCost = totalAmount >= 50 ? 0 : 5.99;
  const tax = totalAmount * 0.1; // 10% tax
  const finalTotal = totalAmount + shippingCost + tax;

  // Handle order submission
  const handlePlaceOrder = async () => {
    if (!validateShippingInfo()) {
      return;
    }

    setIsProcessing(true);
    setOrderError(null);

    try {
      // Create order with shipping information
      const orderData = {
        shipping: shippingInfo,
        totalAmount: finalTotal
      };

      const response = await orderService.createOrder(orderData);
      
      // Clear cart after successful order
      clearCart();
      
      // Redirect to order confirmation or profile
      navigate('/profile', { 
        state: { 
          message: `Order #${response.orderId} placed successfully!`,
          type: 'success'
        }
      });
    } catch (error) {
      setOrderError(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Validate shipping information
  const validateShippingInfo = () => {
    const required = ['fullName', 'email', 'address', 'city', 'postalCode', 'country'];
    for (const field of required) {
      if (!shippingInfo[field].trim()) {
        setOrderError(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      setOrderError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  // Don't render anything while redirecting
  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Review your order and complete your purchase</p>
        </div>

        <div className="checkout-content">
          {/* Main Content */}
          <div className="checkout-main">
            {/* Order Summary */}
            <div className="checkout-section">
              <h3>Order Summary</h3>
              <div className="order-items">
                {items.map((item) => (
                  <div key={item.id} className="checkout-item">
                    <div className="item-image">
                      {item.product.imageUrl ? (
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className="no-image" 
                        style={{ display: item.product.imageUrl ? 'none' : 'flex' }}
                      >
                        📦
                      </div>
                    </div>
                    <div className="item-details">
                      <h4>{item.product.name}</h4>
                      <p className="item-quantity">Quantity: {item.quantity}</p>
                      <p className="item-unit-price">${item.product.price.toFixed(2)} each</p>
                    </div>
                    <div className="item-price">
                      ${item.subtotal.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="checkout-section">
              <h3>Shipping Information</h3>
              <div className="shipping-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name *</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleShippingChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleShippingChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Street Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    placeholder="Enter your street address"
                    required
                  />
                </div>

                <div className="form-row three-columns">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      placeholder="Enter your city"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="postalCode">Postal Code *</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={shippingInfo.postalCode}
                      onChange={handleShippingChange}
                      placeholder="Enter postal code"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">Country *</label>
                    <select
                      id="country"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingChange}
                      required
                    >
                      <option value="">Select country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="IT">Italy</option>
                      <option value="ES">Spain</option>
                      <option value="NL">Netherlands</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="checkout-section">
              <h3>Payment Information</h3>
              <div className="payment-demo">
                <div className="demo-notice">
                  <div className="demo-icon">💳</div>
                  <div className="demo-content">
                    <h4>Demo Mode</h4>
                    <p>This is a demonstration checkout. No actual payment will be processed.</p>
                    <p>In a real implementation, this would include:</p>
                    <ul>
                      <li>Credit card form</li>
                      <li>Payment processing (Stripe, PayPal, etc.)</li>
                      <li>Security verification</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Total Sidebar */}
          <div className="checkout-sidebar">
            <div className="order-total">
              <h3>Order Total</h3>
              
              <div className="total-breakdown">
                <div className="total-row">
                  <span>Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                
                <div className="total-row">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'FREE' : `${shippingCost.toFixed(2)}`}</span>
                </div>
                
                <div className="total-row">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <div className="total-divider"></div>
                
                <div className="total-row final-total">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {totalAmount < 50 && (
                <div className="shipping-notice">
                  <p>💡 Add ${(50 - totalAmount).toFixed(2)} more for free shipping!</p>
                </div>
              )}

              {orderError && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {orderError}
                </div>
              )}

              <div className="checkout-actions">
                <button 
                  className="btn btn-primary btn-full btn-large" 
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="button-spinner"></div>
                      Processing Order...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
                
                <Link to="/cart" className="btn btn-secondary btn-full">
                  Back to Cart
                </Link>
              </div>

              <div className="security-note">
                <div className="security-icon">🔒</div>
                <p>Your information is secure and encrypted</p>
              </div>

              <div className="accepted-payments">
                <h4>We Accept</h4>
                <div className="payment-icons">
                  <span>💳</span>
                  <span>🅿️</span>
                  <span>🍎</span>
                  <span>📱</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;