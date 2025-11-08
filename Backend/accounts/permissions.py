"""
Custom permissions for role-based access control
"""
from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """Permission for Admin role only"""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'


class IsHROrAdmin(permissions.BasePermission):
    """Permission for HR Officer or Admin"""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ['hr_officer', 'admin']


class IsPayrollOrAdmin(permissions.BasePermission):
    """Permission for Payroll Officer or Admin"""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ['payroll_officer', 'admin']


class IsHROrPayrollOrAdmin(permissions.BasePermission):
    """Permission for HR, Payroll, or Admin"""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ['hr_officer', 'payroll_officer', 'admin']


class IsOwnerOrAdmin(permissions.BasePermission):
    """Permission for resource owner or Admin"""
    
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        return obj.employee == request.user or obj == request.user
