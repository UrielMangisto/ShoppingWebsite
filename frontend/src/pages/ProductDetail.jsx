// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, formatDate, getRelativeTime } from '../utils/helpers';
import { validateReviewForm } from '../utils/validation';
import Loading from '../components/common/Loading';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { addToCart, loading: cartLoading } = useCart();
  const {
    product,
    loading,
    error,
    reviews,
    reviewsLoading,
    addReview,
    updateReview,
    deleteReview
  } = useProduct(id);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });
  const [reviewErrors, setReviewErrors] = useState({});

  // איפוס כאשר משתנה המוצר
  useEffect(() => {
    setQuantity(1);
    setSelectedImage(0);
    setShowReviewForm(false);
    setEditingReview(null);
    setReviewForm({ rating: 5, comment: '' });
    setReviewErrors({});
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const result = await addToCart(product.id, quantity);
    if (result.success) {
      // הצגת הודעת הצלחה
      alert('המוצר נוסף לעגלה בהצלחה!');
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    // ולידציה
    const validation = validateReviewForm(reviewForm);
    if (!validation.isValid) {
      setReviewErrors(validation.errors);
      return;
    }

    setReviewErrors({});

    // שליחת ביקורת
    const result = editingReview
      ? await updateReview(editingReview.id, reviewForm)
      : await addReview(reviewForm);

    if (result.success) {
      setShowReviewForm(false);
      setEditingReview(null);
      setReviewForm({ rating: 5, comment: '' });
      alert(editingReview ? 'הביקורת עודכנה!' : 'הביקורת נוספה!');
    } else {
      setReviewErrors({ general: result.error });
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setReviewForm({
      rating: review.rating,
      comment: review.comment || ''
    });
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את הביקורת?')) {
      const result = await deleteReview(reviewId);
      if (result.success) {
        alert('הביקורת נמחקה!');
      }
    }
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type={interactive ? 'button' : undefined}
          onClick={interactive ? () => onStarClick?.(i) : undefined}
          className={`
            ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
            ${i <= rating ? 'text-warning-400' : 'text-gray-300'}
          `}
          disabled={!interactive}
        >
          ⭐
        </button>
      );
    }
    return stars;
  };

  const userReview = reviews.find(review => review.user_id === user?.id);
  const otherReviews = reviews.filter(review => review.user_id !== user?.id);

  if (loading) {
    return (
      <div className="container py-8">
        <Loading size="large" text="טוען פרטי מוצר..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-8">
        <div className="error-container">
          <h2 className="error-title">שגיאה</h2>
          <p className="error-message">
            {error || 'המוצר לא נמצא'}
          </p>
          <div className="flex gap-4 mt-4">
            <button 
              onClick={() => navigate(-1)}
              className="btn btn-outline"
            >
              חזרה
            </button>
            <Link to="/products" className="btn btn-primary">
              צפה במוצרים אחרים
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div className="container py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-primary-600">בית</Link>
        <span>›</span>
        <Link to="/products" className="hover:text-primary-600">מוצרים</Link>
        {product.category_name && (
          <>
            <span>›</span>
            <Link 
              to={`/products?category=${product.category_id}`}
              className="hover:text-primary-600"
            >
              {product.category_name}
            </Link>
          </>
        )}
        <span>›</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg bg-gray-100"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            
            <div 
              className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center text-4xl text-gray-400"
              style={{ display: product.image_url ? 'none' : 'flex' }}
            >
              📦
            </div>

            {isOutOfStock && (
              <div className="absolute top-4 right-4 bg-error-500 text-white px-3 py-1 rounded-lg font-semibold">
                אזל מהמלאי
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            
            {product.category_name && (
              <Link 
                to={`/products?category=${product.category_id}`}
                className="inline-block text-primary-600 hover:text-primary-700 text-sm font-medium mb-4"
              >
                📂 {product.category_name}
              </Link>
            )}

            {/* Rating */}
            {product.average_rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {renderStars(product.average_rating)}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.review_count} ביקורות)
                </span>
              </div>
            )}

            <div className="text-4xl font-bold text-primary-600 mb-4">
              {formatPrice(product.price)}
            </div>

            {/* Stock Info */}
            <div className="mb-6">
              {isOutOfStock ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-error-100 text-error-800">
                  ❌ אזל מהמלאי
                </span>
              ) : product.stock < 10 ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-warning-100 text-warning-800">
                  ⚠️ נותרו {product.stock} במלאי
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success-100 text-success-800">
                  ✅ במלאי
                </span>
              )}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          {!isOutOfStock && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  כמות
                </label>
                <div className="flex items-center gap-3">
                  <div className="quantity-control">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="quantity-button"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      min="1"
                      max={product.stock}
                      className="quantity-input"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="quantity-button"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    מקסימום {product.stock}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                {isAuthenticated ? (
                  <button
                    onClick={handleAddToCart}
                    disabled={cartLoading}
                    className="btn btn-primary btn-lg flex-1"
                  >
                    {cartLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        מוסיף לעגלה...
                      </span>
                    ) : (
                      <>🛒 הוסף לעגלה</>
                    )}
                  </button>
                ) : (
                  <Link to="/login" className="btn btn-primary btn-lg flex-1">
                    התחבר כדי לרכוש
                  </Link>
                )}
                
                <button className="btn btn-outline btn-lg">
                  ❤️
                </button>
              </div>
            </div>
          )}

          {/* Product Features */}
          <div className="space-y-3 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-success-600">✓</span>
              <span>משלוח חינם מעל ₪199</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-success-600">✓</span>
              <span>אחריות יצרן מלאה</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-success-600">✓</span>
              <span>החזרה עד 30 יום</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-success-600">✓</span>
              <span>תמיכה טכנית 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      {product.description && (
        <div className="mb-12">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              תיאור המוצר
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mb-12">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  ביקורות ({reviews.length})
                </h2>
                {product.average_rating && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex">
                      {renderStars(product.average_rating)}
                    </div>
                    <span className="text-lg font-medium">
                      {product.average_rating.toFixed(1)}
                    </span>
                    <span className="text-gray-600">
                      מתוך 5 כוכבים
                    </span>
                  </div>
                )}
              </div>

              {isAuthenticated && !userReview && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="btn btn-primary"
                >
                  ✍️ כתוב ביקורת
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {/* User's Review */}
            {userReview && (
              <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-primary-800">
                    הביקורת שלך
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditReview(userReview)}
                      className="text-sm text-primary-600 hover:text-primary-800"
                    >
                      ✏️ ערוך
                    </button>
                    <button
                      onClick={() => handleDeleteReview(userReview.id)}
                      className="text-sm text-error-600 hover:text-error-800"
                    >
                      🗑️ מחק
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {renderStars(userReview.rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {formatDate(userReview.created_at)}
                  </span>
                </div>
                {userReview.comment && (
                  <p className="text-gray-700">{userReview.comment}</p>
                )}
              </div>
            )}

            {/* Review Form */}
            {showReviewForm && (
              <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-4">
                  {editingReview ? 'ערוך ביקורת' : 'כתוב ביקורת'}
                </h3>
                
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {reviewErrors.general && (
                    <div className="alert alert-error">
                      <p>{reviewErrors.general}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      דירוג *
                    </label>
                    <div className="flex">
                      {renderStars(
                        reviewForm.rating, 
                        true, 
                        (rating) => setReviewForm(prev => ({ ...prev, rating }))
                      )}
                    </div>
                    {reviewErrors.rating && (
                      <p className="text-error-600 text-sm mt-1">
                        {reviewErrors.rating[0]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      תגובה (אופציונלי)
                    </label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm(prev => ({ 
                        ...prev, 
                        comment: e.target.value 
                      }))}
                      rows={4}
                      className="form-textarea"
                      placeholder="שתף את החוויה שלך עם המוצר..."
                    />
                    {reviewErrors.comment && (
                      <p className="text-error-600 text-sm mt-1">
                        {reviewErrors.comment[0]}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button type="submit" className="btn btn-primary">
                      {editingReview ? 'עדכן ביקורת' : 'פרסם ביקורת'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowReviewForm(false);
                        setEditingReview(null);
                        setReviewForm({ rating: 5, comment: '' });
                        setReviewErrors({});
                      }}
                      className="btn btn-outline"
                    >
                      ביטול
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Other Reviews */}
            {reviewsLoading ? (
              <Loading text="טוען ביקורות..." />
            ) : otherReviews.length > 0 ? (
              <div className="space-y-4">
                {otherReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-medium text-sm">
                          {review.user_name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {review.user_name || 'משתמש אנונימי'}
                          </h4>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-gray-500">
                              {getRelativeTime(review.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-gray-700 mr-11">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : !userReview ? (
              <div className="text-center py-8 text-gray-500">
                <p>עדיין אין ביקורות למוצר זה</p>
                {isAuthenticated && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="btn btn-primary mt-4"
                  >
                    היה הראשון לכתוב ביקורת
                  </button>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          מוצרים דומים
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-500 text-center">
            מוצרים דומים יוצגו בקרוב...
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;