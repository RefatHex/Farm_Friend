import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchRentItemById,
  createRentalOrder,
} from "../services/rentalService";

function EquipmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rentalDays, setRentalDays] = useState(1);
  const [returnDate, setReturnDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        setLoading(true);
        const data = await fetchRentItemById(id);
        setEquipment(data);

        // Set default return date to 1 day from now
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setReturnDate(tomorrow.toISOString().split("T")[0]);

        setError(null);
      } catch (err) {
        console.error("Error loading equipment:", err);
        setError("Failed to load equipment details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadEquipment();
  }, [id]);

  const handleReturnDateChange = (e) => {
    const selectedDate = e.target.value;
    setReturnDate(selectedDate);

    if (selectedDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(selectedDate);
      const diffTime = selected - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setRentalDays(Math.max(1, diffDays));
    }
  };

  const totalCost = equipment
    ? (parseFloat(equipment.price) * rentalDays).toFixed(2)
    : 0;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!returnDate) {
      setError("Please select a return date.");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const orderData = {
        rent_owner: equipment.rent_owner.id,
        rent_taker: userId,
        return_date: returnDate,
        title: equipment.product_name,
        description: equipment.description,
        image: equipment.image,
        price: totalCost,
        is_confirmed: false,
        is_ready_for_pickup: false,
      };

      await createRentalOrder(orderData);
      setOrderPlaced(true);

      // Redirect to orders page after 2 seconds
      setTimeout(() => {
        navigate("/my-rentals");
      }, 2000);
    } catch (err) {
      console.error("Error placing order:", err);
      setError("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: "1.2rem", color: "#666" }}>
          Loading equipment details...
        </div>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <h2 style={{ color: "#d32f2f", marginBottom: "1rem" }}>
          Equipment Not Found
        </h2>
        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
          No equipment found for this ID.
        </p>
        <button
          onClick={() => navigate("/equipment-list")}
          style={{
            padding: "10px 20px",
            background: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Back to Equipment List
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      <button
        onClick={() => navigate("/equipment-list")}
        style={{
          marginBottom: "1.5rem",
          padding: "8px 16px",
          background: "#f0f0f0",
          border: "1px solid #ddd",
          borderRadius: 4,
          cursor: "pointer",
          fontSize: "0.95rem",
        }}
      >
        ← Back to Equipment List
      </button>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}
      >
        {/* Equipment Image and Details */}
        <div>
          <div style={{ marginBottom: "1.5rem" }}>
            <img
              src={
                equipment.image
                  ? `http://localhost:8000${equipment.image}`
                  : "https://via.placeholder.com/400x300?text=No+Image"
              }
              alt={equipment.product_name}
              style={{
                width: "100%",
                borderRadius: 10,
                objectFit: "cover",
                maxHeight: 400,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
          </div>

          <div
            style={{
              background: "#f9f9f9",
              padding: "1.5rem",
              borderRadius: 10,
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: "0.5rem", color: "#333" }}>
              {equipment.product_name}
            </h2>

            {equipment.rent_owner && (
              <div
                style={{
                  marginBottom: "1rem",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <p style={{ margin: 0, color: "#666" }}>
                  <strong>Owner:</strong> {equipment.rent_owner.name}
                </p>
                <p
                  style={{
                    margin: "0.5rem 0 0 0",
                    color: "#888",
                    fontSize: "0.9rem",
                  }}
                >
                  {equipment.rent_owner.no_of_deals} deals completed
                </p>
              </div>
            )}

            <p style={{ color: "#555", lineHeight: 1.6, marginBottom: "1rem" }}>
              {equipment.description}
            </p>

            <div
              style={{
                background: "white",
                padding: "1rem",
                borderRadius: 8,
                marginBottom: "1rem",
              }}
            >
              <p style={{ margin: "0.5rem 0", color: "#333" }}>
                <strong>Available Quantity:</strong> {equipment.quantity}
              </p>
              <p style={{ margin: "0.5rem 0", color: "#333" }}>
                <strong>Daily Rate:</strong>{" "}
                <span
                  style={{
                    fontSize: "1.3rem",
                    color: "#27ae60",
                    fontWeight: "bold",
                  }}
                >
                  ৳{equipment.price}
                </span>
              </p>
              <p
                style={{
                  margin: "0.5rem 0",
                  color: equipment.is_available ? "#4caf50" : "#d32f2f",
                }}
              >
                <strong>Status:</strong>{" "}
                {equipment.is_available ? "✓ Available" : "✗ Not Available"}
              </p>
            </div>
          </div>
        </div>

        {/* Rental Form */}
        <div>
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: 10,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "1.5rem", color: "#333" }}>
              Rent This Equipment
            </h3>

            {error && (
              <div
                style={{
                  padding: "1rem",
                  marginBottom: "1.5rem",
                  background: "#f8d7da",
                  color: "#721c24",
                  borderRadius: 6,
                }}
              >
                {error}
              </div>
            )}

            {orderPlaced && (
              <div
                style={{
                  padding: "1rem",
                  marginBottom: "1.5rem",
                  background: "#d4edda",
                  color: "#155724",
                  borderRadius: 6,
                }}
              >
                ✓ Order placed successfully! Redirecting to your rentals...
              </div>
            )}

            {!orderPlaced && (
              <form
                onSubmit={handlePlaceOrder}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.2rem",
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
                    Return Date *
                  </span>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={handleReturnDateChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    style={{
                      padding: "10px",
                      borderRadius: 6,
                      border: "1px solid #ddd",
                      fontSize: "1rem",
                    }}
                  />
                </label>

                <div
                  style={{
                    background: "#f9f9f9",
                    padding: "1rem",
                    borderRadius: 6,
                  }}
                >
                  <p style={{ margin: "0 0 0.5rem 0", color: "#666" }}>
                    <strong>Rental Period:</strong> {rentalDays} day
                    {rentalDays > 1 ? "s" : ""}
                  </p>
                  <p style={{ margin: "0 0 0.5rem 0", color: "#666" }}>
                    <strong>Daily Rate:</strong> ৳{equipment.price}
                  </p>
                  <hr
                    style={{
                      margin: "0.5rem 0",
                      border: "none",
                      borderTop: "1px solid #ddd",
                    }}
                  />
                  <p
                    style={{
                      margin: 0,
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "#27ae60",
                    }}
                  >
                    Total Cost: ৳{totalCost}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !equipment.is_available}
                  style={{
                    padding: "12px",
                    backgroundColor: equipment.is_available
                      ? "#4caf50"
                      : "#ccc",
                    color: "white",
                    borderRadius: 6,
                    cursor:
                      equipment.is_available && !submitting
                        ? "pointer"
                        : "not-allowed",
                    border: "none",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    equipment.is_available &&
                    !submitting &&
                    (e.target.style.backgroundColor = "#45a049")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = equipment.is_available
                      ? "#4caf50"
                      : "#ccc")
                  }
                >
                  {submitting
                    ? "Placing Order..."
                    : equipment.is_available
                    ? "Place Rental Order"
                    : "Not Available"}
                </button>
              </form>
            )}

            <hr
              style={{
                margin: "2rem 0",
                border: "none",
                borderTop: "1px solid #eee",
              }}
            />

            <div style={{ fontSize: "0.9rem", color: "#888" }}>
              <p style={{ margin: "0.5rem 0" }}>
                <strong>Note:</strong> Your order will be sent to the equipment
                owner for confirmation.
              </p>
              <p style={{ margin: "0.5rem 0" }}>
                You will receive a notification once they confirm your rental
                request.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EquipmentPage;
