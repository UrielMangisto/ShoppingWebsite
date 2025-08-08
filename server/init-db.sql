-- init-db.sql
-- Script to initialize the database for the shopping website
-- This script creates the database, tables, and inserts sample data

-- Delete existing database if it exists
DROP DATABASE IF EXISTS store;
CREATE DATABASE store;
USE store;

-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('user', 'admin') DEFAULT 'user'
);

-- Categories table
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100)
);

-- Products table
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  description TEXT,
  price DECIMAL(10,2),
  stock INT DEFAULT 0,
  image VARCHAR(255),
  category_id INT,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order items table
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,
  product_id INT,
  quantity INT,
  price DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Categories table
INSERT INTO categories (name) VALUES
  ('Electronics'),
  ('Furniture'),
  ('Kitchenware'),
  ('Lighting'),
  ('Audio & Headphones'),
  ('Gaming');

-- Products table
INSERT INTO products (name, description, price, stock, image, category_id) VALUES
  ('Wireless Keyboard', 'Compact keyboard with USB receiver', 129.90, 50, 'keyboard.jpg', 1),
  ('Bluetooth Speaker', 'Portable speaker with powerful sound', 199.00, 35, 'speaker.jpg', 5),
  ('Gaming Mouse', 'Ergonomic mouse with high DPI', 149.99, 40, 'mouse.jpg', 6),
  ('Office Desk', 'Spacious wooden desk for home office', 699.00, 10, 'desk.jpg', 2),
  ('LED Floor Lamp', 'Modern design with adjustable brightness', 239.50, 20, 'lamp.jpg', 4),
  ('Stainless Steel Pan', 'Durable pan for everyday cooking', 89.90, 60, 'pan.jpg', 3),
  ('Bookshelf', '5-shelf unit with modern look', 299.99, 15, 'bookshelf.jpg', 2),
  ('Noise Cancelling Headphones', 'Over-ear, wireless with ANC', 499.00, 25, 'headphones.jpg', 5),
  ('Gaming Chair', 'Ergonomic chair with adjustable recline', 899.00, 8, 'chair.jpg', 6),
  ('Smart LED Bulb', 'Color-changing bulb with app control', 59.00, 100, 'bulb.jpg', 4);
