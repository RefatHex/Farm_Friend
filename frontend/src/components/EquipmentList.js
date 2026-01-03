import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRentItems } from "../services/rentalService";
import "./EquipmentList.css";

function EquipmentList() {
  const navigate = useNavigate();
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        setLoading(true);
        const filters = { is_available: true };
        const data = await fetchRentItems(filters);
        const items = Array.isArray(data) ? data : data.results || [];

        // Map backend data
        const mappedItems = items.map((item) => ({
          id: item.id,
          title: item.product_name,
          price: parseFloat(item.price),
          description: item.description,
          image: item.image
            ? `http://localhost:8000${item.image}`
            : "https://via.placeholder.com/300x180?text=No+Image",
          is_available: item.is_available,
          rent_owner: item.rent_owner,
        }));

        setEquipmentList(mappedItems);
        setError(null);
      } catch (err) {
        console.error("Error loading equipment:", err);
        setError("Failed to load equipment");
        setEquipmentList([]);
      } finally {
        setLoading(false);
      }
    };

    loadEquipment();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/equipment/${id}`);
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "#666" }}>Loading equipment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "#d32f2f" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="equipment-list-container" style={{ padding: "2rem" }}>
      <h2>Available Equipment for Rent</h2>
      <div
        className="equipment-list"
        style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}
      >
        {equipmentList.length === 0 ? (
          <p>No equipment available.</p>
        ) : (
          equipmentList.map((eq) => (
            <div
              className="equipment-card"
              key={eq.id}
              style={{
                background: "#fff",
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                width: 260,
                padding: 16,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onClick={() => handleCardClick(eq.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
              }}
            >
              <div
                className="equipment-image"
                style={{
                  width: "100%",
                  height: 140,
                  background: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                <img
                  src={eq.image}
                  alt={eq.title}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/300x180?text=No+Image")
                  }
                />
              </div>
              <div
                className="equipment-info"
                style={{ textAlign: "center", width: "100%" }}
              >
                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: 8,
                    fontSize: "1.1rem",
                    color: "#333",
                  }}
                >
                  {eq.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "#666",
                    marginBottom: 8,
                    minHeight: 30,
                  }}
                >
                  {eq.description}
                </p>
                <p
                  style={{
                    fontWeight: "bold",
                    color: "#27ae60",
                    marginBottom: 10,
                  }}
                >
                  ৳{eq.price}/day
                </p>
                <button
                  className="rent-btn"
                  style={{
                    marginTop: 10,
                    background: "#4caf50",
                    color: "#fff",
                    border: "none",
                    padding: "0.5rem 1.2rem",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontWeight: "bold",
                    width: "100%",
                    transition: "background-color 0.3s",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(eq.id);
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#45a049")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#4caf50")
                  }
                >
                  Rent Now
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default EquipmentList;
