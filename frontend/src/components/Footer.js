import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-lg-3 mb-4 mb-md-0">
            <h2 className="footer-heading">FarmFriend</h2>
            <p>আধুনিক কৃষিকাজের প্রবেশদ্বার</p>
            <ul className="ftco-footer-social p-0">
              <li className="ftco-animate">
                <a href="#" data-toggle="tooltip" data-placement="top" title="Twitter">
                  <span className="fa fa-twitter">🐦</span>
                </a>
              </li>
              <li className="ftco-animate">
                <a href="#" data-toggle="tooltip" data-placement="top" title="Facebook">
                  <span className="fa fa-facebook">📘</span>
                </a>
              </li>
              <li className="ftco-animate">
                <a href="#" data-toggle="tooltip" data-placement="top" title="Instagram">
                  <span className="fa fa-instagram">📷</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-6 col-lg-3 pl-lg-5 mb-4 mb-md-0">
            <h2 className="footer-heading">দ্রুত পৌঁছান</h2>
            <ul className="list-unstyled">
              <li><a href="/" className="py-2 d-block">হোম</a></li>
              <li><a href="/about" className="py-2 d-block">আমাদের সম্পর্কে</a></li>
              <li><a href="/contact" className="py-2 d-block">যোগাযোগ</a></li>
            </ul>
          </div>
          <div className="col-md-6 col-lg-3 mb-4 mb-md-0">
            <h2 className="footer-heading">আপনার কোন প্রশ্ন আছে?</h2>
            <div className="block-23 mb-3">
              <ul>
                <li>
                  <span className="icon fa fa-map">📍</span>
                  <span className="text">১২১/২, ইউনুস টাওয়ার, বানানী, ঢাকা - ১২১২, বাংলাদেশ</span>
                </li>
                <li>
                  <a href="tel:+8801713706733">
                    <span className="icon fa fa-phone">📞</span>
                    <span className="text">+২ ৩৯২ ৩৯২৯ ২১০</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:farmFriend@gmail.com">
                    <span className="icon fa fa-paper-plane">✉</span>
                    <span className="text">farmFriend@gmail.com</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-12 text-center">
            <p className="copyright text-center">
              &copy; {currentYear} FarmFriend. All rights reserved. |
              A dream project by <strong>Team ReBuggers</strong>.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
