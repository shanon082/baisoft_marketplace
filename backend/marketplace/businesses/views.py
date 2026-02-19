from rest_framework import generics, permissions
from .models import Business
from .serializers import BusinessSerializer

class BusinessListCreate(generics.ListCreateAPIView):
    """
    Only superuser can list or create businesses.
    Normal users never see this endpoint (they get their business from profile).
    """
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer
    permission_classes = [permissions.IsAdminUser]   # Only superuser


class BusinessDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer
    permission_classes = [permissions.IsAdminUser]