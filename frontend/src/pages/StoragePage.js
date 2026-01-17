import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import FarmerNavbar from '../components/FarmerNavbar';
import Footer from '../components/Footer';
import {
  fetchStorageGigsWithDetails,
  createStorageDeal,
  fetchStorageDealsByFarmer,
} from '../services/storageService';
import './StoragePage.css';

// Default images for slider
const sliderImages = [
  { url: '/assets/images/storage1.jpg', text: 'আশুলিয়া', fallback: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200' },
  { url: '/assets/images/storage2.jpg', text: 'সাভার', fallback: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200' },
  { url: '/assets/images/storage3.jpg', text: 'জয়পুরহাট', fallback: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200' },
  { url: '/assets/images/storage4.jpg', text: 'দিনাজপুর', fallback: 'https://images.unsplash.com/photo-1595841695893-19e20a40e2c5?w=1200' },
  { url: '/assets/images/storage5.jpg', text: 'রাজশাহী', fallback: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?w=1200' },
];

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

const StoragePage = () => {
  const navigate = useNavigate();
  const [storageGigs, setStorageGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedGig, setSelectedGig] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // Booking form state
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    quantity: 1,
  });

  // Fetch storage gigs on mount
  useEffect(() => {
    const loadStorageGigs = async () => {
      try {
        const gigs = await fetchStorageGigsWithDetails();
        // Filter only available gigs
        const availableGigs = gigs.filter(gig => gig.is_Available === true);
        setStorageGigs(availableGigs);
      } catch (error) {
        console.error('Error loading storage gigs:', error);
        showNotification('তথ্য লোড করতে সমস্যা হয়েছে', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadStorageGigs();
  }, []);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const moveToSlide = (index) => {
    setCurrentSlide(index);
  };

  const openDetailsModal = (gig) => {
    setSelectedGig(gig);
    setBookingData({ startDate: '', endDate: '', quantity: 1 });
  };

  const closeDetailsModal = () => {
    setSelectedGig(null);
  };

  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotalPrice = useCallback(() => {
    if (!selectedGig || !bookingData.startDate || !bookingData.endDate) return 0;
    
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    if (days <= 0) return 0;
    return (days * parseFloat(selectedGig.price) * bookingData.quantity).toFixed(2);
  }, [selectedGig, bookingData]);

  const handleSubmitBooking = async () => {
    const { startDate, endDate, quantity } = bookingData;
    
    // Validation
    if (!startDate || !endDate) {
      showNotification('শুরু এবং শেষ তারিখ নির্বাচন করুন', 'error');
      return;
    }
    
    if (new Date(endDate) <= new Date(startDate)) {
      showNotification('শেষ তারিখ শুরু তারিখের পরে হতে হবে', 'error');
      return;
    }
    
    if (quantity <= 0 || quantity > selectedGig.quantity) {
      showNotification('পরিমাণ সঠিকভাবে উল্লেখ করুন', 'error');
      return;
    }

    const farmerId = getCookie('farmersId');
    if (!farmerId) {
      showNotification('অনুগ্রহ করে প্রথমে লগইন করুন', 'error');
      navigate('/login');
      return;
    }

    const bookingPayload = {
      farmer: parseInt(farmerId),
      storage_owner: selectedGig.storage_owner?.id || 1,
      gigs_offered: selectedGig.id,
      crops: selectedGig.prefered_crop?.id || 1,
      start_date: startDate,
      end_date: endDate,
      completed: false,
      is_confirmed: false,
      is_ready_for_pickup: false,
    };

    try {
      const response = await createStorageDeal(bookingPayload);
      showNotification('বুকিং সফলভাবে জমা দেওয়া হয়েছে! প্রতিষ্ঠাতার নিশ্চিতকরণের জন্য অপেক্ষা করুন।', 'success');
      closeDetailsModal();
      // Refresh the page
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error('Booking failed:', error);
      showNotification('বুকিং করতে সমস্যা হয়েছে: ' + error.message, 'error');
    }
  };

  const getImageUrl = (gig) => {
    if (gig.image) {
      // Handle relative URLs
      if (gig.image.startsWith('http')) return gig.image;
      return `http://localhost:8000${gig.image}`;
    }
    return 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400';
  };

  return (
    <div className="storage-page">
      <FarmerNavbar />
      
      {/* Notification */}
      {notification && (
        <div className={`storage-notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Slider Section */}
      <section className="storage-slider-section">
        <div 
          className="storage-slider" 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {sliderImages.map((slide, index) => (
            <div
              key={index}
              className="storage-slide"
              style={{ 
                backgroundImage: `url('${slide.fallback}')` 
              }}
            >
              <div className="slider-text">{slide.text}</div>
            </div>
          ))}
        </div>
        <div className="dot-nav">
          {sliderImages.map((_, index) => (
            <div
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => moveToSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Page Header */}
      <div className="storage-page-header">
        <h1>🏪 স্টোরেজ সুবিধা</h1>
        <p>আপনার ফসল নিরাপদে সংরক্ষণ করুন সেরা স্টোরেজ সুবিধায়</p>
      </div>

      {/* Storage Cards */}
      {loading ? (
        <div className="storage-loading">
          <div className="storage-loading-spinner"></div>
          <p>স্টোরেজ তথ্য লোড হচ্ছে...</p>
        </div>
      ) : storageGigs.length === 0 ? (
        <div className="storage-empty">
          <h3>কোনো স্টোরেজ সুবিধা পাওয়া যায়নি</h3>
          <p>পরে আবার চেষ্টা করুন</p>
        </div>
      ) : (
        <section className="storage-cards-section">
          {storageGigs.map((gig) => (
            <div key={gig.id} className="storage-card">
              <img
                src={getImageUrl(gig)}
                alt={gig.storage_owner?.name || 'Storage'}
                className="storage-card-image"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400';
                }}
              />
              <div className="storage-card-content">
                <h3 className="storage-card-title">
                  {gig.storage_owner?.name || 'অজানা স্টোরেজ'}
                </h3>
                <p className="storage-card-info">
                  📍 {gig.address || 'ঠিকানা নেই'}
                </p>
                <p className="storage-card-info">
                  📦 ধারণক্ষমতা: {gig.quantity || 0} টন
                </p>
                <p className="storage-card-price">
                  💰 ৳{gig.price || 0}/দিন
                </p>
                <div>
                  <span className={`storage-availability ${gig.is_Available ? 'available' : 'unavailable'}`}>
                    {gig.is_Available ? '✓ উপলব্ধ' : '✗ অনুপলব্ধ'}
                  </span>
                  {gig.prefered_crop && (
                    <span className="storage-card-crop">
                      🌾 {gig.prefered_crop.name || 'যেকোনো ফসল'}
                    </span>
                  )}
                </div>
                <button
                  className="btn-view-details"
                  onClick={() => openDetailsModal(gig)}
                >
                  বিস্তারিত দেখুন
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Details Modal */}
      {selectedGig && (
        <div className="storage-modal-overlay" onClick={closeDetailsModal}>
          <div className="storage-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeDetailsModal}>
              ×
            </button>
            
            <div className="modal-header">
              <h2>{selectedGig.storage_owner?.name || 'স্টোরেজ বিস্তারিত'}</h2>
            </div>
            
            <div className="modal-body">
              <div className="modal-content-grid">
                <div className="modal-image-section">
                  <img
                    src={getImageUrl(selectedGig)}
                    alt="Storage"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400';
                    }}
                  />
                </div>
                <div className="modal-info-section">
                  <div className="modal-info-item">
                    <span>📍 ঠিকানা:</span>
                    <span>{selectedGig.address || 'N/A'}</span>
                  </div>
                  <div className="modal-info-item">
                    <span>📦 ধারণক্ষমতা:</span>
                    <span>{selectedGig.quantity || 0} টন</span>
                  </div>
                  <div className="modal-info-item">
                    <span>💰 মূল্য:</span>
                    <span>৳{selectedGig.price || 0}/দিন</span>
                  </div>
                  <div className="modal-info-item">
                    <span>📊 অবস্থা:</span>
                    <span>{selectedGig.is_Available ? '✓ উপলব্ধ' : '✗ অনুপলব্ধ'}</span>
                  </div>
                  <div className="modal-info-item">
                    <span>🌾 ফসল:</span>
                    <span>{selectedGig.prefered_crop?.name || 'যেকোনো'}</span>
                  </div>
                </div>
              </div>

              <div className="modal-description">
                <h3>📝 বিবরণ</h3>
                <p>{selectedGig.description || 'কোনো বিবরণ নেই'}</p>
              </div>

              {/* Booking Section */}
              {selectedGig.is_Available && (
                <div className="booking-section">
                  <h3>📅 এখনই বুক করুন</h3>
                  <div className="booking-form-grid">
                    <div className="booking-form-group">
                      <label>শুরুর তারিখ</label>
                      <input
                        type="date"
                        name="startDate"
                        value={bookingData.startDate}
                        onChange={handleBookingInputChange}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="booking-form-group">
                      <label>শেষের তারিখ</label>
                      <input
                        type="date"
                        name="endDate"
                        value={bookingData.endDate}
                        onChange={handleBookingInputChange}
                        min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="booking-form-group">
                      <label>পরিমাণ (টন)</label>
                      <input
                        type="number"
                        name="quantity"
                        value={bookingData.quantity}
                        onChange={handleBookingInputChange}
                        min="1"
                        max={selectedGig.quantity || 100}
                      />
                    </div>
                  </div>
                  <div className="booking-total">
                    <span>মোট খরচ:</span>
                    <span>৳{calculateTotalPrice()}</span>
                  </div>
                  <button
                    className="btn-submit-booking"
                    onClick={handleSubmitBooking}
                    disabled={!bookingData.startDate || !bookingData.endDate}
                  >
                    বুকিং নিশ্চিত করুন
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default StoragePage;
