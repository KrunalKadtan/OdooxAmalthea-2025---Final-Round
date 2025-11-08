from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SyncLogViewSet, DocumentFingerprintViewSet

router = DefaultRouter()
router.register(r'logs', SyncLogViewSet, basename='sync-log')
router.register(r'fingerprints', DocumentFingerprintViewSet, basename='fingerprint')

urlpatterns = [
    path('', include(router.urls)),
]
