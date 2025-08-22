// server/models/products.model.js
import { pool } from '../config/db.js';

// Enhanced findAllProducts function that supports filters
export const findAllProducts = async (filters = {}) => {
  let query = `
    SELECT p.*, 
           c.name AS category_name,
           AVG(r.rating) as average_rating,
           COUNT(r.id) as review_count
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN reviews r ON p.id = r.product_id
    WHERE 1=1`;
  
  const params = [];

  // Apply filters
  if (filters.search) {
    query += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm);
  }

  if (filters.category) {
    query += ` AND p.category_id = ?`;
    params.push(filters.category);
  }

  if (filters.minPrice) {
    query += ` AND p.price >= ?`;
    params.push(parseFloat(filters.minPrice));
  }

  if (filters.maxPrice) {
    query += ` AND p.price <= ?`;
    params.push(parseFloat(filters.maxPrice));
  }

  // Stock filter - must be before GROUP BY
  if (filters.inStock !== undefined) {
    if (filters.inStock === 'true' || filters.inStock === true) {
      query += ` AND p.stock > 0`;
    } else if (filters.inStock === 'false' || filters.inStock === false) {
      query += ` AND p.stock <= 0`;
    }
  }

  // Group by for aggregation
  query += ` GROUP BY p.id, c.name`;

  // Rating filter - must be after GROUP BY (using HAVING)
  if (filters.minRating) {
    query += ` HAVING average_rating >= ?`;
    params.push(parseFloat(filters.minRating));
  }

  // Sorting
  const validSorts = {
    'name_asc': 'p.name ASC',
    'name_desc': 'p.name DESC',
    'price_asc': 'p.price ASC', 
    'price_desc': 'p.price DESC',
    'rating_desc': 'average_rating DESC',
    'created_desc': 'p.created_at DESC'
  };
  
  if (filters.sortBy && validSorts[filters.sortBy]) {
    query += ` ORDER BY ${validSorts[filters.sortBy]}`;
  } else {
    query += ` ORDER BY p.name ASC`;
  }

  // Pagination
  if (filters.limit) {
    query += ` LIMIT ?`;
    params.push(parseInt(filters.limit));
    
    if (filters.offset) {
      query += ` OFFSET ?`;
      params.push(parseInt(filters.offset));
    }
  }

  const [rows] = await pool.query(query, params);
  return rows;
};

export const findProductById = async (id) => {
  const [rows] = await pool.query(`
    SELECT p.*, 
           c.name AS category_name,
           AVG(r.rating) as average_rating,
           COUNT(r.id) as review_count
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN reviews r ON p.id = r.product_id
    WHERE p.id = ?
    GROUP BY p.id, c.name`, [id]);
  return rows[0];
};

export const createProductRow = async ({ name, description, price, stock = 0, category_id = null, image_id = null }) => {
  const [result] = await pool.query(
    `INSERT INTO products (name, description, price, stock, category_id, image_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, description, price, stock, category_id, image_id]
  );
  return result.insertId;
};

export const updateProductPartial = async (id, fields) => {
  const allowed = ['name','description','price','stock','category_id','image_id'];
  const set = [];
  const vals = [];
  for (const k of allowed) {
    if (fields[k] !== undefined) { set.push(`${k} = ?`); vals.push(fields[k]); }
  }
  if (!set.length) return 0;
  vals.push(id);
  const [res] = await pool.query(`UPDATE products SET ${set.join(', ')} WHERE id = ?`, vals);
  return res.affectedRows;
};

export const deleteProductById = async (id) => {
  const [res] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
  return res.affectedRows;
};
