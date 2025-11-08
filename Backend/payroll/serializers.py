"""
Serializers for Payroll Management
"""
from rest_framework import serializers
from .models import Payslip, BonusCalculation


class PayslipSerializer(serializers.ModelSerializer):
    """Serializer for Payslip"""
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    
    class Meta:
        model = Payslip
        fields = [
            'id', 'employee', 'employee_name', 'month', 'year',
            'basic_salary', 'hra', 'da', 'gross_salary',
            'pf_deduction', 'professional_tax', 'total_deductions',
            'net_salary', 'days_worked', 'status', 'digital_signature',
            'created_at', '_id'
        ]
        read_only_fields = ['id', 'digital_signature', '_id']


class BonusCalculationSerializer(serializers.ModelSerializer):
    """Serializer for Bonus Calculation"""
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    
    class Meta:
        model = BonusCalculation
        fields = ['id', 'employee', 'employee_name', 'month', 'year', 'bonus_type', 'amount', 'reason', 'created_at']
        read_only_fields = ['id']
