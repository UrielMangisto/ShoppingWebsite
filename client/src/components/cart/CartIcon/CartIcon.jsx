import { useCart } from '../../../hooks/useCart';
import './CartIcon.css';

const CartIcon = () => {
  const { cart } = useCart();
  const itemCount = cart?.items?.length || 0;

  return (
    <div className="cart-icon">
      <i className="fas fa-shopping-cart"></i>
      {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
    </div>
  );
};

export default CartIcon;