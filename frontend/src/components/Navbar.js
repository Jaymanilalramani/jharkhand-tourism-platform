import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css'; // CSS file import karein

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Check if link is active
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <div className="logo">
          <Link to="/">🌿 Jharkhand Tourism</Link>
        </div>
        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${isActiveLink('/') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Home</span>
          </Link>
          <Link 
            to="/destinations" 
            className={`nav-link ${isActiveLink('/destinations') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <span className="nav-icon">🗺️</span>
            <span className="nav-text">Destinations</span>
          </Link>
          <Link 
            to="/itinerary" 
            className={`nav-link ${isActiveLink('/itinerary') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <span className="nav-icon">🤖</span>
            <span className="nav-text">AI Itinerary</span>
          </Link>
          <Link 
            to="/marketplace" 
            className={`nav-link ${isActiveLink('/marketplace') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <span className="nav-icon">🛒</span>
            <span className="nav-text">Marketplace</span>
          </Link>
          <Link 
            to="/arvr" 
            className={`nav-link ${isActiveLink('/arvr') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <span className="nav-icon">👓</span>
            <span className="nav-text">AR/VR</span>
          </Link>
          <Link 
            to="/analytics" 
            className={`nav-link ${isActiveLink('/analytics') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Analytics</span>
          </Link>
        </div>
        <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;