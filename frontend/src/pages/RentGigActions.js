import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.jpg";
import "./RentGigActions.css";

const RentGigActions = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentEditProduct, setCurrentEditProduct] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    categoryType: "",
    description: "",
    price: "",
    quantity: "",
    image: null,
  });

  // Edit form states
  const [editFormData, setEditFormData] = useState({
    categoryType: "",
    description: "",
    price: "",
    quantity: "",
    isAvailable: "true",
    image: null,
  });

  // Get cookie helper
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const rentOwnerId = getCookie("rent-ownersId");

  useEffect(() => {
    fetchAvailableProducts();
  }, []);

  const showAlert = (type, message) => {
    setAlertMessage({ type, message });
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const fetchAvailableProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/rentals/rent-items-with-user/?rent_owner=${rentOwnerId}`
      );
      if (response.ok) {
        const data = await response.json();
        setProducts(data.results || []);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditFileChange = (e) => {
    setEditFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.categoryType ||
      !formData.description ||
      !formData.price ||
      !formData.quantity ||
      !formData.image
    ) {
      showAlert("warning", "দয়া করে সমস্ত প্রয়োজনীয় তথ্য প্রদান করুন।");
      return;
    }

    const submitData = new FormData();
    submitData.append("is_available", "True");
    submitData.append("rent_owner", rentOwnerId || 1);
    submitData.append("product_name", formData.categoryType);
    submitData.append("description", formData.description);
    submitData.append("price", formData.price);
    submitData.append("quantity", formData.quantity);
    submitData.append("image", formData.image);

    try {
      const response = await fetch(
        "http://localhost:8000/api/rentals/rent-items/",
        {
          method: "POST",
          body: submitData,
        }
      );

      if (response.ok) {
        showAlert("success", "যন্ত্র সফলভাবে পোস্ট করা হয়েছে!");
        setFormData({
          categoryType: "",
          description: "",
          price: "",
          quantity: "",
          image: null,
        });
        // Reset file input
        document.getElementById("categoryImage").value = "";
        fetchAvailableProducts();
      } else {
        showAlert("error", "যন্ত্র পোস্ট করতে ব্যর্থ হয়েছে!");
      }
    } catch (error) {
      console.error("Error posting instrument:", error);
      showAlert("error", "একটি ত্রুটি ঘটেছে!");
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("আপনি কি নিশ্চিত এই পণ্য মুছে ফেলতে চান?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/rentals/rent-items/${productId}/`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        showAlert("success", "পণ্য সফলভাবে সরানো হয়েছে!");
        fetchAvailableProducts();
      } else {
        showAlert("error", "পণ্য সরানোতে ব্যর্থ হয়েছে!");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      showAlert("error", "একটি ত্রুটি ঘটেছে!");
    }
  };

  const openEditModal = (product) => {
    setCurrentEditProduct(product);
    setEditFormData({
      categoryType: product.product_name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      isAvailable: product.is_available ? "true" : "false",
      image: null,
    });
    setShowModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!currentEditProduct) return;

    const submitData = new FormData();
    submitData.append("product_name", editFormData.categoryType);
    submitData.append("description", editFormData.description);
    submitData.append("price", editFormData.price);
    submitData.append("quantity", editFormData.quantity);
    submitData.append(
      "is_available",
      editFormData.isAvailable === "true" ? "True" : "False"
    );

    if (editFormData.image) {
      submitData.append("image", editFormData.image);
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/rentals/rent-items/${currentEditProduct.id}/`,
        {
          method: "PATCH",
          body: submitData,
        }
      );

      if (response.ok) {
        showAlert("success", "পণ্য সফলভাবে আপডেট করা হয়েছে!");
        setShowModal(false);
        setCurrentEditProduct(null);
        fetchAvailableProducts();
      } else {
        showAlert("error", "পণ্য আপডেট করতে ব্যর্থ হয়েছে!");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      showAlert("error", "একটি ত্রুটি ঘটেছে!");
    }
  };

  return (
    <div className="rent-gig-page">
      {/* Navbar */}
      <nav className="gig-navbar">
        <div className="logo">
          <Link to="/rental-admin">
            <img src={logo} alt="FarmFriend Logo" />
            <span>FarmFriend</span>
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/rental-admin">হোম</Link>
          <Link to="/profile">প্রোফাইল</Link>
        </div>
      </nav>

      {/* Alert */}
      {alertMessage && (
        <div className={`custom-alert ${alertMessage.type}`}>
          {alertMessage.message}
        </div>
      )}

      <div className="gig-container">
        {/* Post Form */}
        <div className="post-form-section">
          <h2>নতুন যন্ত্র পোস্ট করুন</h2>
          <form onSubmit={handleSubmit} className="post-form">
            <div className="form-group">
              <label htmlFor="categoryType">ক্যাটাগরি নির্বাচন করুন</label>
              <select
                id="categoryType"
                name="categoryType"
                value={formData.categoryType}
                onChange={handleInputChange}
                required
              >
                <option value="">--ক্যাটাগরি নির্বাচন করুন--</option>
                <option value="Tractors">ট্রাক্টর</option>
                <option value="Plows">লাঙল</option>
                <option value="Harrows">হ্যারো</option>
                <option value="Sprayers">স্প্রেয়ার</option>
                <option value="Seeders">বীজ বপনকারী</option>
                <option value="Harvesters">হার্ভেস্টার</option>
                <option value="Irrigation">সেচ সরঞ্জাম</option>
                <option value="Others">অন্যান্য</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">বিবরণ</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="যন্ত্রের বিস্তারিত বিবরণ লিখুন"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="categoryImage">ছবি আপলোড করুন</label>
              <input
                type="file"
                id="categoryImage"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">প্রতিদিন ভাড়া (৳)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="মূল্য লিখুন"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="quantity">উপলব্ধ সংখ্যা</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="সংখ্যা লিখুন"
                  required
                />
              </div>
            </div>

            <button type="submit" className="submit-btn">
              যন্ত্র পোস্ট করুন
            </button>
          </form>
        </div>

        {/* Products List */}
        <div className="products-section">
          <h3>আপনার পোস্ট করা যন্ত্রপাতি</h3>
          {loading ? (
            <div className="loading">লোড হচ্ছে...</div>
          ) : products.length === 0 ? (
            <div className="no-products">
              কোনো যন্ত্র পাওয়া যায়নি। উপরের ফর্ম ব্যবহার করে নতুন যন্ত্র যোগ করুন।
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <img
                    src={product.image || "/assets/images/default-product.jpg"}
                    alt={product.product_name}
                  />
                  <div className="product-content">
                    <h4>{product.product_name}</h4>
                    <p className="description">{product.description}</p>
                    <p>
                      <strong>প্রতিদিন ভাড়া:</strong> ৳{product.price}
                    </p>
                    <p>
                      <strong>সংখ্যা:</strong> {product.quantity}
                    </p>
                    <p>
                      <strong>উপলব্ধ:</strong>{" "}
                      <span
                        className={`availability ${
                          product.is_available ? "available" : "unavailable"
                        }`}
                      >
                        {product.is_available ? "হ্যাঁ" : "না"}
                      </span>
                    </p>
                  </div>
                  <div className="product-actions">
                    <button
                      className="edit-btn"
                      onClick={() => openEditModal(product)}
                    >
                      সম্পাদনা
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(product.id)}
                    >
                      মুছুন
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>যন্ত্র সম্পাদনা করুন</h3>
              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="form-group">
                <label>ক্যাটাগরি</label>
                <select
                  name="categoryType"
                  value={editFormData.categoryType}
                  onChange={handleEditInputChange}
                  required
                >
                  <option value="Tractors">ট্রাক্টর</option>
                  <option value="Plows">লাঙল</option>
                  <option value="Harrows">হ্যারো</option>
                  <option value="Sprayers">স্প্রেয়ার</option>
                  <option value="Seeders">বীজ বপনকারী</option>
                  <option value="Harvesters">হার্ভেস্টার</option>
                  <option value="Irrigation">সেচ সরঞ্জাম</option>
                  <option value="Others">অন্যান্য</option>
                </select>
              </div>

              <div className="form-group">
                <label>বিবরণ</label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>ছবি পরিবর্তন করুন (ঐচ্ছিক)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditFileChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>প্রতিদিন ভাড়া (৳)</label>
                  <input
                    type="number"
                    name="price"
                    value={editFormData.price}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>উপলব্ধ সংখ্যা</label>
                  <input
                    type="number"
                    name="quantity"
                    value={editFormData.quantity}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>উপলব্ধতা</label>
                <select
                  name="isAvailable"
                  value={editFormData.isAvailable}
                  onChange={handleEditInputChange}
                  required
                >
                  <option value="true">হ্যাঁ</option>
                  <option value="false">না</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  বাতিল
                </button>
                <button type="submit" className="save-btn">
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="gig-footer">
        <p>&copy; 2025 FarmFriend ভাড়া প্রদানকারী প্যানেল। সর্বস্বত্ব সংরক্ষিত।</p>
      </footer>
    </div>
  );
};

export default RentGigActions;
