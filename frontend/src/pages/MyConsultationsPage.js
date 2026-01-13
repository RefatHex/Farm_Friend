import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchFarmerConsultations,
  deleteConsultationRequest,
  getCookie,
} from "../services/agronomistService";
import Footer from "../components/Footer";
import logo from "../assets/images/logo.jpg";
import "./MyConsultationsPage.css";

const MyConsultationsPage = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);
  const [filter, setFilter] = useState("all");

  const farmerId = getCookie("farmersId");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!farmerId && !userId) {
      navigate("/login");
      return;
    }
    loadConsultations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farmerId, userId, navigate]);

  const loadConsultations = async () => {
    try {
      setLoading(true);
      const id = farmerId || userId;
      const data = await fetchFarmerConsultations(id);
      const results = Array.isArray(data) ? data : data.results || [];
      setConsultations(results);
    } catch (error) {
      console.error("Error loading consultations:", error);
      showAlert("error", "পরামর্শ তথ্য লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlertMessage({ type, message });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const handleCancelConsultation = async (consultationId) => {
    if (!window.confirm("আপনি কি নিশ্চিত এই পরামর্শ অনুরোধ বাতিল করতে চান?")) {
      return;
    }

    try {
      await deleteConsultationRequest(consultationId);
      showAlert("success", "পরামর্শ অনুরোধ বাতিল করা হয়েছে।");
      loadConsultations();
    } catch (error) {
      console.error("Error cancelling consultation:", error);
      showAlert("error", "বাতিল করতে সমস্যা হয়েছে।");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "তারিখ নির্ধারিত নয়";
    const date = new Date(dateString);
    return date.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      Pending: { class: "status-pending", text: "অপেক্ষমাণ" },
      Accepted: { class: "status-confirmed", text: "গৃহীত" },
      Confirmed: { class: "status-confirmed", text: "নিশ্চিত" },
      Completed: { class: "status-completed", text: "সম্পন্ন" },
      Rejected: { class: "status-rejected", text: "প্রত্যাখ্যাত" },
      Cancelled: { class: "status-cancelled", text: "বাতিল" },
    };
    const statusInfo = statusMap[status] || { class: "", text: status };
    return (
      <span className={`status-badge ${statusInfo.class}`}>
        {statusInfo.text}
      </span>
    );
  };

  const filteredConsultations = consultations.filter((c) => {
    if (filter === "all") return true;
    return c.status === filter;
  });

  const stats = {
    total: consultations.length,
    pending: consultations.filter((c) => c.status === "Pending").length,
    confirmed: consultations.filter((c) => c.status === "Confirmed").length,
    completed: consultations.filter((c) => c.status === "Completed").length,
  };

  const handleLogout = () => {
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "farmersId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "selectedRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("userId");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="my-consultations-page">
        <nav className="consultations-navbar">
          <div className="navbar-logo">
            <Link to="/farmer-dashboard">
              <img src={logo} alt="FarmFriend Logo" />
              <span>FarmFriend</span>
            </Link>
          </div>
          <ul>
            <li>
              <Link to="/farmer-dashboard">হোম</Link>
            </li>
            <li>
              <Link to="/experts">বিশেষজ্ঞ</Link>
            </li>
            <li>
              <Link to="/my-consultations" className="active">
                আমার পরামর্শ
              </Link>
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
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>আপনার পরামর্শ তথ্য লোড হচ্ছে...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="my-consultations-page">
      {/* Navbar */}
      <nav className="consultations-navbar">
        <div className="navbar-logo">
          <Link to="/farmer-dashboard">
            <img src={logo} alt="FarmFriend Logo" />
            <span>FarmFriend</span>
          </Link>
        </div>
        <ul>
          <li>
            <Link to="/farmer-dashboard">হোম</Link>
          </li>
          <li>
            <Link to="/experts">বিশেষজ্ঞ</Link>
          </li>
          <li>
            <Link to="/my-consultations" className="active">
              আমার পরামর্শ
            </Link>
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

      {/* Alert Message */}
      {alertMessage && (
        <div className={`alert-message alert-${alertMessage.type}`}>
          {alertMessage.message}
        </div>
      )}

      {/* Hero Section */}
      <div className="consultations-hero">
        <div className="hero-content">
          <h1>আমার পরামর্শ সমূহ</h1>
          <p>আপনার সকল কৃষি বিশেষজ্ঞ পরামর্শ অনুরোধ দেখুন এবং পরিচালনা করুন</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="consultations-container">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">মোট পরামর্শ</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">অপেক্ষমাণ</div>
          </div>
          <div className="stat-card confirmed">
            <div className="stat-value">{stats.confirmed}</div>
            <div className="stat-label">নিশ্চিত</div>
          </div>
          <div className="stat-card completed">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">সম্পন্ন</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            সকল
          </button>
          <button
            className={filter === "Pending" ? "active" : ""}
            onClick={() => setFilter("Pending")}
          >
            অপেক্ষমাণ
          </button>
          <button
            className={filter === "Confirmed" ? "active" : ""}
            onClick={() => setFilter("Confirmed")}
          >
            নিশ্চিত
          </button>
          <button
            className={filter === "Completed" ? "active" : ""}
            onClick={() => setFilter("Completed")}
          >
            সম্পন্ন
          </button>
        </div>

        {/* Consultations List */}
        {filteredConsultations.length === 0 ? (
          <div className="no-consultations">
            <p>কোনো পরামর্শ অনুরোধ নেই।</p>
            <button
              onClick={() => navigate("/experts")}
              className="btn-find-experts"
            >
              বিশেষজ্ঞ খুঁজুন
            </button>
          </div>
        ) : (
          <div className="consultations-list">
            {filteredConsultations.map((consultation) => (
              <div key={consultation.id} className="consultation-card">
                <div className="consultation-header">
                  <h3>পরামর্শ #{consultation.id}</h3>
                  {getStatusBadge(consultation.status)}
                </div>
                <div className="consultation-body">
                  <div className="consultation-info">
                    <p>
                      <strong>বিশেষজ্ঞ:</strong>{" "}
                      {consultation.agronomist_name ||
                        `বিশেষজ্ঞ #${consultation.agronomist}`}
                    </p>
                    <p>
                      <strong>তারিখ:</strong>{" "}
                      {formatDate(consultation.request_date)}
                    </p>
                    <p>
                      <strong>ফি:</strong> ৳{consultation.fee}
                    </p>
                  </div>
                  <div className="consultation-details">
                    <p>
                      <strong>বিবরণ:</strong>
                    </p>
                    <p className="details-text">
                      {consultation.details || "কোনো বিবরণ নেই"}
                    </p>
                  </div>
                </div>
                <div className="consultation-actions">
                  {consultation.status === "Pending" && (
                    <button
                      className="btn-cancel"
                      onClick={() => handleCancelConsultation(consultation.id)}
                    >
                      বাতিল করুন
                    </button>
                  )}
                  {consultation.status === "Confirmed" && (
                    <div className="confirmation-notice">
                      <span>✅ আপনার পরামর্শ নিশ্চিত করা হয়েছে</span>
                    </div>
                  )}
                  {consultation.status === "Completed" && (
                    <div className="completed-notice">
                      <span>🎉 পরামর্শ সম্পন্ন হয়েছে</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyConsultationsPage;
