import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchMyRentalOrders,
  updateRentalOrderStatus,
} from "../services/rentalService";

function RentalOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, pending, confirmed
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

        const data = await fetchMyRentalOrders(userId);
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

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this rental order?")) {
      try {
        setUpdatingId(orderId);
        // You might want to add a separate endpoint for cancellation
        // For now, we'll just remove it from state
        setOrders(orders.filter((o) => o.id !== orderId));
      } catch (err) {
        console.error("Error canceling order:", err);
        setError("Failed to cancel order. Please try again.");
      } finally {
        setUpdatingId(null);
      }
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
        Pending
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
          Loading your rental orders...
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
        <h2 style={{ margin: 0, color: "#333" }}>My Rental Orders</h2>
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
          Rent More Equipment
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
          onClick={() => setFilter("all")}
          style={{
            padding: "8px 16px",
            background: filter === "all" ? "#4caf50" : "#f0f0f0",
            color: filter === "all" ? "white" : "#333",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: filter === "all" ? "bold" : "normal",
          }}
        >
          All ({orders.length})
        </button>
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
          Pending ({orders.filter((o) => !o.is_confirmed).length})
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
          Ready ({orders.filter((o) => o.is_ready_for_pickup).length})
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
              ? "You have no rental orders yet."
              : "No orders match the selected filter."}
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
                      Days
                    </p>
                    <p
                      style={{
                        margin: "0.25rem 0 0 0",
                        color: "#333",
                        fontWeight: "bold",
                      }}
                    >
                      {Math.ceil(
                        (new Date(order.return_date) -
                          new Date(order.order_date)) /
                          (1000 * 60 * 60 * 24)
                      )}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {!order.is_confirmed && (
                    <button
                      disabled={updatingId === order.id}
                      onClick={() => handleCancelOrder(order.id)}
                      style={{
                        padding: "8px 16px",
                        background: "#d32f2f",
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
                      {updatingId === order.id ? "Canceling..." : "Cancel"}
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

export default RentalOrders;
