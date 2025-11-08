from rest_framework import serializers
from .models import Payrun

class PayrunSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Payrun
        fields = ['id', 'user', 'user_name', 'month', 'year', 'basic_salary',
                  'present_days', 'absent_days', 'gross_pay', 'deductions', 'net_pay']
        read_only_fields = ['id', 'generated_at']
