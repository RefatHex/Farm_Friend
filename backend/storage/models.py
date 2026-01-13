from django.db import models
from farmers.models import Crops, Farmer
from users.models import UserInfo

class StorageOwner(models.Model):
    user = models.OneToOneField(UserInfo, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    dob = models.DateField()
    contact = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    no_of_deals = models.BigIntegerField(default=0)
    class Meta:
        ordering = ['name']

class StorageOwnerGigs(models.Model):
    storage_owner = models.ForeignKey(StorageOwner, on_delete=models.CASCADE)
    address = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='storage_gigs/',null=True, blank=True)
    prefered_crop = models.ForeignKey(Crops, on_delete=models.CASCADE, default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(default=1)
    is_Available = models.BooleanField(default=True)
    class Meta:
        ordering = ['-price']

class StorageDeals(models.Model):
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE)
    storage_owner = models.ForeignKey(StorageOwner, on_delete=models.CASCADE)
    gigs_offered = models.ForeignKey(StorageOwnerGigs, on_delete=models.CASCADE,null=True, blank=True)
    crops= models.ForeignKey(Crops, on_delete=models.CASCADE,null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    is_confirmed = models.BooleanField(default=False) 
    is_ready_for_pickup = models.BooleanField(default=False) 
    class Meta:
        ordering = ['-created_at']
