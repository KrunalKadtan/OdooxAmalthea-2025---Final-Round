"""
Analytics and ML Models
"""
from django.db import models
from accounts.models import User
from django.utils import timezone


class EmployeeSentiment(models.Model):
    """Track employee sentiment over time"""
    
    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sentiments')
    date = models.DateField(default=timezone.now)
    sentiment_score = models.FloatField()  # -1 to 1
    burnout_risk = models.BooleanField(default=False)
    source = models.CharField(max_length=50)  # leave_reason, feedback, etc.
    
    class Meta:
        db_table = 'employee_sentiments'
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.employee.username} - {self.date} - {self.sentiment_score}"


class AttritionRisk(models.Model):
    """Attrition risk prediction"""
    
    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attrition_risks')
    risk_score = models.FloatField()  # 0-1
    factors = models.JSONField(default=dict)  # Contributing factors
    recommendation = models.TextField()
    calculated_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'attrition_risks'
        ordering = ['-calculated_at']
    
    def __str__(self):
        return f"{self.employee.username} - Risk: {self.risk_score}"


class EmployeeAward(models.Model):
    """Employee awards and recognition"""
    
    AWARD_TYPE_CHOICES = [
        ('month', 'Employee of the Month'),
        ('year', 'Employee of the Year'),
        ('attendance', 'Best Attendance'),
        ('team', 'Team Player'),
    ]
    
    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='awards')
    award_type = models.CharField(max_length=20, choices=AWARD_TYPE_CHOICES)
    month = models.IntegerField(null=True, blank=True)
    year = models.IntegerField()
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'employee_awards'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.employee.username} - {self.award_type}"
