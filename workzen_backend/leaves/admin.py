from django.contrib import admin
from .models import Leave

@admin.register(Leave)
class LeaveAdmin(admin.ModelAdmin):
    list_display = ['user', 'leave_type', 'start_date', 'end_date', 'status', 'applied_at']
    list_filter = ['status', 'leave_type', 'applied_at']
    search_fields = ['user__username', 'reason']
    date_hierarchy = 'applied_at'
