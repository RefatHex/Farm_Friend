import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FarmerNavbar from "../components/FarmerNavbar";
import Footer from "../components/Footer";
import "./FertilizerRecommendationPage.css";

const FertilizerRecommendationPage = () => {
  const [weatherData, setWeatherData] = useState({
    city: "লোড হচ্ছে...",
    temperature: "লোড হচ্ছে...",
    humidity: "লোড হচ্ছে...",
    condition: "লোড হচ্ছে...",
  });
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    moisture: "",
    crop_type: "0",
    soil_type: "0",
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

  // Crop types in Bengali
  const cropTypes = [
    { value: "0", label: "বার্লি" },
    { value: "1", label: "সুতী" },
    { value: "2", label: "আলু" },
    { value: "3", label: "ভুট্টা" },
    { value: "4", label: "মিলেট" },
    { value: "5", label: "তেলবীজ" },
    { value: "6", label: "ধান" },
    { value: "7", label: "ডাল" },
    { value: "8", label: "গন্না" },
    { value: "9", label: "তামাক" },
    { value: "10", label: "গম" },
  ];

  // Soil types in Bengali
  const soilTypes = [
    { value: "0", label: "কালো" },
    { value: "1", label: "মাটির" },
    { value: "2", label: "লোমযুক্ত" },
    { value: "3", label: "লাল" },
    { value: "4", label: "বালুময়" },
  ];

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
        condition: data.condition,
      });
    } catch (error) {
      setWeatherData({
        city: "ত্রুটি",
        temperature: "N/A",
        humidity: "N/A",
        condition: "আবহাওয়া তথ্য লোড করতে ব্যর্থ",
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
      moisture: parseFloat(formData.moisture),
      crop_type: formData.crop_type,
      soil_type: formData.soil_type,
      session_id: 12,
      temperature: weatherData.temperature,
      humidity: weatherData.humidity,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/ai_responses/fert/", {
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
        message: `সারের সুপারিশ: ${data.answer}`,
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
    <div className="fertilizer-page">
      <FarmerNavbar />

      <div className="fertilizer-background">
        <div className="fertilizer-container">
          <div className="fertilizer-card">
            <div className="card-header">
              <h2>সার সুপারিশ ফর্ম</h2>
            </div>
            <div className="card-body">
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
                    <p>
                      <strong>অবস্থা:</strong> {weatherData.condition}
                    </p>
                  </>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="nitrogen">নাইট্রোজেন</label>
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
                  <label htmlFor="phosphorus">ফসফরাস</label>
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
                  <label htmlFor="potassium">পটাশিয়াম</label>
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
                  <label htmlFor="moisture">আর্দ্রতা</label>
                  <input
                    type="number"
                    step="any"
                    id="moisture"
                    name="moisture"
                    value={formData.moisture}
                    onChange={handleInputChange}
                    required
                    placeholder="আর্দ্রতা মান লিখুন"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="crop_type">ফসলের প্রকার</label>
                  <select
                    id="crop_type"
                    name="crop_type"
                    value={formData.crop_type}
                    onChange={handleInputChange}
                    required
                  >
                    {cropTypes.map((crop) => (
                      <option key={crop.value} value={crop.value}>
                        {crop.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="soil_type">মাটি প্রকার</label>
                  <select
                    id="soil_type"
                    name="soil_type"
                    value={formData.soil_type}
                    onChange={handleInputChange}
                    required
                  >
                    {soilTypes.map((soil) => (
                      <option key={soil.value} value={soil.value}>
                        {soil.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "প্রক্রিয়াকরণ হচ্ছে..." : "সারের সুপারিশ গ্রহণ করুন"}
                </button>
              </form>

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

export default FertilizerRecommendationPage;
