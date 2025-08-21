import { useState, useEffect } from 'react';
import { useApi } from '../../../hooks/useApi';
import { productsService } from '../../../services/productsService';
import ProductCard from '../ProductCard/ProductCard';
import './ProductRecommendations.css';

const ProductRecommendations = ({ currentProductId, categoryId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const { execute: fetchRecommendations, loading } = useApi();

  useEffect(() => {
    const loadRecommendations = async () => {
      const { success, data } = await fetchRecommendations(
        () => productsService.getRecommendations(currentProductId, categoryId)
      );

      if (success) {
        setRecommendations(data);
      }
    };

    if (currentProductId && categoryId) {
      loadRecommendations();
    }
  }, [currentProductId, categoryId]);

  if (loading || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="product-recommendations">
      <h2 className="recommendations-title">You May Also Like</h2>
      <div className="recommendations-grid">
        {recommendations.map((product) => (
          <div key={product._id} className="recommendation-item">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations;