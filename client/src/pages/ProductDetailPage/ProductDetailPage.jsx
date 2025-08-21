import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { productsService } from '../../services/productsService';
import ProductCard from '../../components/products/ProductCard/ProductCard';
import ReviewList from '../../components/reviews/ReviewList/ReviewList';
import ProductRecommendations from '../../components/products/ProductRecommendations/ProductRecommendations';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const { execute, loading, error } = useApi();

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    const { success, data } = await execute(() => 
      productsService.getProductById(productId)
    );
    if (success) {
      setProduct(data);
    }
  };

  if (loading) return <div className="loading">Loading product...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="product-detail-page">
      <div className="product-section">
        <ProductCard product={product} detailed />
      </div>

      <div className="reviews-section">
        <ReviewList productId={productId} />
      </div>

      <div className="recommendations-section">
        <h2>You might also like</h2>
        <ProductRecommendations 
          categoryId={product.categoryId}
          currentProductId={productId}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;