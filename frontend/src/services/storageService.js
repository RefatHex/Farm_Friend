// Storage API Service
// Note: The backend has storage URLs configured at /api/storage/
// This matches: path('api/storage/', include('storage.urls')) in farmfriend/urls.py
const API_BASE_URL = "http://localhost:8000/api/storage";

// Helper to get cookie value
const getCookie = (name) => {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  return null;
};

// ===================== STORAGE GIGS =====================

// Fetch all storage gigs with details (for farmers to browse)
export const fetchStorageGigsWithDetails = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/storage-gigs-details/`);
    if (!response.ok) throw new Error("Failed to fetch storage gigs");
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching storage gigs:", error);
    throw error;
  }
};

// Fetch storage gigs (basic)
export const fetchStorageGigs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/storage-gigs/`);
    if (!response.ok) throw new Error("Failed to fetch storage gigs");
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching storage gigs:", error);
    throw error;
  }
};

// Fetch single storage gig by ID
export const fetchStorageGigById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/storage-gigs/${id}/`);
    if (!response.ok) throw new Error("Failed to fetch storage gig");
    return await response.json();
  } catch (error) {
    console.error("Error fetching storage gig:", error);
    throw error;
  }
};

// Create new storage gig
export const createStorageGig = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/storage-gigs/`, {
      method: "POST",
      body: formData, // FormData with image
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to create storage gig");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating storage gig:", error);
    throw error;
  }
};
// Fetch storage gigs by owner ID
export const fetchStorageGigsByOwner = async (ownerId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/storage-gigs/?storage_owner=${ownerId}`,
    );
    if (!response.ok) throw new Error("Failed to fetch owner storage gigs");
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching owner storage gigs:", error);
    throw error;
  }
};
// Update storage gig
export const updateStorageGig = async (id, formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/storage-gigs/${id}/`, {
      method: "PATCH",
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to update storage gig");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating storage gig:", error);
    throw error;
  }
};

// Delete storage gig
export const deleteStorageGig = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/storage-gigs/${id}/`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete storage gig");
    return true;
  } catch (error) {
    console.error("Error deleting storage gig:", error);
    throw error;
  }
};

// ===================== STORAGE DEALS (BOOKINGS) =====================

// Fetch all storage deals
export const fetchStorageDeals = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/storage-deals/`);
    if (!response.ok) throw new Error("Failed to fetch storage deals");
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching storage deals:", error);
    throw error;
  }
};

// Fetch storage deals by farmer ID
export const fetchStorageDealsByFarmer = async (farmerId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/storage-deals/?farmer=${farmerId}`,
    );
    if (!response.ok) throw new Error("Failed to fetch farmer storage deals");
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching farmer storage deals:", error);
    throw error;
  }
};

// Fetch storage deals by storage owner ID
export const fetchStorageDealsByOwner = async (ownerId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/storage-deals/?storage_owner=${ownerId}`,
    );
    if (!response.ok) throw new Error("Failed to fetch owner storage deals");
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching owner storage deals:", error);
    throw error;
  }
};

// Create storage deal (booking)
export const createStorageDeal = async (dealData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/storage-deals/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dealData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to create storage deal");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating storage deal:", error);
    throw error;
  }
};

// Update storage deal status
export const updateStorageDeal = async (id, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/storage-deals/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to update storage deal");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating storage deal:", error);
    throw error;
  }
};

// Delete storage deal
export const deleteStorageDeal = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/storage-deals/${id}/`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete storage deal");
    return true;
  } catch (error) {
    console.error("Error deleting storage deal:", error);
    throw error;
  }
};

// Fetch storage deal by ID
export const fetchStorageDealById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/storage-deals/${id}/`);
    if (!response.ok) throw new Error("Failed to fetch storage deal");
    return await response.json();
  } catch (error) {
    console.error("Error fetching storage deal:", error);
    throw error;
  }
};

// ===================== STORAGE OWNERS =====================

// Fetch all storage owners
export const fetchStorageOwners = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/storage-owners/`);
    if (!response.ok) throw new Error("Failed to fetch storage owners");
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching storage owners:", error);
    throw error;
  }
};

// Fetch storage owner by ID
export const fetchStorageOwnerById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/storage-owners/${id}/`);
    if (!response.ok) throw new Error("Failed to fetch storage owner");
    return await response.json();
  } catch (error) {
    console.error("Error fetching storage owner:", error);
    throw error;
  }
};

// Get storage owner count
export const getStorageOwnersCount = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/storage-owners/`);
    if (!response.ok) throw new Error("Failed to fetch storage owners count");
    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error("Error fetching storage owners count:", error);
    throw error;
  }
};

// Get storage deals count
export const getStorageDealsCount = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/storage-deals/`);
    if (!response.ok) throw new Error("Failed to fetch storage deals count");
    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error("Error fetching storage deals count:", error);
    throw error;
  }
};

// ===================== CROPS =====================

// Fetch all crops
export const fetchCrops = async () => {
  try {
    const response = await fetch("http://localhost:8000/farmers/crops/");
    if (!response.ok) throw new Error("Failed to fetch crops");
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching crops:", error);
    throw error;
  }
};

export default {
  fetchStorageGigsWithDetails,
  fetchStorageGigs,
  fetchStorageGigById,
  fetchStorageGigsByOwner,
  createStorageGig,
  updateStorageGig,
  deleteStorageGig,
  fetchStorageDeals,
  fetchStorageDealsByFarmer,
  fetchStorageDealsByOwner,
  fetchStorageDealById,
  createStorageDeal,
  updateStorageDeal,
  deleteStorageDeal,
  fetchStorageOwners,
  fetchStorageOwnerById,
  getStorageOwnersCount,
  getStorageDealsCount,
  fetchCrops,
};
