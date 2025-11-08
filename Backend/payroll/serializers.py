from rest_framework import serializers
from .models import Payrun, Payslip, BonusPolicy


class PayrunSerializer(serializers.ModelSerializer):
    """Serializer for Payrun"""
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = Payrun
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'finalized_at']


class PayslipSerializer(serializers.ModelSerializer):
    """Serializer for Payslip"""
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    payrun_month = serializers.IntegerField(source='payrun.month', read_only=True)
    payrun_year = serializers.IntegerField(source='payrun.year', read_only=True)
    
    class Meta:
        model = Payslip
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'fingerprint', 'fingerprint_timestamp', 'verified']


class BonusPolicySerializer(serializers.ModelSerializer):
    """Serializer for Bonus Policy"""
    class Meta:
        model = BonusPolicy
        fields = '__all__'
