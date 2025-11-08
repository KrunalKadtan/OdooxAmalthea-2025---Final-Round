from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EmployeeSentimentViewSet, AttritionRiskViewSet,
    EmployeeAwardViewSet, AttendancePredictionViewSet
)

router = DefaultRouter()
router.register(r'sentiment', EmployeeSentimentViewSet, basename='sentiment')
router.register(r'attrition', AttritionRiskViewSet, basename='attrition')
router.register(r'awards', EmployeeAwardViewSet, basename='award')
router.register(r'predictions', AttendancePredictionViewSet, basename='prediction')

urlpatterns = [
    path('', include(router.urls)),
]
