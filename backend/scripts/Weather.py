import os
import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

api = os.getenv('OPENWEATHERMAP_API_KEY')

def kelvin_to_celsius(kelvin):
    """
    Convert temperature from Kelvin to Celsius.
    :param kelvin: Temperature in Kelvin.
    :return: Temperature in Celsius.
    """
    return kelvin - 273.15

def get_weather(city):
    """
    Fetch weather data for a city using the OpenWeatherMap API.
    :param city: Name of the city.
    :return: Dictionary containing weather details or error message.
    """
    base_url = "http://api.openweathermap.org/data/2.5/weather?"
    
    if not api:
        return {"error": "API key is missing. Define it in the .env file as 'OPENWEATHERMAP_API_KEY = \"your_api_key\"'."}

    url = f"{base_url}appid={api}&q={city}"
    response = requests.get(url).json()

    if response.get("main"):
        try:
            temp_kelvin = response['main']['temp']
            temp_celsius = kelvin_to_celsius(temp_kelvin)
            feels_like = kelvin_to_celsius(response['main']['feels_like'])
            humidity = response['main']['humidity']
            pressure = response['main'].get('pressure', 0)
            wind_speed = response['wind']['speed']
            wind_degree = response['wind'].get('deg', 0)
            description = response['weather'][0]['description']
            cloudiness = response['clouds'].get('all', 0)
            visibility = response.get('visibility', 0) / 1000  # Convert to km
            uvi = response.get('uvi', 'N/A')  # UV Index if available

            timezone_offset = response['timezone']
            sunrise = datetime.utcfromtimestamp(response['sys']['sunrise'] + timezone_offset)
            sunset = datetime.utcfromtimestamp(response['sys']['sunset'] + timezone_offset)

            return {
                "city": city,
                "temperature": round(temp_celsius, 2),
                "feels_like": round(feels_like, 2),
                "humidity": humidity,
                "pressure": pressure,
                "condition": description,
                "wind_speed": round(wind_speed, 2),
                "wind_direction": wind_degree,
                "cloudiness": cloudiness,
                "visibility": round(visibility, 2),
                "sunrise": sunrise.isoformat(),
                "sunset": sunset.isoformat(),
                "uvi": uvi,
            }
        except KeyError as e:
            return {"error": f"Unexpected response structure: Missing key {str(e)}"}
    else:
        return {"error": response.get("message", "City not found or API call failed!")}

def get_weather_forecast(city, days=5):
    """
    Fetch weather forecast for a city.
    :param city: Name of the city.
    :param days: Number of days to forecast (max 5 for free tier).
    :return: Dictionary containing forecast details.
    """
    base_url = "http://api.openweathermap.org/data/2.5/forecast?"
    
    if not api:
        return {"error": "API key is missing."}

    url = f"{base_url}appid={api}&q={city}&cnt={days * 8}"
    response = requests.get(url).json()

    if response.get("list"):
        try:
            forecast_list = []
            for item in response['list']:
                forecast_list.append({
                    "datetime": item['dt_txt'],
                    "temperature": round(kelvin_to_celsius(item['main']['temp']), 2),
                    "humidity": item['main']['humidity'],
                    "pressure": item['main']['pressure'],
                    "condition": item['weather'][0]['description'],
                    "wind_speed": round(item['wind']['speed'], 2),
                    "precipitation": item.get('rain', {}).get('3h', 0),
                    "cloudiness": item['clouds']['all'],
                })
            
            return {
                "city": city,
                "forecast": forecast_list,
            }
        except KeyError as e:
            return {"error": f"Unexpected response structure: {str(e)}"}
    else:
        return {"error": "Failed to fetch forecast data."}

