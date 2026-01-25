from .models import RentOwner, RentItems, RentItemOrders
from .serializers import RentItemsWithUserSerializer, RentOwnerSerializer, RentItemsSerializer, RentItemOrdersSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from users.models import UserInfo

class RentOwnerViewSet(ModelViewSet):
    serializer_class = RentOwnerSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user']
    permission_classes = [AllowAny]

    def get_queryset(self):
        return RentOwner.objects.all()
    
    def perform_create(self, serializer):
        """Associate rent owner with the user from request data or current user"""
        # Use user from request data if provided, otherwise use authenticated user
        user_id = self.request.data.get('user')
        if user_id:
            try:
                user = UserInfo.objects.get(id=user_id)
                serializer.save(user=user)
            except UserInfo.DoesNotExist:
                serializer.save(user=None)
        elif self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save(user=None)


class RentItemsViewSet(ModelViewSet):
    serializer_class = RentItemsSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_available','product_name','price', 'rent_owner']
    search_fields = ['rent_owner__name', 'product_name', 'description']
    ordering_fields = ['price']
    permission_classes = [AllowAny]

    def get_queryset(self):
        return RentItems.objects.select_related('rent_owner').all()

    def perform_create(self, serializer):
        """
        Customize the creation of rent items.
        If rent_owner is provided in request, use it directly (for unauthenticated requests).
        Otherwise, associate with the rent owner of the current user.
        """
        # If rent_owner is provided in the request data, save it directly
        if 'rent_owner' in self.request.data:
            serializer.save()
        # Otherwise, try to get rent owner from authenticated user
        elif self.request.user.is_authenticated:
            try:
                rent_owner = RentOwner.objects.get(user=self.request.user)
                serializer.save(rent_owner=rent_owner)
            except RentOwner.DoesNotExist:
                return Response(
                    {"detail": "You need to create a RentOwner profile first"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            return Response(
                {"detail": "rent_owner field is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

    def perform_update(self, serializer):
        """
        Handle updates to rent items.
        """
        instance = self.get_object()
        if 'is_available' in self.request.data:
            instance.is_available = self.request.data['is_available']
        instance.save()
        serializer.save()
class RentItemsWithUserViewSet(ModelViewSet):
    serializer_class = RentItemsWithUserSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_available', 'product_name', 'price','rent_owner']
    search_fields = ['rent_owner__name', 'product_name', 'description']
    ordering_fields = ['price']
    permission_classes = [AllowAny]

    def get_queryset(self):
        """
        Return all rent items along with their related rent owners.
        """
        return RentItems.objects.select_related('rent_owner').all()

    def perform_create(self, serializer):
        """
        Customize the creation of rent items with user details.
        If rent_owner is provided in request, use it directly.
        """
        if 'rent_owner' in self.request.data:
            serializer.save()
        else:
            return Response(
                {"detail": "rent_owner field is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

    def perform_update(self, serializer):
        """
        Handle updates to rent items.
        """
        instance = self.get_object()
        if 'is_available' in self.request.data:
            instance.is_available = self.request.data['is_available']
        instance.save()
        serializer.save()

class RentItemOrdersViewSet(ModelViewSet):
    serializer_class = RentItemOrdersSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_confirmed', 'is_ready_for_pickup','rent_owner', 'rent_taker']
    search_fields = ['rent_owner__name', 'title', 'description']
    ordering_fields = ['price', 'order_date']
    permission_classes = [AllowAny]

    def get_queryset(self):
        user = self.request.user
        # Rent owners see orders for their items
        # Farmers see their rental orders
        return RentItemOrders.objects.select_related('rent_owner', 'rent_taker').all()

    def perform_create(self, serializer):
        """
        Create rental order - sets the user as rent_taker if provided in request
        """
        if 'rent_taker' in self.request.data:
            serializer.save()
        else:
            user = self.request.user if self.request.user.is_authenticated else None
            serializer.save(rent_taker=user)

    def perform_update(self, serializer):
        """
        Handle updates for confirmation and readiness.
        Only allow status updates
        """
        instance = self.get_object()
        if 'is_confirmed' in self.request.data:
            instance.is_confirmed = self.request.data['is_confirmed']
        if 'is_ready_for_pickup' in self.request.data:
            instance.is_ready_for_pickup = self.request.data['is_ready_for_pickup']
        instance.save()
        serializer.save()
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def my_rentals(self, request):
        """
        Get rental orders for the current user (as a farmer/rent_taker)
        """
        if request.user.is_authenticated:
            orders = self.get_queryset().filter(rent_taker=request.user)
        else:
            orders = self.get_queryset()
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def my_posted_orders(self, request):
        """
        Get rental orders for the current user's posted items (as a rent owner)
        """
        if request.user.is_authenticated:
            try:
                rent_owner = RentOwner.objects.get(user=request.user)
                orders = self.get_queryset().filter(rent_owner=rent_owner)
                serializer = self.get_serializer(orders, many=True)
                return Response(serializer.data)
            except RentOwner.DoesNotExist:
                orders = self.get_queryset()
                serializer = self.get_serializer(orders, many=True)
                return Response(serializer.data)
        else:
            orders = self.get_queryset()
            serializer = self.get_serializer(orders, many=True)
            return Response(serializer.data)