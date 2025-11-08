"""
Admin configuration for payroll app
"""
from django.contrib import admin
from .models import Payslip, BonusCalculation


@admin.register(Payslip)
class PayslipAdmin(admin.ModelAdmin):
    list_display = ['employee', 'month', 'year', 'net_salary', 'status']
    list_filter = ['status', 'year', 'month']
    search_fields = ['employee__username', 'employee__first_name', 'employee__last_name']


@admin.register(BonusCalculation)
class BonusCalculationAdmin(admin.ModelAdmin):
    list_display = ['employee', 'bonus_type', 'amount', 'month', 'year']
    list_filter = ['bonus_type', 'year', 'month']
    search_fields = ['employee__username', 'employee__first_name', 'employee__last_name']
