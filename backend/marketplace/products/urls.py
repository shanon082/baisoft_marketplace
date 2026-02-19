from django.urls import path
from .views import (
    ProductListCreate,
    ProductDetail,
    ApproveProduct,
    PublicProducts
)

urlpatterns = [
    path('', ProductListCreate.as_view(), name='product-list-create'),
    path('<int:pk>/', ProductDetail.as_view(), name='product-detail'),
    path('<int:pk>/approve/', ApproveProduct.as_view(), name='product-approve'),
    path('public/', PublicProducts.as_view(), name='public-products'),
]