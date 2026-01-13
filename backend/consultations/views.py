from .models import Agronomist, ConsultationRequest
from .serializers import AgronomistSerializer, ConsultationRequestSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters

class AgronomistFilter(filters.FilterSet):
    min_fee = filters.NumberFilter(field_name="fee", lookup_expr='gte')
    max_fee = filters.NumberFilter(field_name="fee", lookup_expr='lte')

    class Meta:
        model = Agronomist
        fields = ['min_fee', 'max_fee','availability','user']

class AgronomistViewSet(ModelViewSet):
    serializer_class = AgronomistSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = AgronomistFilter
    search_fields = ['name', 'specialty', 'description']
    ordering_fields = ['fee', 'years_of_experience']

    def get_queryset(self):
        return Agronomist.objects.all()

class ConsultationRequestViewSet(ModelViewSet):
    serializer_class = ConsultationRequestSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'request_date', 'fee', 'farmer', 'agronomist']
    search_fields = ['farmer__name', 'agronomist__name', 'details']
    ordering_fields = ['request_date', 'fee']

    def get_queryset(self):
        return ConsultationRequest.objects.select_related('farmer', 'agronomist').all()

    def perform_update(self, serializer):
        """
        Handle updates to consultation requests, such as changing status.
        """
        instance = self.get_object()
        if 'status' in self.request.data:
            instance.status = self.request.data['status']
        instance.save()
        serializer.save()

class ConsultationRequestWithDetailsViewSet(ModelViewSet):
    serializer_class = ConsultationRequestSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'request_date', 'fee', 'farmer', 'agronomist']
    search_fields = ['farmer__name', 'agronomist__name', 'details']
    ordering_fields = ['request_date', 'fee']

    def get_queryset(self):
        """
        Return detailed consultation requests with related farmer and agronomist info.
        """
        return ConsultationRequest.objects.select_related('farmer', 'agronomist').all()

    def perform_update(self, serializer):
        """
        Handle updates to consultation requests with detailed data.
        """
        instance = self.get_object()
        if 'status' in self.request.data:
            instance.status = self.request.data['status']
        instance.save()
        serializer.save()
