"""
Views for Leave Management
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import LeaveRequest, LeaveBalance, LeaveTemplate
from .serializers import LeaveRequestSerializer, LeaveBalanceSerializer, LeaveTemplateSerializer
from .ml_sentiment import analyze_leave_sentiment, get_sentiment_recommendation
from accounts.permissions import IsHROrPayrollOrAdmin


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_leave(request):
    """
    Apply for leave with ML sentiment analysis
    POST /api/leaves/apply/
    """
    user = request.user
    serializer = LeaveRequestSerializer(data=request.data)
    
    if serializer.is_valid():
        # Analyze sentiment
        reason = serializer.validated_data['reason']
        sentiment_data = analyze_leave_sentiment(reason)
        
        # Check leave balance
        leave_type = serializer.validated_data['leave_type']
        days_requested = (serializer.validated_data['end_date'] - serializer.validated_data['start_date']).days + 1
        
        leave_balance, created = LeaveBalance.objects.get_or_create(
            employee=user,
            year=timezone.now().year
        )
        
        # Validate balance
        if leave_type == 'casual' and leave_balance.casual_remaining < days_requested:
            return Response({
                'error': f'Insufficient casual leave balance. Available: {leave_balance.casual_remaining} days',
                'status': 400
            }, status=status.HTTP_400_BAD_REQUEST)
        elif leave_type == 'sick' and leave_balance.sick_remaining < days_requested:
            return Response({
                'error': f'Insufficient sick leave balance. Available: {leave_balance.sick_remaining} days',
                'status': 400
            }, status=status.HTTP_400_BAD_REQUEST)
        elif leave_type == 'personal' and leave_balance.personal_remaining < days_requested:
            return Response({
                'error': f'Insufficient personal leave balance. Available: {leave_balance.personal_remaining} days',
                'status': 400
            }, status=status.HTTP_400_BAD_REQUEST)
        elif leave_type == 'comp_off' and leave_balance.comp_off_balance < days_requested:
            return Response({
                'error': f'Insufficient comp-off balance. Available: {leave_balance.comp_off_balance} days',
                'status': 400
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create leave request with sentiment data
        leave_request = serializer.save(
            employee=user,
            sentiment_score=sentiment_data['polarity'],
            burnout_risk=sentiment_data['burnout_risk']
        )
        
        response_data = LeaveRequestSerializer(leave_request).data
        response_data['sentiment_analysis'] = sentiment_data
        response_data['recommendations'] = get_sentiment_recommendation(sentiment_data)
        
        return Response({
            'success': True,
            'data': response_data,
            'message': 'Leave application submitted successfully'
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'error': serializer.errors,
        'status': 400
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_leave_balance(request):
    """
    Get leave balance for current user
    GET /api/leaves/balance/
    """
    user = request.user
    year = request.query_params.get('year', timezone.now().year)
    
    leave_balance, created = LeaveBalance.objects.get_or_create(
        employee=user,
        year=year
    )
    
    serializer = LeaveBalanceSerializer(leave_balance)
    
    return Response({
        'success': True,
        'data': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_leave_templates(request):
    """
    Get leave application templates
    GET /api/leaves/templates/
    """
    templates = LeaveTemplate.objects.all()
    serializer = LeaveTemplateSerializer(templates, many=True)
    
    return Response({
        'success': True,
        'data': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsHROrPayrollOrAdmin])
def get_pending_leaves(request):
    """
    Get pending leave approvals (HR/Payroll/Admin only)
    GET /api/leaves/pending/
    """
    pending_leaves = LeaveRequest.objects.filter(status='pending')
    serializer = LeaveRequestSerializer(pending_leaves, many=True)
    
    return Response({
        'success': True,
        'data': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsHROrPayrollOrAdmin])
def approve_leave(request, pk):
    """
    Approve leave request
    PUT /api/leaves/{id}/approve/
    """
    try:
        leave_request = LeaveRequest.objects.get(pk=pk)
    except LeaveRequest.DoesNotExist:
        return Response({
            'error': 'Leave request not found',
            'status': 404
        }, status=status.HTTP_404_NOT_FOUND)
    
    if leave_request.status != 'pending':
        return Response({
            'error': 'Leave request is not pending',
            'status': 400
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Update leave balance
    leave_balance = LeaveBalance.objects.get(
        employee=leave_request.employee,
        year=leave_request.start_date.year
    )
    
    days_count = leave_request.days_count
    
    if leave_request.leave_type == 'casual':
        leave_balance.casual_used += days_count
    elif leave_request.leave_type == 'sick':
        leave_balance.sick_used += days_count
    elif leave_request.leave_type == 'personal':
        leave_balance.personal_used += days_count
    elif leave_request.leave_type == 'earned':
        leave_balance.earned_leave_used += days_count
    elif leave_request.leave_type == 'comp_off':
        leave_balance.comp_off_balance -= days_count
    
    leave_balance.save()
    
    # Approve leave
    leave_request.status = 'approved'
    leave_request.approved_by = request.user
    leave_request.save()
    
    return Response({
        'success': True,
        'message': 'Leave approved successfully'
    }, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsHROrPayrollOrAdmin])
def reject_leave(request, pk):
    """
    Reject leave request
    PUT /api/leaves/{id}/reject/
    """
    try:
        leave_request = LeaveRequest.objects.get(pk=pk)
    except LeaveRequest.DoesNotExist:
        return Response({
            'error': 'Leave request not found',
            'status': 404
        }, status=status.HTTP_404_NOT_FOUND)
    
    if leave_request.status != 'pending':
        return Response({
            'error': 'Leave request is not pending',
            'status': 400
        }, status=status.HTTP_400_BAD_REQUEST)
    
    leave_request.status = 'rejected'
    leave_request.approved_by = request.user
    leave_request.save()
    
    return Response({
        'success': True,
        'message': 'Leave rejected successfully'
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsHROrPayrollOrAdmin])
def get_sentiment_analysis(request):
    """
    Get sentiment analysis dashboard
    GET /api/leaves/sentiment-analysis/
    """
    # Get all leave requests with sentiment data
    leaves = LeaveRequest.objects.all()
    
    high_risk_count = leaves.filter(burnout_risk=True).count()
    negative_sentiment_count = leaves.filter(sentiment_score__lt=-0.3).count()
    
    return Response({
        'success': True,
        'data': {
            'total_leaves': leaves.count(),
            'high_risk_employees': high_risk_count,
            'negative_sentiment_count': negative_sentiment_count,
            'average_sentiment': leaves.aggregate(avg=models.Avg('sentiment_score'))['avg'] or 0
        }
    }, status=status.HTTP_200_OK)
