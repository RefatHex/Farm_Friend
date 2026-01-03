import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchMyPostedRentals,
  fetchRentOwner,
  updateRentalOrderStatus,
} from "../services/rentalService";

function MyRentalsPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("pending"); // pending, confirmed, ready
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId");
        if (!userId) {
          navigate("/login");
          return;
        }

        // First get the rent owner profile
        const rentOwner = await fetchRentOwner(userId);
        if (!rentOwner) {
          setError(
            "You need to set up a rent owner profile to manage rentals."
          );
          setOrders([]);
          return;
        }

        // Then fetch orders for this rent owner
        const data = await fetchMyPostedRentals(rentOwner.id);
        const ordersList = Array.isArray(data) ? data : data.results || [];
        setOrders(ordersList);
        setError(null);
      } catch (err) {
        console.error("Error loading rental orders:", err);
        setError("Failed to load your rental orders. Please try again.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [navigate]);

  const filteredOrders = orders.filter((order) => {
    if (filter === "pending") return !order.is_confirmed;
    if (filter === "confirmed")
      return order.is_confirmed && !order.is_ready_for_pickup;
    if (filter === "ready") return order.is_ready_for_pickup;
    return true;
  });

  const handleConfirmOrder = async (orderId) => {
    try {
      setUpdatingId(orderId);
      await updateRentalOrderStatus(orderId, { is_confirmed: true });

      // Update local state
      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, is_confirmed: true } : o))
      );
    } catch (err) {
      console.error("Error confirming order:", err);
      setError("Failed to confirm order. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMarkReady = async (orderId) => {
    try {
      setUpdatingId(orderId);
      await updateRentalOrderStatus(orderId, { is_ready_for_pickup: true });

      // Update local state
      setOrders(
        orders.map((o) =>
          o.id === orderId ? { ...o, is_ready_for_pickup: true } : o
        )
      );
    } catch (err) {
      console.error("Error marking as ready:", err);
      setError("Failed to mark as ready. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (order) => {
    if (order.is_ready_for_pickup) {
      return (
        <span
          style={{
            background: "#4caf50",
            color: "white",
            padding: "4px 12px",
            borderRadius: 20,
            fontSize: "0.85rem",
          }}
        >
          Ready for Pickup
        </span>
      );
    }
    if (order.is_confirmed) {
      return (
        <span
          style={{
            background: "#2196F3",
            color: "white",
            padding: "4px 12px",
            borderRadius: 20,
            fontSize: "0.85rem",
          }}
        >
          Confirmed
        </span>
      );
    }
    return (
      <span
        style={{
          background: "#ff9800",
          color: "white",
          padding: "4px 12px",
          borderRadius: 20,
          fontSize: "0.85rem",
        }}
      >
        Pending Confirmation
      </span>
    );
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
          Loading rental requests...
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ margin: 0, color: "#333" }}>My Rental Requests</h2>
        <button
          onClick={() => navigate("/post-equipment")}
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
          + Post New Equipment
        </button>
      </div>

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

      {/* Filter Buttons */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setFilter("pending")}
          style={{
            padding: "8px 16px",
            background: filter === "pending" ? "#ff9800" : "#f0f0f0",
            color: filter === "pending" ? "white" : "#333",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: filter === "pending" ? "bold" : "normal",
          }}
        >
          Pending Confirmation ({orders.filter((o) => !o.is_confirmed).length})
        </button>
        <button
          onClick={() => setFilter("confirmed")}
          style={{
            padding: "8px 16px",
            background: filter === "confirmed" ? "#2196F3" : "#f0f0f0",
            color: filter === "confirmed" ? "white" : "#333",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: filter === "confirmed" ? "bold" : "normal",
          }}
        >
          Confirmed (
          {
            orders.filter((o) => o.is_confirmed && !o.is_ready_for_pickup)
              .length
          }
          )
        </button>
        <button
          onClick={() => setFilter("ready")}
          style={{
            padding: "8px 16px",
            background: filter === "ready" ? "#4caf50" : "#f0f0f0",
            color: filter === "ready" ? "white" : "#333",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: filter === "ready" ? "bold" : "normal",
          }}
        >
          Ready for Pickup ({orders.filter((o) => o.is_ready_for_pickup).length}
          )
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            background: "#f9f9f9",
            borderRadius: 10,
          }}
        >
          <p style={{ color: "#666", fontSize: "1.1rem" }}>
            {orders.length === 0
              ? "You have no rental requests yet."
              : "No requests match the selected filter."}
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              style={{
                background: "white",
                padding: "1.5rem",
                borderRadius: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                display: "grid",
                gridTemplateColumns: "120px 1fr",
                gap: "1.5rem",
                alignItems: "start",
              }}
            >
              {/* Order Image */}
              <div>
                <img
                  src={
                    order.image
                      ? `http://localhost:8000${order.image}`
                      : "https://via.placeholder.com/120x120?text=No+Image"
                  }
                  alt={order.title}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 8,
                    objectFit: "cover",
                  }}
                />
              </div>

              {/* Order Details */}
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: "0 0 0.5rem 0",
                        color: "#333",
                        fontSize: "1.1rem",
                      }}
                    >
                      {order.title}
                    </h3>
                    <p
                      style={{
                        margin: "0.25rem 0",
                        color: "#666",
                        fontSize: "0.9rem",
                      }}
                    >
                      <strong>Description:</strong> {order.description}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {getStatusBadge(order)}
                    <p
                      style={{
                        margin: "0.5rem 0 0 0",
                        color: "#27ae60",
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                      }}
                    >
                      ৳{order.price}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1rem",
                    padding: "1rem",
                    background: "#f9f9f9",
                    borderRadius: 6,
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <p
                      style={{ margin: 0, color: "#888", fontSize: "0.85rem" }}
                    >
                      Order Date
                    </p>
                    <p
                      style={{
                        margin: "0.25rem 0 0 0",
                        color: "#333",
                        fontWeight: "bold",
                      }}
                    >
                      {new Date(order.order_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{ margin: 0, color: "#888", fontSize: "0.85rem" }}
                    >
                      Return Date
                    </p>
                    <p
                      style={{
                        margin: "0.25rem 0 0 0",
                        color: "#333",
                        fontWeight: "bold",
                      }}
                    >
                      {new Date(order.return_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{ margin: 0, color: "#888", fontSize: "0.85rem" }}
                    >
                      Rental Renter
                    </p>
                    <p
                      style={{
                        margin: "0.25rem 0 0 0",
                        color: "#333",
                        fontWeight: "bold",
                      }}
                    >
                      User #{order.rent_taker}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {!order.is_confirmed && (
                    <button
                      disabled={updatingId === order.id}
                      onClick={() => handleConfirmOrder(order.id)}
                      style={{
                        padding: "8px 16px",
                        background: "#4caf50",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        cursor:
                          updatingId === order.id ? "not-allowed" : "pointer",
                        fontWeight: "bold",
                        opacity: updatingId === order.id ? 0.6 : 1,
                        fontSize: "0.9rem",
                      }}
                    >
                      {updatingId === order.id
                        ? "Confirming..."
                        : "Confirm Rental"}
                    </button>
                  )}

                  {order.is_confirmed && !order.is_ready_for_pickup && (
                    <button
                      disabled={updatingId === order.id}
                      onClick={() => handleMarkReady(order.id)}
                      style={{
                        padding: "8px 16px",
                        background: "#2196F3",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        cursor:
                          updatingId === order.id ? "not-allowed" : "pointer",
                        fontWeight: "bold",
                        opacity: updatingId === order.id ? 0.6 : 1,
                        fontSize: "0.9rem",
                      }}
                    >
                      {updatingId === order.id
                        ? "Marking..."
                        : "Mark Ready for Pickup"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRentalsPage;
