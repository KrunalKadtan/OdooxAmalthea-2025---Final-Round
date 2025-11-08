from django.db import models
from django.db.models import Index


class EmployeeSentiment(models.Model):
    """Track sentiment trends for burnout detection"""
    employee = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='sentiment_records')
    month = models.IntegerField(db_index=True)
    year = models.IntegerField(db_index=True)
    average_sentiment_score = models.FloatField()
    sentiment_trend = models.CharField(max_length=20, choices=[
        ('improving', 'Improving'),
        ('stable', 'Stable'),
        ('declining', 'Declining'),
    ])
    high_risk_keywords_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'analytics_employee_sentiment'
        unique_together = ['employee', 'month', 'year']
        indexes = [
            Index(fields=['employee', 'year']),
            Index(fields=['sentiment_trend']),
        ]


class AttritionRisk(models.Model):
    """ML model predictions for attrition risk"""
    
    RISK_LEVEL_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    employee = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='attrition_risks')
    risk_score = models.FloatField()  # 0-100
    risk_level = models.CharField(max_length=20, choices=RISK_LEVEL_CHOICES)
    
    # Contributing factors
    tenure_months = models.IntegerField()
    leaves_trend = models.CharField(max_length=20)  # increasing/stable/decreasing
    sentiment_score = models.FloatField()
    salary_percentile = models.IntegerField()
    recommendation = models.TextField()
    calculated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'analytics_attrition_risk'
        indexes = [
            Index(fields=['employee']),
            Index(fields=['risk_level']),
        ]


class EmployeeAward(models.Model):
    """Track awards and recognitions"""
    
    AWARD_TYPES = [
        ('month', 'Employee of the Month'),
        ('year', 'Employee of the Year'),
        ('team', 'Team Player Award'),
        ('attendance', 'Perfect Attendance'),
    ]
    
    employee = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='awards')
    award_type = models.CharField(max_length=20, choices=AWARD_TYPES)
    month = models.IntegerField(null=True, blank=True)
    year = models.IntegerField()
    reason = models.TextField()
    awarded_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, related_name='awards_given')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'analytics_employee_award'
        indexes = [
            Index(fields=['year', 'month']),
            Index(fields=['award_type']),
        ]


class AttendancePrediction(models.Model):
    """ML predictions for attendance"""
    employee = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='attendance_predictions')
    date = models.DateField(db_index=True)
    predicted_absent = models.BooleanField()
    confidence = models.FloatField()  # 0-1
    factors = models.JSONField()  # {day_of_week, sentiment, recent_leaves, etc}
    actual_status = models.CharField(max_length=20, null=True, blank=True)
    accuracy = models.BooleanField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'analytics_attendance_prediction'
        indexes = [
            Index(fields=['employee', 'date']),
        ]
