from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Count
from datetime import datetime, timedelta
from .models import Attendance, OvertimeRecord
from .serializers import (
    AttendanceSerializer, AttendanceCreateSerializer,
    OvertimeRecordSerializer
)


class AttendanceViewSet(viewsets.ModelViewSet):
    """ViewSet for Attendance CRUD operations"""
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Optimize queries with select_related"""
        queryset = Attendance.objects.select_related('employee', 'marked_by')
        
        user = self.request.user
        if user.role == 'employee':
            queryset = queryset.filter(employee=user)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date and end_date:
            queryset = queryset.filter(date__range=[start_date, end_date])
        
        return queryset.order_by('-date')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return AttendanceCreateSerializer
        return AttendanceSerializer
    
    @action(detail=False, methods=['get'])
    def my_attendance(self, request):
        """Get current user's attendance records"""
        month = request.query_params.get('month', datetime.now().month)
        year = request.query_params.get('year', datetime.now().year)
        
        attendance = Attendance.objects.filter(
            employee=request.user,
            date__month=month,
            date__year=year
        ).order_by('-date')
        
        serializer = AttendanceSerializer(attendance, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get attendance statistics"""
        employee_id = request.query_params.get('employee_id', request.user.id)
        month = request.query_params.get('month', datetime.now().month)
        year = request.query_params.get('year', datetime.now().year)
        
        stats = Attendance.objects.filter(
            employee_id=employee_id,
            date__month=month,
            date__year=year
        ).aggregate(
            total_days=Count('id'),
            present=Count('id', filter=Q(status='present')),
            absent=Count('id', filter=Q(status='absent')),
            leave=Count('id', filter=Q(status='leave')),
            half_day=Count('id', filter=Q(status='half-day')),
            wfh=Count('id', filter=Q(status='work-from-home'))
        )
        
        return Response({
            'success': True,
            'data': stats
        })


class OvertimeRecordViewSet(viewsets.ModelViewSet):
    """ViewSet for Overtime Record operations"""
    queryset = OvertimeRecord.objects.all()
    serializer_class = OvertimeRecordSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = OvertimeRecord.objects.select_related('employee')
        user = self.request.user
        
        if user.role == 'employee':
            queryset = queryset.filter(employee=user)
        
        return queryset.order_by('-date')
