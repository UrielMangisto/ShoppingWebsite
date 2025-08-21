import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../../hooks/useApi';
import { productsService } from '../../../services/productsService';
import './ProductSearch.css';

const ProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { execute: searchProducts } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }

      const { success, data } = await searchProducts(
        () => productsService.searchProducts(searchTerm)
      );

      if (success) {
        setSuggestions(data.slice(0, 5));
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (productId) => {
    navigate(`/products/${productId}`);
    setShowSuggestions(false);
    setSearchTerm('');
  };

  return (
    <div className="product-search">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search products..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          <i className="fas fa-search"></i>
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="search-suggestions">
          {suggestions.map((product) => (
            <div
              key={product._id}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(product._id)}
            >
              <img src={product.image} alt={product.name} className="suggestion-image" />
              <div className="suggestion-details">
                <span className="suggestion-name">{product.name}</span>
                <span className="suggestion-price">${product.price.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;