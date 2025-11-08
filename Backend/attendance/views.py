"""
Views for Attendance Management
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Attendance, OvertimeRecord
from .serializers import AttendanceSerializer, OvertimeRecordSerializer
from leaves.models import LeaveBalance


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_attendance(request):
    """
    Mark attendance for current user
    POST /api/attendance/mark/
    """
    user = request.user
    today = timezone.now().date()
    
    # Check if already marked
    if Attendance.objects.filter(employee=user, date=today).exists():
        return Response({
            'error': 'Attendance already marked for today',
            'status': 400
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Get status from request or auto-determine
    attendance_status = request.data.get('status', 'present')
    
    # Auto-mark as late if after 9:30 AM
    current_time = timezone.now().time()
    if current_time.hour > 9 or (current_time.hour == 9 and current_time.minute > 30):
        # You can add a 'late' field or just mark as present
        pass
    
    attendance = Attendance.objects.create(
        employee=user,
        date=today,
        status=attendance_status
    )
    
    serializer = AttendanceSerializer(attendance)
    return Response({
        'success': True,
        'data': serializer.data,
        'message': 'Attendance marked successfully'
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_attendance_history(request):
    """
    Get attendance history with filters
    GET /api/attendance/history/?start_date=2025-11-01&end_date=2025-11-30
    """
    user = request.user
    start_date = request.query_params.get('start_date')
    end_date = request.query_params.get('end_date')
    
    # Default to current month
    if not start_date:
        start_date = timezone.now().replace(day=1).date()
    else:
        start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
    
    if not end_date:
        end_date = timezone.now().date()
    else:
        end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
    
    # Get attendance records
    attendances = Attendance.objects.filter(
        employee=user,
        date__gte=start_date,
        date__lte=end_date
    )
    
    # Calculate attendance percentage
    total_days = (end_date - start_date).days + 1
    present_days = attendances.filter(status='present').count()
    attendance_percentage = (present_days / total_days * 100) if total_days > 0 else 0
    
    serializer = AttendanceSerializer(attendances, many=True)
    
    return Response({
        'success': True,
        'data': {
            'records': serializer.data,
            'attendance_percentage': round(attendance_percentage, 2),
            'total_days': total_days,
            'present_days': present_days
        }
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_attendance_calendar(request):
    """
    Get attendance calendar view for current month
    GET /api/attendance/calendar/
    """
    user = request.user
    month = request.query_params.get('month', timezone.now().month)
    year = request.query_params.get('year', timezone.now().year)
    
    attendances = Attendance.objects.filter(
        employee=user,
        date__month=month,
        date__year=year
    )
    
    serializer = AttendanceSerializer(attendances, many=True)
    
    return Response({
        'success': True,
        'data': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_overtime(request):
    """
    Mark overtime with face photo
    POST /api/attendance/overtime/
    """
    user = request.user
    serializer = OvertimeRecordSerializer(data=request.data)
    
    if serializer.is_valid():
        overtime = serializer.save(employee=user)
        
        # Calculate comp-off and add to leave balance
        comp_off_days = float(overtime.hours_worked) / 8.0
        
        # Get or create leave balance for current year
        leave_balance, created = LeaveBalance.objects.get_or_create(
            employee=user,
            year=timezone.now().year
        )
        leave_balance.comp_off_balance += comp_off_days
        leave_balance.save()
        
        return Response({
            'success': True,
            'data': {
                'id': overtime.id,
                'hours_worked': float(overtime.hours_worked),
                'comp_off_earned': comp_off_days,
                '_id': overtime._id
            },
            'message': 'Overtime recorded successfully'
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'error': serializer.errors,
        'status': 400
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def predict_attendance(request):
    """
    Predict future attendance (ML placeholder)
    GET /api/attendance/predict/
    """
    # This is a placeholder for ML prediction
    # In production, you would use RandomForest or similar
    
    return Response({
        'success': True,
        'data': {
            'prediction': 'present',
            'confidence': 0.85,
            'message': 'ML prediction feature - placeholder'
        }
    }, status=status.HTTP_200_OK)
