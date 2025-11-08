"""
Serializers for Leave Management
"""
from rest_framework import serializers
from .models import LeaveRequest, LeaveBalance, LeaveTemplate


class LeaveRequestSerializer(serializers.ModelSerializer):
    """Serializer for Leave Request"""
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    days_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = LeaveRequest
        fields = [
            'id', 'employee', 'employee_name', 'leave_type', 'start_date', 'end_date',
            'reason', 'status', 'approved_by', 'sentiment_score', 'burnout_risk',
            'days_count', 'created_at', 'updated_at', '_id'
        ]
        read_only_fields = ['id', 'employee', 'status', 'approved_by', 'sentiment_score', 'burnout_risk', '_id']
    
    def validate(self, attrs):
        """Validate leave request dates"""
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')
        
        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError("End date must be after start date")
        
        return attrs


class LeaveBalanceSerializer(serializers.ModelSerializer):
    """Serializer for Leave Balance"""
    casual_remaining = serializers.IntegerField(read_only=True)
    sick_remaining = serializers.IntegerField(read_only=True)
    personal_remaining = serializers.IntegerField(read_only=True)
    earned_leave_remaining = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = LeaveBalance
        fields = [
            'id', 'employee', 'year',
            'casual_allocated', 'casual_used', 'casual_remaining',
            'sick_allocated', 'sick_used', 'sick_remaining',
            'personal_allocated', 'personal_used', 'personal_remaining',
            'earned_leave_allocated', 'earned_leave_used', 'earned_leave_remaining',
            'comp_off_balance'
        ]
        read_only_fields = ['id', 'employee']


class LeaveTemplateSerializer(serializers.ModelSerializer):
    """Serializer for Leave Template"""
    
    class Meta:
        model = LeaveTemplate
        fields = ['id', 'leave_type', 'template_text', 'required_fields']
