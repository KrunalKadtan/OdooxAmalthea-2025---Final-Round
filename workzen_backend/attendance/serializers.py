from rest_framework import serializers
from .models import Attendance

class AttendanceSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Attendance
        fields = ['id', 'user', 'user_name', 'date', 'check_in', 'check_out', 
                  'hours_worked', 'status', 'notes']
        read_only_fields = ['id', 'date', 'hours_worked']
