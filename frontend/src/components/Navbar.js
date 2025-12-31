import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/images/logo.jpg';

const Navbar = () => {
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

  return (
    <nav id="navbar" className={isVisible ? 'visible' : 'hidden'}>
      <div className="logo">
        <img src={logo} alt="লোগো" />
      </div>
      <div className="nav-links">
        <Link to="/">হোম</Link>
        <Link to="/services">সেবাসমূহ</Link>
        <Link to="/about">আমাদের সম্পর্কে</Link>
        <Link to="/login">লগইন</Link>
        <Link to="/signup">সাইন আপ</Link>
      </div>
      <div className="decorated-container">
        <div className="brand-badge" id="farmfriend" role="img" aria-label="FarmFriend">
          <div className="badge-icon" aria-hidden="true">
            <img src={logo} alt="FarmFriend Logo" style={{ width: '28px', height: '28px', objectFit: 'contain', borderRadius: '6px' }} />
          </div>
          <div className="brand-text">
            <span className="brand-name">FarmFriend</span>
            <span className="brand-tag">Modern Farming</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
