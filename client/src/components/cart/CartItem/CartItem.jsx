import { useCart } from '../../../hooks/useCart';
import './CartItem.css';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = async (e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0) {
      await updateQuantity(item.productId, newQuantity);
    }
  };

  const handleRemove = async () => {
    await removeFromCart(item.productId);
  };

  return (
    <div className="cart-item">
      <img 
        src={item.product.image} 
        alt={item.product.name} 
        className="cart-item-image"
      />
      <div className="cart-item-details">
        <h3>{item.product.name}</h3>
        <p className="cart-item-price">${item.product.price.toFixed(2)}</p>
      </div>
      <div className="cart-item-actions">
        <select 
          value={item.quantity} 
          onChange={handleQuantityChange}
          className="quantity-select"
        >
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        <button 
          onClick={handleRemove}
          className="remove-button"
        >
          Remove
        </button>
      </div>
      <div className="cart-item-total">
        ${(item.quantity * item.product.price).toFixed(2)}
      </div>
    </div>
  );
};

export default CartItem;