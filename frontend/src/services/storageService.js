// Storage API Service
// Note: The backend has storage URLs configured at /api/storage/
// This matches: path('api/storage/', include('storage.urls')) in farmfriend/urls.py
const API_BASE_URL = "http://localhost:8000/api/storage";

// Demo data for when backend is unavailable
const DEMO_STORAGE_OWNERS = [
  {
    id: 1,
    name: "রহিম কোল্ড স্টোরেজ",
    dob: "1980-05-15",
    contact: "01712345678",
    address: "ঢাকা, বাংলাদেশ",
    no_of_deals: 45,
    user: { id: 101, username: "rahim_storage" }
  },
  {
    id: 2,
    name: "করিম গুদামঘর",
    dob: "1975-08-20",
    contact: "01812345678",
    address: "চট্টগ্রাম, বাংলাদেশ",
    no_of_deals: 32,
    user: { id: 102, username: "karim_storage" }
  },
  {
    id: 3,
    name: "সালাম এগ্রো স্টোরেজ",
    dob: "1985-03-10",
    contact: "01912345678",
    address: "রাজশাহী, বাংলাদেশ",
    no_of_deals: 28,
    user: { id: 103, username: "salam_storage" }
  },
  {
    id: 4,
    name: "নূর হাসান কোল্ড স্টোরেজ",
    dob: "1978-11-25",
    contact: "01612345678",
    address: "খুলনা, বাংলাদেশ",
    no_of_deals: 55,
    user: { id: 104, username: "nur_storage" }
  }
];

const DEMO_STORAGE_GIGS = [
  {
    id: 1,
    storage_owner: DEMO_STORAGE_OWNERS[0],
    address: "মিরপুর-১০, ঢাকা",
    description: "আধুনিক কোল্ড স্টোরেজ সুবিধা। ধান, গম, আলু সংরক্ষণের জন্য উপযুক্ত। ২৪/৭ তাপমাত্রা নিয়ন্ত্রণ ব্যবস্থা।",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400",
    prefered_crop: { id: 1, name: "ধান" },
    price: "500.00",
    quantity: 100,
    is_Available: true
  },
  {
    id: 2,
    storage_owner: DEMO_STORAGE_OWNERS[0],
    address: "উত্তরা, ঢাকা",
    description: "শুকনো শস্য সংরক্ষণের জন্য বিশেষ গুদামঘর। পোকামাকড় প্রতিরোধী।",
    image: "https://images.unsplash.com/photo-1595246140520-1991cca1aaaa?w=400",
    prefered_crop: { id: 2, name: "গম" },
    price: "450.00",
    quantity: 80,
    is_Available: true
  },
  {
    id: 3,
    storage_owner: DEMO_STORAGE_OWNERS[1],
    address: "আগ্রাবাদ, চট্টগ্রাম",
    description: "বড় ধারণক্ষমতার গুদামঘর। সবজি ও ফল সংরক্ষণের জন্য আদর্শ।",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
    prefered_crop: { id: 3, name: "আলু" },
    price: "600.00",
    quantity: 150,
    is_Available: true
  },
  {
    id: 4,
    storage_owner: DEMO_STORAGE_OWNERS[2],
    address: "শাহ মখদুম, রাজশাহী",
    description: "আম ও লিচু সংরক্ষণের জন্য বিশেষায়িত কোল্ড স্টোরেজ।",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400",
    prefered_crop: { id: 4, name: "আম" },
    price: "700.00",
    quantity: 60,
    is_Available: true
  },
  {
    id: 5,
    storage_owner: DEMO_STORAGE_OWNERS[3],
    address: "খালিশপুর, খুলনা",
    description: "মাছ ও চিংড়ি সংরক্ষণের জন্য হিমাগার সুবিধা। -২০ ডিগ্রি পর্যন্ত ঠান্ডা করা যায়।",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400",
    prefered_crop: { id: 5, name: "মাছ" },
    price: "800.00",
    quantity: 40,
    is_Available: true
  }
];

const DEMO_CROPS = [
  { id: 1, name: "ধান", farmer: 1 },
  { id: 2, name: "গম", farmer: 1 },
  { id: 3, name: "আলু", farmer: 1 },
  { id: 4, name: "আম", farmer: 1 },
  { id: 5, name: "মাছ", farmer: 1 },
  { id: 6, name: "সবজি", farmer: 1 },
  { id: 7, name: "ভুট্টা", farmer: 1 }
];

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
    console.error("Error fetching storage gigs, using demo data:", error);
    return DEMO_STORAGE_GIGS;
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
    console.error("Error fetching storage owners, using demo data:", error);
    return DEMO_STORAGE_OWNERS;
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
    console.error("Error fetching crops, using demo data:", error);
    return DEMO_CROPS;
  }
};

// Export demo data for direct access
export const getDemoStorageOwners = () => DEMO_STORAGE_OWNERS;
export const getDemoStorageGigs = () => DEMO_STORAGE_GIGS;
export const getDemoCrops = () => DEMO_CROPS;

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
  getDemoStorageOwners,
  getDemoStorageGigs,
  getDemoCrops,
};
