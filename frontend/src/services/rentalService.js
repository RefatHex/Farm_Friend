// Rental API Service
const API_BASE_URL = "http://localhost:8000/api/rentals";

// Demo data for when backend is unavailable
const DEMO_RENT_OWNERS = [
  {
    id: 1,
    name: "আব্দুল করিম যন্ত্রপাতি ভাড়া",
    dob: "1975-06-15",
    contact: "01711111111",
    address: "গাজীপুর, ঢাকা",
    no_of_deals: 120,
    ratings: 4.8,
    user: { id: 201, username: "karim_rent" }
  },
  {
    id: 2,
    name: "হাসান এগ্রো মেশিনারি",
    dob: "1980-03-20",
    contact: "01822222222",
    address: "ময়মনসিংহ",
    no_of_deals: 85,
    ratings: 4.5,
    user: { id: 202, username: "hasan_rent" }
  },
  {
    id: 3,
    name: "রফিক ট্রাক্টর সার্ভিস",
    dob: "1978-09-10",
    contact: "01933333333",
    address: "বগুড়া",
    no_of_deals: 95,
    ratings: 4.7,
    user: { id: 203, username: "rafiq_rent" }
  }
];

const DEMO_RENT_ITEMS = [
  {
    id: 1,
    product_name: "পাওয়ার টিলার",
    description: "১৫ HP পাওয়ার টিলার। জমি চাষের জন্য আদর্শ। জ্বালানি সাশ্রয়ী এবং সহজে চালানো যায়।",
    image: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=400",
    price: "800.00",
    quantity: 5,
    is_available: true,
    rent_owner: DEMO_RENT_OWNERS[0]
  },
  {
    id: 2,
    product_name: "ধান কাটার মেশিন (হার্ভেস্টার)",
    description: "আধুনিক কম্বাইন হার্ভেস্টার। একই সাথে ধান কাটা ও মাড়াই করে। বড় জমির জন্য উপযুক্ত।",
    image: "https://images.unsplash.com/photo-1591438872952-0d2bd0d9d1c4?w=400",
    price: "3500.00",
    quantity: 2,
    is_available: true,
    rent_owner: DEMO_RENT_OWNERS[0]
  },
  {
    id: 3,
    product_name: "ট্রাক্টর (৪৫ HP)",
    description: "মাহিন্দ্রা ট্রাক্টর ৪৫ HP। ভারী কাজের জন্য উপযুক্ত। চাষ, মাল বহন সব কাজে ব্যবহার করা যায়।",
    image: "https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=400",
    price: "2500.00",
    quantity: 3,
    is_available: true,
    rent_owner: DEMO_RENT_OWNERS[1]
  },
  {
    id: 4,
    product_name: "স্প্রে মেশিন",
    description: "ব্যাকপ্যাক স্প্রেয়ার। কীটনাশক ও সার প্রয়োগের জন্য। ২০ লিটার ধারণক্ষমতা।",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
    price: "200.00",
    quantity: 15,
    is_available: true,
    rent_owner: DEMO_RENT_OWNERS[1]
  },
  {
    id: 5,
    product_name: "সেচ পাম্প",
    description: "ডিজেল চালিত সেচ পাম্প। ৫ HP মোটর। ঘণ্টায় ৫০০০ লিটার পানি তোলার ক্ষমতা।",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400",
    price: "600.00",
    quantity: 8,
    is_available: true,
    rent_owner: DEMO_RENT_OWNERS[2]
  },
  {
    id: 6,
    product_name: "বীজ বপন যন্ত্র (সিডার)",
    description: "স্বয়ংক্রিয় বীজ বপন যন্ত্র। সারিবদ্ধভাবে বীজ বপন করে। সময় ও শ্রম সাশ্রয়ী।",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400",
    price: "1200.00",
    quantity: 4,
    is_available: true,
    rent_owner: DEMO_RENT_OWNERS[2]
  },
  {
    id: 7,
    product_name: "রোটাভেটর",
    description: "ট্রাক্টর চালিত রোটাভেটর। মাটি ভাঙ্গা ও সমান করার জন্য। দ্রুত কাজ করে।",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400",
    price: "1500.00",
    quantity: 3,
    is_available: true,
    rent_owner: DEMO_RENT_OWNERS[0]
  },
  {
    id: 8,
    product_name: "ধান মাড়াই মেশিন",
    description: "থ্রেশার মেশিন। ধান থেকে খড় আলাদা করে। দ্রুত ও পরিষ্কার কাজ।",
    image: "https://images.unsplash.com/photo-1595246140520-1991cca1aaaa?w=400",
    price: "900.00",
    quantity: 6,
    is_available: true,
    rent_owner: DEMO_RENT_OWNERS[1]
  }
];

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
    console.error("Error fetching rent items, using demo data:", error);
    // Return demo data with filtering applied
    let filteredItems = [...DEMO_RENT_ITEMS];
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredItems = filteredItems.filter(item => 
        item.product_name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.is_available !== undefined) {
      filteredItems = filteredItems.filter(item => item.is_available === filters.is_available);
    }
    
    return { results: filteredItems };
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

// Export demo data for direct access
export const getDemoRentItems = () => DEMO_RENT_ITEMS;
export const getDemoRentOwners = () => DEMO_RENT_OWNERS;
