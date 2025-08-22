// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import Loading, { ProductCardSkeleton } from '../components/common/Loading';
import ProductCard from '../components/products/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // טעינת מוצרים מומלצים (חדשים ביותר)
      const [productsResponse, categoriesResponse] = await Promise.all([
        productService.getAllProducts({ 
          sortBy: 'created_desc', 
          limit: 8 
        }),
        categoryService.getAllCategories()
      ]);

      setFeaturedProducts(productsResponse);
      setCategories(categoriesResponse);
    } catch (error) {
      console.error('Error loading home data:', error);
      setError('שגיאה בטעינת נתונים');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="py-12">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-12 animate-pulse"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-container">
          <h2 className="error-title">שגיאה</h2>
          <p className="error-message">{error}</p>
          <button 
            onClick={loadHomeData}
            className="btn btn-primary mt-4"
          >
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-l from-primary-600 to-primary-800 text-white py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            ברוכים הבאים לחנות האונליין שלנו
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            מגוון רחב של מוצרים איכותיים במחירים הטובים ביותר
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/products" 
              className="btn btn-secondary btn-lg"
            >
              🛍️ צפה במוצרים
            </Link>
            <Link 
              to="/register" 
              className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary-600"
            >
              📝 הצטרף אלינו
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              קטגוריות מוצרים
            </h2>
            <p className="text-lg text-gray-600">
              גלה את המגוון הרחב של המוצרים שלנו
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.slice(0, 10).map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group"
              >
                <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-300 transition-all">
                  <div className="text-3xl mb-3">📦</div>
                  <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link 
              to="/products" 
              className="btn btn-outline"
            >
              צפה בכל הקטגוריות
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              מוצרים מומלצים
            </h2>
            <p className="text-lg text-gray-600">
              המוצרים החדשים והפופולריים ביותר
            </p>
          </div>

          {featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="text-center mt-8">
                <Link 
                  to="/products" 
                  className="btn btn-primary btn-lg"
                >
                  צפה בכל המוצרים
                </Link>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <h3 className="empty-state-title">אין מוצרים להצגה</h3>
              <p className="empty-state-description">
                נראה שאין מוצרים זמינים כרגע
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              למה לבחור בנו?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                🚚
              </div>
              <h3 className="text-xl font-semibold mb-2">משלוח מהיר</h3>
              <p className="text-gray-600">
                משלוח עד הבית בתוך 24-48 שעות לכל הארץ
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                💳
              </div>
              <h3 className="text-xl font-semibold mb-2">תשלום מאובטח</h3>
              <p className="text-gray-600">
                תשלום מאובטח בכל כרטיסי האשראי ובPayPal
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                🏆
              </div>
              <h3 className="text-xl font-semibold mb-2">איכות מובטחת</h3>
              <p className="text-gray-600">
                מוצרים איכותיים עם אחריות מלאה ושירות לקוחות מעולה
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            הישאר מעודכן
          </h2>
          <p className="text-xl mb-8 opacity-90">
            קבל עדכונים על מוצרים חדשים ומבצעים מיוחדים
          </p>
          
          <form className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="כתובת האימייל שלך"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
              required
            />
            <button 
              type="submit"
              className="btn btn-secondary px-6"
            >
              הירשם
            </button>
          </form>
          
          <p className="text-sm mt-4 opacity-75">
            לא נשתף את המידע שלך עם גורמים שלישיים
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;