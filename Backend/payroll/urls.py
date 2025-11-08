from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PayrunViewSet, PayslipViewSet, BonusPolicyViewSet

router = DefaultRouter()
router.register(r'payruns', PayrunViewSet, basename='payrun')
router.register(r'payslips', PayslipViewSet, basename='payslip')
router.register(r'bonus-policies', BonusPolicyViewSet, basename='bonus-policy')

urlpatterns = [
    path('', include(router.urls)),
]
