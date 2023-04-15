from rest_framework.generics import  ListCreateAPIView, RetrieveUpdateDestroyAPIView, GenericAPIView
from .serializers import InfusionEntrySerializer, ShareSerializer
from .models import InfusionEntry
from rest_framework import response, status, permissions, filters
from .permissions import *
from users.permissions import IsAdmin
from datetime import datetime, timedelta


# Create your views here.


class InfusionEntryListAPIView(ListCreateAPIView):
    serializer_class = InfusionEntrySerializer
    queryset =  InfusionEntry.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    
    filter_backends = (filters.OrderingFilter,)

    # Explicitly specify which fields the API may be ordered against
    ordering_fields = ('updated_at', 'start_time', )

    # This will be used as the default ordering
    ordering = ('-updated_at')
    
    def get_queryset(self):
        if 'now_time' in self.request.GET:
            now_time_=datetime.now()
            begin_time = now_time_ - timedelta(days=7)
            queryset = self.queryset.filter(start_time__range=(begin_time, now_time_))
            return queryset
        if self.request.user.role =='ADMIN':
            return self.queryset.all()
        return self.queryset.filter(perm_group=self.request.user)
    
    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return response.Response({'total': len(self.get_queryset()), 'InfusionEntries': serializer.data},
                                 status=status.HTTP_200_OK)     
        
    def perform_create(self, serializer):
        item = serializer.save()
        item.perm_group.add(self.request.user)
        item.perm_group.add(item.performer)
        item.save()                         
    

class InfusionEntryDetailAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = InfusionEntrySerializer
    queryset = InfusionEntry.objects.all()
    permission_classes = (permissions.IsAuthenticated, IsAdmin|InPermGroup, )
    
    
class InfusionShareAPIView(GenericAPIView):
    serializer_class = ShareSerializer
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data) 
        if serializer.is_valid():
            infusion_entry = serializer.validated_data[0]
            nurse = serializer.validated_data[1]
            infusion_entry.perm_group.add(nurse)  
            infusion_entry.save()          
            return response.Response({"message":"ok"}, status=status.HTTP_200_OK) 
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   
    
    