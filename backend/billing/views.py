from rest_framework.viewsets import ModelViewSet
from .models import BillingAddress
from .serializers import BillingAddressSerializer
from django_filters.rest_framework import DjangoFilterBackend

class BillingAddressViewSet(ModelViewSet):
    """
    CRUD operations for billing addresses.
    """
    serializer_class = BillingAddressSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user']

    def get_queryset(self):
        """
        Fetch billing addresses for the authenticated user.
        """
        return BillingAddress.objects.all()
