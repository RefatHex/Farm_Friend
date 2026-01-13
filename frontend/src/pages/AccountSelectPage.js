import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.jpg";
import "./AccountSelectPage.css";

// Role redirects mapping - defined outside component to avoid recreation
const ROLE_REDIRECTS = {
  farmersId: "/farmer-dashboard",
  "rent-ownersId": "/rental-admin",
  "storage-ownersId": "/profile",
  agronomistsId: "/agronomist-profile-setup",
};

// Role labels in Bengali
const ROLE_LABELS = {
  farmersId: "কৃষক",
  "rent-ownersId": "ভাড়া মালিক",
  "storage-ownersId": "স্টোরেজ মালিক",
  agronomistsId: "কৃষি বিশেষজ্ঞ",
};

// Role icons/descriptions in Bengali
const ROLE_DESCRIPTIONS = {
  farmersId: "আপনার কৃষি কার্যক্রম পরিচালনা করুন",
  "rent-ownersId": "ভাড়া সেবা পরিচালনা করুন",
  "storage-ownersId": "স্টোরেজ সেবা পরিচালনা করুন",
  agronomistsId: "পরামর্শ সেবা প্রদান করুন",
};

const AccountSelectPage = () => {
  const navigate = useNavigate();
  const [foundRoles, setFoundRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      // No roles found, redirect to login
      setError("কোনো অ্যাকাউন্ট খুঁজে পাওয়া যায়নি। অনুগ্রহ করে লগইন করুন।");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }

    if (found.length === 1) {
      // Only one role, auto-redirect immediately
      setCookie("selectedRole", found[0], 7);
      navigate(ROLE_REDIRECTS[found[0]]);
      return;
    }

    // Multiple roles found, show selection page
    setFoundRoles(found);
    setLoading(false);
  }, [navigate]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setLoading(true);
    console.log("Role selected:", role);
    console.log("Redirecting to:", ROLE_REDIRECTS[role]);

    setTimeout(() => {
      setCookie("selectedRole", role, 7);
      navigate(ROLE_REDIRECTS[role]);
    }, 500);
  };

  const handleLogout = () => {
    // Clear all role cookies
    const roles = [
      "farmersId",
      "rent-ownersId",
      "storage-ownersId",
      "agronomistsId",
    ];
    roles.forEach((role) => {
      document.cookie = `${role}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "selectedRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("userId");
    navigate("/login");
  };

  if (error) {
    return (
      <div className="account-select-page">
        <div className="account-select-background">
          <div className="account-select-container">
            <h1 className="welcome-title">ত্রুটি</h1>
            <p style={{ color: "red" }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="account-select-page">
        <div className="account-select-background">
          <div className="account-select-container">
            <h1 className="welcome-title">লোড হচ্ছে...</h1>
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-select-page">
      <div className="account-select-background">
        {/* Top Navigation */}
        <nav className="account-select-navbar">
          <div className="navbar-logo" onClick={() => navigate("/")}>
            <img src={logo} alt="FarmFriend Logo" />
            <span>FarmFriend</span>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            লগ আউট
          </button>
        </nav>

        {/* Main Container */}
        <div className="account-select-container">
          <h1 className="welcome-title">স্বাগতম!</h1>
          <p className="subtitle">
            আপনার একাধিক অ্যাকাউন্ট রয়েছে। দয়া করে চালিয়ে যেতে একটি নির্বাচন
            করুন।
          </p>

          {/* Role Selection Cards */}
          <div className="role-cards-container">
            {foundRoles.map((role) => (
              <div
                key={role}
                className={`role-card ${
                  selectedRole === role ? "selected" : ""
                }`}
                onClick={() => handleRoleSelect(role)}
              >
                <div className="role-icon">
                  {role === "farmersId" && "🌾"}
                  {role === "rent-ownersId" && "🚜"}
                  {role === "storage-ownersId" && "📦"}
                  {role === "agronomistsId" && "👨‍🌾"}
                </div>
                <h3 className="role-label">{ROLE_LABELS[role]}</h3>
                <p className="role-description">{ROLE_DESCRIPTIONS[role]}</p>
                <button className="role-select-btn">
                  {selectedRole === role ? "নির্বাচিত ✓" : "নির্বাচন করুন"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSelectPage;
