import { useState } from 'react';
import CategoryFilter from '../../components/categories/CategoryFilter/CategoryFilter';
import ProductList from '../../components/products/ProductList/ProductList';
import ProductSearch from '../../components/products/ProductSearch/ProductSearch';
import ProductFilter from '../../components/products/ProductFilter/ProductFilter';
import './ProductsPage.css';

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest'
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="products-page">
      <aside className="filters-sidebar">
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <ProductFilter
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </aside>

      <main className="products-content">
        <div className="products-header">
          <h1>All Products</h1>
          <ProductSearch 
            initialQuery={searchQuery}
            onSearch={handleSearch}
          />
        </div>

        <ProductList
          categoryId={selectedCategory}
          searchQuery={searchQuery}
          filters={filters}
        />
      </main>
    </div>
  );
};

export default ProductsPage;