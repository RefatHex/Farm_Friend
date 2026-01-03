import React, { useState, useEffect } from "react";
import {
  createRentItem,
  fetchRentOwner,
  createRentOwner,
} from "../services/rentalService";
import "./EquipmentPostForm.css";

function EquipmentPostForm() {
  const [form, setForm] = useState({
    product_name: "",
    description: "",
    price: "",
    quantity: 1,
    is_available: true,
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rentOwnerId, setRentOwnerId] = useState(null);

  // Get or create rent owner profile on mount
  useEffect(() => {
    const initializeRentOwner = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setError("Please log in first to post equipment.");
          return;
        }

        // Try to fetch existing rent owner
        let owner = await fetchRentOwner(userId);

        if (!owner) {
          // Create rent owner profile if doesn't exist
          const userInfo = {
            first_name: localStorage.getItem("firstName") || "User",
            email: localStorage.getItem("email") || "",
          };

          owner = await createRentOwner({
            user: userId,
            name: userInfo.first_name,
            dob: "1990-01-01", // Default, user should update
            contact: userInfo.email,
            address: "",
          });
        }

        setRentOwnerId(owner.id);
      } catch (err) {
        console.error("Error initializing rent owner:", err);
        setError("Failed to initialize rent owner profile. Please try again.");
      }
    };

    initializeRentOwner();
  }, []);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (name === "image") {
      const file = files[0];
      if (file) {
        setForm({ ...form, image: file });
        setPreview(URL.createObjectURL(file));
      }
    } else if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else if (type === "number") {
      setForm({ ...form, [name]: parseFloat(value) || value });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.product_name.trim()) {
      setError("Equipment name is required.");
      return;
    }
    if (!form.description.trim()) {
      setError("Description is required.");
      return;
    }
    if (!form.price || parseFloat(form.price) <= 0) {
      setError("Price must be a positive number.");
      return;
    }
    if (!form.image) {
      setError("Please upload an image.");
      return;
    }
    if (!rentOwnerId) {
      setError("Rent owner profile not initialized. Please try again.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append("rent_owner", rentOwnerId);
      formData.append("product_name", form.product_name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("quantity", form.quantity);
      formData.append("is_available", form.is_available);
      formData.append("image", form.image);

      await createRentItem(formData);

      setSubmitted(true);

      // Reset form after 2 seconds
      setTimeout(() => {
        setForm({
          product_name: "",
          description: "",
          price: "",
          quantity: 1,
          is_available: true,
          image: null,
        });
        setPreview(null);
        setSubmitted(false);
      }, 2000);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to post equipment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="equipment-post-form-container"
      style={{ maxWidth: 600, margin: "0 auto", padding: "2rem" }}
    >
      <h2
        style={{ textAlign: "center", marginBottom: "1.5rem", color: "#333" }}
      >
        Post Equipment for Rent
      </h2>

      {submitted && (
        <div
          className="success-message"
          style={{
            padding: "1rem",
            marginBottom: "1rem",
            background: "#d4edda",
            color: "#155724",
            borderRadius: 6,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          ✓ Equipment posted successfully! Your listing is now visible to
          farmers.
        </div>
      )}

      {error && (
        <div
          className="error-message"
          style={{
            padding: "1rem",
            marginBottom: "1rem",
            background: "#f8d7da",
            color: "#721c24",
            borderRadius: 6,
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      {!submitted && (
        <form
          className="equipment-post-form"
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
        >
          <label
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <span style={{ fontWeight: "bold", color: "#333" }}>
              Equipment Name *
            </span>
            <input
              type="text"
              name="product_name"
              value={form.product_name}
              onChange={handleChange}
              placeholder="e.g., Tractor, Harvester, etc."
              required
              style={{
                padding: "10px",
                borderRadius: 6,
                border: "1px solid #ddd",
                fontSize: "1rem",
              }}
            />
          </label>

          <label
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <span style={{ fontWeight: "bold", color: "#333" }}>
              Description *
            </span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Provide detailed information about the equipment..."
              required
              rows={4}
              style={{
                padding: "10px",
                borderRadius: 6,
                border: "1px solid #ddd",
                fontSize: "1rem",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
          </label>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <span style={{ fontWeight: "bold", color: "#333" }}>
                Price per day (৳) *
              </span>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="100"
                required
                min="0"
                step="0.01"
                style={{
                  padding: "10px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  fontSize: "1rem",
                }}
              />
            </label>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <span style={{ fontWeight: "bold", color: "#333" }}>
                Quantity Available *
              </span>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                required
                min="1"
                style={{
                  padding: "10px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  fontSize: "1rem",
                }}
              />
            </label>
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="is_available"
              checked={form.is_available}
              onChange={handleChange}
              style={{ width: 20, height: 20, cursor: "pointer" }}
            />
            <span style={{ color: "#333" }}>Mark as available for rent</span>
          </label>

          <label
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <span style={{ fontWeight: "bold", color: "#333" }}>
              Equipment Image *
            </span>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required
              style={{
                padding: "10px",
                borderRadius: 6,
                border: "1px solid #ddd",
                cursor: "pointer",
              }}
            />
          </label>

          {preview && (
            <div style={{ marginTop: "1rem" }}>
              <p
                style={{
                  fontWeight: "bold",
                  color: "#333",
                  marginBottom: "0.5rem",
                }}
              >
                Image Preview:
              </p>
              <img
                src={preview}
                alt="Preview"
                className="image-preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: 300,
                  borderRadius: 6,
                  objectFit: "cover",
                }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px",
              backgroundColor: loading ? "#ccc" : "#4caf50",
              color: "white",
              borderRadius: 6,
              cursor: loading ? "not-allowed" : "pointer",
              border: "none",
              fontWeight: "bold",
              fontSize: "1rem",
              marginTop: "1rem",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) =>
              !loading && (e.target.style.backgroundColor = "#45a049")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = loading ? "#ccc" : "#4caf50")
            }
          >
            {loading ? "Posting Equipment..." : "Post Equipment"}
          </button>
        </form>
      )}
    </div>
  );
}

export default EquipmentPostForm;
