from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from scripts.Weather import get_weather, get_weather_forecast
from scripts.Weather_warning import get_weather_warnings, get_historical_rainfall  

class WeatherAPIView(APIView):
    """
    API endpoint to fetch comprehensive weather data for a city.
    """

    def get(self, request):
        city = request.query_params.get('city')
        if not city:
            return Response({"error": "City parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        weather_data = get_weather(city)
        if "error" in weather_data:
            return Response({"error": weather_data["error"]}, status=status.HTTP_400_BAD_REQUEST)

        return Response(weather_data, status=status.HTTP_200_OK)


class CurrentWeatherAPIView(APIView):
    """
    API endpoint to fetch the current weather for a city.
    Includes temperature, humidity, pressure, wind, visibility, etc.
    """
    def get(self, request):
        city = request.query_params.get('city')
        if not city:
            return Response({"error": "City parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        weather_data = get_weather(city)
        if "error" in weather_data:
            return Response(weather_data, status=status.HTTP_400_BAD_REQUEST)

        return Response(weather_data, status=status.HTTP_200_OK)


class WeatherForecastAPIView(APIView):
    """
    API endpoint to fetch 5-day weather forecast for a city.
    Useful for farmers to plan their activities.
    """
    def get(self, request):
        city = request.query_params.get('city')
        days = request.query_params.get('days', 5)
        
        if not city:
            return Response({"error": "City parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            days = int(days)
            if days < 1 or days > 5:
                days = 5
        except ValueError:
            days = 5

        forecast_data = get_weather_forecast(city, days)
        if "error" in forecast_data:
            return Response(forecast_data, status=status.HTTP_400_BAD_REQUEST)

        return Response(forecast_data, status=status.HTTP_200_OK)


class HistoricalRainfallAPIView(APIView):
    """
    API endpoint to fetch historical rainfall data for a city.
    """
    def get(self, request):
        city = request.query_params.get('city')
        if not city:
            return Response({"error": "City parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        rainfall_data = get_historical_rainfall(city)
        if "error" in rainfall_data:
            return Response(rainfall_data, status=status.HTTP_400_BAD_REQUEST)

        return Response(rainfall_data, status=status.HTTP_200_OK)


class WeatherWarningsAPIView(APIView):
    """
    API endpoint to fetch weather warnings and alerts for a city.
    Includes extreme weather warnings, agricultural warnings, etc.
    """
    def get(self, request):
        city = request.query_params.get('city')
        if not city:
            return Response({"error": "City parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        warnings_data = get_weather_warnings(city)
        if "error" in warnings_data:
            return Response(warnings_data, status=status.HTTP_400_BAD_REQUEST)

        return Response(warnings_data, status=status.HTTP_200_OK)