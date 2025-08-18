export class OrderDTO {
  constructor({ id, user_id, total_price, created_at, items }) {
    this.id = id;
    this.user_id = user_id;
    this.total_price = total_price;
    this.created_at = created_at;
    this.items = items; // Array of order items
  }
}
