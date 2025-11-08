# accounts/utils.py

from .models import AuditLog

def log_action(user, action, details, ip_address=None):
    """Helper function to log user actions"""
    AuditLog.objects.create(
        user=user,
        action=action,
        details=details,
        ip_address=ip_address
    )
