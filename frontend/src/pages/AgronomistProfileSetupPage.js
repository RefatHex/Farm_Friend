import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchAgronomistByUserId,
  fetchAgronomistById,
  createAgronomist,
  updateAgronomist,
  getCookie,
  setCookie,
} from "../services/agronomistService";
import logo from "../assets/images/logo.jpg";
import "./AgronomistProfileSetupPage.css";

const AgronomistProfileSetupPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [agronomistId, setAgronomistId] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    address: "",
    description: "",
    specialty: "",
    fee: "",
    years_of_experience: "",
    availability: false,
  });

  const userId = localStorage.getItem("userId");
  const cookieAgronomistId = getCookie("agronomistsId");

  useEffect(() => {
    if (!userId && !cookieAgronomistId) {
      navigate("/login");
      return;
    }
    fetchExistingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, cookieAgronomistId, navigate]);

  const fetchExistingData = async () => {
    try {
      setLoading(true);
      let agronomist = null;

      // Try to fetch by cookie ID first
      if (cookieAgronomistId) {
        try {
          agronomist = await fetchAgronomistById(cookieAgronomistId);
        } catch (err) {
          console.log("Could not fetch by agronomist ID");
        }
      }

      // If not found, try by user ID
      if (!agronomist && userId) {
        agronomist = await fetchAgronomistByUserId(userId);
      }

      if (agronomist) {
        setAgronomistId(agronomist.id);
        setFormData({
          name: agronomist.name || "",
          contact: agronomist.contact || "",
          address: agronomist.address || "",
          description: agronomist.description || "",
          specialty: agronomist.specialty || "",
          fee: agronomist.fee || "",
          years_of_experience: agronomist.years_of_experience || "",
          availability: agronomist.availability || false,
        });
        // Store the agronomist ID in cookie
        setCookie("agronomistsId", agronomist.id);
      }
    } catch (error) {
      console.error("Error fetching existing data:", error);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlertMessage({ type, message });
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFieldUpdate = async (field, value) => {
    if (!agronomistId) return;

    try {
      const data = { [field]: value };
      await updateAgronomist(agronomistId, data);
      console.log(`Successfully updated ${field}`);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      showAlert("error", `${field} আপডেট করতে ব্যর্থ হয়েছে।`);
    }
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    // Map form field names to API field names
    const fieldMapping = {
      years_of_experience: "years_of_experience",
      fee: "fee",
    };

    const apiField = fieldMapping[name] || name;

    // Convert numeric fields
    let processedValue = fieldValue;
    if (name === "fee" || name === "years_of_experience") {
      processedValue = parseFloat(fieldValue) || 0;
    }

    handleFieldUpdate(apiField, processedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.specialty || !formData.fee) {
      showAlert("warning", "নাম, বিশেষত্ব এবং ফি প্রয়োজনীয়।");
      return;
    }

    try {
      setSaving(true);
      const submitData = {
        ...formData,
        fee: parseFloat(formData.fee) || 0,
        years_of_experience: parseInt(formData.years_of_experience) || 0,
        user: parseInt(userId),
      };

      if (agronomistId) {
        // Update existing profile
        await updateAgronomist(agronomistId, submitData);
        showAlert("success", "প্রোফাইল সফলভাবে আপডেট হয়েছে!");
      } else {
        // Create new profile
        const newAgronomist = await createAgronomist(submitData);
        setAgronomistId(newAgronomist.id);
        setCookie("agronomistsId", newAgronomist.id);
        showAlert("success", "প্রোফাইল সফলভাবে তৈরি হয়েছে!");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      showAlert("error", "প্রোফাইল সংরক্ষণ করতে ব্যর্থ হয়েছে।");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    document.cookie =
      "agronomistsId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="agronomist-profile-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="agronomist-profile-page">
      {/* Navbar */}
      <nav className="profile-navbar">
        <div className="navbar-logo">
          <Link to="/agronomist-dashboard">
            <img src={logo} alt="FarmFriend Logo" />
            <span>FarmFriend</span>
          </Link>
        </div>
        <ul>
          <li>
            <Link to="/agronomist-dashboard">ড্যাশবোর্ড</Link>
          </li>
          <li>
            <Link to="/agronomist-profile-setup" className="active">
              প্রোফাইল সেটআপ
            </Link>
          </li>
          <li>
            <a href="#logout" onClick={handleLogout}>
              লগআউট
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

      {/* Main Content */}
      <div className="profile-container">
        <div className="profile-card">
          <div className="card-header">
            <h3>কৃষি বিশেষজ্ঞ প্রোফাইল সেটআপ</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">নাম *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="আপনার পূর্ণ নাম লিখুন"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact">যোগাযোগ নম্বর</label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="আপনার যোগাযোগ নম্বর লিখুন"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">ঠিকানা</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  rows="3"
                  placeholder="আপনার ঠিকানা লিখুন"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="description">বিবরণ</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  rows="3"
                  placeholder="আপনার দক্ষতা এবং অভিজ্ঞতা বর্ণনা করুন"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="specialty">বিশেষত্ব *</label>
                <input
                  type="text"
                  id="specialty"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="যেমন: ধান চাষ, সবজি চাষ, মৃত্তিকা বিজ্ঞান"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fee">পরামর্শ ফি (টাকা) *</label>
                  <input
                    type="number"
                    id="fee"
                    name="fee"
                    value={formData.fee}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="পরামর্শ ফি"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="years_of_experience">অভিজ্ঞতা (বছর)</label>
                  <input
                    type="number"
                    id="years_of_experience"
                    name="years_of_experience"
                    value={formData.years_of_experience}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="অভিজ্ঞতার বছর"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="availability"
                  name="availability"
                  checked={formData.availability}
                  onChange={(e) => {
                    handleInputChange(e);
                    if (agronomistId) {
                      handleFieldUpdate("availability", e.target.checked);
                    }
                  }}
                />
                <label htmlFor="availability">পরামর্শের জন্য উপলব্ধ</label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving
                    ? "সংরক্ষণ হচ্ছে..."
                    : agronomistId
                    ? "প্রোফাইল আপডেট করুন"
                    : "প্রোফাইল তৈরি করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="profile-footer">
        <p>
          &copy; 2025 FarmFriend - কৃষি বিশেষজ্ঞ প্ল্যাটফর্ম। সর্বস্বত্ব
          সংরক্ষিত।
        </p>
      </footer>
    </div>
  );
};

export default AgronomistProfileSetupPage;
