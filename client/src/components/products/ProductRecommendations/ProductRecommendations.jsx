import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard/ProductCard';
import { productsService } from '../../../services/productsService';
import './ProductRecommendations.css';

const ProductRecommendations = ({ 
  type = 'related', 
  currentProductId = null, 
  categoryId = null, 
  title = 'You might also like',
  limit = 4 
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, [type, currentProductId, categoryId, limit]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let params = { limit };
      
      switch (type) {
        case 'related':
          // Get products from same category, excluding current product
          if (categoryId) {
            params.category = categoryId;
          }
          break;
          
        case 'popular':
          // Get highest rated products
          params.sortBy = 'rating_desc';
          break;
          
        case 'newest':
          // Get newest products
          params.sortBy = 'created_desc';
          break;
          
        case 'featured':
          // Get a mix of well-rated products
          params.sortBy = 'rating_desc';
          params.limit = limit + 2; // Get a few extra to filter
          break;
          
        default:
          params.sortBy = 'name_asc';
      }
      
      const data = await productsService.getAllProducts(params);
      let result = Array.isArray(data) ? data : [];
      
      // Exclude current product if specified
      if (currentProductId) {
        result = result.filter(product => product.id !== parseInt(currentProductId));
      }
      
      // Limit results
      result = result.slice(0, limit);
      
      setRecommendations(result);
    } catch (err) {
      setError(err.message);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="recommendations-section">
        <div className="recommendations-header">
          <h3 className="recommendations-title">{title}</h3>
        </div>
        <div className="recommendations-loading">
          <div className="loading-spinner-small"></div>
          <p>Loading recommendations...</p>
        </div>
      </div>
    );
  }

  if (error || recommendations.length === 0) {
    return null; // Don't show anything if no recommendations
  }

  return (
    <div className="recommendations-section">
      <div className="recommendations-header">
        <h3 className="recommendations-title">{title}</h3>
        {type === 'featured' && (
          <Link to="/products" className="view-all-link">
            View All Products
          </Link>
        )}
      </div>
      
      <div className="recommendations-grid">
        {recommendations.map((product) => (
          <div key={product.id} className="recommendation-item">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      
      {recommendations.length === limit && type !== 'featured' && (
        <div className="recommendations-footer">
          <Link to="/products" className="btn btn-outline">
            See More Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductRecommendations;