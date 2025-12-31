import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Alert from '../components/Alert';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  const showAlert = (type, title, message) => {
    setAlert({ isOpen: true, type, title, message });
  };

  const closeAlert = () => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  };

  const fetchDetails = async (endpoint, userId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/${endpoint}/?user=${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const typeName = endpoint.split('/').pop();
          return { type: typeName, id: data[0].id };
        }
      }
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      username: formData.username,
      password: formData.password,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/users/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();

        // Save user ID and session ID in cookies
        setCookie("userId", data.id, 7);

        if (data.session_id) {
          setCookie("sessionId", data.session_id, 7);
        }

        // Fetch additional details based on user type
        const detailsToFetch = [];
        if (data.is_farmer) {
          detailsToFetch.push(fetchDetails("farmers/farmers", data.id));
        }
        if (data.is_rent_owner) {
          detailsToFetch.push(fetchDetails("rentals/rent-owners", data.id));
        }
        if (data.is_storage_owner) {
          detailsToFetch.push(fetchDetails("storage/storage-owners", data.id));
        }
        if (data.is_agronomist) {
          detailsToFetch.push(fetchDetails("consultations/agronomists", data.id));
        }

        const results = await Promise.all(detailsToFetch);

        results.forEach((result) => {
          if (result) {
            setCookie(`${result.type}Id`, result.id, 7);
          }
        });

        // Show success message
        showAlert('success', 'লগ ইন সফল!', `স্বাগতম, ${formData.username}!`);
        
        // Determine where to redirect based on roles
        const roleCount = results.filter(r => r !== null).length;
        
        setTimeout(() => {
          if (roleCount > 1) {
            // Multiple roles - go to account select page
            navigate('/account-select');
          } else if (data.is_farmer) {
            // Single farmer role - go to farmer dashboard
            setCookie("selectedRole", "farmersId", 7);
            navigate('/farmer-dashboard');
          } else if (roleCount === 1) {
            // Single other role - go to profile
            const role = results.find(r => r !== null);
            if (role) {
              setCookie("selectedRole", `${role.type}Id`, 7);
            }
            navigate('/profile');
          } else {
            // No role - go to home
            navigate('/');
          }
        }, 2000);

      } else {
        const errorData = await response.json();
        showAlert('error', 'লগ ইন ব্যর্থ!', errorData.error || 'অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
    } catch (error) {
      console.error("Login error:", error);
      showAlert('error', 'সংযোগ ত্রুটি!', 'সার্ভারের সাথে সংযোগ করতে ব্যর্থ হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar />
      
      <Alert 
        isOpen={alert.isOpen}
        onClose={closeAlert}
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />
      
      <div className="login-background">
        <div className="login-container">
          <h2>লগইন</h2>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="username" 
              placeholder="ইউজারনেম" 
              value={formData.username}
              onChange={handleChange}
              required 
            />
            <input 
              type="password" 
              name="password" 
              placeholder="পাসওয়ার্ড" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
            <div className="toggle">
              <input 
                type="checkbox" 
                id="remember" 
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              <label htmlFor="remember">আমাকে মনে রাখুন</label>
            </div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'লোড হচ্ছে...' : 'লগইন'}
            </button>
          </form>

          <div className="options">
            <p>আপনি নন? <a href="#">অ্যাকাউন্ট পরিবর্তন করুন</a></p>
            <p>অ্যাকাউন্ট নেই? <Link to="/signup">সাইন আপ করুন</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
