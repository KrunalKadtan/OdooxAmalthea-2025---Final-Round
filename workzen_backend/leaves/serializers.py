from rest_framework import serializers
from .models import Leave

class LeaveSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    total_days = serializers.ReadOnlyField()
    
    class Meta:
        model = Leave
        fields = ['id', 'user', 'user_name', 'leave_type', 'start_date', 'end_date',
                  'total_days', 'reason', 'status', 'applied_at']
        read_only_fields = ['id', 'user', 'status', 'applied_at']
