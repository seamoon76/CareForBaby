from rest_framework import serializers
from patients.models import Patient, InspectionEntry
from users.models import MyUser


class PatientSerializer(serializers.ModelSerializer):
  class Meta:
    model = Patient
    fields = '__all__'
 
class InspectionEntrySerializer(serializers.ModelSerializer):
  #nurse_staff_id = serializers.SlugRelatedField(source='nurse', queryset=MyUser.objects.all(), slug_field='staff_id')
  # nurse = serializers.PrimaryKeyRelatedField(read_only=True)
  # patient = serializers.PrimaryKeyRelatedField(read_only=True)
  class Meta:
    model = InspectionEntry
    fields = '__all__'
    #depth = 1