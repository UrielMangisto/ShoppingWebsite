import CartItemDTO from './cartItem.dto.js';

// DTO for Cart entity
class CartDTO {
  constructor(items) {
    this.items = items.map(item => new CartItemDTO(item));
  }
}

export default CartDTO;
