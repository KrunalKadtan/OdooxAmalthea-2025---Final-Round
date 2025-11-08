from django.db import models
from django.db.models import Index
import uuid


class Payrun(models.Model):
    """Monthly payroll cycle"""
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('processing', 'Processing'),
        ('finalized', 'Finalized'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    month = models.IntegerField(db_index=True)
    year = models.IntegerField(db_index=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, 
                                    limit_choices_to={'role': 'payroll_officer'})
    created_at = models.DateTimeField(auto_now_add=True)
    finalized_at = models.DateTimeField(null=True, blank=True)
    
    # Summary fields
    total_employees = models.IntegerField(default=0)
    total_gross_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_net_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    class Meta:
        db_table = 'payroll_payrun'
        unique_together = ['month', 'year']
        indexes = [
            Index(fields=['month', 'year']),
            Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"Payrun {self.month}/{self.year} - {self.status}"


class Payslip(models.Model):
    """Monthly payslip for each employee
    Optimized for PDF generation and archival"""
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('finalized', 'Finalized'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payrun = models.ForeignKey(Payrun, on_delete=models.CASCADE, related_name='payslips')
    employee = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='payslips')
    
    # Earnings
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2)
    hra = models.DecimalField(max_digits=10, decimal_places=2)
    da = models.DecimalField(max_digits=10, decimal_places=2)
    other_allowances = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    gross_salary = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Deductions
    pf_deduction = models.DecimalField(max_digits=10, decimal_places=2)
    professional_tax = models.DecimalField(max_digits=10, decimal_places=2)
    other_deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_deductions = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Net Salary
    net_salary = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Attendance
    working_days = models.IntegerField(default=26)
    days_worked = models.IntegerField()
    leaves_taken = models.IntegerField()
    
    # Bonus (if applicable)
    bonus_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Digital fingerprint
    fingerprint = models.CharField(max_length=64, unique=True, null=True)
    fingerprint_timestamp = models.DateTimeField(null=True, blank=True)
    verified = models.BooleanField(default=False)
    
    # Sync fields
    _id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    synced = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'payroll_payslip'
        unique_together = ['payrun', 'employee']
        indexes = [
            Index(fields=['employee', 'payrun']),
            Index(fields=['payrun']),
            Index(fields=['fingerprint']),
        ]
    
    def __str__(self):
        return f"Payslip {self.employee.email} {self.payrun.month}/{self.payrun.year}"


class BonusPolicy(models.Model):
    """Define bonus calculation policies"""
    name = models.CharField(max_length=100)
    percentage = models.DecimalField(max_digits=5, decimal_places=2)
    min_attendance = models.IntegerField(default=75)
    min_tenure_months = models.IntegerField(default=6)
    month_applicable = models.IntegerField(help_text="Month when bonus is paid (1-12)")
    
    class Meta:
        db_table = 'payroll_bonus_policy'
    
    def __str__(self):
        return self.name
