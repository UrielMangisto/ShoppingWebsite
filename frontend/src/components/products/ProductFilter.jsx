// src/components/products/ProductFilter.jsx
import React, { useState, useEffect } from 'react';

// src/components/products/ProductFilter.jsx
import React, { useState, useEffect } from 'react';

const ProductFilter = ({
  categories = [],
  selectedCategory = '',
  minPrice = '',
  maxPrice = '',
  onCategoryChange,
  onPriceRangeChange,
  onClearFilters
}) => {
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);
  const [priceError, setPriceError] = useState('');

  useEffect(() => {
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
  }, [minPrice, maxPrice]);

  const handlePriceChange = () => {
    setPriceError('');

    const min = parseFloat(localMinPrice) || 0;
    const max = parseFloat(localMaxPrice) || 0;

    // בדיקת תקינות
    if (localMinPrice && localMaxPrice && min > max) {
      setPriceError('המחיר המינימלי חייב להיות קטן מהמקסימלי');
      return;
    }

    if (min < 0 || max < 0) {
      setPriceError('המחיר חייב להיות חיובי');
      return;
    }

    onPriceRangeChange(localMinPrice, localMaxPrice);
  };

  const clearPriceRange = () => {
    setLocalMinPrice('');
    setLocalMaxPrice('');
    setPriceError('');
    onPriceRangeChange('', '');
  };

  const hasActiveFilters = selectedCategory || minPrice || maxPrice;

  const predefinedPriceRanges = [
    { label: 'עד ₪100', min: '', max: '100' },
    { label: '₪100 - ₪500', min: '100', max: '500' },
    { label: '₪500 - ₪1000', min: '500', max: '1000' },
    { label: 'מעל ₪1000', min: '1000', max: '' }
  ];

  return (
    <div className="filter-group">
      <div className="flex items-center justify-between mb-4">
        <h3 className="filter-title">סינון מוצרים</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-error-600 hover:text-error-800 font-medium"
          >
            נקה הכל
          </button>
        )}
      </div>

      {/* Categories Filter */}
      <div className="filter-section">
        <h4 className="filter-label">קטגוריות</h4>
        <div className="space-y-2">
          <label className="form-checkbox">
            <input
              type="radio"
              name="category"
              value=""
              checked={selectedCategory === ''}
              onChange={(e) => onCategoryChange('')}
              className="form-radio-input"
            />
            <span className="text-sm">כל הקטגוריות</span>
          </label>

          {categories.map((category) => (
            <label key={category.id} className="form-checkbox">
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={selectedCategory === category.id.toString()}
                onChange={(e) => onCategoryChange(category.id.toString())}
                className="form-radio-input"
              />
              <span className="text-sm">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="filter-section">
        <h4 className="filter-label">טווח מחירים</h4>
        
        {/* Predefined Price Ranges */}
        <div className="space-y-2 mb-4">
          {predefinedPriceRanges.map((range, index) => {
            const isSelected = minPrice === range.min && maxPrice === range.max;
            return (
              <button
                key={index}
                onClick={() => {
                  setLocalMinPrice(range.min);
                  setLocalMaxPrice(range.max);
                  onPriceRangeChange(range.min, range.max);
                }}
                className={`w-full text-right px-3 py-2 text-sm rounded border transition-colors ${
                  isSelected
                    ? 'bg-primary-100 border-primary-300 text-primary-800'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>

        {/* Custom Price Range */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              מחיר מינימלי
            </label>
            <div className="relative">
              <input
                type="number"
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(e.target.value)}
                onBlur={handlePriceChange}
                placeholder="0"
                min="0"
                step="1"
                className="form-input text-sm pl-6"
              />
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                ₪
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              מחיר מקסימלי
            </label>
            <div className="relative">
              <input
                type="number"
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
                onBlur={handlePriceChange}
                placeholder="ללא הגבלה"
                min="0"
                step="1"
                className="form-input text-sm pl-6"
              />
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                ₪
              </span>
            </div>
          </div>

          {priceError && (
            <p className="text-error-600 text-xs">{priceError}</p>
          )}

          <div className="flex gap-2">
            <button
              onClick={handlePriceChange}
              className="btn btn-primary btn-sm flex-1"
            >
              החל
            </button>
            <button
              onClick={clearPriceRange}
              className="btn btn-outline btn-sm"
              disabled={!localMinPrice && !localMaxPrice}
            >
              נקה
            </button>
          </div>
        </div>
      </div>

      {/* Additional Filters */}
      <div className="filter-section">
        <h4 className="filter-label">סינון נוסף</h4>
        <div className="space-y-2">
          <label className="form-checkbox">
            <input
              type="checkbox"
              className="form-checkbox-input"
              onChange={(e) => {
                // יכול להוסיף פילטר עבור מוצרים במלאי
              }}
            />
            <span className="text-sm">רק מוצרים במלאי</span>
          </label>

          <label className="form-checkbox">
            <input
              type="checkbox"
              className="form-checkbox-input"
              onChange={(e) => {
                // יכול להוסיף פילטר עבור מוצרים במבצע
              }}
            />
            <span className="text-sm">רק מוצרים במבצע</span>
          </label>

          <label className="form-checkbox">
            <input
              type="checkbox"
              className="form-checkbox-input"
              onChange={(e) => {
                // יכול להוסיף פילטר עבור מוצרים חדשים
              }}
            />
            <span className="text-sm">מוצרים חדשים (שבוע אחרון)</span>
          </label>

          <label className="form-checkbox">
            <input
              type="checkbox"
              className="form-checkbox-input"
              onChange={(e) => {
                // יכול להוסיף פילטר עבור מוצרים עם דירוג גבוה
              }}
            />
            <span className="text-sm">דירוג 4+ כוכבים</span>
          </label>
        </div>
      </div>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="filter-section bg-primary-50 border border-primary-200 rounded p-3">
          <h4 className="text-sm font-medium text-primary-800 mb-2">
            פילטרים פעילים:
          </h4>
          <div className="space-y-1 text-xs text-primary-700">
            {selectedCategory && (
              <div>
                קטגוריה: {categories.find(c => c.id.toString() === selectedCategory)?.name}
              </div>
            )}
            {(minPrice || maxPrice) && (
              <div>
                מחיר: ₪{minPrice || '0'} - ₪{maxPrice || '∞'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="filter-section">
        <div className="bg-gray-50 border border-gray-200 rounded p-3">
          <h4 className="text-sm font-medium text-gray-800 mb-1">
            💡 עצות לחיפוש
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• השתמש בחיפוש לאיתור מוצרים ספציפיים</li>
            <li>• סנן לפי קטגוריה לצמצום התוצאות</li>
            <li>• הגדר טווח מחירים למציאת מוצרים בתקציב</li>
            <li>• שלב מספר פילטרים לחיפוש מדויק יותר</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;