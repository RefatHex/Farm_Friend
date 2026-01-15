import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FarmerNavbar from '../components/FarmerNavbar';
import Footer from '../components/Footer';
import {
  fetchStorageGigs,
  fetchStorageDeals,
  createStorageGig,
  updateStorageGig,
  deleteStorageGig,
  updateStorageDeal,
  fetchCrops,
  getStorageOwnersCount,
  getStorageDealsCount,
} from '../services/storageService';
import './StorageAdminDashboard.css';

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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [gigs, setGigs] = useState([]);
  const [deals, setDeals] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  
  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalGigs: 0,
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingGig, setEditingGig] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    address: '',
    description: '',
    price: '',
    prefered_crop: '',
    quantity: '',
    is_Available: true,
    image: null,
  });

  const storageOwnerId = getCookie('storage-ownersId');

  useEffect(() => {
    if (!storageOwnerId) {
      navigate('/login');
      return;
    }
    loadInitialData();
  }, [storageOwnerId, navigate]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [gigsData, dealsData, cropsData, usersCount, bookingsCount] = await Promise.all([
        fetchStorageGigs(),
        fetchStorageDeals(),
        fetchCrops(),
        getStorageOwnersCount(),
        getStorageDealsCount(),
      ]);
      
      setGigs(gigsData);
      setDeals(dealsData);
      setCrops(cropsData);
      setStats({
        totalUsers: usersCount,
        totalBookings: bookingsCount,
        totalGigs: gigsData.length,
      });
    } catch (error) {
      console.error('Error loading data:', error);
      showNotification('তথ্য লোড করতে সমস্যা হয়েছে', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const openAddModal = () => {
    setEditingGig(null);
    setFormData({
      address: '',
      description: '',
      price: '',
      prefered_crop: crops[0]?.id || '',
      quantity: '',
      is_Available: true,
      image: null,
    });
    setShowModal(true);
  };

  const openEditModal = (gig) => {
    setEditingGig(gig);
    setFormData({
      address: gig.address || '',
      description: gig.description || '',
      price: gig.price || '',
      prefered_crop: gig.prefered_crop || '',
      quantity: gig.quantity || '',
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
    formDataToSend.append('storage_owner', storageOwnerId);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('prefered_crop', formData.prefered_crop);
    formDataToSend.append('quantity', formData.quantity);
    formDataToSend.append('is_Available', formData.is_Available);
    
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      if (editingGig) {
        await updateStorageGig(editingGig.id, formDataToSend);
        showNotification('গিগ সফলভাবে আপডেট হয়েছে!', 'success');
      } else {
        await createStorageGig(formDataToSend);
        showNotification('নতুন গিগ সফলভাবে যোগ হয়েছে!', 'success');
      }
      closeModal();
      loadInitialData();
    } catch (error) {
      console.error('Error saving gig:', error);
      showNotification('গিগ সংরক্ষণ করতে সমস্যা হয়েছে', 'error');
    }
  };

  const handleDeleteGig = async (gigId) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই গিগটি মুছে ফেলতে চান?')) return;
    
    try {
      await deleteStorageGig(gigId);
      showNotification('গিগ সফলভাবে মুছে ফেলা হয়েছে!', 'success');
      loadInitialData();
    } catch (error) {
      console.error('Error deleting gig:', error);
      showNotification('গিগ মুছতে সমস্যা হয়েছে', 'error');
    }
  };

  const handleUpdateDeal = async (dealId, updates) => {
    try {
      await updateStorageDeal(dealId, updates);
      showNotification('বুকিং স্ট্যাটাস আপডেট হয়েছে!', 'success');
      loadInitialData();
    } catch (error) {
      console.error('Error updating deal:', error);
      showNotification('আপডেট করতে সমস্যা হয়েছে', 'error');
    }
  };

  const getImageUrl = (gig) => {
    if (gig.image) {
      if (gig.image.startsWith('http')) return gig.image;
      return `http://localhost:8000${gig.image}`;
    }
    return 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400';
  };

  const renderDashboard = () => (
    <div className="admin-section">
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <h3>মোট ব্যবহারকারী</h3>
          <div className="stat-value">{stats.totalUsers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <h3>মোট বুকিং</h3>
          <div className="stat-value">{stats.totalBookings}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏪</div>
          <h3>মোট গিগ</h3>
          <div className="stat-value">{stats.totalGigs}</div>
        </div>
      </div>
      
      {/* Recent Bookings Preview */}
      <div className="section-header" style={{ marginTop: '30px' }}>
        <h2>📋 সাম্প্রতিক বুকিং</h2>
      </div>
      {deals.length === 0 ? (
        <div className="admin-empty">
          <h3>কোনো বুকিং নেই</h3>
          <p>এখনও কোনো বুকিং আসেনি</p>
        </div>
      ) : (
        <div className="admin-cards-grid">
          {deals.slice(0, 3).map((deal) => (
            <div key={deal.id} className="booking-card">
              <div className="booking-card-header">
                <h3>বুকিং #{deal.id}</h3>
                <span className={`booking-status ${deal.completed ? 'completed' : deal.is_confirmed ? 'confirmed' : 'pending'}`}>
                  {deal.completed ? 'সম্পন্ন' : deal.is_confirmed ? 'নিশ্চিত' : 'অপেক্ষমাণ'}
                </span>
              </div>
              <div className="booking-details">
                <div className="booking-detail">📅 শুরু: {deal.start_date}</div>
                <div className="booking-detail">📅 শেষ: {deal.end_date}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderGigs = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>🏪 আমার স্টোরেজ গিগ</h2>
        <button className="btn-add-gig" onClick={openAddModal}>
          ➕ নতুন গিগ যোগ করুন
        </button>
      </div>
      
      {gigs.length === 0 ? (
        <div className="admin-empty">
          <h3>কোনো গিগ নেই</h3>
          <p>এখনই আপনার প্রথম স্টোরেজ গিগ যোগ করুন</p>
        </div>
      ) : (
        <div className="admin-cards-grid">
          {gigs.map((gig) => (
            <div key={gig.id} className="admin-gig-card">
              <img
                src={getImageUrl(gig)}
                alt={gig.address}
                className="admin-gig-image"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400';
                }}
              />
              <div className="admin-gig-content">
                <h3 className="admin-gig-title">{gig.address}</h3>
                <p className="admin-gig-info">📦 ধারণক্ষমতা: {gig.quantity} টন</p>
                <p className="admin-gig-price">💰 ৳{gig.price}/দিন</p>
                <span className={`admin-gig-status ${gig.is_Available ? 'available' : 'unavailable'}`}>
                  {gig.is_Available ? '✓ উপলব্ধ' : '✗ অনুপলব্ধ'}
                </span>
                <div className="admin-gig-actions">
                  <button className="btn-edit" onClick={() => openEditModal(gig)}>
                    ✏️ সম্পাদনা
                  </button>
                  <button className="btn-delete" onClick={() => handleDeleteGig(gig.id)}>
                    🗑️ মুছুন
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderBookings = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>📋 বুকিং ব্যবস্থাপনা</h2>
      </div>
      
      {deals.length === 0 ? (
        <div className="admin-empty">
          <h3>কোনো বুকিং নেই</h3>
          <p>এখনও কোনো বুকিং আসেনি</p>
        </div>
      ) : (
        <div className="admin-cards-grid">
          {deals.map((deal) => (
            <div key={deal.id} className="booking-card">
              <div className="booking-card-header">
                <h3>বুকিং #{deal.id}</h3>
                <span className={`booking-status ${deal.completed ? 'completed' : deal.is_confirmed ? 'confirmed' : 'pending'}`}>
                  {deal.completed ? 'সম্পন্ন' : deal.is_confirmed ? 'নিশ্চিত' : 'অপেক্ষমাণ'}
                </span>
              </div>
              <div className="booking-details">
                <div className="booking-detail">👤 কৃষক ID: {deal.farmer}</div>
                <div className="booking-detail">📅 শুরু: {deal.start_date}</div>
                <div className="booking-detail">📅 শেষ: {deal.end_date}</div>
                <div className="booking-detail">🌾 ফসল ID: {deal.crops}</div>
                <div className="booking-detail">
                  📦 পিকআপ: {deal.is_ready_for_pickup ? '✓ প্রস্তুত' : '✗ প্রস্তুত নয়'}
                </div>
              </div>
              <div className="booking-actions">
                {!deal.is_confirmed && (
                  <button 
                    className="btn-confirm"
                    onClick={() => handleUpdateDeal(deal.id, { is_confirmed: true })}
                  >
                    ✓ নিশ্চিত করুন
                  </button>
                )}
                {deal.is_confirmed && !deal.is_ready_for_pickup && (
                  <button 
                    className="btn-ready"
                    onClick={() => handleUpdateDeal(deal.id, { is_ready_for_pickup: true })}
                  >
                    📦 পিকআপ প্রস্তুত
                  </button>
                )}
                {deal.is_ready_for_pickup && !deal.completed && (
                  <button 
                    className="btn-complete"
                    onClick={() => handleUpdateDeal(deal.id, { completed: true })}
                  >
                    ✓ সম্পন্ন করুন
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="storage-admin-page">
        <FarmerNavbar />
        <div className="admin-loading">
          <div className="admin-loading-spinner"></div>
          <p>তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="storage-admin-page">
      <FarmerNavbar />
      
      {/* Notification */}
      {notification && (
        <div className={`admin-notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="storage-admin-header">
        <h1>🏪 স্টোরেজ অ্যাডমিন প্যানেল</h1>
        <p>আপনার স্টোরেজ ব্যবসা পরিচালনা করুন সহজেই</p>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-nav-tabs">
        <button 
          className={`admin-nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 ড্যাশবোর্ড
        </button>
        <button 
          className={`admin-nav-tab ${activeTab === 'gigs' ? 'active' : ''}`}
          onClick={() => setActiveTab('gigs')}
        >
          🏪 আমার গিগ
        </button>
        <button 
          className={`admin-nav-tab ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          📋 বুকিং
        </button>
      </div>

      {/* Content */}
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'gigs' && renderGigs()}
      {activeTab === 'bookings' && renderBookings()}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingGig ? '✏️ গিগ সম্পাদনা' : '➕ নতুন গিগ যোগ করুন'}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="admin-modal-body">
              <form onSubmit={handleSubmitGig}>
                <div className="form-group">
                  <label>📍 ঠিকানা</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="স্টোরেজের ঠিকানা লিখুন"
                  />
                </div>
                
                <div className="form-group">
                  <label>📝 বিবরণ</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    placeholder="স্টোরেজের বিবরণ লিখুন"
                  />
                </div>
                
                <div className="form-group">
                  <label>💰 মূল্য (প্রতি দিন)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    placeholder="মূল্য লিখুন"
                  />
                </div>
                
                <div className="form-group">
                  <label>🌾 পছন্দের ফসল</label>
                  <select
                    name="prefered_crop"
                    value={formData.prefered_crop}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">ফসল নির্বাচন করুন</option>
                    {crops.map((crop) => (
                      <option key={crop.id} value={crop.id}>
                        {crop.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>📦 ধারণক্ষমতা (টন)</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    placeholder="ধারণক্ষমতা লিখুন"
                  />
                </div>
                
                <div className="form-group">
                  <label>🖼️ ছবি</label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                    accept="image/*"
                  />
                </div>
                
                <div className="form-group form-group-checkbox">
                  <input
                    type="checkbox"
                    name="is_Available"
                    checked={formData.is_Available}
                    onChange={handleInputChange}
                    id="isAvailable"
                  />
                  <label htmlFor="isAvailable">উপলব্ধ</label>
                </div>
                
                <button type="submit" className="btn-submit-form">
                  {editingGig ? '💾 আপডেট করুন' : '➕ গিগ যোগ করুন'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default StorageAdminDashboard;
