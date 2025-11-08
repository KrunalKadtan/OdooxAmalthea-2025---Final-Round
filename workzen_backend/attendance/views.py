from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Attendance
from .serializers import AttendanceSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_attendance(request):
    today = timezone.now().date()
    attendance, created = Attendance.objects.get_or_create(
        user=request.user,
        date=today
    )
    
    if 'check_in' in request.data and not attendance.check_in:
        attendance.check_in = request.data['check_in']
        attendance.status = 'Present'
        attendance.save()
        return Response({'message': 'Check-in recorded', 'data': AttendanceSerializer(attendance).data})
    
    elif 'check_out' in request.data:
        attendance.check_out = request.data['check_out']
        attendance.calculate_hours()
        return Response({'message': 'Check-out recorded', 'data': AttendanceSerializer(attendance).data})
    
    return Response({'error': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_attendance(request):
    attendances = Attendance.objects.filter(user=request.user)
    serializer = AttendanceSerializer(attendances, many=True)
    return Response(serializer.data)
