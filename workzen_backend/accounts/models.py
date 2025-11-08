from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('Admin', 'Admin'),
        ('HR', 'HR Officer'),
        ('Employee', 'Employee'),
        ('Payroll', 'Payroll Officer'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Employee')
    department = models.CharField(max_length=100, blank=True, null=True)
    designation = models.CharField(max_length=100, blank=True, null=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    join_date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, default='Active')
    
    class Meta:
        ordering = ['-date_joined']
    
    def __str__(self):
        return f"{self.username} ({self.role})"
