from rest_framework.routers import DefaultRouter
from .views import StorageOwnerGigsWithDetailsViewSet, StorageOwnerViewSet, StorageOwnerGigsViewSet, StorageDealsViewSet

router = DefaultRouter()
router.register(r'storage-owners', StorageOwnerViewSet, basename='storage-owners')
router.register(r'storage-gigs', StorageOwnerGigsViewSet, basename='storage-gigs')
router.register(r'storage-deals', StorageDealsViewSet, basename='storage-deals')
router.register(r'storage-gigs-details', StorageOwnerGigsWithDetailsViewSet, basename='storage-gigs-details')
router.register(r'storage-deals-details', StorageDealsViewSet, basename='storage-deals-details')


urlpatterns = router.urls
