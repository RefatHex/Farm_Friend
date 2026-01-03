import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.jpg";
import "./RentalAdminDashboard.css";

const RentalAdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalBookings: 0,
  });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get cookie helper
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const rentOwnerId = getCookie("rent-ownersId");

  useEffect(() => {
    fetchDashboardData();
    fetchBookings();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [rentItemsRes, rentOrdersRes] = await Promise.all([
        fetch("http://localhost:8000/api/rentals/rent-items/"),
        fetch("http://localhost:8000/api/rentals/rent-item-orders/"),
      ]);

      if (rentItemsRes.ok && rentOrdersRes.ok) {
        const rentItems = await rentItemsRes.json();
        const rentOrders = await rentOrdersRes.json();

        const totalProducts = rentItems.count || rentItems.results?.length || 0;
        const totalBookings = rentOrders.count || rentOrders.results?.length || 0;
        const uniqueUsers = new Set(
          (rentOrders.results || []).map((order) => order.rent_taker)
        ).size;

        setDashboardData({
          totalProducts,
          totalUsers: uniqueUsers,
          totalBookings,
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/rentals/rent-item-orders/`
      );
      if (response.ok) {
        const data = await response.json();
        setBookings(data.results || []);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleLogout = () => {
    // Clear cookies
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "rent-ownersId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "selectedRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login");
  };

  return (
    <div className="rental-admin-page">
      {/* Navbar */}
      <nav className="admin-navbar">
        <div className="navbar-logo">
          <Link to="/rental-admin">
            <img src={logo} alt="FarmFriend Logo" />
            <span>FarmFriend</span>
          </Link>
        </div>
        <ul>
          <li>
            <a
              href="#dashboard"
              className={activeSection === "dashboard" ? "active" : ""}
              onClick={() => setActiveSection("dashboard")}
            >
              ড্যাশবোর্ড
            </a>
          </li>
          <li>
            <a
              href="#bookings"
              className={activeSection === "bookings" ? "active" : ""}
              onClick={() => setActiveSection("bookings")}
            >
              বুকিংস
            </a>
          </li>
          <li>
            <Link to="/profile">প্রোফাইল</Link>
          </li>
          <li>
            <Link to="/rent-gig-actions">যন্ত্র আপলোড করুন</Link>
          </li>
          <li>
            <a href="#logout" onClick={handleLogout}>
              লগ আউট
            </a>
          </li>
        </ul>
      </nav>

      {/* Header Section */}
      <header className="admin-header">
        <div className="header-content">
          <h1>FarmFriend - অ্যাডমিন প্যানেল</h1>
          <h2>কৃষি সরঞ্জাম ব্যবস্থাপনার জন্য আপনার একমাত্র সমাধান</h2>
        </div>
      </header>

      {/* Main Content */}
      <div className="admin-main-container">
        {/* Dashboard Section */}
        {activeSection === "dashboard" && (
          <section className="admin-section active">
            <h2>ড্যাশবোর্ড ওভারভিউ</h2>
            {loading ? (
              <div className="loading">লোড হচ্ছে...</div>
            ) : (
              <div className="section-container">
                <div className="admin-card">
                  <h3>মোট পণ্য</h3>
                  <p>ভাড়ার জন্য উপলব্ধ মোট পণ্য</p>
                  <div className="card-value">{dashboardData.totalProducts}</div>
                </div>
                <div className="admin-card">
                  <h3>মোট ব্যবহারকারী</h3>
                  <p>বুকিং করেছেন এমন ব্যবহারকারী</p>
                  <div className="card-value">{dashboardData.totalUsers}</div>
                </div>
                <div className="admin-card">
                  <h3>মোট বুকিং</h3>
                  <p>মোট বুকিং সংখ্যা</p>
                  <div className="card-value">{dashboardData.totalBookings}</div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="quick-actions">
              <h3>দ্রুত কার্যক্রম</h3>
              <div className="action-buttons">
                <Link to="/rent-gig-actions" className="action-btn primary">
                  নতুন যন্ত্র যোগ করুন
                </Link>
                <Link to="/manage-rentals" className="action-btn secondary">
                  বুকিং পরিচালনা
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Bookings Section */}
        {activeSection === "bookings" && (
          <section className="admin-section active">
            <h2>বুকিং তালিকা</h2>
            <div className="section-container">
              {bookings.length === 0 ? (
                <p className="no-data">কোনো বুকিং পাওয়া যায়নি</p>
              ) : (
                bookings.map((booking) => (
                  <div key={booking.id} className="admin-card booking-card">
                    <h3>{booking.title}</h3>
                    <p>
                      <strong>বিবরণ:</strong> {booking.description}
                    </p>
                    <p>
                      <strong>তারিখ:</strong> {booking.order_date}
                    </p>
                    <p>
                      <strong>ফেরত তারিখ:</strong> {booking.return_date}
                    </p>
                    <p>
                      <strong>মূল্য:</strong> ৳{booking.price}
                    </p>
                    <p>
                      <strong>স্ট্যাটাস:</strong>{" "}
                      <span
                        className={`status ${
                          booking.is_confirmed ? "confirmed" : "pending"
                        }`}
                      >
                        {booking.is_confirmed ? "নিশ্চিত" : "অপেক্ষমাণ"}
                      </span>
                    </p>
                    <p>
                      <strong>পিকআপ রেডি:</strong>{" "}
                      <span
                        className={`status ${
                          booking.is_ready_for_pickup ? "ready" : "not-ready"
                        }`}
                      >
                        {booking.is_ready_for_pickup ? "হ্যাঁ" : "না"}
                      </span>
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="admin-footer">
        <p>&copy; 2025 FarmFriend ভাড়া প্রদানকারী অ্যাডমিন প্যানেল। সর্বস্বত্ব সংরক্ষিত।</p>
      </footer>
    </div>
  );
};

export default RentalAdminDashboard;
