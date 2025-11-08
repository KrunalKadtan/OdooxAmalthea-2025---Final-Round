from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'role', 'department', 'status', 'join_date']
    list_filter = ['role', 'status', 'department']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    readonly_fields = ['join_date', 'date_joined']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Employee Information', {
            'fields': ('role', 'department', 'designation', 'salary', 'phone', 'status', 'join_date')
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Employee Information', {
            'fields': ('role', 'department', 'designation', 'salary', 'phone', 'status')
        }),
    )
