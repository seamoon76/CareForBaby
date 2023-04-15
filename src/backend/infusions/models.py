from django.db import models
from patients.models import Patient
from users.models import MyUser

# Create your models here.
class InfusionEntry(models.Model):
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True)
    updated_at = models.DateTimeField(auto_now=True)
    patient = models.ForeignKey(to=Patient, on_delete=models.CASCADE)
    performer = models.ForeignKey(to=MyUser, on_delete=models.SET_NULL, null=True, related_name='performed_infusion_entries')
    drug = models.CharField(max_length=200)
    dose = models.DecimalField(max_digits=5, decimal_places=2)
    perm_group = models.ManyToManyField(MyUser, related_name='perm_infusion_entries', blank=True)
    equipments = models.JSONField()
    vein = models.CharField(max_length=200)
    tips = models.TextField(blank=True)
    
    def __str__(self):
        return str(self.id)