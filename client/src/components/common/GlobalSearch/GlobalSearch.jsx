import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GlobalSearch.css';

const GlobalSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    setSearchTerm('');
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="global-search">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleInputChange}
        className="global-search-input"
      />
      <button type="submit" className="global-search-btn">
        🔍
      </button>
    </form>
  );
};

export default GlobalSearch;