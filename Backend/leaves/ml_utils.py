"""
Sentiment analysis utilities (ML features disabled)
"""

def analyze_sentiment(text):
    """
    Basic sentiment analysis without ML libraries
    Returns: (score, label, burnout_risk)
    """
    if not text:
        return 0.0, 'neutral', False
    
    # Simple keyword-based sentiment analysis
    positive_words = ['happy', 'good', 'great', 'excellent', 'vacation', 'family', 'celebration']
    negative_words = ['sick', 'ill', 'emergency', 'urgent', 'problem', 'issue']
    
    text_lower = text.lower()
    
    # Count positive and negative words
    positive_count = sum(1 for word in positive_words if word in text_lower)
    negative_count = sum(1 for word in negative_words if word in text_lower)
    
    # Calculate simple sentiment score
    if positive_count > negative_count:
        sentiment_score = 0.5
        sentiment_label = 'positive'
    elif negative_count > positive_count:
        sentiment_score = -0.5
        sentiment_label = 'negative'
    else:
        sentiment_score = 0.0
        sentiment_label = 'neutral'
    
    # Detect burnout risk keywords
    burnout_keywords = [
        'stress', 'burnout', 'exhausted', 'overwhelmed', 'tired',
        'mental health', 'anxiety', 'depression', 'pressure', 'overworked'
    ]
    
    burnout_risk = any(keyword in text_lower for keyword in burnout_keywords)
    
    return sentiment_score, sentiment_label, burnout_risk


def calculate_attrition_risk(employee):
    """
    Calculate attrition risk score for an employee (simplified without ML)
    Returns: (risk_score, risk_level, recommendation)
    """
    from datetime import datetime, timedelta
    
    risk_score = 0
    factors = []
    
    # Factor 1: Tenure (shorter tenure = higher risk)
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
    
    # Factor 3: Salary percentile (simplified)
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
