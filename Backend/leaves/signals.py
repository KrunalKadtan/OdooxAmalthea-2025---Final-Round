from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from .models import LeaveRequest
from .ml_utils import analyze_sentiment


@receiver(pre_save, sender=LeaveRequest)
def analyze_leave_sentiment(sender, instance, **kwargs):
    """
    Automatically analyze sentiment when leave request is created/updated
    """
    if instance.reason:
        score, label, burnout_risk = analyze_sentiment(instance.reason)
        instance.sentiment_score = score
        instance.sentiment_label = label
        instance.burnout_risk_detected = burnout_risk


@receiver(post_save, sender=LeaveRequest)
def update_leave_balance_on_approval(sender, instance, created, **kwargs):
    """
    Update leave balance when leave is approved
    This is handled in the view, but kept here as backup
    """
    pass
