"""
Views for Payroll Management
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import FileResponse
from django.utils import timezone
from .models import Payslip, BonusCalculation
from .serializers import PayslipSerializer, BonusCalculationSerializer
from .pdf_generator import generate_payslip_pdf
from accounts.permissions import IsPayrollOrAdmin
from accounts.models import User
from attendance.models import Attendance
from decimal import Decimal


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_payslips(request):
    """
    Get payslips for current user
    GET /api/payroll/payslips/?month=11&year=2025
    """
    user = request.user
    month = request.query_params.get('month')
    year = request.query_params.get('year')
    
    payslips = Payslip.objects.filter(employee=user)
    
    if month:
        payslips = payslips.filter(month=month)
    if year:
        payslips = payslips.filter(year=year)
    
    serializer = PayslipSerializer(payslips, many=True)
    
    return Response({
        'success': True,
        'data': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_payslip_pdf(request, pk):
    """
    Download payslip as PDF
    GET /api/payroll/payslips/{id}/pdf/
    """
    try:
        payslip = Payslip.objects.get(pk=pk)
    except Payslip.DoesNotExist:
        return Response({
            'error': 'Payslip not found',
            'status': 404
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Check permission
    if payslip.employee != request.user and request.user.role not in ['admin', 'payroll_officer']:
        return Response({
            'error': 'You do not have permission to access this payslip',
            'status': 403
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Generate PDF
    pdf_buffer = generate_payslip_pdf(payslip)
    
    return FileResponse(
        pdf_buffer,
        as_attachment=True,
        filename=f'payslip_{payslip.employee.username}_{payslip.month}_{payslip.year}.pdf'
    )


@api_view(['POST'])
@permission_classes([IsPayrollOrAdmin])
def generate_payroll(request):
    """
    Generate payroll for all employees (Payroll Officer/Admin only)
    POST /api/payroll/generate/
    """
    month = request.data.get('month', timezone.now().month)
    year = request.data.get('year', timezone.now().year)
    
    employees = User.objects.filter(role='employee')
    payslips_generated = 0
    total_payout = Decimal('0.00')
    
    for employee in employees:
        # Check if payslip already exists
        if Payslip.objects.filter(employee=employee, month=month, year=year).exists():
            continue
        
        # Calculate payroll
        payroll_data = calculate_payroll(employee, month, year)
        
        # Create payslip
        payslip = Payslip.objects.create(
            employee=employee,
            month=month,
            year=year,
            **payroll_data
        )
        
        payslips_generated += 1
        total_payout += payslip.net_salary
    
    return Response({
        'success': True,
        'data': {
            'payslips_generated': payslips_generated,
            'total_payout': str(total_payout),
            'month': month,
            'year': year
        },
        'message': f'Payroll generated for {payslips_generated} employees'
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def verify_payslip(request, pk):
    """
    Verify payslip authenticity using digital signature
    GET /api/payroll/verify/{id}/
    """
    try:
        payslip = Payslip.objects.get(pk=pk)
    except Payslip.DoesNotExist:
        return Response({
            'error': 'Payslip not found',
            'status': 404
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Recalculate signature
    import hashlib
    data = f"{payslip.employee.id}{payslip.month}{payslip.year}{payslip.net_salary}"
    calculated_signature = hashlib.sha256(data.encode()).hexdigest()
    
    is_valid = calculated_signature == payslip.digital_signature
    
    return Response({
        'success': True,
        'data': {
            'verified': is_valid,
            'payslip_id': payslip.id,
            'employee': payslip.employee.get_full_name(),
            'month': payslip.month,
            'year': payslip.year,
            'net_salary': str(payslip.net_salary)
        }
    }, status=status.HTTP_200_OK)


def calculate_payroll(employee, month, year):
    """
    Calculate complete payroll for an employee
    
    Args:
        employee: User instance
        month: int
        year: int
    
    Returns:
        dict: Payroll calculation data
    """
    # Get attendance records
    attendance_records = Attendance.objects.filter(
        employee=employee,
        date__month=month,
        date__year=year
    )
    
    days_worked = attendance_records.filter(status='present').count()
    total_working_days = 26  # Standard working days
    
    # Salary calculations
    basic = employee.basic_salary
    hra = basic * Decimal('0.4')  # 40% of basic
    da = basic * Decimal('0.2')  # 20% of basic
    gross = basic + hra + da
    
    # Deductions
    pf = basic * Decimal('0.12')  # 12% PF
    professional_tax = Decimal('200.00')  # Fixed
    
    # Pro-rata for absences
    if days_worked < total_working_days:
        per_day_salary = gross / Decimal(str(total_working_days))
        absence_deduction = (Decimal(str(total_working_days)) - Decimal(str(days_worked))) * per_day_salary
        gross = gross - absence_deduction
    
    total_deductions = pf + professional_tax
    net_salary = gross - total_deductions
    
    return {
        'basic_salary': basic,
        'hra': hra,
        'da': da,
        'gross_salary': gross,
        'pf_deduction': pf,
        'professional_tax': professional_tax,
        'total_deductions': total_deductions,
        'net_salary': net_salary,
        'days_worked': days_worked,
        'status': 'finalized'
    }
