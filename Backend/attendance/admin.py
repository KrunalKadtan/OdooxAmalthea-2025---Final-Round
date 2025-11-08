"""
Admin configuration for attendance app
"""
from django.contrib import admin
from .models import Attendance, OvertimeRecord


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['employee', 'date', 'status', 'marked_at']
    list_filter = ['status', 'date']
    search_fields = ['employee__username', 'employee__first_name', 'employee__last_name']
    date_hierarchy = 'date'


@admin.register(OvertimeRecord)
class OvertimeRecordAdmin(admin.ModelAdmin):
    list_display = ['employee', 'date', 'hours_worked', 'verified']
    list_filter = ['verified', 'date']
    search_fields = ['employee__username', 'employee__first_name', 'employee__last_name']
    date_hierarchy = 'date'
