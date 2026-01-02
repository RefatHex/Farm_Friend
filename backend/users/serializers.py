from rest_framework import serializers
from .models import UserInfo, UserSessions

class UserInfoSerializer(serializers.ModelSerializer):
    user_id = serializers.UUIDField(read_only=True)
    username = serializers.CharField(max_length=150, required=True)
    password = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=False)
    name = serializers.CharField(write_only=True, required=False)
    is_farmer = serializers.BooleanField(required=False, default=False)
    is_storage_owner = serializers.BooleanField(required=False, default=False)
    is_rent_owner = serializers.BooleanField(required=False, default=False)
    is_agronomist = serializers.BooleanField(required=False, default=False)

    class Meta:
        model = UserInfo
        fields = ['id','user_id','profile_picture', 'username', 'password', 'email', 'name', 'is_admin', 'is_farmer', 'is_storage_owner', 'is_rent_owner', 'is_agronomist', 'role_count']

    def create(self, validated_data):
        """
        Create user and handle the name field.
        """
        name = validated_data.pop('name', '')
        validated_data['first_name'], validated_data['last_name'] = (name.split(' ', 1) if ' ' in name else (name, ''))
        user = UserInfo.objects.create_user(**validated_data)
        return user

class UserSessionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSessions
        fields = ['login_time', 'logout_time', 'session_duration']
