from rest_framework import serializers
from .models import LeaveType, LeaveBalance, LeaveRequest


class LeaveTypeSerializer(serializers.ModelSerializer):
    """Serializer for Leave Type"""
    class Meta:
        model = LeaveType
        fields = '__all__'


class LeaveBalanceSerializer(serializers.ModelSerializer):
    """Serializer for Leave Balance"""
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    
    class Meta:
        model = LeaveBalance
        fields = '__all__'
        read_only_fields = ['id', 'total_allocated', 'total_used', 'total_available', 'created_at', 'updated_at']


class LeaveRequestSerializer(serializers.ModelSerializer):
    """Serializer for Leave Request"""
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True)
    
    class Meta:
        model = LeaveRequest
        fields = '__all__'
        read_only_fields = [
            'id', 'number_of_days', 'sentiment_score', 'sentiment_label',
            'burnout_risk_detected', 'created_at', 'updated_at'
        ]


class LeaveRequestCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating leave requests"""
    class Meta:
        model = LeaveRequest
        fields = [
            'employee', 'leave_type', 'start_date', 'end_date',
            'reason', '_id', 'synced'
        ]
