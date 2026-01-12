from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import RecAIResponseView, FertAIResponseView, CropSuggestionView, FertilizerSuggestionView

urlpatterns = [
    path('rec/', RecAIResponseView.as_view(), name='rec-response'),
    path('rec/<int:pk>/', RecAIResponseView.as_view(), name='rec-response-rating'),
    path('fert/', FertAIResponseView.as_view(), name='fert-response'),
    path('fert/<int:pk>/', FertAIResponseView.as_view(), name='fert-response-rating'),
    path('crops/', CropSuggestionView.as_view(), name='crop-suggestion'),
    path('crops/<int:user_id>/', CropSuggestionView.as_view(), name='crop-suggestion-detail'),
    path('fertilizers/', FertilizerSuggestionView.as_view(), name='fertilizer-suggestion'),
    path('fertilizers/<int:user_id>/', FertilizerSuggestionView.as_view(), name='fertilizer-suggestion-detail'),
]
