import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FarmerNavbar from "../components/FarmerNavbar";
import Footer from "../components/Footer";
import {
  fetchStorageDealsByFarmer,
  updateStorageDeal,
  deleteStorageDeal,
} from "../services/storageService";
import "./MyStorageBookingsPage.css";

// Helper to get cookie
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

const MyStorageBookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [notification, setNotification] = useState(null);

  const farmerId = getCookie("farmersId");

  useEffect(() => {
    if (!farmerId) {
      navigate("/login");
      return;
    }
    loadBookings();
  }, [farmerId, navigate]);

  useEffect(() => {
    filterBookings(activeFilter);
  }, [bookings, activeFilter]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const farmerBookings = await fetchStorageDealsByFarmer(farmerId);
      setBookings(farmerBookings);
    } catch (error) {
      console.error("Error loading bookings:", error);
      showNotification("বুকিং লোড করতে সমস্যা হয়েছে", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const filterBookings = (filter) => {
    let filtered = [...bookings];

    switch (filter) {
      case "pending":
        filtered = bookings.filter((b) => !b.is_confirmed);
        break;
      case "confirmed":
        filtered = bookings.filter(
          (b) => b.is_confirmed && !b.is_ready_for_pickup,
        );
        break;
      case "ready":
        filtered = bookings.filter(
          (b) => b.is_ready_for_pickup && !b.completed,
        );
        break;
      case "completed":
        filtered = bookings.filter((b) => b.completed);
        break;
      default:
        filtered = bookings;
    }

    setFilteredBookings(filtered);
  };

  const getBookingStatus = (booking) => {
    if (booking.completed) return { label: "সম্পন্ন", class: "completed" };
    if (booking.is_ready_for_pickup)
      return { label: "পিকআপ প্রস্তুত", class: "ready" };
    if (booking.is_confirmed) return { label: "নিশ্চিত", class: "confirmed" };
    return { label: "অপেক্ষমাণ", class: "pending" };
  };

  const getTimelineStatus = (booking) => ({
    booked: true,
    confirmed: booking.is_confirmed,
    ready: booking.is_ready_for_pickup,
    completed: booking.completed,
  });

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("এই বুকিং বাতিল করতে কি আপনি নিশ্চিত?")) {
      return;
    }

    try {
      await deleteStorageDeal(bookingId);
      showNotification("বুকিং সফলভাবে বাতিল করা হয়েছে", "success");
      loadBookings();
    } catch (error) {
      console.error("Error canceling booking:", error);
      showNotification("বুকিং বাতিল করতে সমস্যা হয়েছে", "error");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Stats calculations
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => !b.is_confirmed).length,
    active: bookings.filter((b) => b.is_confirmed && !b.completed).length,
    completed: bookings.filter((b) => b.completed).length,
  };

  if (loading) {
    return (
      <div className="my-storage-page">
        <FarmerNavbar />
        <div className="storage-bookings-loading">
          <div className="loading-spinner"></div>
          <p>বুকিং লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-storage-page">
      <FarmerNavbar />

      {/* Notification */}
      {notification && (
        <div className={`storage-booking-notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="my-storage-header">
        <h1>📦 আমার স্টোরেজ বুকিং</h1>
        <p>আপনার সকল স্টোরেজ বুকিং এখানে দেখুন</p>
      </div>

      {/* Stats */}
      <div className="booking-stats">
        <div className="booking-stat-card">
          <div className="booking-stat-icon">📊</div>
          <h3>মোট বুকিং</h3>
          <div className="booking-stat-value">{stats.total}</div>
        </div>
        <div className="booking-stat-card">
          <div className="booking-stat-icon">⏳</div>
          <h3>অপেক্ষমাণ</h3>
          <div className="booking-stat-value">{stats.pending}</div>
        </div>
        <div className="booking-stat-card">
          <div className="booking-stat-icon">✓</div>
          <h3>সক্রিয়</h3>
          <div className="booking-stat-value">{stats.active}</div>
        </div>
        <div className="booking-stat-card">
          <div className="booking-stat-icon">✅</div>
          <h3>সম্পন্ন</h3>
          <div className="booking-stat-value">{stats.completed}</div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="booking-filters">
        <button
          className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
          onClick={() => setActiveFilter("all")}
        >
          সকল ({bookings.length})
        </button>
        <button
          className={`filter-btn ${activeFilter === "pending" ? "active" : ""}`}
          onClick={() => setActiveFilter("pending")}
        >
          অপেক্ষমাণ ({stats.pending})
        </button>
        <button
          className={`filter-btn ${activeFilter === "confirmed" ? "active" : ""}`}
          onClick={() => setActiveFilter("confirmed")}
        >
          নিশ্চিত (
          {
            bookings.filter((b) => b.is_confirmed && !b.is_ready_for_pickup)
              .length
          }
          )
        </button>
        <button
          className={`filter-btn ${activeFilter === "ready" ? "active" : ""}`}
          onClick={() => setActiveFilter("ready")}
        >
          পিকআপ প্রস্তুত (
          {bookings.filter((b) => b.is_ready_for_pickup && !b.completed).length}
          )
        </button>
        <button
          className={`filter-btn ${activeFilter === "completed" ? "active" : ""}`}
          onClick={() => setActiveFilter("completed")}
        >
          সম্পন্ন ({stats.completed})
        </button>
      </div>

      {/* Bookings List */}
      <div className="bookings-container">
        {filteredBookings.length === 0 ? (
          <div className="no-bookings">
            <div className="no-bookings-icon">📦</div>
            <h3>কোনো বুকিং পাওয়া যায়নি</h3>
            <p>
              {activeFilter === "all"
                ? "আপনার এখনো কোনো স্টোরেজ বুকিং নেই"
                : "এই ফিল্টারে কোনো বুকিং নেই"}
            </p>
            <button
              className="btn-browse-storage"
              onClick={() => navigate("/storage")}
            >
              স্টোরেজ খুঁজুন
            </button>
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const status = getBookingStatus(booking);
            const timeline = getTimelineStatus(booking);

            return (
              <div key={booking.id} className="storage-booking-card">
                <img
                  src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400"
                  alt="Storage"
                  className="booking-card-image"
                />
                <div className="booking-card-content">
                  <div className="booking-card-header">
                    <h3 className="booking-card-title">বুকিং #{booking.id}</h3>
                    <span className={`booking-badge ${status.class}`}>
                      {status.label}
                    </span>
                  </div>

                  {/* Timeline Progress */}
                  <div className="booking-timeline">
                    <div
                      className={`timeline-step ${timeline.booked ? "completed" : ""}`}
                    >
                      <div className="timeline-icon">📝</div>
                      <span className="timeline-label">বুক করা</span>
                    </div>
                    <div
                      className={`timeline-step ${timeline.confirmed ? "completed" : ""}`}
                    >
                      <div className="timeline-icon">✓</div>
                      <span className="timeline-label">নিশ্চিত</span>
                    </div>
                    <div
                      className={`timeline-step ${timeline.ready ? "completed" : ""}`}
                    >
                      <div className="timeline-icon">📦</div>
                      <span className="timeline-label">প্রস্তুত</span>
                    </div>
                    <div
                      className={`timeline-step ${timeline.completed ? "completed" : ""}`}
                    >
                      <div className="timeline-icon">✅</div>
                      <span className="timeline-label">সম্পন্ন</span>
                    </div>
                  </div>

                  <div className="booking-info-grid">
                    <div className="booking-info-item">
                      <span>🏪</span>
                      <span>
                        <strong>স্টোরেজ ID:</strong>{" "}
                        {booking.gigs_offered || "N/A"}
                      </span>
                    </div>
                    <div className="booking-info-item">
                      <span>🌾</span>
                      <span>
                        <strong>ফসল ID:</strong> {booking.crops || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="booking-dates">
                    <div className="date-item">
                      <span className="date-label">শুরু</span>
                      <span className="date-value">
                        {formatDate(booking.start_date)}
                      </span>
                    </div>
                    <span className="date-arrow">→</span>
                    <div className="date-item">
                      <span className="date-label">শেষ</span>
                      <span className="date-value">
                        {formatDate(booking.end_date)}
                      </span>
                    </div>
                  </div>

                  <div className="booking-price-section">
                    <div className="booking-price">
                      বুকিং তারিখ: {formatDate(booking.created_at)}
                    </div>
                    <div className="booking-actions">
                      <button
                        className="btn-booking-action btn-view-details"
                        onClick={() => navigate("/storage")}
                      >
                        আরও দেখুন
                      </button>
                      {!booking.completed && !booking.is_ready_for_pickup && (
                        <button
                          className="btn-booking-action btn-cancel"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          বাতিল করুন
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyStorageBookingsPage;
