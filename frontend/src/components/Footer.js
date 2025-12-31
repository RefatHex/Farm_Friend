import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h2 className="footer-heading">FarmFriend</h2>
            <p>আধুনিক কৃষিকাজের প্রবেশদ্বার</p>
            <ul className="ftco-footer-social">
              <li><a href="#" title="Twitter">🐦</a></li>
              <li><a href="#" title="Facebook">📘</a></li>
              <li><a href="#" title="Instagram">📷</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h2 className="footer-heading">দ্রুত পৌঁছান</h2>
            <ul className="list-unstyled">
              <li><a href="/">হোম</a></li>
              <li><a href="/about">আমাদের সম্পর্কে</a></li>
              <li><a href="/contact">যোগাযোগ</a></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h2 className="footer-heading">যোগাযোগ</h2>
            <ul className="contact-list">
              <li>📍 ১২১/২, ইউনুস টাওয়ার, বানানী, ঢাকা</li>
              <li><a href="tel:+8801713706733">📞 +২ ৩৯২ ৩৯২৯ ২১০</a></li>
              <li><a href="mailto:farmFriend@gmail.com">✉️ farmFriend@gmail.com</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {currentYear} FarmFriend. All rights reserved. | A dream project by <strong>Team ReBuggers</strong>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
