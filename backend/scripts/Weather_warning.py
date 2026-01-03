import os
import requests
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Function to generate comprehensive weather warnings
def get_weather_warnings(city):
    """
    Generates comprehensive weather warnings for farmers.
    Includes temperature, rainfall, and agricultural advisories.
    """
    api_key = os.getenv('WEATHERAPI_API_KEY')
    base_url = "http://api.weatherapi.com/v1/current.json?"
    url = f"{base_url}key={api_key}&q={city}"
    
    try:
        response = requests.get(url).json()
        
        if 'current' in response:
            current = response['current']
            temp = current['temp_c']
            humidity = current['humidity']
            precipitation = current['precip_mm']
            wind_speed = current['wind_kph']
            uv_index = current.get('uv', 0)
            
            warnings = []
            recommendations = []
            
            # Extreme Temperature Warnings
            if temp > 38:
                warnings.append("🔴 CRITICAL HEAT: Temperature exceeds 38°C. Risk of crop heat stress.")
                recommendations.append("Increase irrigation frequency and apply mulch to retain soil moisture.")
            elif temp > 35:
                warnings.append("⚠️  HIGH HEAT: Temperature above 35°C. Monitor crops for heat stress.")
                recommendations.append("Ensure adequate water supply to prevent crop damage.")
            elif temp < 0:
                warnings.append("❄️  FROST WARNING: Below freezing temperature. Risk to frost-sensitive crops.")
                recommendations.append("Use frost protection methods for sensitive crops.")
            elif temp < 5:
                warnings.append("❄️  COLD ALERT: Low temperature below 5°C. Monitor young seedlings.")
                recommendations.append("Protect young plants with row covers or cold frames if necessary.")
                
            # Rainfall Warnings
            if precipitation > 50:
                warnings.append("🌊 HEAVY RAINFALL: More than 50mm. Risk of flooding and waterlogging.")
                recommendations.append("Ensure drainage is clear. Monitor fields for water accumulation.")
            elif precipitation > 20:
                warnings.append("⚠️  MODERATE RAINFALL: 20-50mm expected. Plan irrigation accordingly.")
                recommendations.append("Delay irrigation if adequate rainfall is forecast.")
            elif precipitation < 5 and humidity < 30:
                warnings.append("🌡️  DROUGHT RISK: Low rainfall and humidity. Increase irrigation.")
                recommendations.append("Water crops early morning or late evening to minimize evaporation.")
                
            # Humidity Warnings
            if humidity > 80:
                warnings.append("💨 HIGH HUMIDITY: Greater than 80%. Risk of fungal diseases.")
                recommendations.append("Improve air circulation. Monitor crops for fungal infections.")
            elif humidity < 20:
                warnings.append("🌵 LOW HUMIDITY: Below 20%. Increased evaporation risk.")
                recommendations.append("Increase irrigation frequency and consider using mulch.")
                
            # Wind Warnings
            if wind_speed > 40:
                warnings.append("🌪️  HIGH WIND: Wind speed exceeds 40 kph. Risk to crops and structures.")
                recommendations.append("Secure loose items. Expect lodging in tall crops.")
            elif wind_speed > 20:
                warnings.append("⚠️  MODERATE WIND: Wind speed 20-40 kph. May affect pollination.")
                recommendations.append("Apply pesticides/fungicides before windy conditions if needed.")
                
            # UV Index
            if uv_index > 10:
                warnings.append("☀️  EXTREME UV: UV index above 10. High risk of sunburn on exposed crops.")
                recommendations.append("Use protective measures for sensitive crops.")
            elif uv_index > 6:
                warnings.append("☀️  HIGH UV: UV index above 6. Use sun protection measures.")
                
            return {
                "city": city,
                "warnings": warnings,
                "recommendations": recommendations,
                "current_conditions": {
                    "temperature": temp,
                    "humidity": humidity,
                    "precipitation": precipitation,
                    "wind_speed": wind_speed,
                    "uv_index": uv_index
                }
            }
        else:
            return {"error": response.get("error", "Failed to fetch data")}
            
    except requests.exceptions.RequestException as e:
        return {"error": f"Network error: {str(e)}"}


