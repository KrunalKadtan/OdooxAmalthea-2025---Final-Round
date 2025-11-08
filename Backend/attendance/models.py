from django.db import models
from django.db.models import Index
import uuid


class Attendance(models.Model):
    """Daily attendance tracking with optimized queries
    Partitioned by year for large datasets"""
    
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('leave', 'Leave'),
        ('half-day', 'Half Day'),
        ('work-from-home', 'Work From Home'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='attendance_records', db_index=True)
    date = models.DateField(db_index=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    check_in_time = models.TimeField(null=True, blank=True)
    check_out_time = models.TimeField(null=True, blank=True)
    
    # For overtime tracking
    is_overtime = models.BooleanField(default=False)
    overtime_hours = models.DecimalField(max_digits=4, decimal_places=2, default=0)
    overtime_approved = models.BooleanField(default=False)
    
    # Audit
    marked_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, related_name='attendance_marked',
                                   limit_choices_to={'role__in': ['admin', 'hr_officer']})
    marked_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    
    # Sync fields
    _id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    synced = models.BooleanField(default=False)
    synced_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'attendance_attendance'
        unique_together = ['employee', 'date']  # One entry per employee per day
        indexes = [
            Index(fields=['employee', 'date']),
            Index(fields=['date']),
            Index(fields=['employee', '-date']),
            Index(fields=['status', 'date']),
        ]
        verbose_name = 'Attendance'
        verbose_name_plural = 'Attendance Records'
    
    def __str__(self):
        return f"{self.employee.email} - {self.date} ({self.status})"


class OvertimeRecord(models.Model):
    """Track overtime hours with face verification"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='overtime_records')
    date = models.DateField(db_index=True)
    start_time = models.TimeField()
    end_time = models.TimeField()
    hours_worked = models.DecimalField(max_digits=4, decimal_places=2)
    
    # Face verification (image upload disabled - can be enabled by installing Pillow)
    # face_image = models.ImageField(upload_to='overtime_proofs/%Y/%m/%d/', null=True, blank=True)
    image_timestamp = models.DateTimeField(null=True, blank=True)
    face_verified = models.BooleanField(default=False)
    verification_confidence = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    
    # Compensation
    comp_off_hours = models.DecimalField(max_digits=4, decimal_places=2, default=0)
    comp_off_claimed_on = models.DateField(null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending Verification'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    ], default='pending')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'attendance_overtime'
        indexes = [
            Index(fields=['employee', 'date']),
            Index(fields=['status', 'date']),
        ]
