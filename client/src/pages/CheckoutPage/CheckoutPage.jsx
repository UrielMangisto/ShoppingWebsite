import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { orderService } from '../../services/OrderService';
import CartSummary from '../../components/cart/CartSummary/CartSummary';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [formData, setFormData] = useState({
    shippingAddress: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const order = await orderService.createOrder({
        ...formData,
        items: cart.items
      });
      await clearCart();
      navigate(`/orders/${order._id}`);
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-form-container">
          <h1>Checkout</h1>
          <form onSubmit={handleSubmit}>
            <h2>Shipping Information</h2>
            <div className="form-group">
              <label>Shipping Address</label>
              <input
                type="text"
                value={formData.shippingAddress}
                onChange={(e) => setFormData({...formData, shippingAddress: e.target.value})}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>ZIP Code</label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                  required
                />
              </div>
            </div>

            <h2>Payment Information</h2>
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                value={formData.cardNumber}
                onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={formData.cardExpiry}
                  onChange={(e) => setFormData({...formData, cardExpiry: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input
                  type="text"
                  value={formData.cardCvv}
                  onChange={(e) => setFormData({...formData, cardCvv: e.target.value})}
                  required
                />
              </div>
            </div>

            <button type="submit" className="checkout-button">
              Place Order
            </button>
          </form>
        </div>
        
        <div className="order-summary">
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;