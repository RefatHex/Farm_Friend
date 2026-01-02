import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Alert from "../components/Alert";
import "./SignupPage.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    dob: "",
    address: "",
    contact: "",
    profilePicture: null,
  });

  const [selectedRoles, setSelectedRoles] = useState({
    farmer: false,
    agronomist: false,
    storage_owner: false,
    rent_owner: false,
  });

  const [roleSpecificData, setRoleSpecificData] = useState({
    field_size: "",
    storage_capacity: "",
    specialty: "",
    years_of_experience: "",
  });

  const showAlert = (type, title, message, callback = null) => {
    setAlert({ isOpen: true, type, title, message, callback });
  };

  const closeAlert = () => {
    const callback = alert.callback;
    setAlert((prev) => ({ ...prev, isOpen: false }));
    if (callback) callback();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profilePicture: e.target.files[0],
    }));
  };

  const handleRoleChange = (role) => {
    setSelectedRoles((prev) => ({
      ...prev,
      [role]: !prev[role],
    }));
  };

  const handleRoleDataChange = (e) => {
    const { name, value } = e.target;
    setRoleSpecificData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createRolePayload = (role, userId) => {
    const basePayload = {
      user: userId,
      name: `${formData.firstName} ${formData.lastName}`,
      dob: formData.dob,
      address: formData.address,
      contact: formData.contact,
    };

    switch (role) {
      case "farmer":
        return {
          ...basePayload,
          field_size: parseFloat(roleSpecificData.field_size),
        };
      case "storage_owner":
        return {
          ...basePayload,
          storage_capacity: parseFloat(roleSpecificData.storage_capacity),
        };
      case "rent_owner":
        return {
          ...basePayload,
          no_of_deals: 0,
        };
      case "agronomist":
        return {
          ...basePayload,
          specialty: roleSpecificData.specialty,
          years_of_experience: parseInt(roleSpecificData.years_of_experience),
        };
      default:
        return basePayload;
    }
  };

  const getRoleUrl = (role) => {
    const urlMap = {
      farmer: "http://127.0.0.1:8000/api/farmers/farmers/",
      // storage_owner, rent_owner, and agronomist endpoints are not yet available
    };
    return urlMap[role];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const activeRoles = Object.entries(selectedRoles).filter(
      ([_, isSelected]) => isSelected
    );

    if (activeRoles.length === 0) {
      showAlert(
        "error",
        "একাউন্টের ধরন প্রয়োজন",
        "অনুগ্রহ করে কমপক্ষে একটি একাউন্টের ধরন নির্বাচন করুন"
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showAlert("error", "পাসওয়ার্ড মিলছে না", "পাসওয়ার্ডগুলি মিলছে না");
      return;
    }

    setIsLoading(true);

    // Create FormData for user creation
    const userFormData = new FormData();
    userFormData.append("username", formData.username);
    userFormData.append("email", formData.email);
    userFormData.append("password", formData.password);
    userFormData.append("name", `${formData.firstName} ${formData.lastName}`);

    if (formData.profilePicture) {
      userFormData.append("profile_picture", formData.profilePicture);
    }

    // Add role flags
    activeRoles.forEach(([role]) => {
      userFormData.append(`is_${role}`, "true");
    });

    try {
      // Create user account
      const userResponse = await fetch(
        "http://127.0.0.1:8000/api/users/user-info/",
        {
          method: "POST",
          body: userFormData,
        }
      );

      if (!userResponse.ok) {
        throw new Error("Failed to create user account");
      }

      const userData = await userResponse.json();
      const userId = userData.id;

      // Create role-specific accounts (only for roles that have endpoints)
      const supportedRoles = activeRoles.filter(([role]) => getRoleUrl(role));
      const rolePromises = supportedRoles.map(async ([role]) => {
        const rolePayload = createRolePayload(role, userId);
        const roleUrl = getRoleUrl(role);

        const response = await fetch(roleUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rolePayload),
        });

        if (!response.ok) {
          throw new Error(`Failed to create ${role} account`);
        }
        return response.json();
      });

      if (supportedRoles.length > 0) {
        await Promise.all(rolePromises);
      }

      showAlert("success", "সফল!", "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      showAlert("error", "ভুল হয়েছে!", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleSpecificFields = () => {
    const fields = [];

    if (selectedRoles.farmer) {
      fields.push(
        <div key="farmer" className="role-fields" data-role="farmer">
          <h4>কৃষক বিবরণ:</h4>
          <div className="role-specific-fields">
            <input
              type="number"
              name="field_size"
              placeholder="জমির মাপ (বিঘা অনুযায়ী)"
              value={roleSpecificData.field_size}
              onChange={handleRoleDataChange}
              required
            />
          </div>
        </div>
      );
    }

    if (selectedRoles.storage_owner) {
      // Storage owner role not yet supported
      return;
    }

    if (selectedRoles.agronomist) {
      // Agronomist role not yet supported
      return;
    }

    return fields;
  };

  return (
    <div className="signup-page">
      <Navbar />

      <Alert
        isOpen={alert.isOpen}
        onClose={closeAlert}
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />

      <div className="signup-background">
        <div className="signup-container">
          <h2>সাইন আপ</h2>
          <form id="signupForm" onSubmit={handleSubmit}>
            {/* Common Fields */}
            <div className="input-group">
              <input
                type="text"
                name="firstName"
                placeholder="প্রথম নাম"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="শেষ নাম"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="ইমেইল"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="username"
              placeholder="ইউজারনেম"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="পাসওয়ার্ড"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="পাসওয়ার্ড নিশ্চিত করুন"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="file-upload">
              <label htmlFor="profilePicture">প্রোফাইল ছবি:</label>
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <input
              type="date"
              name="dob"
              placeholder="জন্ম তারিখ"
              value={formData.dob}
              onChange={handleChange}
              required
            />
            <textarea
              name="address"
              placeholder="ঠিকানা"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="contact"
              placeholder="যোগাযোগ নম্বর"
              value={formData.contact}
              onChange={handleChange}
              required
            />

            {/* Role Selection */}
            <div className="role-selection">
              <h3>আপনার ভূমিকা নির্বাচন করুন:</h3>
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedRoles.farmer}
                    onChange={() => handleRoleChange("farmer")}
                  />
                  কৃষক
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedRoles.agronomist}
                    onChange={() => handleRoleChange("agronomist")}
                    disabled
                  />
                  কৃষিবিদ (শীঘ্রই উপলব্ধ হবে)
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedRoles.storage_owner}
                    onChange={() => handleRoleChange("storage_owner")}
                    disabled
                  />
                  গুদামঘর মালিক (শীঘ্রই উপলব্ধ হবে)
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedRoles.rent_owner}
                    onChange={() => handleRoleChange("rent_owner")}
                    disabled
                  />
                  কৃষি সরঞ্জাম ভাড়া প্রদানকারী (শীঘ্রই উপলব্ধ হবে)
                </label>
              </div>
            </div>

            {/* Additional Fields Container */}
            <div id="additional-fields">{renderRoleSpecificFields()}</div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? "লোড হচ্ছে..." : "সাইন আপ"}
            </button>
          </form>

          <div className="options">
            <p>
              ইতিমধ্যে অ্যাকাউন্ট আছে? <Link to="/login">লগইন করুন</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
