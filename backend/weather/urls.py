from django.urls import path
from .views import (
    CurrentWeatherAPIView, 
    HistoricalRainfallAPIView, 
    WeatherAPIView,
    WeatherForecastAPIView,
    WeatherWarningsAPIView
)

urlpatterns = [
    path('weather/', WeatherAPIView.as_view(), name='weather-api'),
    path('current-weather/', CurrentWeatherAPIView.as_view(), name='current-weather'),
    path('weather-forecast/', WeatherForecastAPIView.as_view(), name='weather-forecast'),
    path('historical-rainfall/', HistoricalRainfallAPIView.as_view(), name='historical-rainfall'),
    path('weather-warnings/', WeatherWarningsAPIView.as_view(), name='weather-warnings'),
]
