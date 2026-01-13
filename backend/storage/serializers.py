from rest_framework import serializers
from farmers.serializers import CropsSerializer, FarmerSerializer
from .models import StorageOwner, StorageOwnerGigs, StorageDeals

class StorageOwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = StorageOwner
        fields = ['id','user','name','dob', 'contact', 'no_of_deals']
        

class StorageOwnerGigsWithDetailsSerializer(serializers.ModelSerializer):
    storage_owner = StorageOwnerSerializer()
    prefered_crop = CropsSerializer()
    class Meta:
        model = StorageOwnerGigs
        fields = ['id','storage_owner','address', 'image','description', 'price','is_Available','prefered_crop','quantity']
        

class StorageOwnerGigsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StorageOwnerGigs
        fields = ['id','storage_owner','address', 'image','description', 'price','is_Available','prefered_crop','quantity']
        
class StorageDealsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StorageDeals
        fields = ['farmer', 'storage_owner', 'gigs_offered','crops','start_date','end_date', 'completed', 'is_confirmed', 'is_ready_for_pickup']
        
class StorageDealsWithDetailsSerializer(serializers.ModelSerializer):
    gigs_offered = StorageOwnerGigsSerializer()
    farmer=FarmerSerializer()
    storage_owner = StorageOwnerSerializer()
    class Meta:
        model = StorageDeals
        fields = ['farmer', 'storage_owner', 'gigs_offered','crops','start_date','end_date', 'completed', 'is_confirmed', 'is_ready_for_pickup']
