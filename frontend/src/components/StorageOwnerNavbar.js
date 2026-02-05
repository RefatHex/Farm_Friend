import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './StorageOwnerNavbar.css';
import logo from '../assets/images/logo.jpg';

const StorageOwnerNavbar = ({ ownerName }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    const handleMouseMove = (event) => {
      if (event.clientY <= 50) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [lastScrollY]);

  const handleLogout = () => {
    // Clear all cookies
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "selectedRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "farmersId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "rent-ownersId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "storage-ownersId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "agronomistsId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Clear localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    
    // Redirect to login
    navigate('/login');
  };

  return (
    <nav className={`storage-navbar ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="storage-navbar-container">
        {/* Logo Section */}
        <div className="storage-navbar-logo">
          <Link to="/storage-dashboard">
            <img src={logo} alt="FarmFriend Logo" />
            <div className="logo-text">
              <span className="logo-name">FarmFriend</span>
              <span className="logo-tag">স্টোরেজ ড্যাশবোর্ড</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="storage-navbar-links">
          <Link to="/storage-dashboard" className="nav-link">
            <span className="nav-icon">🏠</span>
            হোম
          </Link>
          <Link to="/profile" className="nav-link">
            <span className="nav-icon">👤</span>
            প্রোফাইল
          </Link>
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            লগআউট
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="storage-navbar-mobile">
          <Link to="/storage-dashboard" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
            🏠 হোম
          </Link>
          <Link to="/profile" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
            👤 প্রোফাইল
          </Link>
          <button className="mobile-logout-btn" onClick={handleLogout}>
            🚪 লগআউট
          </button>
        </div>
      )}
    </nav>
  );
};

export default StorageOwnerNavbar;
