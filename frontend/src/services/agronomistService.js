// Agronomist API Service
const API_BASE_URL = "http://localhost:8000/consultations";

// ===================== AGRONOMIST MANAGEMENT =====================

// Fetch all agronomists (with optional filters)
export const fetchAgronomists = async (filters = {}) => {
  try {
    let url = `${API_BASE_URL}/agronomists/`;
    const params = new URLSearchParams();

    if (filters.availability !== undefined)
      params.append("availability", filters.availability);
    if (filters.specialty) params.append("specialty", filters.specialty);
    if (filters.search) params.append("search", filters.search);

    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch agronomists");
    return await response.json();
  } catch (error) {
    console.error("Error fetching agronomists:", error);
    throw error;
  }
};

// Fetch single agronomist by ID
export const fetchAgronomistById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/agronomists/${id}/`);
    if (!response.ok) throw new Error("Failed to fetch agronomist");
    return await response.json();
  } catch (error) {
    console.error("Error fetching agronomist:", error);
    throw error;
  }
};

// Fetch agronomist by user ID
export const fetchAgronomistByUserId = async (userId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/agronomists/?user=${userId}`
    );
    if (!response.ok) throw new Error("Failed to fetch agronomist");
    const data = await response.json();
    // Return first matching agronomist or null
    const results = data.results || data;
    return Array.isArray(results) && results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error("Error fetching agronomist by user:", error);
    throw error;
  }
};

// Create new agronomist profile
export const createAgronomist = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/agronomists/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to create agronomist profile");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating agronomist:", error);
    throw error;
  }
};

// Update agronomist profile (PATCH for partial updates)
export const updateAgronomist = async (id, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/agronomists/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to update agronomist profile");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating agronomist:", error);
    throw error;
  }
};

// ===================== CONSULTATION REQUESTS MANAGEMENT =====================

// Fetch all consultation requests
export const fetchConsultationRequests = async (filters = {}) => {
  try {
    let url = `${API_BASE_URL}/consultation-requests/`;
    const params = new URLSearchParams();

    if (filters.agronomist) params.append("agronomist", filters.agronomist);
    if (filters.farmer) params.append("farmer", filters.farmer);
    if (filters.status) params.append("status", filters.status);

    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch consultation requests");
    return await response.json();
  } catch (error) {
    console.error("Error fetching consultation requests:", error);
    throw error;
  }
};

// Fetch consultation requests for a specific agronomist
export const fetchAgronomistConsultations = async (agronomistId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/consultation-requests/?agronomist=${agronomistId}`
    );
    if (!response.ok) throw new Error("Failed to fetch consultations");
    return await response.json();
  } catch (error) {
    console.error("Error fetching agronomist consultations:", error);
    throw error;
  }
};

// Fetch consultation requests for a specific farmer
export const fetchFarmerConsultations = async (farmerId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/consultation-requests/?farmer=${farmerId}`
    );
    if (!response.ok) throw new Error("Failed to fetch consultations");
    return await response.json();
  } catch (error) {
    console.error("Error fetching farmer consultations:", error);
    throw error;
  }
};

// Create a new consultation request (booking)
export const createConsultationRequest = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/consultation-requests/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to create consultation request");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating consultation request:", error);
    throw error;
  }
};

// Update consultation request status
export const updateConsultationRequest = async (id, data) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/consultation-requests/${id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to update consultation request");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating consultation request:", error);
    throw error;
  }
};

// Delete consultation request
export const deleteConsultationRequest = async (id) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/consultation-requests/${id}/`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) throw new Error("Failed to delete consultation request");
    return true;
  } catch (error) {
    console.error("Error deleting consultation request:", error);
    throw error;
  }
};

// ===================== HELPER FUNCTIONS =====================

// Get cookie helper
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

// Set cookie helper
export const setCookie = (name, value, days = 7) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = `${name}=${encodeURIComponent(value || "")}${expires}; path=/`;
};
