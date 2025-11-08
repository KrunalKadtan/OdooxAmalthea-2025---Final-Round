from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import EmployeeSentiment, AttritionRisk, EmployeeAward, AttendancePrediction
from .serializers import (
    EmployeeSentimentSerializer, AttritionRiskSerializer,
    EmployeeAwardSerializer, AttendancePredictionSerializer
)


class EmployeeSentimentViewSet(viewsets.ModelViewSet):
    """ViewSet for Employee Sentiment operations"""
    queryset = EmployeeSentiment.objects.all()
    serializer_class = EmployeeSentimentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = EmployeeSentiment.objects.select_related('employee')
        user = self.request.user
        
        if user.role == 'employee':
            queryset = queryset.filter(employee=user)
        
        return queryset.order_by('-year', '-month')


class AttritionRiskViewSet(viewsets.ModelViewSet):
    """ViewSet for Attrition Risk operations"""
    queryset = AttritionRisk.objects.all()
    serializer_class = AttritionRiskSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = AttritionRisk.objects.select_related('employee')
        user = self.request.user
        
        if user.role not in ['admin', 'hr_officer']:
            queryset = queryset.filter(employee=user)
        
        return queryset.order_by('-calculated_at')


class EmployeeAwardViewSet(viewsets.ModelViewSet):
    """ViewSet for Employee Award operations"""
    queryset = EmployeeAward.objects.all()
    serializer_class = EmployeeAwardSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = EmployeeAward.objects.select_related('employee', 'awarded_by')
        return queryset.order_by('-year', '-month')


class AttendancePredictionViewSet(viewsets.ModelViewSet):
    """ViewSet for Attendance Prediction operations"""
    queryset = AttendancePrediction.objects.all()
    serializer_class = AttendancePredictionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = AttendancePrediction.objects.select_related('employee')
        return queryset.order_by('-date')
