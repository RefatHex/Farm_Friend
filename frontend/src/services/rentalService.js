// Rental API Service
const API_BASE_URL = "http://localhost:8000/api/rentals";

// Fetch all rent items with user details
export const fetchRentItems = async (filters = {}) => {
  try {
    let url = `${API_BASE_URL}/rent-items-with-user/`;
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.is_available !== undefined)
      params.append("is_available", filters.is_available);
    if (filters.price_min) params.append("price__gte", filters.price_min);
    if (filters.price_max) params.append("price__lte", filters.price_max);
    if (filters.ordering) params.append("ordering", filters.ordering);

    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch rent items");
    return await response.json();
  } catch (error) {
    console.error("Error fetching rent items:", error);
    throw error;
  }
};

// Fetch single rent item by ID
export const fetchRentItemById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rent-items-with-user/${id}/`);
    if (!response.ok) throw new Error("Failed to fetch rent item");
    return await response.json();
  } catch (error) {
    console.error("Error fetching rent item:", error);
    throw error;
  }
};

// Create new rent item (for rent owners)
export const createRentItem = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rent-items/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData, // FormData with image
    });
    if (!response.ok) throw new Error("Failed to create rent item");
    return await response.json();
  } catch (error) {
    console.error("Error creating rent item:", error);
    throw error;
  }
};

// Update rent item
export const updateRentItem = async (id, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rent-items/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update rent item");
    return await response.json();
  } catch (error) {
    console.error("Error updating rent item:", error);
    throw error;
  }
};

// Delete rent item
export const deleteRentItem = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rent-items/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete rent item");
  } catch (error) {
    console.error("Error deleting rent item:", error);
    throw error;
  }
};

// Create rental order
export const createRentalOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rent-item-orders/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error("Failed to create rental order");
    return await response.json();
  } catch (error) {
    console.error("Error creating rental order:", error);
    throw error;
  }
};

// Fetch rental orders for current user
export const fetchMyRentalOrders = async (userId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/rent-item-orders/?rent_taker=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch rental orders");
    return await response.json();
  } catch (error) {
    console.error("Error fetching rental orders:", error);
    throw error;
  }
};

// Fetch rental orders posted by user (as rent owner)
export const fetchMyPostedRentals = async (rentOwnerId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/rent-item-orders/?rent_owner=${rentOwnerId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch posted rentals");
    return await response.json();
  } catch (error) {
    console.error("Error fetching posted rentals:", error);
    throw error;
  }
};

// Update rental order status
export const updateRentalOrderStatus = async (orderId, statusData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/rent-item-orders/${orderId}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(statusData),
      }
    );
    if (!response.ok) throw new Error("Failed to update rental order status");
    return await response.json();
  } catch (error) {
    console.error("Error updating rental order status:", error);
    throw error;
  }
};

// Fetch rent owner details
export const fetchRentOwner = async (userId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/rent-owners/?user=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch rent owner");
    const data = await response.json();
    return data.results ? data.results[0] : null;
  } catch (error) {
    console.error("Error fetching rent owner:", error);
    throw error;
  }
};

// Create rent owner profile
export const createRentOwner = async (ownerData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rent-owners/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(ownerData),
    });
    if (!response.ok) throw new Error("Failed to create rent owner profile");
    return await response.json();
  } catch (error) {
    console.error("Error creating rent owner profile:", error);
    throw error;
  }
};
