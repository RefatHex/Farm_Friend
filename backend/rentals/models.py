from django.db import models
from django.conf import settings


# Equipment that a user can list for rent
class Equipment(models.Model):
	owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='equipments')
	title = models.CharField(max_length=200)
	description = models.TextField(blank=True)
	image = models.ImageField(upload_to='equipment_images/', null=True, blank=True)
	price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
	is_approved = models.BooleanField(default=False)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return f"{self.title} - {self.owner.username}"


# Rental request submitted by a user to rent an equipment
class RentalRequest(models.Model):
	STATUS_CHOICES = [
		('PENDING', 'Pending'),
		('APPROVED', 'Approved'),
		('REJECTED', 'Rejected'),
	]

	equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='rental_requests')
	renter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='rental_requests')
	start_date = models.DateField()
	end_date = models.DateField()
	total_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
	status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
	created_at = models.DateTimeField(auto_now_add=True)

	def save(self, *args, **kwargs):
		# compute total_price if possible
		if self.start_date and self.end_date and (self.end_date >= self.start_date):
			days = (self.end_date - self.start_date).days + 1
			try:
				self.total_price = days * self.equipment.price_per_day
			except Exception:
				pass
		super().save(*args, **kwargs)

	def __str__(self):
		return f"{self.equipment.title} request by {self.renter.username} [{self.status}]"
