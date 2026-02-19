from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')
    business_name = serializers.ReadOnlyField(source='business.name')

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'status', 'created_by', 'business_name', 'created_at']