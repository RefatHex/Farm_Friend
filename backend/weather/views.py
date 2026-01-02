from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from scripts.Weather import get_weather
from scripts.Weather_warning import get_historical_rainfall  

class WeatherAPIView(APIView):
    """
    API endpoint to fetch weather data for a city.
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
    """
    def get(self, request):
        city = request.query_params.get('city')
        if not city:
            return Response({"error": "City parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the current weather data
        weather_data = get_weather(city)
        if "error" in weather_data:
            return Response(weather_data, status=status.HTTP_400_BAD_REQUEST)

        return Response(weather_data, status=status.HTTP_200_OK)


class HistoricalRainfallAPIView(APIView):
    """
    API endpoint to fetch historical rainfall data for a city.
    """
    def get(self, request):
        city = request.query_params.get('city')
        if not city:
            return Response({"error": "City parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the historical rainfall data
        rainfall_data = get_historical_rainfall(city)
        if "error" in rainfall_data:
            return Response(rainfall_data, status=status.HTTP_400_BAD_REQUEST)

        return Response(rainfall_data, status=status.HTTP_200_OK)