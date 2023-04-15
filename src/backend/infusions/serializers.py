from rest_framework import serializers
from .models import InfusionEntry
from users.models import MyUser
from patients.models import Patient


class InfusionEntrySerializer(serializers.ModelSerializer):
    
  performer_query_id = serializers.SlugRelatedField(source='performer', queryset=MyUser.objects.all(), slug_field='staff_id')
  patient_query_id = serializers.SlugRelatedField(source='patient', queryset=Patient.objects.all(), slug_field='patient_id')
  performer = serializers.PrimaryKeyRelatedField(read_only=True)
  patient = serializers.PrimaryKeyRelatedField(read_only=True)
  
  class Meta:
    model = InfusionEntry
    # fields = ['start_time', 'end_time', 'updated_at', 'patient', 'performer', 'drug', 'dose',
    #           'equipments', 'vein', 'tips']
    fields = "__all__"
    #exclude = ['perm_group', ]
    #depth = 1
    
    

class ShareSerializer(serializers.Serializer):
    
    infusion_db_id = serializers.IntegerField()
    nurse_target_id = serializers.IntegerField()
    
    class Meta:
      fields = ("infusion_db_id", "nurse_target_id")
    
    def validate(self, data):
      try:
        infusion_entry = InfusionEntry.objects.get(pk=data.get('infusion_db_id'))
        nurse = MyUser.objects.get(pk=data.get('nurse_target_id'))
        return (infusion_entry, nurse)
      except:
        #traceback.print_exc()
        raise serializers.ValidationError("infusion entry or nurse do not exist")