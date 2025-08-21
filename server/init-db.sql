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
  UNIQUE KEY uniq_users_email (email),
  CONSTRAINT users_chk_email CHECK (email LIKE '%@%' AND email LIKE '%.%'),
  CONSTRAINT users_chk_name CHECK (CHAR_LENGTH(name) >= 2),
  CONSTRAINT users_chk_password CHECK (CHAR_LENGTH(password) >= 8)
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
  stock INT NOT NULL DEFAULT 0,
  category_id INT DEFAULT NULL,
  image_id VARCHAR(24) DEFAULT NULL,    -- MongoDB GridFS/ObjectId as string
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_products_category (category_id),
  KEY idx_products_name (name),
  KEY idx_products_price (price),
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT products_chk_price CHECK (price >= 0),
  CONSTRAINT products_chk_stock CHECK (stock >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 1.4 reviews (one review per user per product)
CREATE TABLE reviews (
  id INT NOT NULL AUTO_INCREMENT,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  rating TINYINT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_orders_user (user_id),
  KEY idx_orders_status (status),
  KEY idx_orders_created (created_at),
  CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT orders_chk_total CHECK (total >= 0)
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
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT order_items_chk_quantity CHECK (quantity > 0),
  CONSTRAINT order_items_chk_price CHECK (price >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 1.7 cart_items (optional app-level cart)
CREATE TABLE cart_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cart_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_cart_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT cart_items_chk_quantity CHECK (quantity > 0),
  UNIQUE KEY uniq_user_product (user_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 2) Seed data (minimal demo)

-- users
INSERT INTO users (name, email, password, role) VALUES
  ('Admin', 'admin@example.com', '$2b$10$dummyhashforadmin', 'admin'),
  ('Alice', 'alice@example.com', '$2b$10$dummyhashforalice', 'user'),
  ('Bob Miller', 'bob@example.com', '$2b$10$dummyhashforbob', 'user'),
  ('Carol Davis', 'carol@example.com', '$2b$10$dummyhashforcarol', 'user'),
  ('David Wilson', 'david@example.com', '$2b$10$dummyhashfordavid', 'user');

-- categories
INSERT INTO categories (name) VALUES
  ('Electronics'),
  ('Furniture'),
  ('Kitchenware'),
  ('Lighting'),
  ('Audio & Headphones'),
  ('Gaming'),
  ('Sports & Outdoors'),
  ('Books & Media'),
  ('Fashion'),
  ('Home & Garden');

-- products
INSERT INTO products (name, description, price, stock, category_id, image_id) VALUES
  ('Wireless Keyboard', 'Compact keyboard with USB receiver', 129.90, 50, (SELECT id FROM categories WHERE name='Electronics'), NULL),
  ('Bluetooth Speaker', 'Portable speaker with powerful sound', 199.00, 35, (SELECT id FROM categories WHERE name='Audio & Headphones'), NULL),
  ('Gaming Mouse', 'Ergonomic mouse with high DPI', 149.99, 40, (SELECT id FROM categories WHERE name='Gaming'), NULL),
  ('Office Desk', 'Spacious wooden desk for home office', 699.00, 10, (SELECT id FROM categories WHERE name='Furniture'), NULL),
  ('LED Floor Lamp', 'Modern design with adjustable brightness', 239.50, 20, (SELECT id FROM categories WHERE name='Lighting'), NULL),
  ('Stainless Steel Pan', 'Durable pan for everyday cooking', 89.90, 60, (SELECT id FROM categories WHERE name='Kitchenware'), NULL),
  ('Bookshelf', '5-shelf unit with modern look', 299.99, 15, (SELECT id FROM categories WHERE name='Furniture'), NULL),
  ('Noise Cancelling Headphones', 'Over-ear, wireless with ANC', 499.00, 25, (SELECT id FROM categories WHERE name='Audio & Headphones'), NULL),
  ('Gaming Chair', 'Ergonomic chair with adjustable recline', 899.00, 8, (SELECT id FROM categories WHERE name='Gaming'), NULL),
  ('Smart LED Bulb', 'Color-changing bulb with app control', 59.00, 100, (SELECT id FROM categories WHERE name='Lighting'), NULL),
  
  -- Additional Electronics
  ('4K Webcam', 'Ultra HD webcam for streaming and video calls', 179.99, 30, (SELECT id FROM categories WHERE name='Electronics'), NULL),
  ('Wireless Charger', 'Fast wireless charging pad for smartphones', 45.00, 80, (SELECT id FROM categories WHERE name='Electronics'), NULL),
  ('USB-C Hub', '7-in-1 hub with HDMI, USB 3.0, and SD card reader', 69.99, 45, (SELECT id FROM categories WHERE name='Electronics'), NULL),
  ('Mechanical Keyboard', 'RGB backlit mechanical keyboard with blue switches', 189.00, 25, (SELECT id FROM categories WHERE name='Electronics'), NULL),
  
  -- Additional Gaming
  ('Gaming Headset', 'Surround sound headset with noise-cancelling mic', 149.00, 35, (SELECT id FROM categories WHERE name='Gaming'), NULL),
  ('Gaming Controller', 'Wireless controller with haptic feedback', 79.99, 50, (SELECT id FROM categories WHERE name='Gaming'), NULL),
  ('Gaming Monitor', '27-inch 144Hz curved gaming monitor', 399.00, 12, (SELECT id FROM categories WHERE name='Gaming'), NULL),
  ('Gaming Mousepad', 'Extra large RGB mousepad with smooth surface', 39.99, 75, (SELECT id FROM categories WHERE name='Gaming'), NULL),
  
  -- Additional Audio & Headphones
  ('Wireless Earbuds', 'True wireless earbuds with active noise cancellation', 249.00, 40, (SELECT id FROM categories WHERE name='Audio & Headphones'), NULL),
  ('Studio Headphones', 'Professional studio monitor headphones', 299.00, 20, (SELECT id FROM categories WHERE name='Audio & Headphones'), NULL),
  ('Smart Speaker', 'Voice-controlled smart speaker with premium sound', 129.00, 55, (SELECT id FROM categories WHERE name='Audio & Headphones'), NULL),
  
  -- Furniture
  ('Ergonomic Office Chair', 'Adjustable office chair with lumbar support', 449.00, 18, (SELECT id FROM categories WHERE name='Furniture'), NULL),
  ('Standing Desk', 'Height-adjustable standing desk converter', 299.00, 15, (SELECT id FROM categories WHERE name='Furniture'), NULL),
  ('Coffee Table', 'Modern glass-top coffee table', 189.99, 12, (SELECT id FROM categories WHERE name='Furniture'), NULL),
  ('Dining Chair Set', 'Set of 4 modern dining chairs', 359.00, 8, (SELECT id FROM categories WHERE name='Furniture'), NULL),
  
  -- Kitchenware
  ('Chef Knife Set', 'Professional 8-piece knife set with block', 159.00, 25, (SELECT id FROM categories WHERE name='Kitchenware'), NULL),
  ('Espresso Machine', 'Automatic espresso machine with milk frother', 699.00, 10, (SELECT id FROM categories WHERE name='Kitchenware'), NULL),
  ('Non-Stick Cookware Set', '10-piece non-stick cookware set', 199.99, 20, (SELECT id FROM categories WHERE name='Kitchenware'), NULL),
  ('Food Processor', 'Multi-function food processor with 12 attachments', 249.00, 15, (SELECT id FROM categories WHERE name='Kitchenware'), NULL),
  
  -- Sports & Outdoors
  ('Yoga Mat', 'Premium non-slip yoga mat with carrying strap', 49.99, 60, (SELECT id FROM categories WHERE name='Sports & Outdoors'), NULL),
  ('Dumbbell Set', 'Adjustable dumbbell set 10-50 lbs', 299.00, 12, (SELECT id FROM categories WHERE name='Sports & Outdoors'), NULL),
  ('Hiking Backpack', 'Waterproof 40L hiking backpack', 89.99, 25, (SELECT id FROM categories WHERE name='Sports & Outdoors'), NULL),
  ('Camping Tent', '4-person waterproof camping tent', 179.00, 8, (SELECT id FROM categories WHERE name='Sports & Outdoors'), NULL),
  
  -- Books & Media
  ('Programming Book', 'Complete guide to modern web development', 59.99, 40, (SELECT id FROM categories WHERE name='Books & Media'), NULL),
  ('Tablet', '10-inch tablet for reading and entertainment', 349.00, 22, (SELECT id FROM categories WHERE name='Books & Media'), NULL),
  ('E-Reader', 'Waterproof e-reader with adjustable backlight', 149.99, 30, (SELECT id FROM categories WHERE name='Books & Media'), NULL);

-- reviews
-- Alice reviews
INSERT INTO reviews (product_id, user_id, rating, comment) VALUES
((SELECT id FROM products WHERE name='Wireless Keyboard'), (SELECT id FROM users WHERE email='alice@example.com'), 5, 'Great product! Fast delivery.'),
((SELECT id FROM products WHERE name='Gaming Mouse'), (SELECT id FROM users WHERE email='alice@example.com'), 4, 'Good mouse, very responsive. A bit pricey though.'),
((SELECT id FROM products WHERE name='Bluetooth Speaker'), (SELECT id FROM users WHERE email='alice@example.com'), 5, 'Amazing sound quality! Perfect for parties.'),
((SELECT id FROM products WHERE name='Smart LED Bulb'), (SELECT id FROM users WHERE email='alice@example.com'), 4, 'Easy to set up and works great with the app.');

-- Bob reviews
INSERT INTO reviews (product_id, user_id, rating, comment) VALUES
((SELECT id FROM products WHERE name='Gaming Chair'), (SELECT id FROM users WHERE email='bob@example.com'), 5, 'Super comfortable! Perfect for long gaming sessions.'),
((SELECT id FROM products WHERE name='Gaming Monitor'), (SELECT id FROM users WHERE email='bob@example.com'), 5, 'Excellent display quality and smooth refresh rate.'),
((SELECT id FROM products WHERE name='Gaming Headset'), (SELECT id FROM users WHERE email='bob@example.com'), 4, 'Good sound but the mic could be better.'),
((SELECT id FROM products WHERE name='Mechanical Keyboard'), (SELECT id FROM users WHERE email='bob@example.com'), 5, 'Love the tactile feedback! RGB looks amazing.'),
((SELECT id FROM products WHERE name='Gaming Controller'), (SELECT id FROM users WHERE email='bob@example.com'), 4, 'Solid controller, battery life is decent.');

-- Carol reviews  
INSERT INTO reviews (product_id, user_id, rating, comment) VALUES
((SELECT id FROM products WHERE name='Office Desk'), (SELECT id FROM users WHERE email='carol@example.com'), 5, 'Perfect size for my home office. Great quality wood.'),
((SELECT id FROM products WHERE name='Ergonomic Office Chair'), (SELECT id FROM users WHERE email='carol@example.com'), 4, 'Very comfortable for work. Assembly was a bit tricky.'),
((SELECT id FROM products WHERE name='LED Floor Lamp'), (SELECT id FROM users WHERE email='carol@example.com'), 5, 'Beautiful design and great lighting options.'),
((SELECT id FROM products WHERE name='Standing Desk'), (SELECT id FROM users WHERE email='carol@example.com'), 4, 'Good concept but takes some getting used to.'),
((SELECT id FROM products WHERE name='Bookshelf'), (SELECT id FROM users WHERE email='carol@example.com'), 5, 'Sturdy and looks great in my living room.');

-- David reviews
INSERT INTO reviews (product_id, user_id, rating, comment) VALUES
((SELECT id FROM products WHERE name='Espresso Machine'), (SELECT id FROM users WHERE email='david@example.com'), 5, 'Makes excellent coffee! Worth every penny.'),
((SELECT id FROM products WHERE name='Chef Knife Set'), (SELECT id FROM users WHERE email='david@example.com'), 5, 'Sharp knives, great for cooking. Highly recommend.'),
((SELECT id FROM products WHERE name='Stainless Steel Pan'), (SELECT id FROM users WHERE email='david@example.com'), 4, 'Good pan but requires proper seasoning.'),
((SELECT id FROM products WHERE name='Food Processor'), (SELECT id FROM users WHERE email='david@example.com'), 4, 'Powerful motor, many useful attachments.'),
((SELECT id FROM products WHERE name='Non-Stick Cookware Set'), (SELECT id FROM users WHERE email='david@example.com'), 3, 'Decent set but non-stick coating wore off quickly.');

-- Additional cross-user reviews for popular products
INSERT INTO reviews (product_id, user_id, rating, comment) VALUES
((SELECT id FROM products WHERE name='Noise Cancelling Headphones'), (SELECT id FROM users WHERE email='bob@example.com'), 5, 'Best headphones I have ever owned! Noise cancellation is perfect.'),
((SELECT id FROM products WHERE name='Wireless Earbuds'), (SELECT id FROM users WHERE email='carol@example.com'), 4, 'Great for workouts, stay in place well.'),
((SELECT id FROM products WHERE name='4K Webcam'), (SELECT id FROM users WHERE email='alice@example.com'), 4, 'Clear video quality for video calls.'),
((SELECT id FROM products WHERE name='Wireless Charger'), (SELECT id FROM users WHERE email='david@example.com'), 3, 'Works fine but charges slower than expected.'),
((SELECT id FROM products WHERE name='Yoga Mat'), (SELECT id FROM users WHERE email='carol@example.com'), 5, 'Perfect grip and thickness. Love it!'),
((SELECT id FROM products WHERE name='Hiking Backpack'), (SELECT id FROM users WHERE email='bob@example.com'), 4, 'Spacious and comfortable for long hikes.'),
((SELECT id FROM products WHERE name='Tablet'), (SELECT id FROM users WHERE email='alice@example.com'), 4, 'Good for reading and streaming videos.'),
((SELECT id FROM products WHERE name='Smart Speaker'), (SELECT id FROM users WHERE email='david@example.com'), 5, 'Voice recognition is excellent, sound quality is great.');

-- orders + order_items examples
-- Alice's orders
INSERT INTO orders (user_id, status, total) VALUES
((SELECT id FROM users WHERE email='alice@example.com'), 'paid', 329.89),
((SELECT id FROM users WHERE email='alice@example.com'), 'shipped', 199.00);

-- Bob's orders  
INSERT INTO orders (user_id, status, total) VALUES
((SELECT id FROM users WHERE email='bob@example.com'), 'paid', 1447.99),
((SELECT id FROM users WHERE email='bob@example.com'), 'pending', 229.00);

-- Carol's orders
INSERT INTO orders (user_id, status, total) VALUES
((SELECT id FROM users WHERE email='carol@example.com'), 'paid', 1187.50),
((SELECT id FROM users WHERE email='carol@example.com'), 'shipped', 239.50);

-- David's orders
INSERT INTO orders (user_id, status, total) VALUES
((SELECT id FROM users WHERE email='david@example.com'), 'paid', 1107.89),
((SELECT id FROM users WHERE email='david@example.com'), 'cancelled', 299.00);

-- Order items for Alice's first order (Wireless Keyboard + Gaming Mouse)
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
((SELECT o.id FROM orders o JOIN users u ON o.user_id = u.id WHERE u.email='alice@example.com' AND o.total = 329.89),
 (SELECT id FROM products WHERE name='Wireless Keyboard'), 1, 129.90),
((SELECT o.id FROM orders o JOIN users u ON o.user_id = u.id WHERE u.email='alice@example.com' AND o.total = 329.89),
 (SELECT id FROM products WHERE name='Gaming Mouse'), 1, 149.99),
((SELECT o.id FROM orders o JOIN users u ON o.user_id = u.id WHERE u.email='alice@example.com' AND o.total = 329.89),
 (SELECT id FROM products WHERE name='Smart LED Bulb'), 1, 59.00);

-- Order items for Alice's second order (Bluetooth Speaker)
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
((SELECT o.id FROM orders o JOIN users u ON o.user_id = u.id WHERE u.email='alice@example.com' AND o.total = 199.00),
 (SELECT id FROM products WHERE name='Bluetooth Speaker'), 1, 199.00);

-- Order items for Bob's first order (Gaming setup)
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
((SELECT o.id FROM orders o JOIN users u ON o.user_id = u.id WHERE u.email='bob@example.com' AND o.total = 1447.99),
 (SELECT id FROM products WHERE name='Gaming Chair'), 1, 899.00),
((SELECT o.id FROM orders o JOIN users u ON o.user_id = u.id WHERE u.email='bob@example.com' AND o.total = 1447.99),
 (SELECT id FROM products WHERE name='Gaming Monitor'), 1, 399.00),
((SELECT o.id FROM orders o JOIN users u ON o.user_id = u.id WHERE u.email='bob@example.com' AND o.total = 1447.99),
 (SELECT id FROM products WHERE name='Gaming Headset'), 1, 149.00);

-- Order items for Bob's second order (Gaming accessories)
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
((SELECT o.id FROM orders o JOIN users u ON o.user_id = u.id WHERE u.email='bob@example.com' AND o.total = 229.00),
 (SELECT id FROM products WHERE name='Mechanical Keyboard'), 1, 189.00),
((SELECT o.id FROM orders o JOIN users u ON o.user_id = u.id WHERE u.email='bob@example.com' AND o.total = 229.00),
 (SELECT id FROM products WHERE name='Gaming Mousepad'), 1, 39.99);

-- Order items for Carol's first order (Office furniture)
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
((SELECT o.id FROM orders o JOIN users u ON o.user_id = u.id WHERE u.email='carol@example.com' AND o.total = 1187.50),
 (SELECT id FROM products WHERE name='Office Desk'), 1, 699.00),
((SELECT o.id FROM orders o JOIN users u ON o.user_id = u.id WHERE u.email='carol@example.com' AND o.total = 1187.50),
 (SELECT id FROM products WHERE name='Ergonomic Office Chair'), 1, 449.00),
((SELECT o.id FROM orders o JOIN users u ON o.user_id = u.id WHERE u.email='carol@example.com' AND o.total = 1187.50),
 (SELECT id FROM products WHERE name='Gaming Mousepad'), 1, 39.50);

-- Order items for Carol's second order (LED Floor Lamp)
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
((SELECT o.id FROM orders o JOIN users u ON o.user_id = u.id WHERE u.email='carol@example.com' AND o.total = 239.50),
 (SELECT id FROM products WHERE name='LED Floor Lamp'), 1, 239.50);

-- Order items for David's first order (Kitchen equipment)
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
((SELECT o.id FROM orders o JOIN users u ON o.user_id = u.id WHERE u.email='david@example.com' AND o.total = 1107.89),
 (SELECT id FROM products WHERE name='Espresso Machine'), 1, 699.00),
((SELECT o.id FROM orders o JOIN users u ON o.user_id = u.id WHERE u.email='david@example.com' AND o.total = 1107.89),
 (SELECT id FROM products WHERE name='Chef Knife Set'), 1, 159.00),
((SELECT o.id FROM orders o JOIN users u ON o.user_id = u.id WHERE u.email='david@example.com' AND o.total = 1107.89),
 (SELECT id FROM products WHERE name='Food Processor'), 1, 249.00);

-- Order items for David's cancelled order (Standing Desk)
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
((SELECT o.id FROM orders o JOIN users u ON o.user_id = u.id WHERE u.email='david@example.com' AND o.total = 299.00),
 (SELECT id FROM products WHERE name='Standing Desk'), 1, 299.00);

-- cart_items examples
INSERT INTO cart_items (user_id, product_id, quantity) VALUES
-- Alice's cart
((SELECT id FROM users WHERE email='alice@example.com'), (SELECT id FROM products WHERE name='Wireless Earbuds'), 1),
((SELECT id FROM users WHERE email='alice@example.com'), (SELECT id FROM products WHERE name='4K Webcam'), 1),

-- Bob's cart
((SELECT id FROM users WHERE email='bob@example.com'), (SELECT id FROM products WHERE name='Gaming Controller'), 2),
((SELECT id FROM users WHERE email='bob@example.com'), (SELECT id FROM products WHERE name='USB-C Hub'), 1),

-- Carol's cart  
((SELECT id FROM users WHERE email='carol@example.com'), (SELECT id FROM products WHERE name='Coffee Table'), 1),
((SELECT id FROM users WHERE email='carol@example.com'), (SELECT id FROM products WHERE name='Yoga Mat'), 1),
((SELECT id FROM users WHERE email='carol@example.com'), (SELECT id FROM products WHERE name='E-Reader'), 1),

-- David's cart
((SELECT id FROM users WHERE email='david@example.com'), (SELECT id FROM products WHERE name='Non-Stick Cookware Set'), 1),
((SELECT id FROM users WHERE email='david@example.com'), (SELECT id FROM products WHERE name='Smart Speaker'), 2);
