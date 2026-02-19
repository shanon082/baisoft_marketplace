from rest_framework import serializers
from .models import Business

class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = ['id', 'name', 'created_at']
        read_only_fields = ['created_at', 'id']