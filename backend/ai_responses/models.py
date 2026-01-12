from django.db import models
from users.models import UserInfo
from users.models import UserSessions

class CropSuggestion(models.Model):
    """
    Model to store crop recommendation responses from ML algorithm.
    """
    user = models.ForeignKey(UserInfo, on_delete=models.CASCADE)
    nitrogen = models.FloatField(help_text="Nitrogen content (N)")
    phosphorus = models.FloatField(help_text="Phosphorus content (P)")
    potassium = models.FloatField(help_text="Potassium content (K)")
    temperature = models.FloatField(help_text="Temperature in Celsius")
    humidity = models.FloatField(help_text="Humidity percentage")
    ph = models.FloatField(help_text="Soil pH level")
    rainfall = models.FloatField(help_text="Rainfall in mm")
    recommended_crop = models.CharField(max_length=255, help_text="Recommended crop name")
    recommendation_message = models.TextField(help_text="Full recommendation message")
    created_at = models.DateTimeField(auto_now_add=True)
    rating = models.FloatField(null=True, blank=True, help_text="User rating of recommendation (1-5)")
    session_id = models.BigIntegerField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Crop Suggestion"
        verbose_name_plural = "Crop Suggestions"

    def __str__(self):
        return f"{self.user.username} - {self.recommended_crop}"


class FertilizerSuggestion(models.Model):
    """
    Model to store fertilizer recommendation responses from ML algorithm.
    """
    user = models.ForeignKey(UserInfo, on_delete=models.CASCADE)
    nitrogen = models.FloatField(help_text="Nitrogen content")
    phosphorous = models.FloatField(help_text="Phosphorous content")
    potassium = models.FloatField(help_text="Potassium content")
    soil_type = models.CharField(max_length=100, help_text="Type of soil")
    crop_type = models.CharField(max_length=100, help_text="Type of crop")
    temperature = models.FloatField(help_text="Temperature in Celsius")
    humidity = models.FloatField(help_text="Humidity percentage")
    moisture = models.FloatField(help_text="Soil moisture percentage")
    recommended_fertilizer = models.CharField(max_length=255, help_text="Recommended fertilizer name")
    recommendation_message = models.TextField(help_text="Full recommendation message")
    created_at = models.DateTimeField(auto_now_add=True)
    rating = models.FloatField(null=True, blank=True, help_text="User rating of recommendation (1-5)")
    session_id = models.BigIntegerField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Fertilizer Suggestion"
        verbose_name_plural = "Fertilizer Suggestions"

    def __str__(self):
        return f"{self.user.username} - {self.recommended_fertilizer}"


class RecAIResponse(models.Model):
    user = models.ForeignKey(UserInfo, on_delete=models.CASCADE)
    nitrogen = models.FloatField()
    phosphorus = models.FloatField()
    potassium = models.FloatField()
    temperature = models.FloatField()
    humidity = models.FloatField()
    ph = models.FloatField()
    rainfall = models.FloatField()
    answer = models.CharField(max_length=255)
    asked_at = models.DateTimeField(auto_now_add=True)
    answer_rating = models.FloatField(null=True, blank=True)
    session_id = models.BigIntegerField()

class FertAIResponse(models.Model):
    user = models.ForeignKey(UserInfo, on_delete=models.CASCADE)
    nitrogen = models.FloatField()
    phosphorus = models.FloatField()
    potassium = models.FloatField()
    temperature = models.FloatField()
    humidity = models.FloatField()
    moisture = models.FloatField()
    crop_type = models.CharField(max_length=255)
    soil_type = models.CharField(max_length=255)
    answer = models.CharField(max_length=255)
    asked_at = models.DateTimeField(auto_now_add=True)
    answer_rating = models.FloatField(null=True, blank=True)
    session_id = models.BigIntegerField()
