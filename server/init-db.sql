-- init-db.sql
-- Initialize local MySQL database for the shopping website (clean install)

-- 0) Fresh DB
DROP DATABASE IF EXISTS store;
CREATE DATABASE store
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;
USE store;

-- 1) Core tables

-- 1.1 users
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  PRIMARY KEY (id),
  UNIQUE KEY uniq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 1.2 categories
CREATE TABLE categories (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 1.3 products
CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  image VARCHAR(255) DEFAULT NULL,      -- optional local/legacy path
  category_id INT DEFAULT NULL,
  image_id VARCHAR(24) DEFAULT NULL,    -- optional MongoDB GridFS/ObjectId as string
  PRIMARY KEY (id),
  KEY idx_products_category (category_id),
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 1.4 reviews (one review per user per product)
CREATE TABLE reviews (
  id INT NOT NULL AUTO_INCREMENT,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  rating TINYINT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_product_user (product_id, user_id),
  KEY idx_reviews_product (product_id),
  KEY idx_reviews_user (user_id),
  KEY idx_reviews_created (created_at),
  CONSTRAINT fk_reviews_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_reviews_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT reviews_chk_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 1.5 orders
CREATE TABLE orders (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  status ENUM('pending','paid','shipped','cancelled') NOT NULL DEFAULT 'pending',
  total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_orders_user (user_id),
  CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 1.6 order_items (snapshot price at purchase time)
CREATE TABLE order_items (
  id INT NOT NULL AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_items_order (order_id),
  KEY idx_items_product (product_id),
  CONSTRAINT fk_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_items_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 1.7 cart_items (optional app-level cart)
CREATE TABLE cart_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  CONSTRAINT fk_cart_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_cart_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 2) Seed data (minimal demo)

-- users
INSERT INTO users (name, email, password, role) VALUES
  ('Admin', 'admin@example.com', '$2b$10$dummyhashforadmin', 'admin'),
  ('Alice', 'alice@example.com', '$2b$10$dummyhashforalice', 'user');

-- categories
INSERT INTO categories (name) VALUES
  ('Electronics'),
  ('Furniture'),
  ('Kitchenware'),
  ('Lighting'),
  ('Audio & Headphones'),
  ('Gaming');

-- products
INSERT INTO products (name, description, price, stock, image, category_id, image_id) VALUES
  ('Wireless Keyboard', 'Compact keyboard with USB receiver', 129.90, 50, 'keyboard.jpg', (SELECT id FROM categories WHERE name='Electronics'), NULL),
  ('Bluetooth Speaker', 'Portable speaker with powerful sound', 199.00, 35, 'speaker.jpg', (SELECT id FROM categories WHERE name='Audio & Headphones'), NULL),
  ('Gaming Mouse', 'Ergonomic mouse with high DPI', 149.99, 40, 'mouse.jpg', (SELECT id FROM categories WHERE name='Gaming'), NULL),
  ('Office Desk', 'Spacious wooden desk for home office', 699.00, 10, 'desk.jpg', (SELECT id FROM categories WHERE name='Furniture'), NULL),
  ('LED Floor Lamp', 'Modern design with adjustable brightness', 239.50, 20, 'lamp.jpg', (SELECT id FROM categories WHERE name='Lighting'), NULL),
  ('Stainless Steel Pan', 'Durable pan for everyday cooking', 89.90, 60, 'pan.jpg', (SELECT id FROM categories WHERE name='Kitchenware'), NULL),
  ('Bookshelf', '5-shelf unit with modern look', 299.99, 15, 'bookshelf.jpg', (SELECT id FROM categories WHERE name='Furniture'), NULL),
  ('Noise Cancelling Headphones', 'Over-ear, wireless with ANC', 499.00, 25, 'headphones.jpg', (SELECT id FROM categories WHERE name='Audio & Headphones'), NULL),
  ('Gaming Chair', 'Ergonomic chair with adjustable recline', 899.00, 8, 'chair.jpg', (SELECT id FROM categories WHERE name='Gaming'), NULL),
  ('Smart LED Bulb', 'Color-changing bulb with app control', 59.00, 100, 'bulb.jpg', (SELECT id FROM categories WHERE name='Lighting'), NULL);

-- reviews (Alice -> Wireless Keyboard)
INSERT INTO reviews (product_id, user_id, rating, comment)
SELECT p.id, u.id, 5, 'Great product! Fast delivery.'
FROM products p
JOIN users u ON u.email='alice@example.com'
WHERE p.name='Wireless Keyboard'
LIMIT 1;

-- order + item demo (Alice buys a Wireless Keyboard)
INSERT INTO orders (user_id, status, total)
SELECT id, 'paid', 129.90 FROM users WHERE email='alice@example.com' LIMIT 1;

INSERT INTO order_items (order_id, product_id, quantity, price)
SELECT
  (SELECT MAX(id) FROM orders WHERE user_id = (SELECT id FROM users WHERE email='alice@example.com')),
  (SELECT id FROM products WHERE name='Wireless Keyboard' LIMIT 1),
  1,
  129.90;

-- cart_items example (optional)
INSERT INTO cart_items (user_id, product_id, quantity)
SELECT
  (SELECT id FROM users WHERE email='alice@example.com' LIMIT 1),
  (SELECT id FROM products WHERE name='Gaming Mouse' LIMIT 1),
  2;
