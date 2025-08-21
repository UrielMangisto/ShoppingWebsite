import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/products/ProductCard/ProductCard';
import './SearchResultsPage.css';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const { searchProducts } = useProducts();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const results = await searchProducts(query);
        setProducts(results);
        setError(null);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to load search results');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, searchProducts]);

  if (loading) {
    return (
      <div className="search-results-page">
        <div className="loading-spinner">Searching...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-results-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="search-results-page">
        <div className="no-query-message">
          Enter a search term to find products
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-page">
      <div className="search-header">
        <h1>Search Results</h1>
        <p className="search-summary">
          {products.length === 0
            ? `No products found for "${query}"`
            : `Found ${products.length} product${products.length === 1 ? '' : 's'} for "${query}"`}
        </p>
      </div>

      {products.length > 0 && (
        <div className="search-results">
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {products.length === 0 && (
        <div className="no-results">
          <p>Try:</p>
          <ul>
            <li>Checking your spelling</li>
            <li>Using more general terms</li>
            <li>Using fewer terms</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
