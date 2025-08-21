import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import './CartSummary.css';

const CartSummary = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  const subtotal = cart?.items?.reduce(
    (sum, item) => sum + item.quantity * item.product.price, 
    0
  ) || 0;

  const tax = subtotal * 0.17; // 17% VAT
  const total = subtotal + tax;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-summary">
      <h2>Order Summary</h2>
      <div className="summary-row">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="summary-row">
        <span>Tax (17%)</span>
        <span>${tax.toFixed(2)}</span>
      </div>
      <div className="summary-row total">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <button 
        className="checkout-button"
        onClick={handleCheckout}
        disabled={!cart?.items?.length}
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;