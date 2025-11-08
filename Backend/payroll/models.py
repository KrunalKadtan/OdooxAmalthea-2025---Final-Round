"""
Payroll Management Models
"""
from django.db import models
from accounts.models import User
from django.utils import timezone
import uuid
import hashlib


class Payslip(models.Model):
    """Payslip with digital signature"""
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('finalized', 'Finalized'),
    ]
    
    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payslips')
    month = models.IntegerField()
    year = models.IntegerField()
    
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2)
    hra = models.DecimalField(max_digits=10, decimal_places=2)  # House Rent Allowance
    da = models.DecimalField(max_digits=10, decimal_places=2)  # Dearness Allowance
    gross_salary = models.DecimalField(max_digits=10, decimal_places=2)
    
    pf_deduction = models.DecimalField(max_digits=10, decimal_places=2)  # 12% of basic
    professional_tax = models.DecimalField(max_digits=10, decimal_places=2, default=200)
    total_deductions = models.DecimalField(max_digits=10, decimal_places=2)
    net_salary = models.DecimalField(max_digits=10, decimal_places=2)
    
    days_worked = models.IntegerField(default=26)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    digital_signature = models.CharField(max_length=64, blank=True)  # SHA-256 hash
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    _id = models.CharField(max_length=100, unique=True, blank=True)
    
    class Meta:
        db_table = 'payslips'
        unique_together = ['employee', 'month', 'year']
        ordering = ['-year', '-month']
    
    def save(self, *args, **kwargs):
        if not self._id:
            self._id = f"payslip_{uuid.uuid4().hex[:12]}"
        
        # Generate digital signature
        if not self.digital_signature:
            data = f"{self.employee.id}{self.month}{self.year}{self.net_salary}"
            self.digital_signature = hashlib.sha256(data.encode()).hexdigest()
        
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.employee.username} - {self.month}/{self.year}"


class BonusCalculation(models.Model):
    """Bonus calculations"""
    
    BONUS_TYPE_CHOICES = [
        ('performance', 'Performance Bonus'),
        ('festival', 'Festival Bonus'),
        ('referral', 'Referral Bonus'),
        ('annual', 'Annual Bonus'),
    ]
    
    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bonuses')
    month = models.IntegerField()
    year = models.IntegerField()
    bonus_type = models.CharField(max_length=20, choices=BONUS_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'bonus_calculations'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.employee.username} - {self.bonus_type} - ₹{self.amount}"
