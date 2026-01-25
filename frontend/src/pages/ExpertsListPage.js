import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchAgronomists,
  createConsultationRequest,
  fetchFarmerProfileByUser,
  getCookie,
  setCookie,
} from "../services/agronomistService";
import Footer from "../components/Footer";
import logo from "../assets/images/logo.jpg";
import "./ExpertsListPage.css";

const ExpertsListPage = () => {
  const navigate = useNavigate();
  const [agronomists, setAgronomists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAgronomist, setSelectedAgronomist] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [bookingData, setBookingData] = useState({
    requestDate: "",
    details: "",
  });

  const [farmerId, setFarmerId] = useState(() => getCookie("farmersId"));
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    loadAgronomists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAgronomists = async () => {
    try {
      setLoading(true);
      const data = await fetchAgronomists({ availability: true });
      const results = Array.isArray(data) ? data : data.results || [];
      setAgronomists(results);
    } catch (error) {
      console.error("Error loading agronomists:", error);
      showAlert("error", "বিশেষজ্ঞদের তথ্য লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = useCallback((type, message) => {
    setAlertMessage({ type, message });
    setTimeout(() => setAlertMessage(null), 4000);
  }, []);

  const ensureFarmerId = useCallback(async () => {
    if (farmerId) return farmerId;
    if (!userId) return null;

    try {
      const profile = await fetchFarmerProfileByUser(userId);
      if (profile?.id) {
        const normalizedId = String(profile.id);
        setCookie("farmersId", normalizedId);
        setFarmerId(normalizedId);
        return normalizedId;
      }
      return null;
    } catch (error) {
      console.error("Error resolving farmer profile:", error);
      showAlert("error", "কৃষক তথ্য লোড করতে ব্যর্থ হয়েছে।");
      return null;
    }
  }, [farmerId, userId, showAlert]);

  useEffect(() => {
    if (!userId) return;
    ensureFarmerId();
  }, [userId, ensureFarmerId]);

  const handleBookClick = async (agronomist) => {
    if (!userId) {
      showAlert("warning", "বুকিং করতে অনুগ্রহ করে প্রথমে লগইন করুন।");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    const resolvedFarmerId = farmerId || (await ensureFarmerId());
    if (!resolvedFarmerId) {
      showAlert("warning", "বুকিং করতে কৃষক প্রোফাইল প্রয়োজন।");
      return;
    }
    setSelectedAgronomist(agronomist);
    setBookingData({ requestDate: "", details: "" });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAgronomist(null);
    setBookingData({ requestDate: "", details: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();

    if (!bookingData.requestDate || !bookingData.details) {
      showAlert("warning", "সমস্ত তথ্য পূরণ করুন।");
      return;
    }

    try {
      setSubmitting(true);

      const resolvedFarmerId = farmerId || (await ensureFarmerId());
      const numericFarmerId = parseInt(resolvedFarmerId || "", 10);
      if (!numericFarmerId) {
        showAlert("error", "বুকিং করতে কৃষক প্রোফাইল নিশ্চিত করুন।");
        return;
      }

      const requestData = {
        farmer: numericFarmerId,
        agronomist: selectedAgronomist.id,
        fee: selectedAgronomist.fee,
        status: "Pending",
        details: bookingData.details,
      };

      console.log("Sending consultation request with data:", requestData);
      await createConsultationRequest(requestData);
      showAlert("success", "বুকিং সফলভাবে সম্পন্ন হয়েছে!");
      handleCloseModal();
    } catch (error) {
      console.error("Error creating booking:", error);
      const errorMessage = error.message || "বুকিং করতে সমস্যা হয়েছে।";
      showAlert("error", `${errorMessage} আবার চেষ্টা করুন।`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "farmersId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "selectedRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("userId");
    setFarmerId(null);
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="experts-page">
        <nav className="experts-navbar">
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
              <Link to="/experts" className="active">
                বিশেষজ্ঞ
              </Link>
            </li>
            <li>
              <Link to="/my-consultations">আমার পরামর্শ</Link>
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
          <p>বিশেষজ্ঞদের তথ্য লোড হচ্ছে...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="experts-page">
      {/* Navbar */}
      <nav className="experts-navbar">
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
            <Link to="/experts" className="active">
              বিশেষজ্ঞ
            </Link>
          </li>
          <li>
            <Link to="/my-consultations">আমার পরামর্শ</Link>
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
      <div className="experts-hero">
        <div className="hero-content">
          <h1>কৃষি বিশেষজ্ঞ পরামর্শ</h1>
          <p>
            আমাদের অভিজ্ঞ কৃষি বিশেষজ্ঞদের সাথে যোগাযোগ করুন এবং আপনার কৃষি
            সমস্যার সমাধান পান
          </p>
        </div>
      </div>

      {/* Experts List */}
      <div className="experts-container">
        <h2 className="section-title">উপলব্ধ কৃষি বিশেষজ্ঞগণ</h2>

        {agronomists.length === 0 ? (
          <div className="no-experts">
            <p>বর্তমানে কোনো বিশেষজ্ঞ উপলব্ধ নেই।</p>
          </div>
        ) : (
          <div className="experts-grid">
            {agronomists.map((agronomist) => (
              <div key={agronomist.id} className="expert-card">
                <div className="expert-avatar">
                  <span>
                    {agronomist.name
                      ? agronomist.name.charAt(0).toUpperCase()
                      : "?"}
                  </span>
                </div>
                <h3 className="expert-name">{agronomist.name || "নাম নেই"}</h3>
                <p className="expert-description">
                  {agronomist.description || "কোনো বিবরণ নেই"}
                </p>
                <div className="expert-fee">
                  পরামর্শ ফি: ৳{parseFloat(agronomist.fee).toFixed(2)}
                </div>
                <div className="expert-details">
                  <p>
                    <strong>বিশেষত্ব:</strong> {agronomist.specialty || "N/A"}
                  </p>
                  <p>
                    <strong>অভিজ্ঞতা:</strong>{" "}
                    {agronomist.years_of_experience || 0} বছর
                  </p>
                  <p>
                    <strong>যোগাযোগ:</strong> {agronomist.contact || "N/A"}
                  </p>
                  <p>
                    <strong>ঠিকানা:</strong> {agronomist.address || "N/A"}
                  </p>
                  <p className="availability-status">
                    <strong>স্ট্যাটাস:</strong>{" "}
                    {agronomist.availability ? (
                      <span className="available">✅ উপলব্ধ</span>
                    ) : (
                      <span className="unavailable">❌ উপলব্ধ নয়</span>
                    )}
                  </p>
                </div>
                <button
                  className="btn-book"
                  onClick={() => handleBookClick(agronomist)}
                  disabled={!agronomist.availability}
                >
                  এখনই বুক করুন
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showModal && selectedAgronomist && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>পরামর্শ বুক করুন</h3>
              <button className="modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="selected-expert-info">
                <p>
                  <strong>বিশেষজ্ঞ:</strong> {selectedAgronomist.name}
                </p>
                <p>
                  <strong>বিশেষত্ব:</strong> {selectedAgronomist.specialty}
                </p>
                <p>
                  <strong>ফি:</strong> ৳
                  {parseFloat(selectedAgronomist.fee).toFixed(2)}
                </p>
              </div>
              <form onSubmit={handleSubmitBooking}>
                <div className="form-group">
                  <label htmlFor="requestDate">
                    তারিখ ও সময় নির্বাচন করুন *
                  </label>
                  <input
                    type="datetime-local"
                    id="requestDate"
                    name="requestDate"
                    value={bookingData.requestDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="details">পরামর্শের বিবরণ *</label>
                  <textarea
                    id="details"
                    name="details"
                    value={bookingData.details}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="আপনার সমস্যা বা প্রশ্ন বিস্তারিত লিখুন..."
                    required
                  ></textarea>
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={handleCloseModal}
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={submitting}
                  >
                    {submitting ? "জমা হচ্ছে..." : "বুকিং জমা দিন"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ExpertsListPage;
