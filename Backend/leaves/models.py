"""
Leave Management Models
"""
from django.db import models
from accounts.models import User
from django.utils import timezone
import uuid


class LeaveRequest(models.Model):
    """Leave request with sentiment analysis"""
    
    LEAVE_TYPE_CHOICES = [
        ('casual', 'Casual Leave'),
        ('sick', 'Sick Leave'),
        ('personal', 'Personal Leave'),
        ('earned', 'Earned Leave'),
        ('comp_off', 'Compensatory Off'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='leave_requests')
    leave_type = models.CharField(max_length=20, choices=LEAVE_TYPE_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_leaves')
    sentiment_score = models.FloatField(default=0.0)  # ML FEATURE
    burnout_risk = models.BooleanField(default=False)  # ML FEATURE
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    _id = models.CharField(max_length=100, unique=True, blank=True)
    
    class Meta:
        db_table = 'leave_requests'
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self._id:
            self._id = f"leave_{uuid.uuid4().hex[:12]}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.employee.username} - {self.leave_type} - {self.status}"
    
    @property
    def days_count(self):
        """Calculate number of leave days"""
        return (self.end_date - self.start_date).days + 1


class LeaveBalance(models.Model):
    """Leave balance for each employee"""
    
    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='leave_balances')
    year = models.IntegerField(default=timezone.now().year)
    
    casual_allocated = models.IntegerField(default=12)
    casual_used = models.IntegerField(default=0)
    
    sick_allocated = models.IntegerField(default=8)
    sick_used = models.IntegerField(default=0)
    
    personal_allocated = models.IntegerField(default=5)
    personal_used = models.IntegerField(default=0)
    
    earned_leave_allocated = models.IntegerField(default=5)
    earned_leave_used = models.IntegerField(default=0)
    
    comp_off_balance = models.DecimalField(max_digits=5, decimal_places=2, default=0)  # From overtime
    
    class Meta:
        db_table = 'leave_balances'
        unique_together = ['employee', 'year']
        ordering = ['-year']
    
    def __str__(self):
        return f"{self.employee.username} - {self.year}"
    
    @property
    def casual_remaining(self):
        return self.casual_allocated - self.casual_used
    
    @property
    def sick_remaining(self):
        return self.sick_allocated - self.sick_used
    
    @property
    def personal_remaining(self):
        return self.personal_allocated - self.personal_used
    
    @property
    def earned_leave_remaining(self):
        return self.earned_leave_allocated - self.earned_leave_used


class LeaveTemplate(models.Model):
    """Leave application templates"""
    
    leave_type = models.CharField(max_length=20)
    template_text = models.TextField()
    required_fields = models.JSONField(default=list)
    
    class Meta:
        db_table = 'leave_templates'
    
    def __str__(self):
        return f"Template - {self.leave_type}"
