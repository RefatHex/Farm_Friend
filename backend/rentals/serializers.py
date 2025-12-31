from rest_framework import serializers
from .models import Equipment, RentalRequest


class EquipmentSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model = Equipment
        fields = ['id', 'owner', 'owner_username', 'title', 'description', 'image', 'price_per_day', 'is_approved', 'created_at', 'updated_at']
        read_only_fields = ['is_approved', 'created_at', 'updated_at', 'owner_username']


class RentalRequestSerializer(serializers.ModelSerializer):
    renter_username = serializers.CharField(source='renter.username', read_only=True)
    equipment_title = serializers.CharField(source='equipment.title', read_only=True)

    class Meta:
        model = RentalRequest
        fields = ['id', 'equipment', 'equipment_title', 'renter', 'renter_username', 'start_date', 'end_date', 'total_price', 'status', 'created_at']
        read_only_fields = ['total_price', 'status', 'created_at', 'renter_username', 'equipment_title']
