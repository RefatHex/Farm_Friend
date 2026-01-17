import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  fetchStorageOwners,
  fetchStorageGigsWithDetails,
  fetchCrops,
} from "../services/storageService";
import "./StorageOwnersListPage.css";

// Helper to get cookie
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

const StorageOwnersListPage = () => {
  const navigate = useNavigate();
  const [owners, setOwners] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCropFilter, setSelectedCropFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ownersData, gigsData, cropsData] = await Promise.all([
        fetchStorageOwners(),
        fetchStorageGigsWithDetails(),
        fetchCrops(),
      ]);

      setOwners(ownersData);
      setGigs(gigsData);
      setCrops(cropsData);
    } catch (error) {
      console.error("Error loading data:", error);
      showNotification("তথ্য লোড করতে সমস্যা হয়েছে", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const getOwnerGigs = (ownerId) => {
    return gigs.filter(
      (gig) => gig.storage_owner?.id === ownerId && gig.is_Available,
    );
  };

  const getAveragePrice = (ownerId) => {
    const ownerGigs = getOwnerGigs(ownerId);
    if (ownerGigs.length === 0) return 0;
    const total = ownerGigs.reduce(
      (sum, gig) => sum + parseFloat(gig.price || 0),
      0,
    );
    return (total / ownerGigs.length).toFixed(2);
  };

  const getTotalCapacity = (ownerId) => {
    const ownerGigs = getOwnerGigs(ownerId);
    return ownerGigs.reduce((sum, gig) => sum + (gig.quantity || 0), 0);
  };

  // Filter and sort owners
  let filteredOwners = owners.filter((owner) => {
    const gigsCount = getOwnerGigs(owner.id).length;
    if (gigsCount === 0) return false; // Only show owners with available gigs

    const matchesSearch = owner.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (selectedCropFilter) {
      const ownerGigs = getOwnerGigs(owner.id);
      const hasCrop = ownerGigs.some(
        (gig) => gig.prefered_crop?.id === parseInt(selectedCropFilter),
      );
      return matchesSearch && hasCrop;
    }

    return matchesSearch;
  });

  // Sort
  if (sortBy === "name") {
    filteredOwners.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "price-low") {
    filteredOwners.sort(
      (a, b) =>
        parseFloat(getAveragePrice(a.id)) - parseFloat(getAveragePrice(b.id)),
    );
  } else if (sortBy === "price-high") {
    filteredOwners.sort(
      (a, b) =>
        parseFloat(getAveragePrice(b.id)) - parseFloat(getAveragePrice(a.id)),
    );
  } else if (sortBy === "capacity") {
    filteredOwners.sort(
      (a, b) => getTotalCapacity(b.id) - getTotalCapacity(a.id),
    );
  }

  if (loading) {
    return (
      <div className="storage-owners-page">
        <Navbar />
        <div className="page-loading">
          <div className="loading-spinner"></div>
          <p>স্টোরেজ মালিক তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="storage-owners-page">
      <Navbar />

      {/* Notification */}
      {notification && (
        <div className={`page-notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <h1>🏪 স্টোরেজ সেবা প্রদানকারী</h1>
        <p>আমাদের বিশ্বস্ত স্টোরেজ মালিক এবং তাদের সেবা আবিষ্কার করুন</p>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filter-container">
          <input
            type="text"
            placeholder="স্টোরেজ মালিক নাম খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-container">
          <select
            value={selectedCropFilter}
            onChange={(e) => setSelectedCropFilter(e.target.value)}
            className="crop-filter"
          >
            <option value="">সব ফসল</option>
            {crops.map((crop) => (
              <option key={crop.id} value={crop.id}>
                {crop.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-container">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">নাম অনুযায়ী</option>
            <option value="price-low">মূল্য (কম থেকে বেশি)</option>
            <option value="price-high">মূল্য (বেশি থেকে কম)</option>
            <option value="capacity">ক্ষমতা</option>
          </select>
        </div>
      </div>

      {/* Results Info */}
      <div className="results-info">
        <p>
          মোট স্টোরেজ প্রদানকারী: <strong>{filteredOwners.length}</strong>
        </p>
      </div>

      {/* Owners Grid */}
      {filteredOwners.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>কোনো স্টোরেজ মালিক পাওয়া যায়নি</h3>
          <p>
            {searchTerm || selectedCropFilter
              ? "আপনার অনুসন্ধান মানদণ্ড পরিবর্তন করুন"
              : "এখনই কোনো স্টোরেজ সেবা উপলব্ধ নেই"}
          </p>
        </div>
      ) : (
        <div className="owners-grid">
          {filteredOwners.map((owner) => {
            const ownerGigs = getOwnerGigs(owner.id);
            const avgPrice = getAveragePrice(owner.id);
            const totalCapacity = getTotalCapacity(owner.id);

            return (
              <div key={owner.id} className="owner-card">
                <div className="owner-card-header">
                  <div className="owner-avatar">
                    <span className="avatar-text">{owner.name.charAt(0)}</span>
                  </div>
                  <div className="owner-info">
                    <h3 className="owner-name">{owner.name}</h3>
                    <p className="owner-contact">
                      📞 {owner.contact || "যোগাযোগ তথ্য উপলব্ধ নেই"}
                    </p>
                  </div>
                </div>

                <div className="owner-stats">
                  <div className="stat-item">
                    <span className="stat-icon">📦</span>
                    <div>
                      <span className="stat-label">সক্রিয় গিগ</span>
                      <span className="stat-value">{ownerGigs.length}</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">📊</span>
                    <div>
                      <span className="stat-label">সর্বমোট ক্ষমতা</span>
                      <span className="stat-value">{totalCapacity} টন</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">💰</span>
                    <div>
                      <span className="stat-label">গড় মূল্য</span>
                      <span className="stat-value">৳{avgPrice}/দিন</span>
                    </div>
                  </div>
                </div>

                <div className="owner-address">
                  <span>📍 {owner.address || "ঠিকানা উপলব্ধ নেই"}</span>
                </div>

                {/* Gigs Preview */}
                <div className="owner-gigs-preview">
                  <h4>উপলব্ধ সেবা:</h4>
                  <div className="gigs-list">
                    {ownerGigs.slice(0, 3).map((gig) => (
                      <div key={gig.id} className="gig-tag">
                        <span>{gig.prefered_crop?.name || "সব ফসল"}</span>
                        <span className="gig-price">৳{gig.price}/দিন</span>
                      </div>
                    ))}
                    {ownerGigs.length > 3 && (
                      <div className="gig-tag more">
                        +{ownerGigs.length - 3} আরও
                      </div>
                    )}
                  </div>
                </div>

                <div className="owner-actions">
                  <button
                    className="btn-view-gigs"
                    onClick={() => navigate("/storage")}
                  >
                    সেবা দেখুন
                  </button>
                  <button
                    className="btn-contact-owner"
                    onClick={() =>
                      showNotification(
                        `${owner.name} - ${owner.contact} এ যোগাযোগ করুন`,
                        "info",
                      )
                    }
                  >
                    যোগাযোগ করুন
                  </button>
                </div>

                <div className="owner-deals-count">
                  <span>সম্পন্ন লেনদেন: {owner.no_of_deals || 0}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default StorageOwnersListPage;
