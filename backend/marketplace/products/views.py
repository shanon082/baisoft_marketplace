from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import ProductSerializer
from accounts.permissions import CanManageProducts, CanApprove, IsSuperOrBusinessMember
from .models import Product

class ProductListCreate(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, CanManageProducts]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Product.objects.all()
        return Product.objects.filter(business=self.request.user.business)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, business=self.request.user.business)

class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsSuperOrBusinessMember, CanManageProducts]
    queryset = Product.objects.all()

class ApproveProduct(generics.UpdateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, CanApprove, IsSuperOrBusinessMember]

    def get_object(self):
        return Product.objects.get(pk=self.kwargs['pk'])

    def update(self, request, *args, **kwargs):
        product = self.get_object()
        product.status = 'approved'
        product.save()
        return Response(ProductSerializer(product).data)

class PublicProducts(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    queryset = Product.objects.filter(status='approved')