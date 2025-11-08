"""
Admin configuration for leaves app
"""
from django.contrib import admin
from .models import LeaveRequest, LeaveBalance, LeaveTemplate


@admin.register(LeaveRequest)
class LeaveRequestAdmin(admin.ModelAdmin):
    list_display = ['employee', 'leave_type', 'start_date', 'end_date', 'status', 'sentiment_score', 'burnout_risk']
    list_filter = ['status', 'leave_type', 'burnout_risk']
    search_fields = ['employee__username', 'employee__first_name', 'employee__last_name']
    date_hierarchy = 'start_date'


@admin.register(LeaveBalance)
class LeaveBalanceAdmin(admin.ModelAdmin):
    list_display = ['employee', 'year', 'casual_remaining', 'sick_remaining', 'comp_off_balance']
    list_filter = ['year']
    search_fields = ['employee__username', 'employee__first_name', 'employee__last_name']


@admin.register(LeaveTemplate)
class LeaveTemplateAdmin(admin.ModelAdmin):
    list_display = ['leave_type', 'template_text']
