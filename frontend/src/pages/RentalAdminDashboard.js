import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchMyPostedRentals,
  fetchOwnerRentItems,
  updateRentalOrderStatus,
  fetchRentOwner,
} from "../services/rentalService";
import logo from "../assets/images/logo.jpg";
import "./RentalAdminDashboard.css";

const RentalAdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
  });
  const [postedItems, setPostedItems] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get token and user info
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const rentOwnerId = (() => {
    // Helper to get cookie value
    const getCookie = (name) => {
      const nameEQ = name + "=";
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(nameEQ) === 0) {
          return decodeURIComponent(cookie.substring(nameEQ.length));
        }
      }
      return null;
    };
    return getCookie("rent-ownersId");
  })();

  const initializeDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let ownerId = rentOwnerId;

      // If we don't have rent owner ID from cookies, fetch it
      if (!ownerId && userId) {
        const owner = await fetchRentOwner(userId);
        ownerId = owner?.id;
      }

      if (ownerId) {
        await Promise.all([
          fetchPostedItems(ownerId),
          fetchPostingBookings(ownerId),
        ]);
      } else {
        console.warn("No rent owner profile found");
        setError(null);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error initializing dashboard:", err);
      setError(null);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [userId, rentOwnerId]);

  useEffect(() => {
    if (!token || !userId) {
      navigate("/login");
      return;
    }
    initializeDashboard();
  }, [token, userId, navigate, initializeDashboard]);

  const fetchPostedItems = async (ownerId) => {
    try {
      const data = await fetchOwnerRentItems(ownerId);
      const items = Array.isArray(data) ? data : data.results || [];
      setPostedItems(items);

      setDashboardData((prev) => ({
        ...prev,
        totalProducts: items.length,
      }));
    } catch (err) {
      console.error("Error fetching posted items:", err);
    }
  };

  const fetchPostingBookings = async (ownerId) => {
    try {
      console.log("[RentalAdmin] Fetching bookings for rent owner:", ownerId);
      const data = await fetchMyPostedRentals(ownerId);
      console.log("[RentalAdmin] API Response:", data);
      const orders = Array.isArray(data) ? data : data.results || [];
      console.log("[RentalAdmin] Processed orders:", orders);
      setBookings(orders);

      const confirmed = orders.filter((o) => o.is_confirmed).length;
      const pending = orders.filter((o) => !o.is_confirmed).length;

      console.log("[RentalAdmin] Confirmed:", confirmed, "Pending:", pending);

      setDashboardData((prev) => ({
        ...prev,
        confirmedBookings: confirmed,
        pendingBookings: pending,
      }));
    } catch (err) {
      console.error("[RentalAdmin] Error fetching bookings:", err);
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      let ownerId = rentOwnerId;
      if (!ownerId && userId) {
        const owner = await fetchRentOwner(userId);
        ownerId = owner?.id;
      }

      await updateRentalOrderStatus(orderId, { is_confirmed: true });
      if (ownerId) {
        await fetchPostingBookings(ownerId);
      }
      alert("Order confirmed successfully!");
    } catch (err) {
      console.error("Error confirming order:", err);
      alert("Failed to confirm order");
    }
  };

  const handleReadyForPickup = async (orderId) => {
    try {
      let ownerId = rentOwnerId;
      if (!ownerId && userId) {
        const owner = await fetchRentOwner(userId);
        ownerId = owner?.id;
      }

      await updateRentalOrderStatus(orderId, { is_ready_for_pickup: true });
      if (ownerId) {
        await fetchPostingBookings(ownerId);
      }
      alert("Order marked as ready for pickup!");
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Failed to update order");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("selectedRole");
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "rent-ownersId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "selectedRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
              href="#items"
              className={activeSection === "items" ? "active" : ""}
              onClick={() => setActiveSection("items")}
            >
              আমার যন্ত্র
            </a>
          </li>
          <li>
            <a
              href="#bookings"
              className={activeSection === "bookings" ? "active" : ""}
              onClick={() => setActiveSection("bookings")}
            >
              বুকিংস ({bookings.length})
            </a>
          </li>
          <li>
            <Link to="/equipment-post">নতুন যন্ত্র যোগ করুন</Link>
          </li>
          <li>
            <Link to="/profile">প্রোফাইল</Link>
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
          <h1>FarmFriend - ভাড়া প্রদানকারী প্যানেল</h1>
          <h2>আপনার কৃষি সরঞ্জাম পরিচালনা করুন এবং আয় করুন</h2>
        </div>
      </header>

      {/* Main Content */}
      <div className="admin-main-container">
        {/* Error Message */}
        {error && (
          <div
            style={{
              padding: "1rem",
              margin: "1rem",
              backgroundColor: "#ffebee",
              color: "#d32f2f",
              borderRadius: "6px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {/* Dashboard Section */}
        {activeSection === "dashboard" && !error && (
          <section className="admin-section active">
            <h2>ড্যাশবোর্ড ওভারভিউ</h2>
            {loading ? (
              <div className="loading">লোড হচ্ছে...</div>
            ) : (
              <div className="section-container">
                <div className="admin-card">
                  <h3>মোট পোস্ট করা যন্ত্র</h3>
                  <p>আপনার ভাড়া সেবায় যন্ত্রের সংখ্যা</p>
                  <div className="card-value">
                    {dashboardData.totalProducts}
                  </div>
                </div>
                <div className="admin-card">
                  <h3>নিশ্চিত বুকিংস</h3>
                  <p>অনুমোদিত ভাড়া অর্ডার</p>
                  <div className="card-value">
                    {dashboardData.confirmedBookings}
                  </div>
                </div>
                <div className="admin-card">
                  <h3>অপেক্ষমাণ বুকিংস</h3>
                  <p>অনুমোদনের জন্য অপেক্ষমান অর্ডার</p>
                  <div className="card-value">
                    {dashboardData.pendingBookings}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="quick-actions">
              <h3>দ্রুত কার্যক্রম</h3>
              <div className="action-buttons">
                <Link to="/equipment-post" className="action-btn primary">
                  নতুন যন্ত্র যোগ করুন
                </Link>
                <button
                  className="action-btn secondary"
                  onClick={() => setActiveSection("bookings")}
                >
                  অপেক্ষমান বুকিংস দেখুন
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Posted Items Section */}
        {activeSection === "items" && !error && (
          <section className="admin-section active">
            <h2>আমার পোস্ট করা যন্ত্র</h2>
            <div className="section-container">
              {loading ? (
                <div className="loading">লোড হচ্ছে...</div>
              ) : postedItems.length === 0 ? (
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  <p>আপনি এখনো কোনো যন্ত্র পোস্ট করেননি</p>
                  <Link to="/equipment-post" className="action-btn primary">
                    প্রথম যন্ত্র যোগ করুন
                  </Link>
                </div>
              ) : (
                postedItems.map((item) => (
                  <div key={item.id} className="admin-card booking-card">
                    <div style={{ display: "flex", gap: "1rem" }}>
                      {item.image && (
                        <img
                          src={`http://localhost:8000${item.image}`}
                          alt={item.product_name}
                          style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "6px",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <h3>{item.product_name}</h3>
                        <p>
                          <strong>বিবরণ:</strong> {item.description}
                        </p>
                        <p>
                          <strong>মূল্য:</strong> ৳{item.price}/দিন
                        </p>
                        <p>
                          <strong>পরিমাণ:</strong> {item.quantity}
                        </p>
                        <p>
                          <strong>অবস্থা:</strong>{" "}
                          <span
                            className={`status ${
                              item.is_available ? "available" : "unavailable"
                            }`}
                          >
                            {item.is_available ? "উপলব্ধ" : "অনুপলব্ধ"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* Bookings Section */}
        {activeSection === "bookings" && !error && (
          <section className="admin-section active">
            <h2>ভাড়া অর্ডারসমূহ</h2>
            <div className="section-container">
              {loading ? (
                <div className="loading">লোড হচ্ছে...</div>
              ) : bookings.length === 0 ? (
                <p className="no-data">কোনো অর্ডার পাওয়া যায়নি</p>
              ) : (
                bookings.map((booking) => (
                  <div key={booking.id} className="admin-card booking-card">
                    <h3>{booking.title}</h3>
                    <p>
                      <strong>বিবরণ:</strong> {booking.description}
                    </p>
                    <p>
                      <strong>অর্ডার তারিখ:</strong> {booking.order_date}
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
                      <strong>পিকআপ প্রস্তুত:</strong>{" "}
                      <span
                        className={`status ${
                          booking.is_ready_for_pickup ? "ready" : "not-ready"
                        }`}
                      >
                        {booking.is_ready_for_pickup ? "হ্যাঁ" : "না"}
                      </span>
                    </p>

                    {/* Action Buttons */}
                    <div
                      style={{
                        marginTop: "1rem",
                        display: "flex",
                        gap: "0.5rem",
                      }}
                    >
                      {!booking.is_confirmed && (
                        <button
                          onClick={() => handleConfirmOrder(booking.id)}
                          style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "#4caf50",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          নিশ্চিত করুন
                        </button>
                      )}
                      {booking.is_confirmed && !booking.is_ready_for_pickup && (
                        <button
                          onClick={() => handleReadyForPickup(booking.id)}
                          style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "#2196f3",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          পিকআপের জন্য প্রস্তুত
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="admin-footer">
        <p>
          &copy; 2025 FarmFriend ভাড়া প্রদানকারী অ্যাডমিন প্যানেল। সর্বস্বত্ব
          সংরক্ষিত।
        </p>
      </footer>
    </div>
  );
};

export default RentalAdminDashboard;
