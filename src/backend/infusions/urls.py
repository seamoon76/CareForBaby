from django.urls import path
from .views import InfusionEntryListAPIView, InfusionEntryDetailAPIView, InfusionShareAPIView



urlpatterns = [
    path('api/infusions', InfusionEntryListAPIView.as_view(),
         name='infusions'),
    path('api/infusions/<int:pk>', InfusionEntryDetailAPIView.as_view(),
         name='infusion'),
    path('api/share', InfusionShareAPIView.as_view(),
         name='share'),
]

