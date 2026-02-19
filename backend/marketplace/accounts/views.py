from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer, UserCreateSerializer
from .permissions import IsBusinessAdmin

class CustomTokenObtainPairView(TokenObtainPairView):
    pass

class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

# class UserListCreate(generics.ListCreateAPIView):
    # permission_classes = [permissions.IsAuthenticated]

    # def get_serializer_class(self):
    #     return UserCreateSerializer if self.request.method == 'POST' else UserSerializer

    # def get_queryset(self):
    #     if self.request.user.is_superuser:
    #         return CustomUser.objects.all()
    #     if not self.request.user.business:
    #         return CustomUser.objects.none()
    #     return CustomUser.objects.filter(business=self.request.user.business)

    # def get_permissions(self):
    #     if self.request.method == 'POST':
    #         return [permissions.IsAuthenticated(), IsBusinessAdmin()]
    #     return [permissions.IsAuthenticated()]

    # def create(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     if not request.user.is_superuser:
    #         serializer.validated_data['business'] = request.user.business
    #     user = serializer.save()
    #     return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class UserListCreate(generics.ListCreateAPIView):
    """
    GET  → list users (own business or all for superuser)
    POST → create user (scoped to own business for admins)
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), IsBusinessAdmin()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return CustomUser.objects.all()
        if not self.request.user.business:
            return CustomUser.objects.none()
        return CustomUser.objects.filter(business=self.request.user.business)

    def get_serializer_class(self):
        return UserCreateSerializer if self.request.method in ['POST'] else UserSerializer

    def perform_create(self, serializer):
        # Force business for normal admins
        if not self.request.user.is_superuser:
            serializer.save(business=self.request.user.business, created_by=self.request.user)
        else:
            # superuser must provide business in payload
            serializer.save(created_by=self.request.user)