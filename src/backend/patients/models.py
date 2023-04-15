from django.db import models
from users.models import MyUser
from django.utils.translation import gettext_lazy as _

def upload_to(instance, filename):
    return 'footprints/{filename}'.format(filename=filename)

# Create your models here.
class Patient(models.Model):
    name = models.CharField(max_length=200, blank=True)
    age = models.CharField(max_length=200)
    parents = models.CharField(max_length=200)
    relation = models.CharField(max_length=200)
    phone = models.CharField(max_length=200)
    bedID = models.CharField(max_length=200)
    roomID = models.CharField(max_length=200)
    patient_id = models.CharField(max_length=200, unique=True)
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
    )
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True)
    foot = models.CharField(max_length=200, blank=True, null=True)
    infused_veins = models.CharField(max_length=200, blank=True, null=True)
    disease = models.CharField(max_length=200, blank=True, null=True)    
    tips = models.TextField(blank=True)
    
    def __str__(self):
        return str(self.patient_id)
    

class InspectionEntry(models.Model):
    nurse = models.ForeignKey(to=MyUser, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    patient = models.ForeignKey(to=Patient, on_delete=models.CASCADE, related_name='inspection_entries')
    tips = models.TextField(blank=True)
    complications = models.CharField(max_length=200, blank=True, null=True)
    
    
    
    
    
    