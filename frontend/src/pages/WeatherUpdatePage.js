import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './WeatherUpdatePage.css';

// API endpoints (adjust as needed)
const CURRENT_WEATHER_API_URL = 'http://127.0.0.1:8000/api/current-weather/?city=Dhaka';
const HISTORICAL_RAINFALL_API_URL = 'http://127.0.0.1:8000/api/historical-rainfall/?city=Dhaka';

const WeatherUpdatePage = () => {
  const [weatherData, setWeatherData] = useState({
    temperature: '--',
    humidity: '--',
    precipitation: '--',
    warnings: []
  });
  const [historicalRainfall, setHistoricalRainfall] = useState('--');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch current weather
        const weatherResponse = await fetch(CURRENT_WEATHER_API_URL);
        if (!weatherResponse.ok) {
          throw new Error('Failed to fetch current weather data.');
        }
        const weatherJson = await weatherResponse.json();
        setWeatherData({
          temperature: weatherJson.temperature || '--',
          humidity: weatherJson.humidity || '--',
          precipitation: weatherJson.precipitation || '--',
          warnings: weatherJson.warnings || []
        });

        // Fetch historical rainfall
        const rainfallResponse = await fetch(HISTORICAL_RAINFALL_API_URL);
        if (!rainfallResponse.ok) {
          throw new Error('Failed to fetch historical rainfall data.');
        }
        const rainfallJson = await rainfallResponse.json();
        setHistoricalRainfall(rainfallJson.total_rainfall_last_year || '--');

      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  return (
    <div className="weather-page">
      <Navbar />
      <div className="weather-background">
        <div className="weather-container">
          {/* Weather Update Card */}
          <div className="weather-update-card">
            <h1>আবহাওয়া আপডেট</h1>
          </div>

          {loading ? (
            <div className="loading">তথ্য লোড হচ্ছে...</div>
          ) : error ? (
            <div className="error-message">
              তথ্য লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।
            </div>
          ) : (
            <>
              {/* Card Section */}
              <div className="card-container">
                <div className="weather-card">
                  <div className="card-value">{weatherData.temperature}°C</div>
                  <div className="card-label">তাপমাত্রা</div>
                </div>
                <div className="weather-card">
                  <div className="card-value">{weatherData.humidity}%</div>
                  <div className="card-label">আর্দ্রতা</div>
                </div>
              </div>

              {/* Alerts Section */}
              <div className="weather-section">
                <h2>সতর্কতা</h2>
                {weatherData.warnings && weatherData.warnings.length > 0 ? (
                  weatherData.warnings.map((alert, index) => (
                    <div key={index} className="weather-alert">
                      {alert}
                    </div>
                  ))
                ) : (
                  <div className="weather-alert no-alert">
                    কোনো বর্তমান আবহাওয়া সতর্কতা নেই।
                  </div>
                )}
              </div>

              {/* Historical Data Section */}
              <div className="weather-section">
                <h2>পূর্ববর্তী বছরের তথ্য</h2>
                <p>
                  গত বছরে মোট বৃষ্টিপাত: <span>{historicalRainfall} মিমি</span>
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
