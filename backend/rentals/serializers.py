from rest_framework import serializers
from .models import RentOwner, RentItems, RentItemOrders
from users.models import UserInfo

class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

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
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = RentItems
        fields = ['id', 'rent_owner', 'product_name', 'description',"quantity", 'image', 'price', 'is_available']
    
    def get_image(self, obj):
        """Return full URL for image"""
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class RentItemOrdersSerializer(serializers.ModelSerializer):
    rent_taker_details = UserDetailSerializer(source='rent_taker', read_only=True)
    rent_owner_name = serializers.CharField(source='rent_owner.name', read_only=True)
    
    class Meta:
        model = RentItemOrders
        fields = ['id', 'rent_owner', 'rent_owner_name', 'rent_taker', 'rent_taker_details', 'title', 'description', 'price', 'order_date', 'return_date', 'is_confirmed', 'is_ready_for_pickup']
