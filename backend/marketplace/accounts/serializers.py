from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User
from businesses.models import Business


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'business']


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    business = serializers.PrimaryKeyRelatedField(queryset=Business.objects.all(), required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'business']

    def create(self, validated_data):
        business = validated_data.pop('business', None)
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'viewer'),
            business=business
        )
