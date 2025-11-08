from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import datetime
from .models import LeaveType, LeaveBalance, LeaveRequest
from .serializers import (
    LeaveTypeSerializer, LeaveBalanceSerializer,
    LeaveRequestSerializer, LeaveRequestCreateSerializer
)


class LeaveTypeViewSet(viewsets.ModelViewSet):
    """ViewSet for Leave Type operations"""
    queryset = LeaveType.objects.all()
    serializer_class = LeaveTypeSerializer
    permission_classes = [IsAuthenticated]


class LeaveBalanceViewSet(viewsets.ModelViewSet):
    """ViewSet for Leave Balance operations"""
    queryset = LeaveBalance.objects.all()
    serializer_class = LeaveBalanceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = LeaveBalance.objects.select_related('employee')
        user = self.request.user
        
        if user.role == 'employee':
            queryset = queryset.filter(employee=user)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def my_balance(self, request):
        """Get current user's leave balance"""
        year = request.query_params.get('year', datetime.now().year)
        
        try:
            balance = LeaveBalance.objects.get(employee=request.user, year=year)
            serializer = LeaveBalanceSerializer(balance)
            return Response({
                'success': True,
                'data': serializer.data
            })
        except LeaveBalance.DoesNotExist:
            # Create default balance for the year
            balance = LeaveBalance.objects.create(
                employee=request.user,
                year=year
            )
            serializer = LeaveBalanceSerializer(balance)
            return Response({
                'success': True,
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)


class LeaveRequestViewSet(viewsets.ModelViewSet):
    """ViewSet for Leave Request operations"""
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = LeaveRequest.objects.select_related('employee', 'approved_by')
        user = self.request.user
        
        if user.role == 'employee':
            queryset = queryset.filter(employee=user)
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset.order_by('-created_at')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return LeaveRequestCreateSerializer
        return LeaveRequestSerializer
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a leave request"""
        leave_request = self.get_object()
        
        if request.user.role not in ['admin', 'hr_officer']:
            return Response({
                'success': False,
                'message': 'You do not have permission to approve leaves'
            }, status=status.HTTP_403_FORBIDDEN)
        
        leave_request.status = 'approved'
        leave_request.approved_by = request.user
        leave_request.approval_date = timezone.now()
        leave_request.approval_comments = request.data.get('comments', '')
        leave_request.save()
        
        # Update leave balance
        year = leave_request.start_date.year
        balance, created = LeaveBalance.objects.get_or_create(
            employee=leave_request.employee,
            year=year
        )
        
        # Update used leaves based on type
        if leave_request.leave_type == 'casual':
            balance.casual_used += leave_request.number_of_days
        elif leave_request.leave_type == 'sick':
            balance.sick_used += leave_request.number_of_days
        elif leave_request.leave_type == 'personal':
            balance.personal_used += leave_request.number_of_days
        elif leave_request.leave_type == 'earned':
            balance.earned_leave_used += leave_request.number_of_days
        
        balance.save()
        
        serializer = LeaveRequestSerializer(leave_request)
        return Response({
            'success': True,
            'message': 'Leave request approved',
            'data': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a leave request"""
        leave_request = self.get_object()
        
        if request.user.role not in ['admin', 'hr_officer']:
            return Response({
                'success': False,
                'message': 'You do not have permission to reject leaves'
            }, status=status.HTTP_403_FORBIDDEN)
        
        leave_request.status = 'rejected'
        leave_request.approved_by = request.user
        leave_request.approval_date = timezone.now()
        leave_request.approval_comments = request.data.get('comments', '')
        leave_request.save()
        
        serializer = LeaveRequestSerializer(leave_request)
        return Response({
            'success': True,
            'message': 'Leave request rejected',
            'data': serializer.data
        })
