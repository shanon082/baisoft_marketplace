from rest_framework import generics
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from accounts.permissions import (
    CanApproveProducts,
    CanDeleteProducts,
    CanEditProducts,
    CanViewProducts,
    IsSuperOrBusinessMember,
)

from .models import Product
from .serializers import ProductSerializer


class ProductListCreate(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, CanViewProducts]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated(), CanViewProducts(), CanEditProducts()]
        return [IsAuthenticated(), CanViewProducts()]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Product.objects.all().order_by("-created_at")

        queryset = Product.objects.filter(business=user.business).order_by("-created_at")
        if user.role == "viewer":
            queryset = queryset.filter(status="approved")
        return queryset

    def perform_create(self, serializer):
        serializer.save(
            created_by=self.request.user,
            business=self.request.user.business,
            status="pending_approval",
        )


class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, CanViewProducts, IsSuperOrBusinessMember]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.request.method in ["PATCH", "PUT"]:
            return [IsAuthenticated(), CanViewProducts(), IsSuperOrBusinessMember(), CanEditProducts()]
        if self.request.method == "DELETE":
            return [IsAuthenticated(), CanViewProducts(), IsSuperOrBusinessMember(), CanDeleteProducts()]
        return [IsAuthenticated(), CanViewProducts(), IsSuperOrBusinessMember()]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Product.objects.all()

        queryset = Product.objects.filter(business=user.business)
        if user.role == "viewer":
            queryset = queryset.filter(status="approved")
        return queryset

    def perform_update(self, serializer):
        serializer.save(status="pending_approval")


class ApproveProduct(generics.UpdateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, CanViewProducts, IsSuperOrBusinessMember, CanApproveProducts]

    def get_object(self):
        user = self.request.user
        if user.is_superuser:
            return Product.objects.get(pk=self.kwargs["pk"])
        return Product.objects.get(pk=self.kwargs["pk"], business=user.business)

    def update(self, request, *args, **kwargs):
        product = self.get_object()
        product.status = "approved"
        product.save(update_fields=["status"])
        return Response(ProductSerializer(product).data)


class PublicProducts(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    queryset = Product.objects.filter(status="approved").order_by("-created_at")
