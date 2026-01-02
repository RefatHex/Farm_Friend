import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FarmerNavbar from "../components/FarmerNavbar";
import Footer from "../components/Footer";
import Alert from "../components/Alert";
import "./ProfilePage.css";

// Set to true to use mock data for testing (set to false in production)
const USE_MOCK_DATA = false;

// Demo/Mock data for testing
const MOCK_ROLE_DETAILS = {
  id: 1,
  user: 1,
  name: "মোহাম্মদ করিম",
  email: "karim@example.com",
  phone: "01712345678",
  address: "ঢাকা, বাংলাদেশ",
  field_size: "5 একর",
  no_of_deals: 12,
};

const MOCK_BILLING_DATA = {
  id: 1,
  street: "মিরপুর রোড",
  city: "ঢাকা",
  state: "ঢাকা বিভাগ",
  postal_code: "1216",
  country: "বাংলাদেশ",
};

const MOCK_PAYMENTS = [
  {
    amount: "৫,০০০ টাকা",
    payment_date: "২০২৫-১২-১৫",
    payment_method: "বিকাশ",
    status: "সম্পন্ন",
  },
  {
    amount: "৩,৫০০ টাকা",
    payment_date: "২০২৫-১১-২০",
    payment_method: "নগদ",
    status: "সম্পন্ন",
  },
  {
    amount: "২,০০০ টাকা",
    payment_date: "২০২৫-১০-০৫",
    payment_method: "ব্যাংক ট্রান্সফার",
    status: "পেন্ডিং",
  },
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("লোড হচ্ছে...");
  const [userName, setUserName] = useState("লোড হচ্ছে...");
  const [userRole, setUserRole] = useState("লোড হচ্ছে...");
  const [roleDetails, setRoleDetails] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [showBilling, setShowBilling] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const [billingData, setBillingData] = useState({
    street: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });
  const [payments, setPayments] = useState([]);
  const [alert, setAlert] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  // Cookie helper functions
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

  const showAlert = (type, title, message) => {
    setAlert({ isOpen: true, type, title, message });
  };

  const closeAlert = () => {
    setAlert({ ...alert, isOpen: false });
  };

  const roleEndpoints = {
    farmersId: "farmers/farmers",
    "rent-ownersId": "rentals/rent-owners",
    "storage-ownersId": "storage/storage-owners",
    agronomistsId: "consultations/agronomists",
  };

  const roleLabels = {
    farmersId: "কৃষক",
    "rent-ownersId": "ভাড়া মালিক",
    "storage-ownersId": "স্টোরেজ মালিক",
    agronomistsId: "কৃষি বিশেষজ্ঞ",
  };

  const fieldLabels = {
    name: "নাম",
    email: "ইমেইল",
    phone: "ফোন",
    address: "ঠিকানা",
    field_size: "জমির আকার",
    storage_capacity: "স্টোরেজ ক্ষমতা",
    specialty: "বিশেষজ্ঞতা",
    years_of_experience: "অভিজ্ঞতার বছর",
    no_of_deals: "মোট চুক্তি",
    id: "আইডি",
    user: "ব্যবহারকারী",
  };

  // Immutable fields
  const immutableFields = ["no_of_deals", "id", "user"];

  useEffect(() => {
    fetchRoleDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRoleDetails = async () => {
    // Use mock data if enabled
    if (USE_MOCK_DATA) {
      setUsername(MOCK_ROLE_DETAILS.name);
      setUserName(MOCK_ROLE_DETAILS.name);
      setUserRole("কৃষক");
      setRoleDetails(MOCK_ROLE_DETAILS);
      setBillingData(MOCK_BILLING_DATA);
      setPayments(MOCK_PAYMENTS);
      return;
    }

    const selectedRole = getCookie("selectedRole");
    const userId = getCookie("userId");

    if (!selectedRole || !userId) {
      showAlert(
        "warning",
        "সতর্কতা",
        "ব্যবহারকারীর ভূমিকা বা আইডি পাওয়া যায়নি। লগইন পৃষ্ঠায় যাচ্ছি..."
      );
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    const endpoint = roleEndpoints[selectedRole];
    if (!endpoint) {
      showAlert("error", "ত্রুটি", "অবৈধ ভূমিকা। লগইন পৃষ্ঠায় যাচ্ছি...");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/${endpoint}/?user=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const details = data.results && data.results[0];

        if (details) {
          setUsername(details.name || "ব্যবহারকারী");
          setUserName(details.name || "অজানা ব্যবহারকারী");
          setUserRole(roleLabels[selectedRole] || selectedRole);
          setRoleDetails(details);
        } else {
          showAlert(
            "warning",
            "সতর্কতা",
            "ভূমিকা সম্পর্কিত তথ্য পাওয়া যায়নি।"
          );
          setTimeout(() => navigate("/"), 2000);
        }
      } else {
        showAlert(
          "error",
          "ত্রুটি",
          "ভূমিকা সম্পর্কিত তথ্য লোড করতে সমস্যা হয়েছে।"
        );
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      console.error("Error fetching role details:", error);
      showAlert("error", "ত্রুটি", "প্রোফাইল লোড করতে সমস্যা হয়েছে।");
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  const handleEdit = (key, value) => {
    setEditingField(key);
    setEditValue(value);
  };

  const handleSave = async (key) => {
    const userId = getCookie("userId");
    const selectedRole = getCookie("selectedRole");
    const endpoint = roleEndpoints[selectedRole];

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/${endpoint}/${userId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ [key]: editValue }),
        }
      );

      if (response.ok) {
        showAlert("success", "সফল", "ফিল্ড সফলভাবে আপডেট করা হয়েছে।");
        setEditingField(null);
        fetchRoleDetails();
      } else {
        showAlert("error", "ত্রুটি", "ফিল্ড আপডেট করতে ব্যর্থ হয়েছে।");
      }
    } catch (error) {
      console.error("Error updating field:", error);
      showAlert("error", "ত্রুটি", "ফিল্ড আপডেট করার সময় একটি ত্রুটি ঘটেছে।");
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue("");
  };

  const toggleBillingSection = () => {
    setShowBilling(!showBilling);
    if (!showBilling) {
      fetchBillingDetails();
    }
  };

  const fetchBillingDetails = async () => {
    const userId = getCookie("userId");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/billing/billing-addresses/?user=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setBillingData(data.results[0]);
        } else {
          showAlert(
            "warning",
            "সতর্কতা",
            "বিলিং তথ্য পাওয়া যায়নি। দয়া করে আপনার বিলিং তথ্য যোগ করুন।"
          );
        }
      } else {
        showAlert("error", "ত্রুটি", "বিলিং তথ্য আনতে ত্রুটি হয়েছে।");
      }
    } catch (error) {
      console.error("Error fetching billing details:", error);
      showAlert("error", "ত্রুটি", "একটি ত্রুটি ঘটেছে।");
    }
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingData({ ...billingData, [name]: value });
  };

  const handleBillingSubmit = async (e) => {
    e.preventDefault();
    const userId = getCookie("userId");

    try {
      const checkResponse = await fetch(
        `http://127.0.0.1:8000/api/billing/billing-addresses/?user=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (checkResponse.ok) {
        const checkData = await checkResponse.json();
        if (checkData.results && checkData.results.length > 0) {
          const billingId = checkData.results[0].id;
          await updateBillingInfo(billingId);
        } else {
          await createBillingInfo();
        }
      } else {
        showAlert("error", "ত্রুটি", "বিলিং তথ্য যাচাই করতে ত্রুটি হয়েছে।");
      }
    } catch (error) {
      console.error("Error saving billing details:", error);
      showAlert("error", "ত্রুটি", "একটি ত্রুটি ঘটেছে।");
    }
  };

  const createBillingInfo = async () => {
    const userId = getCookie("userId");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/billing/billing-addresses/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...billingData, user: userId }),
        }
      );

      if (response.ok) {
        showAlert("success", "সফল", "বিলিং তথ্য সফলভাবে সেভ করা হয়েছে!");
        fetchBillingDetails();
      } else {
        showAlert("error", "ত্রুটি", "বিলিং তথ্য সেভ করতে ত্রুটি হয়েছে।");
      }
    } catch (error) {
      console.error("Error creating billing info:", error);
      showAlert("error", "ত্রুটি", "একটি ত্রুটি ঘটেছে।");
    }
  };

  const updateBillingInfo = async (billingId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/billing/billing-addresses/${billingId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(billingData),
        }
      );

      if (response.ok) {
        showAlert("success", "সফল", "বিলিং তথ্য সফলভাবে আপডেট করা হয়েছে!");
        fetchBillingDetails();
      } else {
        showAlert("error", "ত্রুটি", "বিলিং তথ্য আপডেট করতে ত্রুটি হয়েছে।");
      }
    } catch (error) {
      console.error("Error updating billing info:", error);
      showAlert("error", "ত্রুটি", "একটি ত্রুটি ঘটেছে।");
    }
  };

  const togglePaymentsSection = () => {
    setShowPayments(!showPayments);
    if (!showPayments) {
      fetchPayments();
    }
  };

  const fetchPayments = async () => {
    const userId = getCookie("userId");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/payment/payments/?user=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setPayments(data.results);
        } else {
          showAlert("warning", "সতর্কতা", "কোনো পেমেন্ট রেকর্ড পাওয়া যায়নি।");
        }
      } else {
        showAlert("error", "ত্রুটি", "পেমেন্ট তথ্য আনতে ত্রুটি হয়েছে।");
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      showAlert("error", "ত্রুটি", "একটি ত্রুটি ঘটেছে।");
    }
  };

  const handleLogout = () => {
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "selectedRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "farmersId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "rent-ownersId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "storage-ownersId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "agronomistsId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    showAlert("info", "লগআউট", "আপনি লগআউট হয়ে গেছেন।");
    setTimeout(() => navigate("/login"), 2000);
  };

  return (
    <div className="profile-page">
      <FarmerNavbar />

      <div className="profile-background">
        <div className="profile-container">
          {/* Header Section */}
          <div className="profile-header">
            <h1>
              স্বাগতম, <span>{username}</span>
            </h1>
          </div>

          {/* User Information */}
          <div className="profile-card">
            <h2>আপনার বিবরণ</h2>
            <p>
              <strong>ব্যবহারকারীর নাম:</strong> <span>{userName}</span>
            </p>
            <p>
              <strong>ভূমিকা:</strong> <span>{userRole}</span>
            </p>
          </div>

          {/* Role-Based Information */}
          <div className="profile-card">
            <h2>ভূমিকা ভিত্তিক তথ্য</h2>
            <div className="role-details">
              {roleDetails ? (
                Object.keys(roleDetails).map((key) => {
                  const value = roleDetails[key];
                  const isImmutable = immutableFields.includes(key);
                  const label =
                    fieldLabels[key] || key.replace(/_/g, " ").toUpperCase();

                  return (
                    <div key={key} className="field-container">
                      <strong>{label}: </strong>
                      {editingField === key ? (
                        <div className="edit-container">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="edit-input"
                          />
                          <button
                            className="btn-save"
                            onClick={() => handleSave(key)}
                          >
                            সংরক্ষণ
                          </button>
                          <button className="btn-cancel" onClick={handleCancel}>
                            বাতিল
                          </button>
                        </div>
                      ) : (
                        <>
                          <span>{value}</span>
                          {!isImmutable && (
                            <button
                              className="btn-edit"
                              onClick={() => handleEdit(key, value)}
                            >
                              সম্পাদনা
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  );
                })
              ) : (
                <p>ভূমিকা ভিত্তিক তথ্য লোড হচ্ছে...</p>
              )}
            </div>
          </div>

          {/* Billing Section */}
          <div className="profile-card">
            <h2>বিলিং তথ্য</h2>
            <button className="btn-primary" onClick={toggleBillingSection}>
              {showBilling ? "বিলিং বিস্তারিত লুকান" : "বিলিং বিস্তারিত দেখান"}
            </button>
            {showBilling && (
              <form className="billing-form" onSubmit={handleBillingSubmit}>
                <div className="form-group">
                  <label htmlFor="street">রাস্তা:</label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={billingData.street}
                    onChange={handleBillingChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">শহর:</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={billingData.city}
                    onChange={handleBillingChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">রাজ্য:</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={billingData.state}
                    onChange={handleBillingChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="postal_code">পোস্টাল কোড:</label>
                  <input
                    type="text"
                    id="postal_code"
                    name="postal_code"
                    value={billingData.postal_code}
                    onChange={handleBillingChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="country">দেশ:</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={billingData.country}
                    onChange={handleBillingChange}
                    required
                  />
                </div>
                <button type="submit" className="btn-save-billing">
                  বিলিং তথ্য সংরক্ষণ করুন
                </button>
              </form>
            )}
          </div>

          {/* Payments Section */}
          <div className="profile-card">
            <h2>পেমেন্টের ইতিহাস</h2>
            <button className="btn-primary" onClick={togglePaymentsSection}>
              {showPayments ? "পেমেন্ট লুকান" : "পেমেন্ট দেখান"}
            </button>
            {showPayments && (
              <div className="payments-section">
                {payments.length > 0 ? (
                  <table className="payments-table">
                    <thead>
                      <tr>
                        <th>পরিমাণ</th>
                        <th>পেমেন্টের তারিখ</th>
                        <th>পেমেন্ট পদ্ধতি</th>
                        <th>অবস্থা</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment, index) => (
                        <tr key={index}>
                          <td>{payment.amount}</td>
                          <td>{payment.payment_date}</td>
                          <td>{payment.payment_method}</td>
                          <td>{payment.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>কোনো পেমেন্ট রেকর্ড নেই</p>
                )}
              </div>
            )}
          </div>

          {/* Button Group */}
          <div className="button-group">
            <button className="btn-danger" onClick={handleLogout}>
              লগআউট
            </button>
          </div>
        </div>
      </div>

      <Footer />

      <Alert
        isOpen={alert.isOpen}
        onClose={closeAlert}
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />
    </div>
  );
};

export default ProfilePage;
