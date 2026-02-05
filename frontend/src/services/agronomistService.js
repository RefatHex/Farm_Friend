// Agronomist API Service
const ROOT_API_URL = "http://localhost:8000/api";
const API_BASE_URL = `${ROOT_API_URL}/consultations`;

// Demo data for when backend is unavailable
const DEMO_AGRONOMISTS = [
  {
    id: 1,
    name: "ড. মোহাম্মদ আলী",
    dob: "1970-05-15",
    contact: "01711234567",
    address: "ঢাকা বিশ্ববিদ্যালয়, ঢাকা",
    description: "কৃষি বিজ্ঞানে ৩০ বছরের অভিজ্ঞতা। ধান ও গমের রোগ প্রতিরোধে বিশেষজ্ঞ। বাংলাদেশ কৃষি গবেষণা ইনস্টিটিউটের সাবেক পরিচালক।",
    specialty: "ফসলের রোগ প্রতিরোধ",
    fee: "500.00",
    years_of_experience: 30,
    availability: true,
    user: { id: 301, username: "dr_ali", profile_picture: null }
  },
  {
    id: 2,
    name: "প্রফেসর ফাতেমা বেগম",
    dob: "1975-08-20",
    contact: "01812345678",
    address: "বাংলাদেশ কৃষি বিশ্ববিদ্যালয়, ময়মনসিংহ",
    description: "মাটি ও সার বিশেষজ্ঞ। জৈব সার ও মাটির স্বাস্থ্য নিয়ে গবেষণা করেন। কৃষকদের জমির উর্বরতা বৃদ্ধিতে সহায়তা করেন।",
    specialty: "মাটি ও সার ব্যবস্থাপনা",
    fee: "400.00",
    years_of_experience: 20,
    availability: true,
    user: { id: 302, username: "prof_fatema", profile_picture: null }
  },
  {
    id: 3,
    name: "ড. কামরুল হাসান",
    dob: "1980-03-10",
    contact: "01912345678",
    address: "শেরেবাংলা কৃষি বিশ্ববিদ্যালয়, ঢাকা",
    description: "সবজি চাষ ও বালাই দমনে বিশেষজ্ঞ। আধুনিক কৃষি প্রযুক্তি ও জৈবিক বালাইনাশক নিয়ে কাজ করেন।",
    specialty: "সবজি চাষ ও বালাই দমন",
    fee: "350.00",
    years_of_experience: 15,
    availability: true,
    user: { id: 303, username: "dr_kamrul", profile_picture: null }
  },
  {
    id: 4,
    name: "ড. রাশেদা খাতুন",
    dob: "1978-11-25",
    contact: "01612345678",
    address: "বরিশাল কৃষি বিশ্ববিদ্যালয়",
    description: "ফল চাষ বিশেষজ্ঞ। আম, লিচু, কাঁঠাল চাষে দীর্ঘ অভিজ্ঞতা। ফলের রোগ ও পোকামাকড় দমনে পরামর্শ দেন।",
    specialty: "ফল চাষ ও ব্যবস্থাপনা",
    fee: "450.00",
    years_of_experience: 18,
    availability: true,
    user: { id: 304, username: "dr_rasheda", profile_picture: null }
  },
  {
    id: 5,
    name: "মোঃ আবু তালেব",
    dob: "1982-07-08",
    contact: "01512345678",
    address: "রাজশাহী বিভাগ",
    description: "মাঠ পর্যায়ে ২০ বছরের অভিজ্ঞতা। ধান, পাট, ভুট্টা চাষে বিশেষজ্ঞ। কৃষকদের সাথে সরাসরি কাজ করার অভিজ্ঞতা।",
    specialty: "শস্য উৎপাদন ও ব্যবস্থাপনা",
    fee: "300.00",
    years_of_experience: 20,
    availability: true,
    user: { id: 305, username: "abu_taleb", profile_picture: null }
  },
  {
    id: 6,
    name: "ড. সাইফুল ইসলাম",
    dob: "1976-04-18",
    contact: "01712345678",
    address: "সিলেট কৃষি বিশ্ববিদ্যালয়",
    description: "সেচ ও পানি ব্যবস্থাপনা বিশেষজ্ঞ। খরা ও বন্যা প্রতিরোধী কৃষি পদ্ধতি নিয়ে গবেষণা করেন।",
    specialty: "সেচ ও পানি ব্যবস্থাপনা",
    fee: "400.00",
    years_of_experience: 22,
    availability: true,
    user: { id: 306, username: "dr_saiful", profile_picture: null }
  }
];

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
    console.error("Error fetching agronomists, using demo data:", error);
    // Return demo data with filtering applied
    let filteredAgronomists = [...DEMO_AGRONOMISTS];
    
    if (filters.availability !== undefined) {
      filteredAgronomists = filteredAgronomists.filter(a => a.availability === filters.availability);
    }
    
    if (filters.specialty) {
      filteredAgronomists = filteredAgronomists.filter(a => 
        a.specialty.toLowerCase().includes(filters.specialty.toLowerCase())
      );
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredAgronomists = filteredAgronomists.filter(a => 
        a.name.toLowerCase().includes(searchLower) ||
        a.specialty.toLowerCase().includes(searchLower) ||
        a.description.toLowerCase().includes(searchLower)
      );
    }
    
    return filteredAgronomists;
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

// Export demo data for direct access
export const getDemoAgronomists = () => DEMO_AGRONOMISTS;
