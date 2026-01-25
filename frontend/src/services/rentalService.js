// Rental API Service
const API_BASE_URL = "http://localhost:8000/api/rentals";

// ===================== RENT ITEMS MANAGEMENT =====================

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
    if (filters.rent_owner) params.append("rent_owner", filters.rent_owner);

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

// Create new rent item (for rent owners/RentAdmin)
export const createRentItem = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rent-items/`, {
      method: "POST",
      body: formData, // FormData with image
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to create rent item");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating rent item:", error);
    throw error;
  }
};

// Create new rent item with data object (alternative method)
export const createRentItemWithData = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rent-items/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to create rent item");
    }
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
    });
    if (!response.ok) throw new Error("Failed to delete rent item");
  } catch (error) {
    console.error("Error deleting rent item:", error);
    throw error;
  }
};

// ===================== RENTAL ORDERS MANAGEMENT =====================

// Create rental order (Farmer rents equipment)
export const createRentalOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rent-item-orders/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to create rental order");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating rental order:", error);
    throw error;
  }
};

// Fetch rental orders for current user (farmer)
export const fetchMyRentalOrders = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/rent-item-orders/my_rentals/`,
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
    const url = rentOwnerId
      ? `${API_BASE_URL}/rent-item-orders/?rent_owner=${rentOwnerId}`
      : `${API_BASE_URL}/rent-item-orders/my_posted_orders/`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch posted rentals");
    return await response.json();
  } catch (error) {
    console.error("Error fetching posted rentals:", error);
    throw error;
  }
};

// Fetch all rental orders with filters
export const fetchRentalOrders = async (filters = {}) => {
  try {
    let url = `${API_BASE_URL}/rent-item-orders/`;
    const params = new URLSearchParams();

    if (filters.is_confirmed !== undefined)
      params.append("is_confirmed", filters.is_confirmed);
    if (filters.is_ready_for_pickup !== undefined)
      params.append("is_ready_for_pickup", filters.is_ready_for_pickup);
    if (filters.rent_owner) params.append("rent_owner", filters.rent_owner);
    if (filters.rent_taker) params.append("rent_taker", filters.rent_taker);

    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch rental orders");
    return await response.json();
  } catch (error) {
    console.error("Error fetching rental orders:", error);
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
        },
        body: JSON.stringify(statusData),
      },
    );
    if (!response.ok) throw new Error("Failed to update rental order status");
    return await response.json();
  } catch (error) {
    console.error("Error updating rental order status:", error);
    throw error;
  }
};

// ===================== RENT OWNER MANAGEMENT =====================

// Fetch rent owner details
export const fetchRentOwner = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rent-owners/?user=${userId}`);
    if (!response.ok) throw new Error("Failed to fetch rent owner");
    const data = await response.json();
    // Handle both paginated and non-paginated responses
    if (Array.isArray(data)) {
      return data.length > 0 ? data[0] : null;
    }
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
      },
      body: JSON.stringify(ownerData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Rent owner creation error:", errorData);
      throw new Error(JSON.stringify(errorData));
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating rent owner profile:", error);
    throw error;
  }
};

// Fetch rent items for a specific owner
export const fetchOwnerRentItems = async (ownerId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/rent-items-with-user/?rent_owner=${ownerId}`,
    );
    if (!response.ok) throw new Error("Failed to fetch owner rent items");
    return await response.json();
  } catch (error) {
    console.error("Error fetching owner rent items:", error);
    throw error;
  }
};

// Get equipment availability
export const getEquipmentAvailability = async (itemId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/rent-items-with-user/${itemId}/`,
    );
    if (!response.ok) throw new Error("Failed to fetch equipment availability");
    const data = await response.json();
    return data.is_available;
  } catch (error) {
    console.error("Error fetching equipment availability:", error);
    throw error;
  }
};
