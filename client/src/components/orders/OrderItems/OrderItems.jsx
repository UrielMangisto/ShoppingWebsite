import './OrderItems.css';

const OrderItems = ({ items }) => {
  return (
    <div className="order-items">
      <h3>Order Items</h3>
      <div className="items-list">
        {items.map((item) => (
          <div key={item.productId} className="order-item">
            <img 
              src={item.product.image} 
              alt={item.product.name} 
              className="item-image" 
            />
            <div className="item-details">
              <h4>{item.product.name}</h4>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.product.price.toFixed(2)}</p>
            </div>
            <div className="item-total">
              ${(item.quantity * item.product.price).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItems;