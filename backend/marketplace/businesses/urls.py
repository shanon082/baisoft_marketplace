from django.urls import path
from .views import BusinessListCreate, BusinessDetail

urlpatterns = [
    path('', BusinessListCreate.as_view(), name='business-list-create'),
    path('<int:pk>/', BusinessDetail.as_view(), name='business-detail'),
]