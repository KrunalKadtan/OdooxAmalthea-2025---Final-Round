"""
Admin configuration for accounts app
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'designation', 'department']
    list_filter = ['role', 'department', 'is_staff', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('HRMS Information', {
            'fields': ('role', 'designation', 'department', 'phone_number', 'date_of_birth', 'basic_salary', 'password_changed_on_first_login', '_id')
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('HRMS Information', {
            'fields': ('role', 'designation', 'department', 'phone_number', 'date_of_birth', 'basic_salary')
        }),
    )
