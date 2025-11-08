"""
Views for Analytics and ML Features
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Avg
from .models import EmployeeSentiment, AttritionRisk, EmployeeAward
from .serializers import EmployeeSentimentSerializer, AttritionRiskSerializer, EmployeeAwardSerializer
from accounts.permissions import IsHROrAdmin
from accounts.models import User
from leaves.models import LeaveRequest
from attendance.models import Attendance


@api_view(['GET'])
@permission_classes([IsHROrAdmin])
def get_sentiment_dashboard(request):
    """
    Get sentiment analysis dashboard
    GET /api/analytics/sentiment-dashboard/
    """
    # Get recent sentiments
    sentiments = EmployeeSentiment.objects.all()[:100]
    
    # Calculate statistics
    avg_sentiment = sentiments.aggregate(Avg('sentiment_score'))['sentiment_score__avg'] or 0
    high_risk_count = sentiments.filter(burnout_risk=True).count()
    
    # Get leave-based sentiments
    leave_sentiments = LeaveRequest.objects.all()
    negative_leaves = leave_sentiments.filter(sentiment_score__lt=-0.3).count()
    
    serializer = EmployeeSentimentSerializer(sentiments, many=True)
    
    return Response({
        'success': True,
        'data': {
            'overall_sentiment': round(avg_sentiment, 2),
            'high_risk_employees': high_risk_count,
            'negative_sentiment_leaves': negative_leaves,
            'recent_sentiments': serializer.data[:20]
        }
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsHROrAdmin])
def get_attrition_risk(request):
    """
    Get attrition risk predictions
    GET /api/analytics/attrition-risk/
    """
    attrition_risks = AttritionRisk.objects.all()[:50]
    serializer = AttritionRiskSerializer(attrition_risks, many=True)
    
    return Response({
        'success': True,
        'data': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsHROrAdmin])
def get_employee_of_month(request):
    """
    Get Employee of the Month
    GET /api/analytics/employee-of-month/
    """
    month = request.query_params.get('month', timezone.now().month)
    year = request.query_params.get('year', timezone.now().year)
    
    # Check if already calculated
    existing_award = EmployeeAward.objects.filter(
        award_type='month',
        month=month,
        year=year
    ).first()
    
    if existing_award:
        serializer = EmployeeAwardSerializer(existing_award)
        return Response({
            'success': True,
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    # Calculate Employee of the Month
    employees = User.objects.filter(role='employee')
    scores = {}
    
    for emp in employees:
        # Attendance percentage
        attendance_records = Attendance.objects.filter(
            employee=emp,
            date__month=month,
            date__year=year
        )
        present_days = attendance_records.filter(status='present').count()
        total_days = attendance_records.count()
        attendance_pct = (present_days / total_days * 100) if total_days > 0 else 0
        
        # Sentiment score
        sentiments = EmployeeSentiment.objects.filter(
            employee=emp,
            date__month=month,
            date__year=year
        )
        avg_sentiment = sentiments.aggregate(Avg('sentiment_score'))['sentiment_score__avg'] or 0
        
        # Leaves taken
        leaves = LeaveRequest.objects.filter(
            employee=emp,
            start_date__month=month,
            start_date__year=year,
            status='approved'
        ).count()
        
        # Weighted score
        score = (
            attendance_pct * 0.4 +
            (avg_sentiment + 1) * 50 * 0.3 +  # Normalize -1 to 1 → 0 to 100
            (12 - leaves) * 8 * 0.3  # Less leaves = better
        )
        
        scores[emp.id] = score
    
    if scores:
        winner_id = max(scores, key=scores.get)
        winner = User.objects.get(id=winner_id)
        
        # Create award
        award = EmployeeAward.objects.create(
            employee=winner,
            award_type='month',
            month=month,
            year=year,
            reason=f"Top performer with score {scores[winner_id]:.1f}"
        )
        
        serializer = EmployeeAwardSerializer(award)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': f'{winner.get_full_name()} is Employee of the Month!'
        }, status=status.HTTP_200_OK)
    
    return Response({
        'error': 'No eligible employees found',
        'status': 404
    }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsHROrAdmin])
def calculate_attrition(request):
    """
    Calculate attrition risk for all employees (ML placeholder)
    POST /api/analytics/calculate-attrition/
    """
    employees = User.objects.filter(role='employee')
    calculated_count = 0
    
    for employee in employees:
        # This is a placeholder for ML prediction
        # In production, you would use RandomForest or similar
        
        # Simple heuristic for demo
        sentiments = EmployeeSentiment.objects.filter(employee=employee)
        avg_sentiment = sentiments.aggregate(Avg('sentiment_score'))['sentiment_score__avg'] or 0
        
        # Calculate risk score (simplified)
        risk_score = 0.5  # Base risk
        if avg_sentiment < -0.2:
            risk_score += 0.3
        
        # Create or update attrition risk
        AttritionRisk.objects.update_or_create(
            employee=employee,
            defaults={
                'risk_score': min(risk_score, 1.0),
                'factors': {
                    'avg_sentiment': avg_sentiment,
                    'tenure_months': 12  # Placeholder
                },
                'recommendation': 'Monitor employee engagement' if risk_score > 0.7 else 'No immediate action required'
            }
        )
        calculated_count += 1
    
    return Response({
        'success': True,
        'data': {
            'employees_analyzed': calculated_count
        },
        'message': 'Attrition risk calculated for all employees'
    }, status=status.HTTP_200_OK)
