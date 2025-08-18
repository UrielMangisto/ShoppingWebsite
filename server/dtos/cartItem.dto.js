// DTO for Cart Item

class CartItemDTO {
  constructor({ id, product_id, quantity, name, price, image }) {
    this.id = id;
    this.productId = product_id;
    this.quantity = quantity;
    this.productName = name;
    this.productPrice = price;
    this.productImage = image;
  }
}

export default CartItemDTO;
