from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User
from businesses.models import Business


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'business']


# class UserCreateSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
#     business = serializers.PrimaryKeyRelatedField(queryset=Business.objects.all(), required=False)

#     class Meta:
#         model = User
#         fields = ['username', 'email', 'password', 'role', 'business']

#     def create(self, validated_data):
#         business = validated_data.pop('business', None)
#         return User.objects.create_user(
#             username=validated_data['username'],
#             email=validated_data['email'],
#             password=validated_data['password'],
#             role=validated_data.get('role', 'viewer'),
#             business=business
#         )


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'business']

    def validate_business(self, value):
        request = self.context['request']
        if not request.user.is_superuser:
            raise serializers.ValidationError(
                "Normal users cannot specify business – it is set automatically."
            )
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user
