"""
Serializers for Attendance
"""
from rest_framework import serializers
from .models import Attendance, OvertimeRecord
from datetime import datetime, time


class AttendanceSerializer(serializers.ModelSerializer):
    """Serializer for Attendance model"""
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    
    class Meta:
        model = Attendance
        fields = ['id', 'employee', 'employee_name', 'date', 'status', 'marked_at', 'timestamp', '_id']
        read_only_fields = ['id', 'employee', 'marked_at', 'timestamp', '_id']


class OvertimeRecordSerializer(serializers.ModelSerializer):
    """Serializer for Overtime Record"""
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    comp_off_earned = serializers.SerializerMethodField()
    
    class Meta:
        model = OvertimeRecord
        fields = [
            'id', 'employee', 'employee_name', 'date', 'start_time', 'end_time',
            'hours_worked', 'face_image', 'image_timestamp', 'verified',
            'comp_off_earned', '_id'
        ]
        read_only_fields = ['id', 'employee', 'image_timestamp', 'verified', '_id']
    
    def get_comp_off_earned(self, obj):
        """Calculate comp-off days: 8 hours = 1 day"""
        return float(obj.hours_worked) / 8.0
    
    def validate(self, attrs):
        """Validate overtime record"""
        start_time = attrs.get('start_time')
        end_time = attrs.get('end_time')
        
        if start_time and end_time:
            # Calculate hours
            start_datetime = datetime.combine(datetime.today(), start_time)
            end_datetime = datetime.combine(datetime.today(), end_time)
            
            if end_datetime < start_datetime:
                # Handle overnight shifts
                end_datetime = datetime.combine(datetime.today(), end_time)
                end_datetime = end_datetime.replace(day=end_datetime.day + 1)
            
            hours = (end_datetime - start_datetime).total_seconds() / 3600
            attrs['hours_worked'] = round(hours, 2)
        
        return attrs
