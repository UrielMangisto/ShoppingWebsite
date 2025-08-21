import CartItem from '../../components/cart/CartItem/CartItem';
import CartSummary from '../../components/cart/CartSummary/CartSummary';
import { useCart } from '../../hooks/useCart';
import './CartPage.css';

const CartPage = () => {
  const { cart, loading, error } = useCart();

  if (loading) return <div className="loading">Loading cart...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!cart?.items?.length) {
    return <div className="empty-cart">Your cart is empty</div>;
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      <div className="cart-container">
        <div className="cart-items">
          {cart.items.map(item => (
            <CartItem key={item.productId} item={item} />
          ))}
        </div>
        <CartSummary />
      </div>
    </div>
  );
};

export default CartPage;