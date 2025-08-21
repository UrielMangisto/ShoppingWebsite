import { useSearchParams } from 'react-router-dom';
import ProductList from '../../components/products/ProductList/ProductList';
import ProductFilter from '../../components/products/ProductFilter/ProductFilter';
import './SearchResultsPage.css';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  return (
    <div className="search-results-page">
      <aside className="filters-sidebar">
        <ProductFilter />
      </aside>

      <main className="results-content">
        <h1>Search Results for "{query}"</h1>
        <ProductList searchQuery={query} />
      </main>
    </div>
  );
};

export default SearchResultsPage;