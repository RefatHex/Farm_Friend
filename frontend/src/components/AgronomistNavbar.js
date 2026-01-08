import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AgronomistNavbar.css';
import logo from '../assets/images/logo.jpg';

const AgronomistNavbar = () => {
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
    // Clear all cookies and localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("selectedRole");
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "selectedRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "agronomistsId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    navigate('/login');
  };

  return (
    <nav className={`agronomist-nav ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/agronomist-dashboard">
            <img src={logo} alt="FarmFriend Logo" />
            <span className="logo-text">FarmFriend</span>
          </Link>
        </div>
        
        <div className="nav-links">
          <Link to="/agronomist-dashboard" className="nav-link">
            ড্যাশবোর্ড
          </Link>
          <Link to="/agronomist-profile-setup" className="nav-link">
            প্রোফাইল সেটআপ
          </Link>
          <Link to="/profile" className="nav-link">
            প্রোফাইল
          </Link>
          <button className="logout-btn" onClick={handleLogout}>
            লগআউট
          </button>
        </div>
      </div>
      
      <div className="nav-badge">
        <span className="badge-label">কৃষি বিশেষজ্ঞ ড্যাশবোর্ড</span>
      </div>
    </nav>
  );
};

export default AgronomistNavbar;
