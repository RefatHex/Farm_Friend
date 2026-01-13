from rest_framework.viewsets import ModelViewSet
from .models import StorageOwner, StorageOwnerGigs, StorageDeals
from .serializers import StorageDealsWithDetailsSerializer, StorageOwnerGigsWithDetailsSerializer, StorageOwnerSerializer, StorageOwnerGigsSerializer, StorageDealsSerializer
from django_filters.rest_framework import DjangoFilterBackend


class StorageOwnerViewSet(ModelViewSet):
    serializer_class = StorageOwnerSerializer

    filter_backends = [DjangoFilterBackend]
    def get_queryset(self):
        return StorageOwner.objects.all()


class StorageOwnerGigsViewSet(ModelViewSet):
    serializer_class = StorageOwnerGigsSerializer


    def get_queryset(self):
        return StorageOwnerGigs.objects.all()

class StorageOwnerGigsWithDetailsViewSet(ModelViewSet):
    serializer_class = StorageOwnerGigsWithDetailsSerializer
    queryset = StorageDeals.objects.all()

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['quantity', 'price']

    def get_queryset(self):
        return StorageOwnerGigs.objects.all()

class StorageDealsViewSet(ModelViewSet):
    """
    ViewSet for managing storage deals with search and filter.
    """
    serializer_class = StorageDealsSerializer
    queryset = StorageDeals.objects.all()

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_confirmed', 'is_ready_for_pickup', 'completed','storage_owner']


    def get_queryset(self):
        return StorageDeals.objects.all()



    def perform_update(self, serializer):
        """
        Handle updates for confirmation and readiness.
        """
        instance = self.get_object()
        if 'is_confirmed' in self.request.data:
            instance.is_confirmed = self.request.data['is_confirmed']
        if 'is_ready_for_pickup' in self.request.data:
            instance.is_ready_for_pickup = self.request.data['is_ready_for_pickup']
        instance.save()
        serializer.save()

class StorageOrderWithDetailsViewSet(ModelViewSet):
    serializer_class = StorageDealsWithDetailsSerializer
    queryset = StorageDeals.objects.all()
    
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['quantity', 'is_confirmed', 'completed','storage_owner']
    
    def get_queryset(self):
        return StorageDeals.objects.all()
    
    
    