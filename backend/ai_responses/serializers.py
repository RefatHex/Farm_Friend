from rest_framework import serializers
from .models import RecAIResponse, FertAIResponse, CropSuggestion, FertilizerSuggestion

class CropSuggestionSerializer(serializers.ModelSerializer):
    """Serializer for Crop Suggestion model."""
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = CropSuggestion
        fields = [
            'id', 'user', 'user_name', 'nitrogen', 'phosphorus', 'potassium',
            'temperature', 'humidity', 'ph', 'rainfall', 'recommended_crop',
            'recommendation_message', 'created_at', 'rating', 'session_id'
        ]

class FertilizerSuggestionSerializer(serializers.ModelSerializer):
    """Serializer for Fertilizer Suggestion model."""
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = FertilizerSuggestion
        fields = [
            'id', 'user', 'user_name', 'nitrogen', 'phosphorous', 'potassium',
            'soil_type', 'crop_type', 'temperature', 'humidity', 'moisture',
            'recommended_fertilizer', 'recommendation_message', 'created_at', 
            'rating', 'session_id'
        ]

class RecAIResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecAIResponse
        fields = '__all__'

class FertAIResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = FertAIResponse
        fields = '__all__'
