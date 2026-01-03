import React, { useState, useEffect } from "react";
import FarmerNavbar from "../components/FarmerNavbar";
import Footer from "../components/Footer";
import "./WeatherUpdatePage.css";

// API endpoints
const API_BASE = "http://127.0.0.1:8000/api";

const USE_MOCK_DATA = false;

const MOCK_WEATHER_DATA = {
  temperature: 28,
  humidity: 75,
  precipitation: 12,
  wind_speed: 15,
  pressure: 1013,
  visibility: 10,
  cloudiness: 60,
  warnings: [
    "আজ বিকেলে হালকা বৃষ্টির সম্ভাবনা",
    "তাপমাত্রা স্বাভাবিকের চেয়ে বেশি",
  ],
};

const MOCK_WARNINGS_DATA = {
  warnings: [
    "🌡️ HIGH HEAT: Temperature above 35°C. Monitor crops for heat stress.",
  ],
  recommendations: ["Ensure adequate water supply to prevent crop damage."],
};

const MOCK_FORECAST_DATA = {
  forecast: [
    {
      datetime: "2026-01-03 12:00",
      temperature: 28,
      humidity: 70,
      condition: "Partly Cloudy",
      precipitation: 0,
    },
    {
      datetime: "2026-01-04 12:00",
      temperature: 26,
      humidity: 75,
      condition: "Rainy",
      precipitation: 15,
    },
    {
      datetime: "2026-01-05 12:00",
      temperature: 24,
      humidity: 80,
      condition: "Rainy",
      precipitation: 20,
    },
  ],
};

const MOCK_RAINFALL_DATA = {
  total_rainfall_last_year: 2150,
};

