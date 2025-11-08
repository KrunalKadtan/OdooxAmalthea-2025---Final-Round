from django.db import models
from accounts.models import User
from datetime import datetime, timedelta

class Attendance(models.Model):
    STATUS_CHOICES = [
        ('Present', 'Present'),
        ('Absent', 'Absent'),
        ('Leave', 'Leave'),
        ('Half-Day', 'Half-Day'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField(auto_now_add=True)
    check_in = models.TimeField(null=True, blank=True)
    check_out = models.TimeField(null=True, blank=True)
    hours_worked = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Absent')
    notes = models.TextField(blank=True, null=True)
    
    class Meta:
        unique_together = ['user', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.status}"
    
    def calculate_hours(self):
        if self.check_in and self.check_out:
            check_in_dt = datetime.combine(datetime.today(), self.check_in)
            check_out_dt = datetime.combine(datetime.today(), self.check_out)
            if check_out_dt < check_in_dt:
                check_out_dt += timedelta(days=1)
            hours = (check_out_dt - check_in_dt).total_seconds() / 3600
            self.hours_worked = round(hours, 2)
            if hours >= 8:
                self.status = 'Present'
            elif hours >= 4:
                self.status = 'Half-Day'
            self.save()
