from rest_framework import serializers
from .models import EmployeeSentiment, AttritionRisk, EmployeeAward, AttendancePrediction


class EmployeeSentimentSerializer(serializers.ModelSerializer):
    """Serializer for Employee Sentiment"""
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    
    class Meta:
        model = EmployeeSentiment
        fields = '__all__'
        read_only_fields = ['created_at']


class AttritionRiskSerializer(serializers.ModelSerializer):
    """Serializer for Attrition Risk"""
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    
    class Meta:
        model = AttritionRisk
        fields = '__all__'
        read_only_fields = ['calculated_at']


class EmployeeAwardSerializer(serializers.ModelSerializer):
    """Serializer for Employee Award"""
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    awarded_by_name = serializers.CharField(source='awarded_by.get_full_name', read_only=True)
    
    class Meta:
        model = EmployeeAward
        fields = '__all__'
        read_only_fields = ['created_at']


class AttendancePredictionSerializer(serializers.ModelSerializer):
    """Serializer for Attendance Prediction"""
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    
    class Meta:
        model = AttendancePrediction
        fields = '__all__'
        read_only_fields = ['created_at']
