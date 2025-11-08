"""
Attendance Management Models
"""
from django.db import models
from accounts.models import User
from django.utils import timezone
import uuid


class Attendance(models.Model):
    """Attendance record for employees"""
    
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('leave', 'Leave'),
        ('half-day', 'Half Day'),
    ]
    
    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField(default=timezone.now)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='present')
    marked_at = models.DateTimeField(auto_now_add=True)
    timestamp = models.DateTimeField(auto_now=True)
    _id = models.CharField(max_length=100, unique=True, blank=True)
    
    class Meta:
        db_table = 'attendance'
        unique_together = ['employee', 'date']
        ordering = ['-date']
    
    def save(self, *args, **kwargs):
        if not self._id:
            self._id = f"attendance_{uuid.uuid4().hex[:12]}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.employee.username} - {self.date} - {self.status}"


class OvertimeRecord(models.Model):
    """Overtime record with face verification"""
    
    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='overtime_records')
    date = models.DateField(default=timezone.now)
    start_time = models.TimeField()
    end_time = models.TimeField()
    hours_worked = models.DecimalField(max_digits=5, decimal_places=2)
    face_image = models.ImageField(upload_to='overtime_proofs/', null=True, blank=True)
    image_timestamp = models.DateTimeField(auto_now_add=True)
    verified = models.BooleanField(default=False)
    _id = models.CharField(max_length=100, unique=True, blank=True)
    
    class Meta:
        db_table = 'overtime_records'
        ordering = ['-date']
    
    def save(self, *args, **kwargs):
        if not self._id:
            self._id = f"overtime_{uuid.uuid4().hex[:12]}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.employee.username} - {self.date} - {self.hours_worked}hrs"
