import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AccountSelectPage.css";

// Set to true to use mock data for testing (set to false in production)
const USE_MOCK_DATA = false;

// Demo mock roles for testing (simulates user with multiple roles)
const MOCK_ROLES = ["farmersId", "agronomistsId"];

const AccountSelectPage = () => {
  const navigate = useNavigate();
  const [foundRoles, setFoundRoles] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  // Role redirects mapping - farmers go to farmer dashboard, others to profile
  const roleRedirects = {
    farmersId: "/farmer-dashboard",
    "rent-ownersId": "/profile",
    "storage-ownersId": "/profile",
    agronomistsId: "/profile",
  };

  // Role labels in Bengali
  const roleLabels = {
    farmersId: "কৃষক",
    "rent-ownersId": "ভাড়া মালিক",
    "storage-ownersId": "স্টোরেজ মালিক",
    agronomistsId: "কৃষি বিশেষজ্ঞ",
  };

  // Cookie helper functions
  const getCookie = (name) => {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(
          cookie.substring(nameEQ.length, cookie.length)
        );
      }
    }
    return null;
  };

  const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${encodeURIComponent(
      value || ""
    )}${expires}; path=/`;
  };

  useEffect(() => {
    // Use mock data if enabled
    if (USE_MOCK_DATA) {
      setFoundRoles(MOCK_ROLES);
      setShowPopup(true);
      return;
    }

    const roles = [
      "farmersId",
      "rent-ownersId",
      "storage-ownersId",
      "agronomistsId",
    ];
    const found = [];

    roles.forEach((role) => {
      const roleValue = getCookie(role);
      if (roleValue) {
        found.push(role);
      }
    });

    if (found.length === 0) {
      // No roles found, redirect to home
      navigate("/");
      return;
    }

    if (found.length === 1) {
      // Only one role, auto-redirect
      setCookie("selectedRole", found[0], 7);
      navigate(roleRedirects[found[0]]);
      return;
    }

    // Multiple roles found, show popup
    setFoundRoles(found);
    setShowPopup(true);
  }, [navigate, roleRedirects]);

  const handleRoleSelect = (role) => {
    setCookie("selectedRole", role, 7);
    navigate(roleRedirects[role]);
  };

  const handleClose = () => {
    setShowPopup(false);
    navigate("/");
  };

  return (
    <div className="account-select-page">
      <div className="account-select-background">
        <div className="account-select-container">
          <h1 className="welcome-title">স্বাগতম!</h1>
          <p>
            আপনার একাধিক অ্যাকাউন্ট আছে, দয়া করে কোনটি ব্যবহার করতে চান তা
            নির্বাচন করুন।
          </p>
          <p>
            <em>অন্যথায়, আপনাকে স্বয়ংক্রিয়ভাবে পুনর্নির্দেশিত করা হবে।</em>
          </p>
        </div>

        {showPopup && (
          <div className="popup-overlay" onClick={handleClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
              <h2>অ্যাকাউন্টের ধরন নির্বাচন করুন</h2>
              <ul className="account-list">
                {foundRoles.map((role) => (
                  <li key={role} onClick={() => handleRoleSelect(role)}>
                    <button className="account-btn">
                      {roleLabels[role]} হিসাবে প্রবেশ করুন
                    </button>
                  </li>
                ))}
              </ul>
              <button className="btn-close-popup" onClick={handleClose}>
                বন্ধ করুন
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSelectPage;
