import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FarmerNavbar from "../components/FarmerNavbar";
import Footer from "../components/Footer";
import "./CropRecommendationPage.css";

const CropRecommendationPage = () => {
  const [weatherData, setWeatherData] = useState({
    city: "লোড হচ্ছে...",
    temperature: "লোড হচ্ছে...",
    humidity: "লোড হচ্ছে...",
  });
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    ph: "",
    rainfall: "",
  });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(true);

  // Get cookie helper
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/weather/?city=Dhaka"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const data = await response.json();
      setWeatherData({
        city: data.city,
        temperature: data.temperature,
        humidity: data.humidity,
      });
    } catch (error) {
      setWeatherData({
        city: "ত্রুটি",
        temperature: "N/A",
        humidity: "N/A",
      });
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    const payload = {
      user: getCookie("userId") || 1,
      nitrogen: parseFloat(formData.nitrogen),
      phosphorus: parseFloat(formData.phosphorus),
      potassium: parseFloat(formData.potassium),
      ph: parseFloat(formData.ph),
      rainfall: parseFloat(formData.rainfall),
      temperature: weatherData.temperature,
      humidity: weatherData.humidity,
      session_id: 12,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/ai_responses/rec/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setResponse({
        type: "success",
        message: `সুপারিশকৃত ফসল: ${data.answer}`,
      });
    } catch (error) {
      setResponse({
        type: "error",
        message: `ত্রুটি: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crop-recommendation-page">
      <FarmerNavbar />

      <div className="crop-background">
        <div className="crop-container">
          <div className="crop-card">
            <div className="card-header">
              <h2>ফসল চাষ পরামর্শ</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="nitrogen">নাইট্রোজেন (N)</label>
                  <input
                    type="number"
                    step="any"
                    id="nitrogen"
                    name="nitrogen"
                    value={formData.nitrogen}
                    onChange={handleInputChange}
                    required
                    placeholder="নাইট্রোজেন মান লিখুন"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phosphorus">ফসফরাস (P)</label>
                  <input
                    type="number"
                    step="any"
                    id="phosphorus"
                    name="phosphorus"
                    value={formData.phosphorus}
                    onChange={handleInputChange}
                    required
                    placeholder="ফসফরাস মান লিখুন"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="potassium">পটাশিয়াম (K)</label>
                  <input
                    type="number"
                    step="any"
                    id="potassium"
                    name="potassium"
                    value={formData.potassium}
                    onChange={handleInputChange}
                    required
                    placeholder="পটাশিয়াম মান লিখুন"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ph">পিএইচ</label>
                  <input
                    type="number"
                    step="any"
                    id="ph"
                    name="ph"
                    value={formData.ph}
                    onChange={handleInputChange}
                    required
                    placeholder="পিএইচ মান লিখুন"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rainfall">বৃষ্টিপাত (মিমি)</label>
                  <input
                    type="number"
                    step="any"
                    id="rainfall"
                    name="rainfall"
                    value={formData.rainfall}
                    onChange={handleInputChange}
                    required
                    placeholder="বৃষ্টিপাত মান লিখুন"
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "প্রক্রিয়াকরণ হচ্ছে..." : "সুপারিশ গ্রহণ করুন"}
                </button>
              </form>

              {/* Weather Info Section */}
              <div className="weather-info">
                <h5>আবহাওয়া তথ্য</h5>
                {weatherLoading ? (
                  <p className="loading-text">আবহাওয়া তথ্য লোড হচ্ছে...</p>
                ) : (
                  <>
                    <p>
                      <strong>শহর:</strong> {weatherData.city}
                    </p>
                    <p>
                      <strong>তাপমাত্রা:</strong> {weatherData.temperature} °C
                    </p>
                    <p>
                      <strong>আর্দ্রতা:</strong> {weatherData.humidity}%
                    </p>
                  </>
                )}
              </div>

              {/* Response Alert */}
              {response && (
                <div className={`response-alert ${response.type}`}>
                  {response.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CropRecommendationPage;
