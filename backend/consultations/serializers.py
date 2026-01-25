from rest_framework import serializers
from farmers.models import Farmer
from farmers.serializers import FarmerSerializer
from .models import Agronomist, ConsultationRequest

class AgronomistSerializer(serializers.ModelSerializer):

    class Meta:
        model = Agronomist
        fields = [
            'id', 'user', 'name',  'dob', 'contact','fee','description',
            'address', 'specialty', 'years_of_experience', 'availability'
        ]

class ConsultationRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultationRequest
        fields = [
            'id', 'farmer', 'agronomist', 'request_date', 'status', 'fee',
            'details', 'resolution', 'meet_link'
        ]
        read_only_fields = ['id', 'request_date']

class ConsultationRequestWithDetailsSerializer(serializers.ModelSerializer):
    farmer=FarmerSerializer()
    agronomist=AgronomistSerializer()
    class Meta:
        model = ConsultationRequest
        fields = [
            'id', 'farmer', 'agronomist', 'request_date', 'status', 'fee',
            'details', 'resolution', 'meet_link'
        ]
        read_only_fields = ['id', 'request_date', 'farmer', 'agronomist']