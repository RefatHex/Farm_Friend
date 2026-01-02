from django.urls import path
from .views import CurrentWeatherAPIView, HistoricalRainfallAPIView, WeatherAPIView

urlpatterns = [
    path('weather/', WeatherAPIView.as_view(), name='weather-api'),
     path('current-weather/', CurrentWeatherAPIView.as_view(), name='current-weather'),
    path('historical-rainfall/', HistoricalRainfallAPIView.as_view(), name='historical-rainfall'),
]
