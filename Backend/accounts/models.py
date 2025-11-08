"""
User and Authentication Models
"""
from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid


class User(AbstractUser):
    """
    Custom User model with HRMS-specific fields
    """
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('employee', 'Employee'),
        ('hr_officer', 'HR Officer'),
        ('payroll_officer', 'Payroll Officer'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='employee')
    designation = models.CharField(max_length=100, blank=True)
    department = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    password_changed_on_first_login = models.BooleanField(default=False)
    _id = models.CharField(max_length=100, unique=True, blank=True)  # For sync with IndexedDB
    
    class Meta:
        db_table = 'users'
        ordering = ['id']
    
    def save(self, *args, **kwargs):
        if not self._id:
            self._id = f"user_{uuid.uuid4().hex[:12]}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"
