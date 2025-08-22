// src/components/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-section">
            <h3>אודות החנות</h3>
            <p className="text-gray-300 mb-4">
              החנות האונליין המובילה בישראל עם מגוון רחב של מוצרים איכותיים 
              במחירים הוגנים ושירות מעולה.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                📘 Facebook
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                📷 Instagram
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                🐦 Twitter
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3>קישורים מהירים</h3>
            <ul className="footer-links">
              <li>
                <Link to="/">בית</Link>
              </li>
              <li>
                <Link to="/products">מוצרים</Link>
              </li>
              <li>
                <Link to="/about">אודותינו</Link>
              </li>
              <li>
                <Link to="/contact">צור קשר</Link>
              </li>
              <li>
                <Link to="/faq">שאלות נפוצות</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-section">
            <h3>שירות לקוחות</h3>
            <ul className="footer-links">
              <li>
                <Link to="/shipping">מידע על משלוחים</Link>
              </li>
              <li>
                <Link to="/returns">החזרות והחלפות</Link>
              </li>
              <li>
                <Link to="/warranty">אחריות</Link>
              </li>
              <li>
                <Link to="/privacy">מדיניות פרטיות</Link>
              </li>
              <li>
                <Link to="/terms">תנאי שימוש</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3>יצירת קשר</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>רחוב הדוגמה 123, תל אביב</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📞</span>
                <a 
                  href="tel:03-1234567" 
                  className="hover:text-white transition-colors"
                >
                  03-1234567
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span>✉️</span>
                <a 
                  href="mailto:info@store.com" 
                  className="hover:text-white transition-colors"
                >
                  info@store.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span>🕒</span>
                <span>ראשון-חמישי: 9:00-18:00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p>
              © {currentYear} חנות אונליין. כל הזכויות שמורות.
            </p>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span>💳</span>
                <span className="text-sm">תשלומים מאובטחים</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🚚</span>
                <span className="text-sm">משלוח מהיר</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🔒</span>
                <span className="text-sm">אתר מאובטח</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-700 text-center text-sm">
            <p>
              פותח עם ❤️ בישראל | 
              <Link to="/sitemap" className="hover:text-white mx-2">
                מפת אתר
              </Link>
              |
              <Link to="/accessibility" className="hover:text-white mx-2">
                נגישות
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;