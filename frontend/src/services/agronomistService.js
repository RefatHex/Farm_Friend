// Agronomist API Service
const ROOT_API_URL = "http://localhost:8000/api";
const API_BASE_URL = `${ROOT_API_URL}/consultations`;

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
    if (filters.min_fee) params.append("min_fee", filters.min_fee);
    if (filters.max_fee) params.append("max_fee", filters.max_fee);
    if (filters.ordering) params.append("ordering", filters.ordering);

    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch agronomists");
    const data = await response.json();
    // Handle both paginated and non-paginated responses
    return Array.isArray(data) ? data : data.results || data;
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
    const response = await fetch(`${API_BASE_URL}/agronomists/?user=${userId}`);
    if (!response.ok) throw new Error("Failed to fetch agronomist");
    const data = await response.json();
    // Return first matching agronomist or null
    const results = Array.isArray(data) ? data : data.results || data;
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

// Update agronomist profile (PUT for full updates)
export const updateAgronomistFull = async (id, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/agronomists/${id}/`, {
      method: "PUT",
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

// Delete agronomist
export const deleteAgronomist = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/agronomists/${id}/`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete agronomist");
    return true;
  } catch (error) {
    console.error("Error deleting agronomist:", error);
    throw error;
  }
};

// ===================== CONSULTATION REQUESTS MANAGEMENT =====================

// ===================== CONSULTATION REQUESTS MANAGEMENT =====================

// Fetch all consultation requests
export const fetchConsultationRequests = async (filters = {}) => {
  try {
    let url = `${API_BASE_URL}/consultation-requests/`;
    const params = new URLSearchParams();

    if (filters.agronomist) params.append("agronomist", filters.agronomist);
    if (filters.farmer) params.append("farmer", filters.farmer);
    if (filters.status) params.append("status", filters.status);
    if (filters.search) params.append("search", filters.search);
    if (filters.ordering) params.append("ordering", filters.ordering);

    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch consultation requests");
    const data = await response.json();
    // Handle both paginated and non-paginated responses
    return Array.isArray(data) ? data : data.results || data;
  } catch (error) {
    console.error("Error fetching consultation requests:", error);
    throw error;
  }
};

// Fetch single consultation request by ID
export const fetchConsultationRequestById = async (id) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/consultation-requests/${id}/`,
    );
    if (!response.ok) throw new Error("Failed to fetch consultation request");
    return await response.json();
  } catch (error) {
    console.error("Error fetching consultation request:", error);
    throw error;
  }
};

// Fetch consultation requests for a specific agronomist
export const fetchAgronomistConsultations = async (agronomistId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/consultation-requests/?agronomist=${agronomistId}`,
    );
    if (!response.ok) throw new Error("Failed to fetch consultations");
    const data = await response.json();
    // Handle both paginated and non-paginated responses
    return Array.isArray(data) ? data : data.results || data;
  } catch (error) {
    console.error("Error fetching agronomist consultations:", error);
    throw error;
  }
};

// Fetch consultation requests for a specific farmer
export const fetchFarmerConsultations = async (farmerId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/consultation-requests/?farmer__user=${farmerId}`,
    );
    if (!response.ok) throw new Error("Failed to fetch consultations");
    const data = await response.json();
    // Handle both paginated and non-paginated responses
    return Array.isArray(data) ? data : data.results || data;
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
      console.error("Consultation request error response:", error);
      throw new Error(
        error.detail ||
          JSON.stringify(error) ||
          "Failed to create consultation request",
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating consultation request:", error);
    throw error;
  }
};

// Update consultation request (full update with PUT)
export const updateConsultationRequestFull = async (id, data) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/consultation-requests/${id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
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

// Update consultation request status (PATCH for partial updates)
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
      },
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
      },
    );
    if (!response.ok) throw new Error("Failed to delete consultation request");
    return true;
  } catch (error) {
    console.error("Error deleting consultation request:", error);
    throw error;
  }
};

// ===================== FARMER HELPERS =====================

export const fetchFarmerProfileByUser = async (userId) => {
  if (!userId) {
    console.warn("fetchFarmerProfileByUser: No userId provided");
    return null;
  }

  const url = `${ROOT_API_URL}/farmers/?user=${userId}`;
  console.log("DEBUG: Fetching farmer profile from:", url);

  try {
    const response = await fetch(url);
    console.log("DEBUG: Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DEBUG: HTTP error response:", errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("DEBUG: Raw farmer API response:", data);

    const results = Array.isArray(data) ? data : data.results || [];
    console.log("DEBUG: Parsed results array:", results);

    if (Array.isArray(results) && results.length > 0) {
      console.log("DEBUG: Found farmer profile:", results[0]);
      return results[0];
    }

    console.warn("DEBUG: No farmer profile found for userId:", userId);
  } catch (error) {
    console.error("ERROR: Failed to fetch farmer profile:", error);
  }

  return null;
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
  document.cookie = `${name}=${encodeURIComponent(
    value || "",
  )}${expires}; path=/`;
};
