// src/pages/ProductDetailPage/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useReviews } from '../../hooks/useReviews';
import ProductRecommendations from '../../components/products/ProductRecommendations/ProductRecommendations';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { currentProduct, loading, error, fetchProduct } = useProducts();
  const { addToCart, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const { reviews, loading: reviewsLoading } = useReviews(id);
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      await addToCart(currentProduct.id, quantity);
      alert(`Added ${quantity} item(s) to cart!`);
    } catch (error) {
      alert(`Failed to add to cart: ${error.message}`);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= currentProduct.stock) {
      setQuantity(value);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star full">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }
    
    return stars;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading product details...</p>
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
            <h2>Product Not Found</h2>
            <p>{error}</p>
            <Link to="/products" className="btn btn-primary">
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="error-container">
            <h2>Product Not Found</h2>
            <p>The product you're looking for doesn't exist.</p>
            <Link to="/products" className="btn btn-primary">
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const averageRating = currentProduct.average_rating ? parseFloat(currentProduct.average_rating) : 0;
  const reviewCount = parseInt(currentProduct.review_count) || 0;
  const isInStock = currentProduct.stock > 0;

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          {currentProduct.category_name && (
            <>
              <span>/</span>
              <span>{currentProduct.category_name}</span>
            </>
          )}
          <span>/</span>
          <span>{currentProduct.name}</span>
        </div>

        {/* Product Main Section */}
        <div className="product-main">
          <div className="product-image-section">
            <div className="product-image">
              {currentProduct.image_url ? (
                <img src={currentProduct.image_url} alt={currentProduct.name} />
              ) : (
                <div className="no-image">
                  <span>No Image Available</span>
                </div>
              )}
            </div>
          </div>

          <div className="product-info-section">
            <div className="product-header">
              <h1 className="product-title">{currentProduct.name}</h1>
              
              {averageRating > 0 && (
                <div className="product-rating">
                  <div className="stars">
                    {renderStars(averageRating)}
                  </div>
                  <span className="rating-text">
                    {averageRating.toFixed(1)} ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
                  </span>
                </div>
              )}
            </div>

            <div className="product-price">
              <span className="price">${currentProduct.price}</span>
            </div>

            <div className="product-stock">
              <span className={`stock-status ${isInStock ? 'in-stock' : 'out-of-stock'}`}>
                {isInStock ? `${currentProduct.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {currentProduct.category_name && (
              <div className="product-category">
                <strong>Category:</strong> {currentProduct.category_name}
              </div>
            )}

            {isInStock && (
              <div className="product-actions">
                <div className="quantity-selector">
                  <label htmlFor="quantity">Quantity:</label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="quantity-select"
                  >
                    {Array.from({ length: Math.min(currentProduct.stock, 10) }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  className="btn btn-primary add-to-cart"
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                >
                  {cartLoading ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="product-details">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({reviewCount})
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="description-content">
                <h3>Product Description</h3>
                <p>{currentProduct.description || 'No description available.'}</p>
                
                <div className="product-specs">
                  <h4>Product Information</h4>
                  <ul>
                    <li><strong>Product ID:</strong> {currentProduct.id}</li>
                    <li><strong>Category:</strong> {currentProduct.category_name || 'Uncategorized'}</li>
                    <li><strong>Stock:</strong> {currentProduct.stock} units</li>
                    <li><strong>Added:</strong> {formatDate(currentProduct.created_at)}</li>
                    {currentProduct.updated_at && currentProduct.updated_at !== currentProduct.created_at && (
                      <li><strong>Last Updated:</strong> {formatDate(currentProduct.updated_at)}</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-content">
                <div className="reviews-summary">
                  <h3>Customer Reviews</h3>
                  {averageRating > 0 && (
                    <div className="reviews-stats">
                      <div className="average-rating">
                        <span className="rating-number">{averageRating.toFixed(1)}</span>
                        <div className="stars-large">
                          {renderStars(averageRating)}
                        </div>
                        <span className="total-reviews">Based on {reviewCount} review{reviewCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="reviews-list">
                  {reviewsLoading ? (
                    <div className="loading-reviews">Loading reviews...</div>
                  ) : reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="review-item">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <strong className="reviewer-name">{review.user_name}</strong>
                            <div className="review-stars">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          <div className="review-date">
                            {formatDate(review.created_at)}
                          </div>
                        </div>
                        {review.comment && (
                          <div className="review-comment">
                            <p>{review.comment}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="no-reviews">
                      <p>No reviews yet. Be the first to review this product!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Recommendations */}
        <ProductRecommendations
          type="related"
          currentProductId={currentProduct.id}
          categoryId={currentProduct.category_id}
          title="You might also like"
          limit={4}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;