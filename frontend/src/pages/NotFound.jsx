// src/pages/NotFound.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-9xl font-extrabold text-gray-900 tracking-widest">
            404
          </h1>
          <div className="bg-primary-600 px-2 text-sm rounded rotate-12 absolute">
            דף לא נמצא
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            אופס! משהו השתבש
          </h2>
          <p className="text-gray-600 mb-6">
            הדף שחיפשת לא קיים או שהקישור שגוי. 
            יכול להיות שהדף הועבר או נמחק.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          <Link 
            to="/" 
            className="btn btn-primary btn-full btn-lg"
          >
            🏠 חזרה לדף הבית
          </Link>
          
          <button 
            onClick={handleGoBack}
            className="btn btn-outline btn-full btn-lg"
          >
            ← חזור לדף הקודם
          </button>
          
          <Link 
            to="/products" 
            className="btn btn-ghost btn-full"
          >
            🛍️ עבור לקטלוג המוצרים
          </Link>
        </div>

        {/* Search Suggestion */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🔍 נסה לחפש במקום
          </h3>
          <form className="space-y-3">
            <input
              type="text"
              placeholder="מה אתה מחפש?"
              className="form-input w-full"
            />
            <button 
              type="submit"
              className="btn btn-primary btn-full"
            >
              חפש
            </button>
          </form>
        </div>

        {/* Popular Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            דפים פופולריים
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Link 
              to="/products" 
              className="text-sm text-primary-600 hover:text-primary-800 p-2 bg-primary-50 rounded hover:bg-primary-100 transition-colors"
            >
              📦 מוצרים
            </Link>
            <Link 
              to="/contact" 
              className="text-sm text-primary-600 hover:text-primary-800 p-2 bg-primary-50 rounded hover:bg-primary-100 transition-colors"
            >
              📞 צור קשר
            </Link>
            <Link 
              to="/about" 
              className="text-sm text-primary-600 hover:text-primary-800 p-2 bg-primary-50 rounded hover:bg-primary-100 transition-colors"
            >
              ℹ️ אודותינו
            </Link>
            <Link 
              to="/faq" 
              className="text-sm text-primary-600 hover:text-primary-800 p-2 bg-primary-50 rounded hover:bg-primary-100 transition-colors"
            >
              ❓ שאלות נפוצות
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-xs text-gray-500">
          <p>
            אם אתה חושב שזו שגיאה, אנא{' '}
            <Link to="/contact" className="text-primary-600 hover:underline">
              צור איתנו קשר
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;