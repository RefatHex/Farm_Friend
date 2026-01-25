from django.db import models
from farmers.models import Farmer
from users.models import UserInfo

class Agronomist(models.Model):
    user = models.OneToOneField(UserInfo, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    dob = models.DateField(null=True, blank=True)
    contact = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    specialty = models.CharField(max_length=255)
    fee= models.DecimalField(max_digits=10, decimal_places=2, default=0)
    years_of_experience = models.IntegerField()
    availability = models.BooleanField(default=True)

class ConsultationRequest(models.Model):
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE)
    agronomist = models.ForeignKey(Agronomist, on_delete=models.CASCADE)
    request_date = models.DateTimeField(auto_now_add=True)
    fee= models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=50, choices=[
        ('Pending', 'Pending'),
        ('Accepted', 'Accepted'),
        ('Rejected', 'Rejected'),
        ('Completed', 'Completed')
    ])
    details = models.TextField()
    meet_link = models.TextField(null=True, blank=True)
    resolution = models.TextField(null=True, blank=True)
