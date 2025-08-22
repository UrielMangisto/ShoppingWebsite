// src/pages/Products.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { categoryService } from '../services/categoryService';
import { PRODUCT_SORT_OPTIONS, PRODUCT_SORT_LABELS } from '../utils/constants';
import { debounce } from '../utils/helpers';
import ProductCard from '../components/products/ProductCard';
import ProductFilter from '../components/products/ProductFilter';
import Loading, { ProductCardSkeleton } from '../components/common/Loading';
import Pagination from '../components/common/Pagination';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');

  // יצירת פילטרים מתוך URL params
  const getFiltersFromParams = useCallback(() => {
    return {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sortBy: searchParams.get('sortBy') || PRODUCT_SORT_OPTIONS.NAME_ASC,
      limit: 12,
      offset: (parseInt(searchParams.get('page') || '1') - 1) * 12
    };
  }, [searchParams]);

  const { 
    products, 
    loading, 
    error, 
    loadProducts,
    updateFilters 
  } = useProducts(getFiltersFromParams());

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      const newParams = new URLSearchParams(searchParams);
      if (searchTerm) {
        newParams.set('search', searchTerm);
      } else {
        newParams.delete('search');
      }
      newParams.delete('page'); // איפוס עמוד בחיפוש חדש
      setSearchParams(newParams);
    }, 500),
    [searchParams, setSearchParams]
  );

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    // עדכון פילטרים בעת שינוי URL
    const filters = getFiltersFromParams();
    updateFilters(filters);
    loadProducts(filters);
  }, [searchParams, getFiltersFromParams, updateFilters, loadProducts]);

  // עדכון חיפוש מקומי
  useEffect(() => {
    setLocalSearch(searchParams.get('search') || '');
  }, [searchParams]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    debouncedSearch(value);
  };

  const handleFilterChange = (filterName, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value) {
      newParams.set(filterName, value);
    } else {
      newParams.delete(filterName);
    }
    
    // איפוס עמוד בעת שינוי פילטר
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const handlePriceRangeChange = (minPrice, maxPrice) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (minPrice) {
      newParams.set('minPrice', minPrice);
    } else {
      newParams.delete('minPrice');
    }
    
    if (maxPrice) {
      newParams.set('maxPrice', maxPrice);
    } else {
      newParams.delete('maxPrice');
    }
    
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    if (page > 1) {
      newParams.set('page', page.toString());
    } else {
      newParams.delete('page');
    }
    setSearchParams(newParams);
    
    // גלילה לחלק העליון
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setLocalSearch('');
  };

  const currentPage = parseInt(searchParams.get('page') || '1');
  const hasActiveFilters = searchParams.toString() !== '';

  const selectedCategory = categories.find(cat => 
    cat.id.toString() === searchParams.get('category')
  );

  if (error) {
    return (
      <div className="container py-8">
        <div className="error-container">
          <h2 className="error-title">שגיאה בטעינת מוצרים</h2>
          <p className="error-message">{error}</p>
          <button 
            onClick={() => loadProducts()}
            className="btn btn-primary mt-4"
          >
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {selectedCategory ? selectedCategory.name : 'כל המוצרים'}
        </h1>
        <p className="text-gray-600">
          {selectedCategory 
            ? `מוצרים בקטגוריית ${selectedCategory.name}` 
            : 'גלה את המגוון הרחב של המוצרים שלנו'
          }
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="חיפוש מוצרים..."
                value={localSearch}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
              {localSearch && (
                <button
                  onClick={() => {
                    setLocalSearch('');
                    handleFilterChange('search', '');
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Sort */}
          <div className="flex gap-2">
            <select
              value={searchParams.get('sortBy') || PRODUCT_SORT_OPTIONS.NAME_ASC}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white min-w-0"
            >
              {Object.entries(PRODUCT_SORT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden btn btn-outline px-3"
            >
              🔧 סינון
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">פילטרים פעילים:</span>
              
              {searchParams.get('search') && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 rounded text-sm">
                  חיפוש: "{searchParams.get('search')}"
                  <button 
                    onClick={() => handleFilterChange('search', '')}
                    className="text-primary-600 hover:text-primary-800"
                  >
                    ✕
                  </button>
                </span>
              )}
              
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 rounded text-sm">
                  קטגוריה: {selectedCategory.name}
                  <button 
                    onClick={() => handleFilterChange('category', '')}
                    className="text-primary-600 hover:text-primary-800"
                  >
                    ✕
                  </button>
                </span>
              )}
              
              {(searchParams.get('minPrice') || searchParams.get('maxPrice')) && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 rounded text-sm">
                  טווח מחירים: ₪{searchParams.get('minPrice') || '0'} - ₪{searchParams.get('maxPrice') || '∞'}
                  <button 
                    onClick={() => {
                      handleFilterChange('minPrice', '');
                      handleFilterChange('maxPrice', '');
                    }}
                    className="text-primary-600 hover:text-primary-800"
                  >
                    ✕
                  </button>
                </span>
              )}
              
              <button
                onClick={clearAllFilters}
                className="text-sm text-error-600 hover:text-error-800 font-medium"
              >
                נקה הכל
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className={`lg:w-64 lg:block ${showFilters ? 'block' : 'hidden'}`}>
          <ProductFilter
            categories={categories}
            selectedCategory={searchParams.get('category')}
            minPrice={searchParams.get('minPrice')}
            maxPrice={searchParams.get('maxPrice')}
            onCategoryChange={(categoryId) => handleFilterChange('category', categoryId)}
            onPriceRangeChange={handlePriceRangeChange}
            onClearFilters={clearAllFilters}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Results Info */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-gray-600">
              {loading ? (
                <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
              ) : (
                <span>
                  {products.length > 0 
                    ? `נמצאו ${products.length} מוצרים`
                    : 'לא נמצאו מוצרים'
                  }
                </span>
              )}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }, (_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    onAddToCart={(product) => {
                      // יכול להוסיף הודעת הצלחה כאן
                      console.log('Product added to cart:', product.name);
                    }}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(products.length / 12)} // זה רק ערך זמני
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3 className="empty-state-title">לא נמצאו מוצרים</h3>
              <p className="empty-state-description">
                {hasActiveFilters 
                  ? 'נסה לשנות את הפילטרים או החיפוש'
                  : 'נראה שאין מוצרים זמינים כרגע'
                }
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="btn btn-primary mt-4"
                >
                  נקה פילטרים
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;