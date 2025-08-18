import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/OrderService';
import { productService } from '../services/productService';
import { validateEmail, validateName, validatePhone, validateAddress, validateCreditCard, validateExpiryDate, validateCVV } from '../utils/validation';
import { formatPrice } from '../utils/formatters';
import Loading from '../components/common/Loading';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { items, total, totalItems, clearCart } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    if (items.length === 0 && !orderComplete) {
      navigate('/cart');
    }
  }, [isAuthenticated, items, navigate, orderComplete]);

  // Calculate totals
  const subtotal = total;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const finalTotal = subtotal + shipping + tax;

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Format card number
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length >= 2) {
        formattedValue = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
      } else {
        formattedValue = cleaned;
      }
    }
    
    // Format CVV
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setPaymentInfo(prev => ({ ...prev, [name]: formattedValue }));
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateShippingForm = () => {
    const errors = {};
    
    const firstNameValidation = validateName(shippingInfo.firstName);
    if (!firstNameValidation.isValid) errors.firstName = firstNameValidation.message;
    
    const lastNameValidation = validateName(shippingInfo.lastName);
    if (!lastNameValidation.isValid) errors.lastName = lastNameValidation.message;
    
    const emailValidation = validateEmail(shippingInfo.email);
    if (!emailValidation.isValid) errors.email = emailValidation.message;
    
    const phoneValidation = validatePhone(shippingInfo.phone);
    if (!phoneValidation.isValid) errors.phone = phoneValidation.message;
    
    const addressValidation = validateAddress(shippingInfo.address);
    if (!addressValidation.isValid) errors.address = addressValidation.message;
    
    if (!shippingInfo.city.trim()) errors.city = 'City is required';
    if (!shippingInfo.postalCode.trim()) errors.postalCode = 'Postal code is required';
    
    return errors;
  };

  const validatePaymentForm = () => {
    const errors = {};
    
    const cardValidation = validateCreditCard(paymentInfo.cardNumber);
    if (!cardValidation.isValid) errors.cardNumber = cardValidation.message;
    
    const expiryValidation = validateExpiryDate(paymentInfo.expiryDate);
    if (!expiryValidation.isValid) errors.expiryDate = expiryValidation.message;
    
    const cvvValidation = validateCVV(paymentInfo.cvv);
    if (!cvvValidation.isValid) errors.cvv = cvvValidation.message;
    
    const nameValidation = validateName(paymentInfo.cardholderName);
    if (!nameValidation.isValid) errors.cardholderName = nameValidation.message;
    
    return errors;
  };

  const handleStepNavigation = (step) => {
    setError(null);
    
    if (step === 2) {
      // Validate shipping before going to payment
      const shippingErrors = validateShippingForm();
      if (Object.keys(shippingErrors).length > 0) {
        setFormErrors(shippingErrors);
        return;
      }
    }
    
    if (step === 3) {
      // Validate payment before going to review
      const paymentErrors = validatePaymentForm();
      if (Object.keys(paymentErrors).length > 0) {
        setFormErrors(paymentErrors);
        return;
      }
    }
    
    setFormErrors({});
    setCurrentStep(step);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Final validation
      const shippingErrors = validateShippingForm();
      const paymentErrors = validatePaymentForm();
      const allErrors = { ...shippingErrors, ...paymentErrors };
      
      if (Object.keys(allErrors).length > 0) {
        setFormErrors(allErrors);
        return;
      }
      
      // Create order
      const orderData = {
        shippingInfo,
        paymentInfo: {
          // Don't send actual payment info to backend in real app
          cardLast4: paymentInfo.cardNumber.slice(-4),
          cardType: getCardType(paymentInfo.cardNumber)
        },
        totals: {
          subtotal,
          shipping,
          tax,
          total: finalTotal
        }
      };
      
      const response = await orderService.createOrder(orderData);
      
      if (response.data.orderId) {
        setOrderId(response.data.orderId);
        setOrderComplete(true);
        clearCart();
        
        // Redirect to success page after a short delay
        setTimeout(() => {
          navigate(`/orders/${response.data.orderId}`, { 
            state: { orderComplete: true } 
          });
        }, 3000);
      }
      
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getCardType = (cardNumber) => {
    const cleaned = cardNumber.replace(/\D/g, '');
    if (/^4/.test(cleaned)) return 'Visa';
    if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
    if (/^3[47]/.test(cleaned)) return 'American Express';
    return 'Unknown';
  };

  const getImageUrl = (imageName) => {
    if (!imageName) return '/placeholder-image.jpg';
    return productService.getImageUrl(imageName);
  };

  if (!isAuthenticated || (items.length === 0 && !orderComplete)) {
    return null;
  }

  if (orderComplete) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="order-success">
            <div className="success-icon">✅</div>
            <h1>Order Placed Successfully!</h1>
            <p>Thank you for your purchase. Your order #{orderId} has been confirmed.</p>
            <p>You will receive an email confirmation shortly.</p>
            <div className="success-actions">
              <button 
                onClick={() => navigate('/orders')}
                className="btn btn-primary"
              >
                View Order Details
              </button>
              <button 
                onClick={() => navigate('/products')}
                className="btn btn-outline"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <div className="step-indicator">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Shipping</span>
            </div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Payment</span>
            </div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-label">Review</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        <div className="checkout-content">
          <div className="checkout-main">
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <div className="checkout-step">
                <h2>Shipping Information</h2>
                <form className="checkout-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={shippingInfo.firstName}
                        onChange={handleShippingChange}
                        className={formErrors.firstName ? 'error' : ''}
                      />
                      {formErrors.firstName && (
                        <span className="field-error">{formErrors.firstName}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={shippingInfo.lastName}
                        onChange={handleShippingChange}
                        className={formErrors.lastName ? 'error' : ''}
                      />
                      {formErrors.lastName && (
                        <span className="field-error">{formErrors.lastName}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleShippingChange}
                      className={formErrors.email ? 'error' : ''}
                    />
                    {formErrors.email && (
                      <span className="field-error">{formErrors.email}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      className={formErrors.phone ? 'error' : ''}
                    />
                    {formErrors.phone && (
                      <span className="field-error">{formErrors.phone}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Street Address</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      className={formErrors.address ? 'error' : ''}
                    />
                    {formErrors.address && (
                      <span className="field-error">{formErrors.address}</span>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        className={formErrors.city ? 'error' : ''}
                      />
                      {formErrors.city && (
                        <span className="field-error">{formErrors.city}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="postalCode">Postal Code</label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={handleShippingChange}
                        className={formErrors.postalCode ? 'error' : ''}
                      />
                      {formErrors.postalCode && (
                        <span className="field-error">{formErrors.postalCode}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <select
                      id="country"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingChange}
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="France">France</option>
                      <option value="Germany">Germany</option>
                    </select>
                  </div>
                </form>

                <div className="step-actions">
                  <button 
                    onClick={() => handleStepNavigation(2)}
                    className="btn btn-primary"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment Information */}
            {currentStep === 2 && (
              <div className="checkout-step">
                <h2>Payment Information</h2>
                <form className="checkout-form">
                  <div className="form-group">
                    <label htmlFor="cardholderName">Cardholder Name</label>
                    <input
                      type="text"
                      id="cardholderName"
                      name="cardholderName"
                      value={paymentInfo.cardholderName}
                      onChange={handlePaymentChange}
                      className={formErrors.cardholderName ? 'error' : ''}
                    />
                    {formErrors.cardholderName && (
                      <span className="field-error">{formErrors.cardholderName}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={handlePaymentChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className={formErrors.cardNumber ? 'error' : ''}
                    />
                    {formErrors.cardNumber && (
                      <span className="field-error">{formErrors.cardNumber}</span>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="expiryDate">Expiry Date</label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={paymentInfo.expiryDate}
                        onChange={handlePaymentChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        className={formErrors.expiryDate ? 'error' : ''}
                      />
                      {formErrors.expiryDate && (
                        <span className="field-error">{formErrors.expiryDate}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="cvv">CVV</label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={paymentInfo.cvv}
                        onChange={handlePaymentChange}
                        placeholder="123"
                        maxLength="4"
                        className={formErrors.cvv ? 'error' : ''}
                      />
                      {formErrors.cvv && (
                        <span className="field-error">{formErrors.cvv}</span>
                      )}
                    </div>
                  </div>
                </form>

                <div className="step-actions">
                  <button 
                    onClick={() => setCurrentStep(1)}
                    className="btn btn-outline"
                  >
                    Back to Shipping
                  </button>
                  <button 
                    onClick={() => handleStepNavigation(3)}
                    className="btn btn-primary"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Order Review */}
            {currentStep === 3 && (
              <div className="checkout-step">
                <h2>Review Your Order</h2>
                
                {/* Order Items */}
                <div className="order-review">
                  <h3>Order Items</h3>
                  <div className="review-items">
                    {items.map((item) => (
                      <div key={item.id} className="review-item">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="review-item-image"
                        />
                        <div className="review-item-info">
                          <h4>{item.name}</h4>
                          <p>Quantity: {item.quantity}</p>
                          <p>Price: {formatPrice(item.price)}</p>
                        </div>
                        <div className="review-item-total">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Information Review */}
                <div className="review-section">
                  <h3>Shipping Information</h3>
                  <div className="review-info">
                    <p><strong>Name:</strong> {shippingInfo.firstName} {shippingInfo.lastName}</p>
                    <p><strong>Email:</strong> {shippingInfo.email}</p>
                    <p><strong>Phone:</strong> {shippingInfo.phone}</p>
                    <p><strong>Address:</strong> {shippingInfo.address}</p>
                    <p><strong>City:</strong> {shippingInfo.city}, {shippingInfo.postalCode}</p>
                    <p><strong>Country:</strong> {shippingInfo.country}</p>
                  </div>
                  <button 
                    onClick={() => setCurrentStep(1)}
                    className="btn btn-outline btn-sm"
                  >
                    Edit Shipping
                  </button>
                </div>

                {/* Payment Information Review */}
                <div className="review-section">
                  <h3>Payment Information</h3>
                  <div className="review-info">
                    <p><strong>Cardholder:</strong> {paymentInfo.cardholderName}</p>
                    <p><strong>Card:</strong> **** **** **** {paymentInfo.cardNumber.slice(-4)} ({getCardType(paymentInfo.cardNumber)})</p>
                    <p><strong>Expires:</strong> {paymentInfo.expiryDate}</p>
                  </div>
                  <button 
                    onClick={() => setCurrentStep(2)}
                    className="btn btn-outline btn-sm"
                  >
                    Edit Payment
                  </button>
                </div>

                <div className="step-actions">
                  <button 
                    onClick={() => setCurrentStep(2)}
                    className="btn btn-outline"
                  >
                    Back to Payment
                  </button>
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="btn btn-primary place-order-btn"
                  >
                    {isProcessing ? (
                      <>
                        <Loading size="small" color="white" />
                        Processing Order...
                      </>
                    ) : (
                      <>
                        <span className="btn-icon">🔒</span>
                        Place Order {formatPrice(finalTotal)}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="checkout-sidebar">
            <div className="order-summary">
              <h3>Order Summary</h3>
              
              <div className="summary-items">
                {items.map((item) => (
                  <div key={item.id} className="summary-item">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="summary-item-image"
                    />
                    <div className="summary-item-info">
                      <span className="summary-item-name">{item.name}</span>
                      <span className="summary-item-quantity">Qty: {item.quantity}</span>
                    </div>
                    <span className="summary-item-price">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal ({totalItems} items):</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span className={shipping === 0 ? 'free-shipping' : ''}>
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-row total-row">
                  <span>Total:</span>
                  <span className="total-amount">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {shipping === 0 && (
                <div className="free-shipping-notice">
                  <span className="shipping-icon">🚚</span>
                  <span>You qualify for free shipping!</span>
                </div>
              )}

              <div className="security-notice">
                <span className="security-icon">🔒</span>
                <span>Your payment information is secure and encrypted</span>
              </div>

              <div className="accepted-cards">
                <h4>We Accept</h4>
                <div className="card-icons">
                  <span className="card-icon">💳</span>
                  <span className="card-icon">💳</span>
                  <span className="card-icon">💳</span>
                  <span className="card-icon">💳</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;