import React from 'react';
import './AccessDenied.css';

const AccessDenied = () => {
  return (
    <div className="access-denied">
      <h2>Access Denied</h2>
      <p>You need admin privileges to access this page.</p>
    </div>
  );
};

export default AccessDenied;
