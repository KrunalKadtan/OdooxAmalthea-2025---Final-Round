from django.db import models
from django.db.models import Index
import uuid


class LeaveType(models.Model):
    """Define leave types and their policies"""
    name = models.CharField(max_length=50, unique=True)
    annual_allocation = models.IntegerField()
    is_carryforward_allowed = models.BooleanField(default=False)
    max_carryforward = models.IntegerField(default=0)
    description = models.TextField()
    
    class Meta:
        db_table = 'leaves_leave_type'
    
    def __str__(self):
        return self.name


class LeaveBalance(models.Model):
    """Track leave balances per employee per year
    Heavily cached for performance"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='leave_balances')
    year = models.IntegerField(db_index=True)
    
    # Leave balances
    casual_allocated = models.IntegerField(default=12)
    casual_used = models.IntegerField(default=0)
    casual_carryforward = models.IntegerField(default=0)
    
    sick_allocated = models.IntegerField(default=8)
    sick_used = models.IntegerField(default=0)
    
    personal_allocated = models.IntegerField(default=5)
    personal_used = models.IntegerField(default=0)
    
    earned_leave_allocated = models.IntegerField(default=5)
    earned_leave_used = models.IntegerField(default=0)
    
    # Computed fields (cache these)
    total_allocated = models.IntegerField(default=30)
    total_used = models.IntegerField(default=0)
    total_available = models.IntegerField(default=30)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'leaves_leave_balance'
        unique_together = ['employee', 'year']
        indexes = [
            Index(fields=['employee', 'year']),
        ]
    
    def __str__(self):
        return f"{self.employee.email} - {self.year}"
    
    def save(self, *args, **kwargs):
        """Auto-calculate totals"""
        self.total_allocated = (self.casual_allocated + self.sick_allocated + 
                                self.personal_allocated + self.earned_leave_allocated)
        self.total_used = (self.casual_used + self.sick_used + 
                           self.personal_used + self.earned_leave_used)
        self.total_available = self.total_allocated - self.total_used
        super().save(*args, **kwargs)


class LeaveRequest(models.Model):
    """Leave application with sentiment analysis
    Optimized for approval workflow"""
    
    LEAVE_TYPES = [
        ('casual', 'Casual Leave'),
        ('sick', 'Sick Leave'),
        ('personal', 'Personal Leave'),
        ('earned', 'Earned Leave'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='leave_requests')
    leave_type = models.CharField(max_length=20, choices=LEAVE_TYPES, db_index=True)
    start_date = models.DateField(db_index=True)
    end_date = models.DateField()
    number_of_days = models.IntegerField()
    reason = models.TextField()
    
    # Sentiment analysis (ML feature)
    sentiment_score = models.FloatField(default=0, help_text="Sentiment analysis of leave reason (-1 to 1)")
    sentiment_label = models.CharField(max_length=20, choices=[
        ('positive', 'Positive'),
        ('neutral', 'Neutral'),
        ('negative', 'Negative'),
    ], default='neutral')
    burnout_risk_detected = models.BooleanField(default=False)

    # Approval workflow
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, db_index=True)
    approved_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='leaves_approved')
    approval_date = models.DateTimeField(null=True, blank=True)
    approval_comments = models.TextField(blank=True)
    
    # Sync fields
    _id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    synced = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'leaves_leave_request'
        indexes = [
            Index(fields=['employee', 'status']),
            Index(fields=['employee', '-start_date']),
            Index(fields=['status', 'created_at']),
            Index(fields=['burnout_risk_detected']),  # For HR alerts
        ]
    
    def __str__(self):
        return f"{self.employee.email} - {self.leave_type} ({self.start_date})"
    
    def save(self, *args, **kwargs):
        """Calculate leave duration"""
        if self.end_date and self.start_date:
            self.number_of_days = (self.end_date - self.start_date).days + 1
        super().save(*args, **kwargs)