const WeatherUpdatePage = () => {
  const [city, setCity] = useState("Dhaka");
  const [weatherData, setWeatherData] = useState({
    temperature: "--",
    humidity: "--",
    precipitation: "--",
    wind_speed: "--",
    pressure: "--",
    visibility: "--",
    cloudiness: "--",
    warnings: [],
  });
  const [warningsData, setWarningsData] = useState({
    warnings: [],
    recommendations: [],
  });
  const [forecastData, setForecastData] = useState({ forecast: [] });
  const [historicalRainfall, setHistoricalRainfall] = useState("--");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllWeatherData(city);
  }, [city]);

  const fetchAllWeatherData = async (selectedCity) => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setWeatherData(MOCK_WEATHER_DATA);
        setWarningsData(MOCK_WARNINGS_DATA);
        setForecastData(MOCK_FORECAST_DATA);
        setHistoricalRainfall(MOCK_RAINFALL_DATA.total_rainfall_last_year);
        setLoading(false);
        return;
      }

      // Fetch current weather
      const weatherResponse = await fetch(
        `${API_BASE}/current-weather/?city=${selectedCity}`
      );
      if (weatherResponse.ok) {
        const weatherJson = await weatherResponse.json();
        setWeatherData({
          temperature: weatherJson.temperature || "--",
          humidity: weatherJson.humidity || "--",
          precipitation: weatherJson.precipitation || "--",
          wind_speed: weatherJson.wind_speed || "--",
          pressure: weatherJson.pressure || "--",
          visibility: weatherJson.visibility || "--",
          cloudiness: weatherJson.cloudiness || "--",
          condition: weatherJson.condition || "--",
          warnings: weatherJson.warnings || [],
        });
      }

      // Fetch weather warnings
      const warningsResponse = await fetch(
        `${API_BASE}/weather-warnings/?city=${selectedCity}`
      );
      if (warningsResponse.ok) {
        const warningsJson = await warningsResponse.json();
        setWarningsData(warningsJson);
      }

      // Fetch weather forecast
      const forecastResponse = await fetch(
        `${API_BASE}/weather-forecast/?city=${selectedCity}&days=5`
      );
      if (forecastResponse.ok) {
        const forecastJson = await forecastResponse.json();
        setForecastData(forecastJson);
      }

      // Fetch historical rainfall
      const rainfallResponse = await fetch(
        `${API_BASE}/historical-rainfall/?city=${selectedCity}`
      );
      if (rainfallResponse.ok) {
        const rainfallJson = await rainfallResponse.json();
        setHistoricalRainfall(rainfallJson.total_rainfall_last_year || "--");
      }
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  return (
    <div className="weather-page">
      <FarmerNavbar />
      <div className="weather-background">
        <div className="weather-container">
          {/* Weather Update Card */}
          <div className="weather-update-card">
            <h1>🌤️ আবহাওয়া আপডেট</h1>
            <p style={{ color: '#666', marginBottom: '20px', fontSize: '16px' }}>
              আপনার এলাকার বিস্তারিত আবহাওয়া তথ্য
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <label
                htmlFor="city-select"
                style={{ fontWeight: '500', color: '#555' }}
              >
                শহর নির্বাচন করুন:
              </label>
              <input
                id="city-select"
                type="text"
                value={city}
                onChange={handleCityChange}
                placeholder="শহরের নাম লিখুন"
              />
            </div>
          </div>

          {loading ? (
            <div className="loading">তথ্য লোড হচ্ছে...</div>
          ) : error ? (
            <div className="error-message">
              ⚠️ তথ্য লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।
            </div>
          ) : (
            <>
              {/* Current Weather Cards */}
              <div className="card-container">
                <div className="weather-card">
                  <div className="card-value">{weatherData.temperature}°C</div>
                  <div className="card-label">🌡️ তাপমাত্রা</div>
                </div>
                <div className="weather-card">
                  <div className="card-value">{weatherData.humidity}%</div>
                  <div className="card-label">💧 আর্দ্রতা</div>
                </div>
                <div className="weather-card">
                  <div className="card-value">
                    {weatherData.wind_speed} km/h
                  </div>
                  <div className="card-label">💨 বাতাসের গতি</div>
                </div>
                <div className="weather-card">
                  <div className="card-value">{weatherData.pressure} mb</div>
                  <div className="card-label">🔵 চাপ</div>
                </div>
                <div className="weather-card">
                  <div className="card-value">
                    {weatherData.precipitation} mm
                  </div>
                  <div className="card-label">🌧️ বৃষ্টিপাত</div>
                </div>
                <div className="weather-card">
                  <div className="card-value">{weatherData.visibility} km</div>
                  <div className="card-label">👁️ দৃশ্যমানতা</div>
                </div>
                <div className="weather-card">
                  <div className="card-value">{weatherData.cloudiness}%</div>
                  <div className="card-label">☁️ মেঘলা</div>
                </div>
                <div className="weather-card">
                  <div className="card-value">{weatherData.condition || '--'}</div>
                  <div className="card-label">🌤️ অবস্থা</div>
                </div>
              </div>

              {/* Agricultural Warnings & Recommendations */}
              {warningsData.warnings && warningsData.warnings.length > 0 && (
                <div className="weather-section">
                  <h2>⚠️ কৃষি সতর্কতা</h2>
                  <div className="warnings-list">
                    {warningsData.warnings.map((warning, index) => (
                      <div key={index} className="warning-item">
                        {warning}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {warningsData.recommendations &&
                warningsData.recommendations.length > 0 && (
                  <div className="weather-section">
                    <h2>✅ সুপারিশ</h2>
                    <div className="recommendations-list">
                      {warningsData.recommendations.map((rec, index) => (
                        <div key={index} className="recommendation-item">
                          • {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* 5-Day Forecast */}
              {forecastData.forecast && forecastData.forecast.length > 0 && (
                <div className="weather-section">
                  <h2>📅 ৫ দিনের পূর্বাভাস</h2>
                  <div className="forecast-container">
                    {forecastData.forecast.slice(0, 5).map((day, index) => (
                      <div key={index} className="forecast-card">
                        <div className="forecast-date">
                          {day.datetime.split(" ")[0]}
                        </div>
                        <div className="forecast-time">
                          {day.datetime.split(" ")[1]}
                        </div>
                        <div className="forecast-temp">{day.temperature}°C</div>
                        <div className="forecast-condition">
                          {day.condition}
                        </div>
                        <div className="forecast-humidity">
                          আর্দ্রতা: {day.humidity}%
                        </div>
                        <div className="forecast-precip">
                          বৃষ্টি: {day.precipitation} mm
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Historical Rainfall */}
              <div className="weather-section">
                <h2>📊 বার্ষিক বৃষ্টিপাত</h2>
                <p>
                  গত বছর: <strong>{historicalRainfall} mm</strong>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WeatherUpdatePage;