# Function to get current weather
def get_weather(city):
    """
    Fetches the current weather for a given city.
    Returns structured JSON data with weather details and warnings.
    """
    base_url = "http://api.weatherapi.com/v1/current.json?"
    api_key = os.getenv('WEATHERAPI_API_KEY')
    url = f"{base_url}key={api_key}&q={city}"
    
    try:
        response = requests.get(url).json()

        if 'current' in response:
            temp_celsius = response['current']['temp_c']
            feels_like = response['current']['feelslike_c']
            humidity = response['current']['humidity']
            description = response['current']['condition']['text']
            precipitation = response['current']['precip_mm']  # Rainfall in mm

            # Generate warnings based on weather conditions
            warnings = generate_weather_warnings(temp_celsius, feels_like, precipitation)

            # Return the weather details as JSON
            return {
                "city": city,
                "temperature": temp_celsius,
                "feels_like": feels_like,
                "humidity": humidity,
                "condition": description,
                "precipitation": precipitation,
                "warnings": warnings
            }
        else:
            # Handle case where the city is not found
            return {"error": response.get("error", "City not found or API call failed!")}

    except requests.exceptions.RequestException as e:
        # Handle network or API request issues
        return {"error": f"Network error occurred: {str(e)}"}


# Function to generate weather warnings
def generate_weather_warnings(temp, feels_like, precipitation):
    """
    Generates a list of warnings based on weather conditions.
    """
    warnings = []

    # Temperature Warnings
    if temp > 35:
        warnings.append("Extreme Heat Alert! Temperature is above 35°C.")
    elif temp < 5:
        warnings.append("Extreme Cold Alert! Temperature is below 5°C.")

    # Feels Like Warnings
    if feels_like < 0:
        warnings.append("Extreme Cold Alert! Feels like temperature is below freezing.")

    # Rainfall Warnings
    if precipitation > 10:
        warnings.append("Heavy Rainfall Alert! More than 10mm of rain.")
    elif precipitation == 0:
        warnings.append("No Rainfall: No rainfall recorded at this time.")
    else:
        warnings.append("Light Rainfall Alert: Be cautious, light rain detected.")

    return warnings


# Function to get historical rainfall data
def get_historical_rainfall(city):
    """
    Fetches the total rainfall data for the past year for a given city.
    Returns structured JSON data with rainfall details and warnings.
    """
    base_url = "http://api.weatherapi.com/v1/history.json?"
    api_key = os.getenv('WEATHERAPI_API_KEY')
    end_date = datetime.now()
    start_date = end_date.replace(year=end_date.year - 1)  # 1 year back

    url = (f"{base_url}key={api_key}&q={city}&dt={start_date.strftime('%Y-%m-%d')}"
           f"&end_dt={end_date.strftime('%Y-%m-%d')}")
    
    try:
        response = requests.get(url).json()

        if 'forecast' in response:
            total_rainfall = 0
            for day in response['forecast']['forecastday']:
                total_rainfall += day['day'].get('totalprecip_mm', 0)

            # Generate warnings based on annual rainfall
            warnings = []
            if total_rainfall > 1000:
                warnings.append("High annual rainfall detected!")
            elif total_rainfall < 500:
                warnings.append("Very low annual rainfall detected.")
            else:
                warnings.append("Annual rainfall is within the normal range.")

            # Return the rainfall details as JSON
            return {
                "city": city,
                "total_rainfall_last_year": total_rainfall,
                "warnings": warnings
            }
        else:
            # Handle case where historical data is not available
            return {"error": response.get("error", "Failed to fetch historical data.")}

    except requests.exceptions.RequestException as e:
        # Handle network or API request issues
        return {"error": f"Network error occurred: {str(e)}"}
