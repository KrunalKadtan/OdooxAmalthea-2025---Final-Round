"""
Admin configuration for analytics app
"""
from django.contrib import admin
from .models import EmployeeSentiment, AttritionRisk, EmployeeAward


@admin.register(EmployeeSentiment)
class EmployeeSentimentAdmin(admin.ModelAdmin):
    list_display = ['employee', 'date', 'sentiment_score', 'burnout_risk', 'source']
    list_filter = ['burnout_risk', 'source', 'date']
    search_fields = ['employee__username']


@admin.register(AttritionRisk)
class AttritionRiskAdmin(admin.ModelAdmin):
    list_display = ['employee', 'risk_score', 'calculated_at']
    list_filter = ['calculated_at']
    search_fields = ['employee__username']


@admin.register(EmployeeAward)
class EmployeeAwardAdmin(admin.ModelAdmin):
    list_display = ['employee', 'award_type', 'month', 'year']
    list_filter = ['award_type', 'year']
    search_fields = ['employee__username']
