export class ReviewDTO {
  constructor({ id, user_id, product_id, rating, comment, created_at, updated_at }) {
    this.id = id;
    this.user_id = user_id;
    this.product_id = product_id;
    this.rating = rating;
    this.comment = comment;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
