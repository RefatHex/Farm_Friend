from rest_framework.routers import DefaultRouter
from .views import AgronomistViewSet, ConsultationRequestViewSet, ConsultationRequestWithDetailsViewSet

router = DefaultRouter()

# Registering Agronomist viewset with filtering by fee range
router.register(r'agronomists', AgronomistViewSet, basename='agronomist')

# Registering ConsultationRequest viewsets
router.register(r'consultation-requests', ConsultationRequestViewSet, basename='consultation-request')
router.register(r'consultation-requests-details', ConsultationRequestWithDetailsViewSet, basename='consultation-request-details')

urlpatterns = router.urls
