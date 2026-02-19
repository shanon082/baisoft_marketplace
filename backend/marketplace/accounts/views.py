from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User
from .permissions import IsBusinessAdmin
from .serializers import UserCreateSerializer, UserSerializer, UserUpdateSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    pass


class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserListCreate(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsBusinessAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return User.objects.all().order_by("id")
        if not user.business:
            return User.objects.none()
        return User.objects.filter(business=user.business).order_by("id")

    def get_serializer_class(self):
        if self.request.method == "POST":
            return UserCreateSerializer
        return UserSerializer

    def perform_create(self, serializer):
        if self.request.user.is_superuser:
            serializer.save()
        else:
            serializer.save(business=self.request.user.business)


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsBusinessAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return User.objects.all()
        if not user.business:
            return User.objects.none()
        return User.objects.filter(business=user.business)

    def get_serializer_class(self):
        if self.request.method in ["PATCH", "PUT"]:
            return UserUpdateSerializer
        return UserSerializer
