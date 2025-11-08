"""
Serializers for Analytics
"""
from rest_framework import serializers
from .models import EmployeeSentiment, AttritionRisk, EmployeeAward


class EmployeeSentimentSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    
    class Meta:
        model = EmployeeSentiment
        fields = ['id', 'employee', 'employee_name', 'date', 'sentiment_score', 'burnout_risk', 'source']


class AttritionRiskSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    risk_level = serializers.SerializerMethodField()
    
    class Meta:
        model = AttritionRisk
        fields = ['id', 'employee', 'employee_name', 'risk_score', 'risk_level', 'factors', 'recommendation', 'calculated_at']
    
    def get_risk_level(self, obj):
        if obj.risk_score > 0.7:
            return 'high'
        elif obj.risk_score > 0.4:
            return 'medium'
        return 'low'


class EmployeeAwardSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    
    class Meta:
        model = EmployeeAward
        fields = ['id', 'employee', 'employee_name', 'award_type', 'month', 'year', 'reason', 'created_at']
