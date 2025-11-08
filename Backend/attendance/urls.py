from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AttendanceViewSet, OvertimeRecordViewSet

router = DefaultRouter()
router.register(r'attendance', AttendanceViewSet, basename='attendance')
router.register(r'overtime', OvertimeRecordViewSet, basename='overtime')

urlpatterns = [
    path('', include(router.urls)),
]
