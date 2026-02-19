from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')
    business_name = serializers.ReadOnlyField(source='business.name')

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image', 'status', 'created_by', 'business_name', 'created_at']
        read_only_fields = ['status', 'created_by', 'business_name', 'created_at']

    def validate_image(self, value):
        if not value:
            return value

        content_type = getattr(value, 'content_type', None)
        if content_type and not content_type.startswith('image/'):
            raise serializers.ValidationError('Only image files are allowed.')

        return value
