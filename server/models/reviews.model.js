// server/models/reviews.model.js
import { pool } from '../config/db.js';

export const createReviewInDB = async ({ product_id, user_id, rating, comment }) => {
  const [res] = await pool.query(
    `INSERT INTO reviews (product_id, user_id, rating, comment)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE rating=VALUES(rating), comment=VALUES(comment)`,
    [product_id, user_id, rating, comment ?? null]
  );
  return res.insertId || 0;
};

export const listReviewsByProductFromDB = async (product_id) => {
  const [rows] = await pool.query(
    `SELECT r.id, r.product_id, r.user_id, r.rating, r.comment, r.created_at,
            u.name AS user_name
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     WHERE r.product_id = ?
     ORDER BY r.created_at DESC`,
    [product_id]
  );
  console.log('[Model] Reviews fetched from DB:', rows);
  return rows;
};

export const deleteReviewFromDB = async ({ id, user_id, isAdmin }) => {
  if (isAdmin) {
    const [res] = await pool.query(`DELETE FROM reviews WHERE id = ?`, [id]);
    return res.affectedRows;
  } else {
    const [res] = await pool.query(`DELETE FROM reviews WHERE id = ? AND user_id = ?`, [id, user_id]);
    return res.affectedRows;
  }
};

export const updateReviewInDB = async ({ id, user_id, rating, comment }) => {
  const [res] = await pool.query(
    `UPDATE reviews SET rating = ?, comment = ? WHERE id = ? AND user_id = ?`,
    [rating, comment, id, user_id]
  );
  return res.affectedRows;
};

// optional helpers
export const hasPurchasedProduct = async (user_id, product_id) => {
  const [rows] = await pool.query(
    `SELECT 1
     FROM order_items oi
     JOIN orders o ON o.id = oi.order_id
     WHERE o.user_id = ? AND oi.product_id = ?
     LIMIT 1`,
    [user_id, product_id]
  );
  return rows.length > 0;
};
