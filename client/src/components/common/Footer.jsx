import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Footer Top */}
        <div className="footer-top">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">🛍️</span>
              <span className="logo-text">E-Store</span>
            </div>
            <p className="footer-description">
              Your one-stop shop for everything you need. Quality products, 
              great prices, and excellent customer service.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                📘
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                🐦
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                📷
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                💼
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">Home</Link>
              </li>
              <li>
                <Link to="/products" className="footer-link">Products</Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">Contact</Link>
              </li>
              <li>
                <Link to="/blog" className="footer-link">Blog</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-section">
            <h3 className="footer-title">Customer Service</h3>
            <ul className="footer-links">
              <li>
                <Link to="/help" className="footer-link">Help Center</Link>
              </li>
              <li>
                <Link to="/shipping" className="footer-link">Shipping Info</Link>
              </li>
              <li>
                <Link to="/returns" className="footer-link">Returns</Link>
              </li>
              <li>
                <Link to="/track-order" className="footer-link">Track Order</Link>
              </li>
              <li>
                <Link to="/size-guide" className="footer-link">Size Guide</Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="footer-section">
            <h3 className="footer-title">My Account</h3>
            <ul className="footer-links">
              <li>
                <Link to="/login" className="footer-link">Sign In</Link>
              </li>
              <li>
                <Link to="/register" className="footer-link">Create Account</Link>
              </li>
              <li>
                <Link to="/profile" className="footer-link">My Profile</Link>
              </li>
              <li>
                <Link to="/orders" className="footer-link">Order History</Link>
              </li>
              <li>
                <Link to="/wishlist" className="footer-link">Wishlist</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-section newsletter-section">
            <h3 className="footer-title">Newsletter</h3>
            <p className="newsletter-description">
              Subscribe to get special offers, free giveaways, and updates.
            </p>
            <form className="newsletter-form">
              <div className="newsletter-input-group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-btn">
                  Subscribe
                </button>
              </div>
            </form>
            <p className="newsletter-privacy">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            {/* Copyright */}
            <div className="footer-copyright">
              <p>
                © {currentYear} E-Store. All rights reserved. Built with ❤️ for shopping.
              </p>
            </div>

            {/* Legal Links */}
            <div className="footer-legal">
              <Link to="/privacy" className="legal-link">Privacy Policy</Link>
              <Link to="/terms" className="legal-link">Terms of Service</Link>
              <Link to="/cookies" className="legal-link">Cookie Policy</Link>
            </div>

            {/* Payment Methods */}
            <div className="payment-methods">
              <span className="payment-text">We accept:</span>
              <div className="payment-icons">
                <span className="payment-icon" title="Visa">💳</span>
                <span className="payment-icon" title="Mastercard">💳</span>
                <span className="payment-icon" title="PayPal">💰</span>
                <span className="payment-icon" title="Apple Pay">📱</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="trust-badges">
          <div className="trust-badge">
            <span className="trust-icon">🔒</span>
            <span className="trust-text">Secure Shopping</span>
          </div>
          <div className="trust-badge">
            <span className="trust-icon">🚚</span>
            <span className="trust-text">Free Shipping</span>
          </div>
          <div className="trust-badge">
            <span className="trust-icon">↩️</span>
            <span className="trust-text">Easy Returns</span>
          </div>
          <div className="trust-badge">
            <span className="trust-icon">📞</span>
            <span className="trust-text">24/7 Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;