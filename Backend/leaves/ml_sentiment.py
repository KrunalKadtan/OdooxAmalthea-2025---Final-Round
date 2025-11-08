"""
ML Sentiment Analysis for Leave Reasons
"""
from textblob import TextBlob


def analyze_leave_sentiment(reason_text):
    """
    Analyze sentiment of leave reason using TextBlob
    
    Args:
        reason_text (str): The leave reason text
    
    Returns:
        dict: Sentiment analysis results
    """
    blob = TextBlob(reason_text)
    sentiment = blob.sentiment
    
    # Detect burnout keywords
    burnout_keywords = [
        'stress', 'stressed', 'overwhelmed', 'exhausted', 'burnout',
        'tired', 'anxiety', 'anxious', 'pressure', 'cannot cope',
        'mental health', 'depression', 'depressed', 'breakdown'
    ]
    
    reason_lower = reason_text.lower()
    has_burnout = any(keyword in reason_lower for keyword in burnout_keywords)
    
    # Determine risk level based on polarity
    if sentiment.polarity < -0.3:
        risk_level = 'high'
    elif sentiment.polarity < 0:
        risk_level = 'medium'
    else:
        risk_level = 'low'
    
    return {
        'polarity': sentiment.polarity,  # -1 to 1 (negative to positive)
        'subjectivity': sentiment.subjectivity,  # 0 to 1 (objective to subjective)
        'risk_level': risk_level,
        'burnout_risk': has_burnout
    }


def get_sentiment_recommendation(sentiment_data):
    """
    Get recommendations based on sentiment analysis
    
    Args:
        sentiment_data (dict): Sentiment analysis results
    
    Returns:
        list: Recommendations for HR
    """
    recommendations = []
    
    if sentiment_data['burnout_risk']:
        recommendations.append("⚠️ Burnout risk detected - Schedule wellness check-in")
        recommendations.append("Consider mental health support resources")
    
    if sentiment_data['risk_level'] == 'high':
        recommendations.append("High negative sentiment - Immediate attention required")
        recommendations.append("Review workload and stress factors")
    
    if sentiment_data['polarity'] < -0.5:
        recommendations.append("Very negative sentiment - Consider extended leave approval")
    
    return recommendations
