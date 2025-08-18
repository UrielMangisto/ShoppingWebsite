import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/products/ProductCard';
import Loading, { CardSkeleton } from '../components/common/Loading';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart, isInCart, getItemQuantity } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      loadRelatedProducts();
    }
  }, [product]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await productService.getProductById(id);
      setProduct(response.data);
      setSelectedImage(0);
      setImageError(false);
    } catch (err) {
      console.error('Error loading product:', err);
      if (err.response?.status === 404) {
        setError('Product not found.');
      } else {
        setError('Failed to load product. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadRelatedProducts = async () => {
    try {
      if (product.category_id) {
        const response = await productService.getProductsByCategory(product.category_id);
        // Filter out current product and limit to 4 items
        const filtered = response.data
          .filter(p => p.id !== product.id)
          .slice(0, 4);
        setRelatedProducts(filtered);
      }
    } catch (err) {
      console.error('Error loading related products:', err);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsAddingToCart(true);
    try {
      const result = await addToCart(product.id, quantity);
      if (result.success) {
        // Reset quantity to 1 after adding
        setQuantity(1);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getImageUrl = (imageName) => {
    if (imageError || !imageName) {
      return '/placeholder-image.jpg';
    }
    return productService.getImageUrl(imageName);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const isInStock = product?.stock > 0;
  const currentQuantityInCart = product ? getItemQuantity(product.id) : 0;
  const isProductInCart = product ? isInCart(product.id) : false;

  if (isLoading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="product-detail-loading">
            <Loading size="large" text="Loading product..." />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="error-container">
            <h2 className="error-title">Oops! Something went wrong</h2>
            <p className="error-message">{error}</p>
            <div className="error-actions">
              <button onClick={loadProduct} className="btn btn-primary">
                Try Again
              </button>
              <Link to="/products" className="btn btn-outline">
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/products" className="breadcrumb-link">Products</Link>
          <span className="breadcrumb-separator">/</span>
          {product.category && (
            <>
              <Link 
                to={`/products?category=${product.category_id}`} 
                className="breadcrumb-link"
              >
                {product.category}
              </Link>
              <span className="breadcrumb-separator">/</span>
            </>
          )}
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="product-detail-content">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image-container">
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="main-image"
                onError={handleImageError}
              />
              {!isInStock && (
                <div className="stock-overlay">
                  <span className="stock-badge">Out of Stock</span>
                </div>
              )}
            </div>
            
            {/* Thumbnail images (for future multiple images feature) */}
            <div className="thumbnail-images">
              <button
                className={`thumbnail ${selectedImage === 0 ? 'active' : ''}`}
                onClick={() => setSelectedImage(0)}
              >
                <img
                  src={getImageUrl(product.image)}
                  alt={`${product.name} thumbnail`}
                  onError={handleImageError}
                />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <div className="product-category">
                {product.category && (
                  <Link 
                    to={`/products?category=${product.category_id}`}
                    className="category-link"
                  >
                    {product.category}
                  </Link>
                )}
              </div>
              <h1 className="product-title">{product.name}</h1>
              <div className="product-price">
                <span className="current-price">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="original-price">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description || 'No description available.'}</p>
            </div>

            <div className="product-stock">
              <div className="stock-info">
                <span className="stock-label">Availability:</span>
                {isInStock ? (
                  <span className="stock-status in-stock">
                    ✅ {product.stock} in stock
                  </span>
                ) : (
                  <span className="stock-status out-of-stock">
                    ❌ Out of stock
                  </span>
                )}
              </div>
              
              {isProductInCart && (
                <div className="cart-status">
                  <span className="cart-info">
                    🛒 {currentQuantityInCart} in your cart
                  </span>
                </div>
              )}
            </div>

            {/* Add to Cart Section */}
            {isAuthenticated ? (
              <div className="add-to-cart-section">
                {isInStock && (
                  <div className="quantity-selector">
                    <label htmlFor="quantity">Quantity:</label>
                    <div className="quantity-controls">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="quantity-btn"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <input
                        id="quantity"
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                        className="quantity-input"
                      />
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= product.stock}
                        className="quantity-btn"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                <div className="action-buttons">
                  <button
                    onClick={handleAddToCart}
                    disabled={!isInStock || isAddingToCart}
                    className={`add-to-cart-btn ${isProductInCart ? 'in-cart' : ''}`}
                  >
                    {isAddingToCart ? (
                      <>
                        <Loading size="small" color="white" />
                        Adding to Cart...
                      </>
                    ) : !isInStock ? (
                      <>
                        <span className="btn-icon">❌</span>
                        Out of Stock
                      </>
                    ) : isProductInCart ? (
                      <>
                        <span className="btn-icon">✓</span>
                        Add More to Cart
                      </>
                    ) : (
                      <>
                        <span className="btn-icon">🛒</span>
                        Add to Cart
                      </>
                    )}
                  </button>

                  {isProductInCart && (
                    <Link to="/cart" className="btn btn-outline">
                      <span className="btn-icon">👀</span>
                      View Cart
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="login-prompt">
                <p>Please log in to add items to your cart</p>
                <Link to="/login" className="btn btn-primary">
                  <span className="btn-icon">🔑</span>
                  Login to Purchase
                </Link>
              </div>
            )}

            {/* Product Features */}
            <div className="product-features">
              <div className="feature">
                <span className="feature-icon">🚚</span>
                <div className="feature-text">
                  <strong>Free Shipping</strong>
                  <span>On orders over $50</span>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">↩️</span>
                <div className="feature-text">
                  <strong>Easy Returns</strong>
                  <span>30-day return policy</span>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">🔒</span>
                <div className="feature-text">
                  <strong>Secure Payment</strong>
                  <span>Your data is protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <div className="section-header">
              <h2>Related Products</h2>
              <p>You might also like these items</p>
            </div>
            
            <div className="related-products-grid">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard 
                  key={relatedProduct.id} 
                  product={relatedProduct}
                  className="compact"
                />
              ))}
            </div>
            
            <div className="section-footer">
              <Link 
                to={`/products?category=${product.category_id}`}
                className="btn btn-outline"
              >
                View All in {product.category}
              </Link>
            </div>
          </div>
        )}

        {/* Product Specifications (Future Enhancement) */}
        <div className="product-specifications">
          <h3>Product Details</h3>
          <div className="specifications-grid">
            <div className="spec-item">
              <span className="spec-label">Product ID:</span>
              <span className="spec-value">#{product.id}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Category:</span>
              <span className="spec-value">{product.category || 'General'}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Stock:</span>
              <span className="spec-value">{product.stock} units</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Price:</span>
              <span className="spec-value">{formatPrice(product.price)}</span>
            </div>
          </div>
        </div>

        {/* Reviews Section (Future Enhancement) */}
        <div className="reviews-section">
          <h3>Customer Reviews</h3>
          <div className="reviews-placeholder">
            <p>Reviews feature coming soon! ⭐</p>
            <p>Be the first to review this product.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;