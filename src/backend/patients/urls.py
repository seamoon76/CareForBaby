from django.urls import path
from .views import PatientListAPIView, PatientDetailAPIView, InspectionEntryAPIView



urlpatterns = [
    path('api/patients', PatientListAPIView.as_view(),
         name='patients'),
    path('api/patients/<int:pk>', PatientDetailAPIView.as_view(),
         name='patient'),
    path('api/inspections', InspectionEntryAPIView.as_view(),
         name='inspections'),
]