"""
Machine Learning utilities for sentiment analysis and burnout detection
"""
from textblob import TextBlob


def analyze_sentiment(text):
    """
    Analyze sentiment of leave reason text
    Returns: (score, label, burnout_risk)
    """
    if not text:
        return 0.0, 'neutral', False
    
    # Perform sentiment analysis
    blob = TextBlob(text)
    sentiment_score = blob.sentiment.polarity  # -1 to 1
    
    # Determine sentiment label
    if sentiment_score > 0.1:
        sentiment_label = 'positive'
    elif sentiment_score < -0.1:
        sentiment_label = 'negative'
    else:
        sentiment_label = 'neutral'
    
    # Detect burnout risk keywords
    burnout_keywords = [
        'stress', 'burnout', 'exhausted', 'overwhelmed', 'tired',
        'mental health', 'anxiety', 'depression', 'pressure', 'overworked'
    ]
    
    text_lower = text.lower()
    burnout_risk = any(keyword in text_lower for keyword in burnout_keywords)
    
    return sentiment_score, sentiment_label, burnout_risk


def calculate_attrition_risk(employee):
    """
    Calculate attrition risk score for an employee
    Returns: (risk_score, risk_level, recommendation)
    """
    risk_score = 0
    factors = []
    
    # Factor 1: Tenure (shorter tenure = higher risk)
    from datetime import datetime
    tenure_months = (datetime.now().date() - employee.date_joined.date()).days // 30
    if tenure_months < 6:
        risk_score += 30
        factors.append('Short tenure')
    elif tenure_months < 12:
        risk_score += 20
        factors.append('Less than 1 year tenure')
    
    # Factor 2: Leave pattern
    from leaves.models import LeaveRequest
    recent_leaves = LeaveRequest.objects.filter(
        employee=employee,
        created_at__gte=datetime.now() - timedelta(days=90)
    ).count()
    
    if recent_leaves > 5:
        risk_score += 25
        factors.append('High leave frequency')
    
    # Factor 3: Sentiment trend
    from analytics.models import EmployeeSentiment
    recent_sentiment = EmployeeSentiment.objects.filter(
        employee=employee
    ).order_by('-year', '-month').first()
    
    if recent_sentiment and recent_sentiment.sentiment_trend == 'declining':
        risk_score += 30
        factors.append('Declining sentiment')
    
    # Factor 4: Salary percentile (simplified)
    if employee.basic_salary < 30000:
        risk_score += 15
        factors.append('Below average salary')
    
    # Determine risk level
    if risk_score >= 60:
        risk_level = 'high'
        recommendation = 'Immediate intervention required. Schedule 1-on-1 meeting.'
    elif risk_score >= 30:
        risk_level = 'medium'
        recommendation = 'Monitor closely. Consider career development discussion.'
    else:
        risk_level = 'low'
        recommendation = 'Continue regular engagement.'
    
    return risk_score, risk_level, recommendation
