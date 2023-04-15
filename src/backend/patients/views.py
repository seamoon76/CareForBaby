from rest_framework.generics import  ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .serializers import PatientSerializer, InspectionEntrySerializer
from .models import Patient, InspectionEntry
from rest_framework import response, status, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.parsers import MultiPartParser, FormParser


# Create your views here.


class PatientListAPIView(ListCreateAPIView):
    serializer_class = PatientSerializer
    queryset = Patient.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    # parser_classes = [MultiPartParser, FormParser]
    
    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return response.Response({'total': len(queryset), 'patients': serializer.data},
                                 status=status.HTTP_200_OK)                                 
    


class PatientDetailAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = PatientSerializer
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Patient.objects.all()
    

class InspectionEntryAPIView(ListCreateAPIView):
    serializer_class = InspectionEntrySerializer
    queryset = InspectionEntry.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ['patient', ]
    
    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return response.Response({'total': len(queryset), 'inspections': serializer.data},
                                 status=status.HTTP_200_OK)      
    
    