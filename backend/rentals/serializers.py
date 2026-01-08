from rest_framework import serializers
from .models import RentOwner, RentItems, RentItemOrders

class RentOwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = RentOwner
        fields = ['user', 'id', 'name', 'dob', 'contact', 'address', 'no_of_deals', 'ratings']

    def validate(self, data):
        """Make certain fields optional during creation"""
        return data

class RentItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RentItems
        fields = ['id', 'rent_owner', 'product_name', 'description',"quantity", 'image', 'price', 'is_available']

class RentItemsWithUserSerializer(serializers.ModelSerializer):
    rent_owner=RentOwnerSerializer()
    class Meta:
        model = RentItems
        fields = ['id', 'rent_owner', 'product_name', 'description',"quantity", 'image', 'price', 'is_available']

class RentItemOrdersSerializer(serializers.ModelSerializer):
    class Meta:
        model = RentItemOrders
        fields = ['id', 'rent_owner','rent_taker', 'title', 'description', 'price','order_date','return_date', 'is_confirmed', 'is_ready_for_pickup']
