from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import Index
import uuid


class User(AbstractUser):
    """Extended User model with role-based access and additional fields
    Optimized for quick profile lookups and role-based filtering"""
    
    ROLE_CHOICES = [
        ('admin', 'Admin - Full System Access'),
        ('employee', 'Employee - Limited Access'),
        ('hr_officer', 'HR Officer - HR Management'),
        ('payroll_officer', 'Payroll Officer - Payroll Management'),
    ]
    
    # Core fields
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, db_index=True)
    
    # Profile fields
    designation = models.CharField(max_length=100, db_index=True)
    department = models.CharField(max_length=100, db_index=True)
    phone_number = models.CharField(max_length=15, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    
    # Salary fields
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    hra_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=40)
    da_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=50)
    
    # Account status
    is_first_login = models.BooleanField(default=True)
    password_changed_on_first_login = models.BooleanField(default=False)
    last_password_change = models.DateTimeField(null=True, blank=True)
    failed_login_attempts = models.IntegerField(default=0)
    account_locked_until = models.DateTimeField(null=True, blank=True)
    
    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    # Sync fields (for three-tier sync)
    _id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    synced = models.BooleanField(default=False)
    synced_at = models.DateTimeField(null=True, blank=True)
    synced_to = models.JSONField(default=dict)  # {local: bool, postgres: bool, supabase: bool}
    
    class Meta:
        db_table = 'users_user'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        indexes = [
            Index(fields=['email']),
            Index(fields=['role']),
            Index(fields=['designation']),
            Index(fields=['department']),
            Index(fields=['is_active', 'role']),  # Composite index
        ]
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"
    
    @property
    def gross_salary(self):
        """Calculate gross salary"""
        hra = self.basic_salary * (self.hra_percentage / 100)
        da = self.basic_salary * (self.da_percentage / 100)
        return self.basic_salary + hra + da
    
    def can_access(self, resource, action):
        """Role-based access control"""
        permissions = {
            'admin': ['view_all', 'create_all', 'update_all', 'delete_all'],
            'employee': ['view_own', 'create_own', 'update_own'],
            'hr_officer': ['view_employees', 'update_employees', 'approve_leaves'],
            'payroll_officer': ['view_payroll', 'generate_payslips', 'approve_leaves'],
        }
        return action in permissions.get(self.role, [])


class LoginAudit(models.Model):
    """Track login attempts for security"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='login_audits')
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    success = models.BooleanField()
    reason_for_failure = models.CharField(max_length=255, null=True, blank=True)
    
    class Meta:
        db_table = 'users_login_audit'
        indexes = [
            Index(fields=['user', '-timestamp']),
        ]
