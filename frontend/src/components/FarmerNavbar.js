import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './FarmerNavbar.css';
import logo from '../assets/images/logo.jpg';

const FarmerNavbar = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
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
    
    // Redirect to login
    navigate('/login');
  };

  return (
    <nav id="farmer-navbar" className={`farmer-navbar ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="navbar-left">
        <div className="logo">
          <Link to="/farmer-dashboard">
            <img src={logo} alt="লোগো" />
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/farmer-dashboard">হোম</Link>
          <Link to="/profile">প্রোফাইল</Link>
          <button className="logout-btn" onClick={handleLogout}>লগআউট</button>
        </div>
      </div>
      <div className="decorated-container">
        <div className="brand-badge" id="farmfriend" role="img" aria-label="FarmFriend">
          <div className="badge-icon" aria-hidden="true">
            <img src={logo} alt="FarmFriend Logo" style={{ width: '28px', height: '28px', objectFit: 'contain', borderRadius: '6px' }} />
          </div>
          <div className="brand-text">
            <span className="brand-name">FarmFriend</span>
            <span className="brand-tag">কৃষক ড্যাশবোর্ড</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default FarmerNavbar;
