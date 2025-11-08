from rest_framework import serializers
from .models import Attendance, OvertimeRecord


class AttendanceSerializer(serializers.ModelSerializer):
    """Serializer for Attendance model"""
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    employee_email = serializers.EmailField(source='employee.email', read_only=True)
    
    class Meta:
        model = Attendance
        fields = '__all__'
        read_only_fields = ['id', 'marked_at', 'created_at', 'updated_at']


class AttendanceCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating attendance records"""
    class Meta:
        model = Attendance
        fields = [
            'employee', 'date', 'status', 'check_in_time',
            'check_out_time', 'is_overtime', 'overtime_hours',
            'notes', '_id', 'synced'
        ]


class OvertimeRecordSerializer(serializers.ModelSerializer):
    """Serializer for Overtime records"""
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    
    class Meta:
        model = OvertimeRecord
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'face_verified', 'verification_confidence']
