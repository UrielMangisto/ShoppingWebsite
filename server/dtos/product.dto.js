export class ProductDTO {
  constructor({ id, name, description, price, stock, category_id, image_id }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.category_id = category_id;
    this.image_id = image_id;
  }
}
