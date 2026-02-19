from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from businesses.models import Business

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "role", "business", "is_active", "is_superuser"]


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    business = serializers.PrimaryKeyRelatedField(queryset=Business.objects.all(), required=False)

    class Meta:
        model = User
        fields = ["username", "email", "password", "role", "business"]

    def validate(self, attrs):
        request = self.context["request"]
        business = attrs.get("business")

        if not request.user.is_superuser:
            attrs["business"] = request.user.business
        elif business is None:
            raise serializers.ValidationError({"business": "This field is required."})

        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        return User.objects.create_user(password=password, **validated_data)


class UserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, validators=[validate_password])
    business = serializers.PrimaryKeyRelatedField(queryset=Business.objects.all(), required=False)

    class Meta:
        model = User
        fields = ["username", "email", "password", "role", "business", "is_active"]

    def validate(self, attrs):
        request = self.context["request"]
        if not request.user.is_superuser:
            attrs["business"] = request.user.business
        return attrs

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance
