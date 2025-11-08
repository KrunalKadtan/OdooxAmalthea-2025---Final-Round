from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Payrun, Payslip, BonusPolicy
from .serializers import PayrunSerializer, PayslipSerializer, BonusPolicySerializer


class PayrunViewSet(viewsets.ModelViewSet):
    """ViewSet for Payrun operations"""
    queryset = Payrun.objects.all()
    serializer_class = PayrunSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Payrun.objects.select_related('created_by')
        return queryset.order_by('-year', '-month')


class PayslipViewSet(viewsets.ModelViewSet):
    """ViewSet for Payslip operations"""
    queryset = Payslip.objects.all()
    serializer_class = PayslipSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Payslip.objects.select_related('employee', 'payrun')
        user = self.request.user
        
        if user.role == 'employee':
            queryset = queryset.filter(employee=user)
        
        return queryset.order_by('-payrun__year', '-payrun__month')
    
    @action(detail=False, methods=['get'])
    def my_payslips(self, request):
        """Get current user's payslips"""
        payslips = Payslip.objects.filter(employee=request.user).select_related('payrun')
        serializer = PayslipSerializer(payslips, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })


class BonusPolicyViewSet(viewsets.ModelViewSet):
    """ViewSet for Bonus Policy operations"""
    queryset = BonusPolicy.objects.all()
    serializer_class = BonusPolicySerializer
    permission_classes = [IsAuthenticated]
