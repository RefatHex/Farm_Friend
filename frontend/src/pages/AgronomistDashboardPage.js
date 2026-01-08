import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchAgronomistByUserId,
  fetchAgronomistConsultations,
  updateConsultationRequest,
  getCookie,
} from "../services/agronomistService";
import logo from "../assets/images/logo.jpg";
import "./AgronomistDashboardPage.css";

// Set to true to use mock data for testing UI (set to false in production)
const USE_MOCK_DATA = true;

// Mock data for testing
const MOCK_AGRONOMIST = {
  id: 1,
  name: "ড. আব্দুল করিম",
  contact: "+880171234567",
  address: "ঢাকা, বাংলাদেশ",
  description: "২০ বছরের অভিজ্ঞ কৃষি বিশেষজ্ঞ",
  specialty: "ধান ও সবজি চাষ",
  fee: 500,
  years_of_experience: 20,
  availability: true,
};

const MOCK_CONSULTATIONS = [
  {
    id: 1,
    farmer: 1,
    farmer_name: "মোঃ রহিম উদ্দিন",
    agronomist: 1,
    fee: 500,
    status: "Pending",
    request_date: "2026-01-15T10:00:00Z",
    details: "আমার ধান ক্ষেতে পোকামাকড়ের আক্রমণ হয়েছে। কী করব?",
  },
  {
    id: 2,
    farmer: 2,
    farmer_name: "করিম সরকার",
    agronomist: 1,
    fee: 500,
    status: "Confirmed",
    request_date: "2026-01-12T14:00:00Z",
    details: "টমেটো গাছের পাতা হলুদ হয়ে যাচ্ছে।",
  },
  {
    id: 3,
    farmer: 3,
    farmer_name: "জামাল হোসেন",
    agronomist: 1,
    fee: 500,
    status: "Completed",
    request_date: "2026-01-05T09:00:00Z",
    details: "সার প্রয়োগের সঠিক সময় ও পরিমাণ জানতে চাই।",
  },
  {
    id: 4,
    farmer: 4,
    farmer_name: "সালমা বেগম",
    agronomist: 1,
    fee: 500,
    status: "Completed",
    request_date: "2026-01-02T11:00:00Z",
    details: "মরিচ চাষের জন্য মাটি প্রস্তুত করার পরামর্শ চাই।",
  },
];

const AgronomistDashboardPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [agronomist, setAgronomist] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    totalConsultations: 0,
    pendingConsultations: 0,
    confirmedConsultations: 0,
    completedConsultations: 0,
    totalIncome: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = USE_MOCK_DATA ? "mock-user" : localStorage.getItem("userId");
  const agronomistId = USE_MOCK_DATA ? "1" : getCookie("agronomistsId");

  const initializeDashboard = useCallback(async () => {
    // Use mock data if enabled
    if (USE_MOCK_DATA) {
      setAgronomist(MOCK_AGRONOMIST);
      setConsultations(MOCK_CONSULTATIONS);
      
      const pending = MOCK_CONSULTATIONS.filter((c) => c.status === "Pending").length;
      const confirmed = MOCK_CONSULTATIONS.filter((c) => c.status === "Confirmed").length;
      const completed = MOCK_CONSULTATIONS.filter((c) => c.status === "Completed").length;
      const totalIncome = MOCK_CONSULTATIONS
        .filter((c) => c.status === "Completed")
        .reduce((sum, c) => sum + parseFloat(c.fee || 0), 0);

      setDashboardData({
        totalConsultations: MOCK_CONSULTATIONS.length,
        pendingConsultations: pending,
        confirmedConsultations: confirmed,
        completedConsultations: completed,
        totalIncome: totalIncome,
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let agro = null;
      
      // Try to fetch agronomist by cookie ID first
      if (agronomistId) {
        try {
          const { fetchAgronomistById } = await import("../services/agronomistService");
          agro = await fetchAgronomistById(agronomistId);
        } catch (err) {
          console.log("Could not fetch by agronomist ID, trying user ID...");
        }
      }
      
      // If not found, try by user ID
      if (!agro && userId) {
        agro = await fetchAgronomistByUserId(userId);
      }

      if (agro) {
        setAgronomist(agro);
        await fetchConsultations(agro.id);
      } else {
        setError("অনুগ্রহ করে প্রথমে আপনার প্রোফাইল সেটআপ করুন।");
      }
    } catch (err) {
      console.error("Error initializing dashboard:", err);
      setError("ড্যাশবোর্ড লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  }, [userId, agronomistId]);

  useEffect(() => {
    if (!USE_MOCK_DATA && !userId && !agronomistId) {
      navigate("/login");
      return;
    }
    initializeDashboard();
  }, [userId, agronomistId, navigate, initializeDashboard]);

  const fetchConsultations = async (agroId) => {
    try {
      const data = await fetchAgronomistConsultations(agroId);
      const results = Array.isArray(data) ? data : data.results || [];
      setConsultations(results);

      // Calculate dashboard metrics
      const pending = results.filter((c) => c.status === "Pending").length;
      const confirmed = results.filter((c) => c.status === "Confirmed").length;
      const completed = results.filter((c) => c.status === "Completed").length;
      const totalIncome = results
        .filter((c) => c.status === "Completed")
        .reduce((sum, c) => sum + parseFloat(c.fee || 0), 0);

      setDashboardData({
        totalConsultations: results.length,
        pendingConsultations: pending,
        confirmedConsultations: confirmed,
        completedConsultations: completed,
        totalIncome: totalIncome,
      });
    } catch (err) {
      console.error("Error fetching consultations:", err);
    }
  };

  const handleConfirmConsultation = async (consultationId) => {
    try {
      await updateConsultationRequest(consultationId, { status: "Confirmed" });
      if (agronomist) {
        await fetchConsultations(agronomist.id);
      }
      alert("পরামর্শ অনুরোধ নিশ্চিত করা হয়েছে!");
    } catch (err) {
      console.error("Error confirming consultation:", err);
      alert("নিশ্চিত করতে ব্যর্থ হয়েছে।");
    }
  };

  const handleCompleteConsultation = async (consultationId) => {
    try {
      await updateConsultationRequest(consultationId, { status: "Completed" });
      if (agronomist) {
        await fetchConsultations(agronomist.id);
      }
      alert("পরামর্শ সম্পন্ন হিসাবে চিহ্নিত করা হয়েছে!");
    } catch (err) {
      console.error("Error completing consultation:", err);
      alert("সম্পন্ন করতে ব্যর্থ হয়েছে।");
    }
  };

  const handleRejectConsultation = async (consultationId) => {
    if (!window.confirm("আপনি কি নিশ্চিত এই অনুরোধ বাতিল করতে চান?")) return;
    try {
      await updateConsultationRequest(consultationId, { status: "Cancelled" });
      if (agronomist) {
        await fetchConsultations(agronomist.id);
      }
      alert("পরামর্শ অনুরোধ বাতিল করা হয়েছে।");
    } catch (err) {
      console.error("Error rejecting consultation:", err);
      alert("বাতিল করতে ব্যর্থ হয়েছে।");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("selectedRole");
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "agronomistsId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "selectedRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login");
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
      Confirmed: { class: "status-confirmed", text: "নিশ্চিত" },
      Completed: { class: "status-completed", text: "সম্পন্ন" },
      Cancelled: { class: "status-cancelled", text: "বাতিল" },
    };
    const statusInfo = statusMap[status] || { class: "", text: status };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  if (loading) {
    return (
      <div className="agronomist-dashboard-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="agronomist-dashboard-page">
      {/* Navbar */}
      <nav className="agronomist-navbar">
        <div className="navbar-logo">
          <Link to="/agronomist-dashboard">
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
              href="#consultations"
              className={activeSection === "consultations" ? "active" : ""}
              onClick={() => setActiveSection("consultations")}
            >
              পরামর্শ অনুরোধ
            </a>
          </li>
          <li>
            <Link to="/agronomist-profile-setup">প্রোফাইল সেটআপ</Link>
          </li>
          <li>
            <a href="#logout" onClick={handleLogout}>
              লগআউট
            </a>
          </li>
        </ul>
      </nav>

      {/* Header Section */}
      <header className="agronomist-header">
        <div className="header-content">
          <h1>কৃষি বিশেষজ্ঞ ড্যাশবোর্ড</h1>
          <h2>আপনার কৃষি পরামর্শ সেবা পরিচালনা করুন</h2>
        </div>
      </header>

      {/* Main Content */}
      <div className="agronomist-main-container">
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <Link to="/agronomist-profile-setup" className="setup-btn">
              প্রোফাইল সেটআপ করুন
            </Link>
          </div>
        )}

        {/* Dashboard Section */}
        {activeSection === "dashboard" && !error && (
          <section className="agronomist-section">
            <h2>ড্যাশবোর্ড ওভারভিউ</h2>
            <div className="section-container">
              <div className="agronomist-card">
                <h3>মোট পরামর্শ</h3>
                <p>সকল পরামর্শ অনুরোধ</p>
                <div className="card-value">{dashboardData.totalConsultations}</div>
              </div>

              <div className="agronomist-card">
                <h3>অপেক্ষমাণ</h3>
                <p>প্রতিক্রিয়ার অপেক্ষায়</p>
                <div className="card-value pending">{dashboardData.pendingConsultations}</div>
              </div>

              <div className="agronomist-card">
                <h3>নিশ্চিত</h3>
                <p>নিশ্চিত করা পরামর্শ</p>
                <div className="card-value confirmed">{dashboardData.confirmedConsultations}</div>
              </div>

              <div className="agronomist-card">
                <h3>সম্পন্ন</h3>
                <p>সম্পন্ন পরামর্শ</p>
                <div className="card-value completed">{dashboardData.completedConsultations}</div>
              </div>

              <div className="agronomist-card">
                <h3>মোট আয়</h3>
                <p>সম্পন্ন পরামর্শ থেকে</p>
                <div className="card-value income">৳{dashboardData.totalIncome.toFixed(2)}</div>
              </div>

              <Link to="/agronomist-profile-setup" className="agronomist-card clickable">
                <h3>প্রোফাইল সেটআপ</h3>
                <p>আপনার বিশেষজ্ঞ প্রোফাইল আপডেট করুন</p>
              </Link>
            </div>
          </section>
        )}

        {/* Consultations Section */}
        {activeSection === "consultations" && !error && (
          <section className="agronomist-section">
            <h2>পরামর্শ অনুরোধ সমূহ</h2>
            
            {consultations.length === 0 ? (
              <div className="no-data">
                <p>কোনো পরামর্শ অনুরোধ নেই।</p>
              </div>
            ) : (
              <div className="consultations-list">
                {consultations.map((consultation) => (
                  <div key={consultation.id} className="consultation-card">
                    <div className="consultation-header">
                      <h3>পরামর্শ #{consultation.id}</h3>
                      {getStatusBadge(consultation.status)}
                    </div>
                    <div className="consultation-details">
                      <p><strong>কৃষক:</strong> {consultation.farmer_name || `কৃষক #${consultation.farmer}`}</p>
                      <p><strong>তারিখ:</strong> {formatDate(consultation.request_date)}</p>
                      <p><strong>ফি:</strong> ৳{consultation.fee}</p>
                      <p><strong>বিবরণ:</strong> {consultation.details || "কোনো বিবরণ নেই"}</p>
                    </div>
                    <div className="consultation-actions">
                      {consultation.status === "Pending" && (
                        <>
                          <button
                            className="btn-confirm"
                            onClick={() => handleConfirmConsultation(consultation.id)}
                          >
                            নিশ্চিত করুন
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => handleRejectConsultation(consultation.id)}
                          >
                            বাতিল করুন
                          </button>
                        </>
                      )}
                      {consultation.status === "Confirmed" && (
                        <button
                          className="btn-complete"
                          onClick={() => handleCompleteConsultation(consultation.id)}
                        >
                          সম্পন্ন করুন
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="agronomist-footer">
        <p>&copy; 2025 FarmFriend - কৃষি বিশেষজ্ঞ প্ল্যাটফর্ম। সর্বস্বত্ব সংরক্ষিত।</p>
      </footer>
    </div>
  );
};

export default AgronomistDashboardPage;
