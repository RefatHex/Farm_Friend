import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StorageOwnerNavbar from "../components/StorageOwnerNavbar";
import Footer from "../components/Footer";
import {
  fetchStorageGigsByOwner,
  fetchStorageDealsByOwner,
  createStorageGig,
  updateStorageGig,
  deleteStorageGig,
  updateStorageDeal,
  fetchCrops,
  fetchStorageOwnerById,
  getStorageOwnersCount,
  getStorageDealsCount,
} from "../services/storageService";
import "./StorageAdminDashboard.css";

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

const StorageAdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [gigs, setGigs] = useState([]);
  const [deals, setDeals] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [ownerInfo, setOwnerInfo] = useState(null);

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalGigs: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingGig, setEditingGig] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    address: "",
    description: "",
    price: "",
    prefered_crop: "",
    quantity: "",
    is_Available: true,
    image: null,
  });

  const storageOwnerId = getCookie("storage-ownersId");

  useEffect(() => {
    if (!storageOwnerId) {
      navigate("/login");
      return;
    }
    loadInitialData();
  }, [storageOwnerId, navigate]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [gigsData, dealsData, cropsData, usersCount, bookingsCount, ownerData] =
        await Promise.all([
          fetchStorageGigsByOwner(storageOwnerId),
          fetchStorageDealsByOwner(storageOwnerId),
          fetchCrops(),
          getStorageOwnersCount(),
          getStorageDealsCount(),
          fetchStorageOwnerById(storageOwnerId),
        ]);

      setGigs(gigsData);
      setDeals(dealsData);
      setCrops(cropsData);
      setOwnerInfo(ownerData);

      // Calculate booking statistics
      const pendingBookings = dealsData.filter(d => !d.is_confirmed && !d.completed).length;
      const confirmedBookings = dealsData.filter(d => d.is_confirmed && !d.completed).length;
      const completedBookings = dealsData.filter(d => d.completed).length;

      setStats({
        totalUsers: usersCount,
        totalBookings: dealsData.length,
        totalGigs: gigsData.length,
        pendingBookings,
        confirmedBookings,
        completedBookings,
      });
    } catch (error) {
      console.error("Error loading data:", error);
      showNotification("তথ্য লোড করতে সমস্যা হয়েছে", "error");
    } finally {
      setLoading(false);
    }
  };

  const getCropName = (cropId) => {
    const crop = crops.find(c => c.id === cropId);
    return crop ? crop.name : 'N/A';
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const openAddModal = () => {
    setEditingGig(null);
    setFormData({
      address: "",
      description: "",
      price: "",
      prefered_crop: crops[0]?.id || "",
      quantity: "",
      is_Available: true,
      image: null,
    });
    setShowModal(true);
  };

  const openEditModal = (gig) => {
    setEditingGig(gig);
    setFormData({
      address: gig.address || "",
      description: gig.description || "",
      price: gig.price || "",
      prefered_crop: gig.prefered_crop || "",
      quantity: gig.quantity || "",
      is_Available: gig.is_Available || false,
      image: null,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingGig(null);
  };

  const handleSubmitGig = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("storage_owner", storageOwnerId);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("prefered_crop", formData.prefered_crop);
    formDataToSend.append("quantity", formData.quantity);
    formDataToSend.append("is_Available", formData.is_Available);

    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      if (editingGig) {
        await updateStorageGig(editingGig.id, formDataToSend);
        showNotification("গিগ সফলভাবে আপডেট হয়েছে!", "success");
      } else {
        await createStorageGig(formDataToSend);
        showNotification("নতুন গিগ সফলভাবে যোগ হয়েছে!", "success");
      }
      closeModal();
      loadInitialData();
    } catch (error) {
      console.error("Error saving gig:", error);
      showNotification("গিগ সংরক্ষণ করতে সমস্যা হয়েছে", "error");
    }
  };

  const handleDeleteGig = async (gigId) => {
    if (!window.confirm("আপনি কি নিশ্চিত যে এই গিগটি মুছে ফেলতে চান?")) return;

    try {
      await deleteStorageGig(gigId);
      showNotification("গিগ সফলভাবে মুছে ফেলা হয়েছে!", "success");
      loadInitialData();
    } catch (error) {
      console.error("Error deleting gig:", error);
      showNotification("গিগ মুছতে সমস্যা হয়েছে", "error");
    }
  };

  const handleUpdateDeal = async (dealId, updates) => {
    try {
      await updateStorageDeal(dealId, updates);
      showNotification("বুকিং স্ট্যাটাস আপডেট হয়েছে!", "success");
      loadInitialData();
    } catch (error) {
      console.error("Error updating deal:", error);
      showNotification("আপডেট করতে সমস্যা হয়েছে", "error");
    }
  };

  const getImageUrl = (gig) => {
    if (gig.image) {
      if (gig.image.startsWith("http")) return gig.image;
      return `http://localhost:8000${gig.image}`;
    }
    return "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400";
  };

  const renderDashboard = () => (
    <div className="dashboard-content">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-text">
          <h2>স্বাগতম, {ownerInfo?.name || 'স্টোরেজ মালিক'}!</h2>
          <p>আপনার স্টোরেজ ব্যবসার সকল তথ্য এখানে দেখুন</p>
        </div>
        <div className="welcome-date">
          <span className="date-icon">📅</span>
          <span>{new Date().toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon-wrapper"><span className="stat-emoji">📦</span></div>
          <div className="stat-info">
            <h3>মোট বুকিং</h3>
            <span className="stat-number">{stats.totalBookings}</span>
          </div>
        </div>
        <div className="stat-card stat-pending">
          <div className="stat-icon-wrapper"><span className="stat-emoji">⏳</span></div>
          <div className="stat-info">
            <h3>অপেক্ষমাণ</h3>
            <span className="stat-number">{stats.pendingBookings}</span>
          </div>
        </div>
        <div className="stat-card stat-confirmed">
          <div className="stat-icon-wrapper"><span className="stat-emoji">✅</span></div>
          <div className="stat-info">
            <h3>নিশ্চিত</h3>
            <span className="stat-number">{stats.confirmedBookings}</span>
          </div>
        </div>
        <div className="stat-card stat-completed">
          <div className="stat-icon-wrapper"><span className="stat-emoji">🎉</span></div>
          <div className="stat-info">
            <h3>সম্পন্ন</h3>
            <span className="stat-number">{stats.completedBookings}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="dashboard-grid">
        <div className="quick-actions-card">
          <h3>⚡ দ্রুত কার্যক্রম</h3>
          <div className="quick-actions-list">
            <button className="quick-action-btn" onClick={openAddModal}>
              <span className="action-icon">➕</span>
              <span>নতুন গিগ যোগ করুন</span>
            </button>
            <button className="quick-action-btn" onClick={() => setActiveTab('gigs')}>
              <span className="action-icon">🏪</span>
              <span>সকল গিগ দেখুন ({stats.totalGigs})</span>
            </button>
            <button className="quick-action-btn" onClick={() => setActiveTab('bookings')}>
              <span className="action-icon">📋</span>
              <span>বুকিং ব্যবস্থাপনা</span>
            </button>
          </div>
        </div>

        <div className="recent-bookings-card">
          <h3>📋 সাম্প্রতিক বুকিং</h3>
          {deals.length === 0 ? (
            <div className="empty-state-small">
              <span className="empty-icon">📭</span>
              <p>কোনো বুকিং নেই</p>
            </div>
          ) : (
            <div className="recent-bookings-list">
              {deals.slice(0, 4).map((deal) => (
                <div key={deal.id} className="recent-booking-item">
                  <div className="booking-id">#{deal.id}</div>
                  <div className="booking-dates">{deal.start_date} - {deal.end_date}</div>
                  <span className={`booking-badge ${deal.completed ? 'completed' : deal.is_confirmed ? 'confirmed' : 'pending'}`}>
                    {deal.completed ? 'সম্পন্ন' : deal.is_confirmed ? 'নিশ্চিত' : 'অপেক্ষমাণ'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* My Gigs Preview */}
      <div className="gigs-preview-section">
        <div className="section-title">
          <h3>🏪 আমার স্টোরেজ গিগ</h3>
          <button className="view-all-btn" onClick={() => setActiveTab('gigs')}>সবগুলো দেখুন →</button>
        </div>
        {gigs.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🏪</span>
            <h4>কোনো গিগ নেই</h4>
            <p>আপনার প্রথম স্টোরেজ গিগ তৈরি করুন</p>
            <button className="btn-primary" onClick={openAddModal}>➕ নতুন গিগ যোগ করুন</button>
          </div>
        ) : (
          <div className="gigs-preview-grid">
            {gigs.slice(0, 3).map((gig) => (
              <div key={gig.id} className="gig-preview-card">
                <img src={getImageUrl(gig)} alt={gig.address} className="gig-image" />
                <div className="gig-overlay">
                  <span className={`availability-badge ${gig.is_Available ? 'available' : 'unavailable'}`}>
                    {gig.is_Available ? '✓ উপলব্ধ' : '✗ অনুপলব্ধ'}
                  </span>
                </div>
                <div className="gig-info">
                  <h4>{gig.address}</h4>
                  <p className="gig-capacity">📦 {gig.quantity} টন ধারণক্ষমতা</p>
                  <p className="gig-price">💰 ৳{gig.price}/দিন</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderGigs = () => (
    <div className="gigs-content">
      <div className="content-header">
        <h2>🏪 আমার স্টোরেজ গিগ</h2>
        <button className="btn-add" onClick={openAddModal}>➕ নতুন গিগ যোগ করুন</button>
      </div>

      {gigs.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🏪</span>
          <h3>কোনো গিগ নেই</h3>
          <p>এখনই আপনার প্রথম স্টোরেজ গিগ যোগ করুন এবং গ্রাহকদের সেবা দিন</p>
          <button className="btn-primary" onClick={openAddModal}>➕ নতুন গিগ যোগ করুন</button>
        </div>
      ) : (
        <div className="gigs-grid">
          {gigs.map((gig) => (
            <div key={gig.id} className="gig-card">
              <div className="gig-card-image">
                <img
                  src={getImageUrl(gig)}
                  alt={gig.address}
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400"; }}
                />
                <span className={`gig-status-badge ${gig.is_Available ? 'available' : 'unavailable'}`}>
                  {gig.is_Available ? '✓ উপলব্ধ' : '✗ অনুপলব্ধ'}
                </span>
              </div>
              <div className="gig-card-body">
                <h3 className="gig-title">{gig.address}</h3>
                <p className="gig-description">{gig.description?.substring(0, 80)}...</p>
                <div className="gig-details">
                  <div className="gig-detail"><span className="detail-icon">📦</span><span>{gig.quantity} টন</span></div>
                  <div className="gig-detail"><span className="detail-icon">🌾</span><span>{getCropName(gig.prefered_crop)}</span></div>
                </div>
                <div className="gig-price-row">
                  <span className="gig-price">৳{gig.price}</span>
                  <span className="price-unit">/দিন</span>
                </div>
                <div className="gig-actions">
                  <button className="btn-edit" onClick={() => openEditModal(gig)}>✏️ সম্পাদনা</button>
                  <button className="btn-delete" onClick={() => handleDeleteGig(gig.id)}>🗑️ মুছুন</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderBookings = () => (
    <div className="bookings-content">
      <div className="content-header">
        <h2>📋 বুকিং ব্যবস্থাপনা</h2>
        <div className="booking-filters"><span className="filter-label">মোট: {deals.length} টি বুকিং</span></div>
      </div>

      {deals.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>কোনো বুকিং নেই</h3>
          <p>এখনও কোনো গ্রাহক বুকিং করেননি</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {deals.map((deal) => (
            <div key={deal.id} className={`booking-card ${deal.completed ? 'completed' : deal.is_confirmed ? 'confirmed' : 'pending'}`}>
              <div className="booking-card-header">
                <span className="booking-number">বুকিং #{deal.id}</span>
                <span className={`status-badge ${deal.completed ? 'completed' : deal.is_confirmed ? 'confirmed' : 'pending'}`}>
                  {deal.completed ? '✓ সম্পন্ন' : deal.is_confirmed ? '✓ নিশ্চিত' : '⏳ অপেক্ষমাণ'}
                </span>
              </div>
              <div className="booking-card-body">
                <div className="booking-info-row"><span className="info-icon">👤</span><span>কৃষক ID: {deal.farmer}</span></div>
                <div className="booking-info-row"><span className="info-icon">📅</span><span>শুরু: {deal.start_date}</span></div>
                <div className="booking-info-row"><span className="info-icon">📅</span><span>শেষ: {deal.end_date}</span></div>
                <div className="booking-info-row"><span className="info-icon">🌾</span><span>ফসল: {getCropName(deal.crops)}</span></div>
                <div className="booking-info-row"><span className="info-icon">📦</span><span>পিকআপ: {deal.is_ready_for_pickup ? '✓ প্রস্তুত' : '✗ প্রস্তুত নয়'}</span></div>
              </div>
              <div className="booking-card-actions">
                {!deal.is_confirmed && (
                  <button className="btn-action btn-confirm" onClick={() => handleUpdateDeal(deal.id, { is_confirmed: true })}>✓ নিশ্চিত করুন</button>
                )}
                {deal.is_confirmed && !deal.is_ready_for_pickup && (
                  <button className="btn-action btn-ready" onClick={() => handleUpdateDeal(deal.id, { is_ready_for_pickup: true })}>📦 পিকআপ প্রস্তুত</button>
                )}
                {deal.is_ready_for_pickup && !deal.completed && (
                  <button className="btn-action btn-complete" onClick={() => handleUpdateDeal(deal.id, { completed: true })}>✓ সম্পন্ন করুন</button>
                )}
                {deal.completed && <span className="completion-badge">✓ সম্পন্ন হয়েছে</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Profile Info Tab
  const renderProfile = () => (
    <div className="profile-content">
      <div className="content-header">
        <h2>👤 প্রোফাইল তথ্য</h2>
      </div>
      
      {ownerInfo ? (
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <span>{ownerInfo.name?.charAt(0) || '?'}</span>
            </div>
            <div className="profile-title">
              <h3>{ownerInfo.name}</h3>
              <span className="profile-role">স্টোরেজ মালিক</span>
            </div>
          </div>
          <div className="profile-details">
            <div className="profile-item"><span className="item-label">📧 আইডি:</span><span className="item-value">{ownerInfo.id}</span></div>
            <div className="profile-item"><span className="item-label">📞 যোগাযোগ:</span><span className="item-value">{ownerInfo.contact || 'N/A'}</span></div>
            <div className="profile-item"><span className="item-label">📍 ঠিকানা:</span><span className="item-value">{ownerInfo.address || 'N/A'}</span></div>
            <div className="profile-item"><span className="item-label">🎂 জন্ম তারিখ:</span><span className="item-value">{ownerInfo.dob || 'N/A'}</span></div>
            <div className="profile-item"><span className="item-label">🤝 মোট চুক্তি:</span><span className="item-value">{ownerInfo.no_of_deals || 0}</span></div>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon">👤</span>
          <h3>প্রোফাইল তথ্য পাওয়া যায়নি</h3>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="storage-dashboard-page">
        <StorageOwnerNavbar ownerName={ownerInfo?.name} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="storage-dashboard-page">
      <StorageOwnerNavbar ownerName={ownerInfo?.name} />

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <span className="notification-icon">{notification.type === 'success' ? '✓' : '✗'}</span>
          {notification.message}
        </div>
      )}

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Sidebar Navigation */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <h3>📊 নিয়ন্ত্রণ প্যানেল</h3>
          </div>
          <nav className="sidebar-nav">
            <button className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <span className="nav-item-icon">🏠</span>
              <span className="nav-item-text">ড্যাশবোর্ড</span>
            </button>
            <button className={`sidebar-nav-item ${activeTab === 'gigs' ? 'active' : ''}`} onClick={() => setActiveTab('gigs')}>
              <span className="nav-item-icon">🏪</span>
              <span className="nav-item-text">আমার গিগ</span>
              <span className="nav-item-badge">{stats.totalGigs}</span>
            </button>
            <button className={`sidebar-nav-item ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
              <span className="nav-item-icon">📋</span>
              <span className="nav-item-text">বুকিং</span>
              {stats.pendingBookings > 0 && <span className="nav-item-badge pending">{stats.pendingBookings}</span>}
            </button>
            <button className={`sidebar-nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <span className="nav-item-icon">👤</span>
              <span className="nav-item-text">প্রোফাইল</span>
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="dashboard-content-area">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'gigs' && renderGigs()}
          {activeTab === 'bookings' && renderBookings()}
          {activeTab === 'profile' && renderProfile()}
        </main>
      </div>

      {/* Add/Edit Gig Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingGig ? '✏️ গিগ সম্পাদনা' : '➕ নতুন গিগ যোগ করুন'}</h2>
              <button className="modal-close-btn" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmitGig} className="modal-form">
              <div className="form-group">
                <label>📍 ঠিকানা</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} required placeholder="স্টোরেজের ঠিকানা লিখুন" />
              </div>

              <div className="form-group">
                <label>📝 বিবরণ</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} required placeholder="স্টোরেজের বিস্তারিত বিবরণ লিখুন" rows="4" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>💰 মূল্য (প্রতি দিন)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} required step="0.01" min="0" placeholder="৳ মূল্য" />
                </div>
                <div className="form-group">
                  <label>📦 ধারণক্ষমতা (টন)</label>
                  <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} required min="1" placeholder="টন" />
                </div>
              </div>

              <div className="form-group">
                <label>🌾 পছন্দের ফসল</label>
                <select name="prefered_crop" value={formData.prefered_crop} onChange={handleInputChange} required>
                  <option value="">ফসল নির্বাচন করুন</option>
                  {crops.map((crop) => (
                    <option key={crop.id} value={crop.id}>{crop.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>🖼️ ছবি {editingGig ? '(নতুন ছবি দিতে চাইলে)' : ''}</label>
                <input type="file" name="image" onChange={handleInputChange} accept="image/*" />
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" name="is_Available" checked={formData.is_Available} onChange={handleInputChange} />
                  <span className="checkbox-text">উপলব্ধ (Available)</span>
                </label>
              </div>

              <button type="submit" className="btn-submit">{editingGig ? '💾 আপডেট করুন' : '➕ গিগ যোগ করুন'}</button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default StorageAdminDashboard;
