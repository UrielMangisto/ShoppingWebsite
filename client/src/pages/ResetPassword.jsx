import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="page-container">
      <div className="empty-state fade-in">
        <div className="empty-state-icon">
          404
        </div>
        <h1 className="empty-state-title">Page Not Found</h1>
        <p className="empty-state-description">
          Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered the wrong URL.
        </p>
        <div className="empty-state-actions">
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
          <button onClick={() => window.history.back()} className="btn btn-secondary">
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;