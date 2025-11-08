from django.contrib import admin
from .models import Attendance

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['user', 'date', 'check_in', 'check_out', 'hours_worked', 'status']
    list_filter = ['status', 'date']
    search_fields = ['user__username', 'user__email']
    date_hierarchy = 'date'
