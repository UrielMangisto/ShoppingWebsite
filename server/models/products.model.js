// server/models/products.model.js - Product data access layer with advanced filtering
// This module handles all database operations related to products
import { pool } from '../config/db.js';

// Enhanced product retrieval with comprehensive filtering and pagination support
export const findAllProducts = async (filters = {}) => {
  // Build dynamic SQL query with JOINs for category and rating information
  let query = `
    SELECT p.*, 
           c.name AS category_name,                    -- Include category name for display
           AVG(r.rating) as average_rating,            -- Calculate average rating from reviews
           COUNT(r.id) as review_count                 -- Count total reviews
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id    -- LEFT JOIN to include products without categories
    LEFT JOIN reviews r ON p.id = r.product_id        -- LEFT JOIN to include products without reviews
    WHERE 1=1`;  // Base WHERE clause for easy filter appending
  
  const params = []; // Parameters array for prepared statement

  // Text search filter - searches both name and description
  if (filters.search) {
    query += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
    const searchTerm = `%${filters.search}%`; // Add wildcards for partial matching
    params.push(searchTerm, searchTerm);
  }

  // Category filter
  if (filters.category) {
    query += ` AND p.category_id = ?`;
    params.push(filters.category);
  }

  // Price range filters
  if (filters.minPrice) {
    query += ` AND p.price >= ?`;
    params.push(parseFloat(filters.minPrice));
  }

  if (filters.maxPrice) {
    query += ` AND p.price <= ?`;
    params.push(parseFloat(filters.maxPrice));
  }

  // GROUP BY required for aggregate functions (AVG, COUNT)
  query += ` GROUP BY p.id, c.name`;

  // Rating filter - applied after GROUP BY using HAVING clause
  if (filters.minRating) {
    query += ` HAVING average_rating >= ?`;
    params.push(parseFloat(filters.minRating));
  }

  // Sorting options - whitelist valid sort combinations
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
    query += ` ORDER BY p.name ASC`; // Default sort by name
  }

  // Pagination support for "Load More" functionality
  if (filters.limit) {
    query += ` LIMIT ?`;
    params.push(parseInt(filters.limit));
    
    if (filters.offset) {
      query += ` OFFSET ?`;
      params.push(parseInt(filters.offset));
    }
  }

  // Execute query with prepared statement for security
  const [rows] = await pool.query(query, params);
  return rows;
};

// Find single product by ID with aggregated rating data
export const findProductById = async (id) => {
  const [rows] = await pool.query(`
    SELECT p.*, 
           c.name AS category_name,                    -- Include category information
           AVG(r.rating) as average_rating,            -- Calculate average rating
           COUNT(r.id) as review_count                 -- Count total reviews
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN reviews r ON p.id = r.product_id
    WHERE p.id = ?
    GROUP BY p.id, c.name`, [id]);
  return rows[0]; // Return single product or undefined
};

// Create new product with all optional fields
export const createProductRow = async ({ 
  name, 
  description, 
  price, 
  stock = 0,           // Default stock to 0 if not provided
  category_id = null,  // Allow products without category
  image_id = null      // Allow products without image
}) => {
  const [result] = await pool.query(
    `INSERT INTO products (name, description, price, stock, category_id, image_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, description, price, stock, category_id, image_id]
  );
  return result.insertId; // Return ID of newly created product
};

// Partial product update with field validation
export const updateProductPartial = async (id, fields) => {
  // Security: Whitelist allowed fields to prevent unauthorized updates
  const allowedFields = ['name', 'description', 'price', 'stock', 'category_id', 'image_id'];
  const setClause = [];
  const values = [];
  
  // Build dynamic UPDATE query with only provided fields
  for (const fieldName of allowedFields) {
    if (fields[fieldName] !== undefined) { 
      setClause.push(`${fieldName} = ?`); 
      values.push(fields[fieldName]); 
    }
  }
  
  // Return early if no valid fields to update
  if (!setClause.length) return 0;
  
  values.push(id); // Add product ID for WHERE clause
  const [result] = await pool.query(
    `UPDATE products SET ${setClause.join(', ')} WHERE id = ?`, 
    values
  );
  return result.affectedRows;
};

// Delete product (admin only operation)
export const deleteProductById = async (id) => {
  const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
  return result.affectedRows;
};
