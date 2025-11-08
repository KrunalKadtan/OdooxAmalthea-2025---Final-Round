from celery import shared_task
from django.utils import timezone
from .models import Payrun, Payslip
from users.models import User
from attendance.models import Attendance


@shared_task
def generate_payslips_for_payrun(payrun_id):
    """
    Background task to generate payslips for all employees in a payrun
    """
    try:
        payrun = Payrun.objects.get(id=payrun_id)
        employees = User.objects.filter(is_active=True, role='employee')
        
        payslips_created = 0
        
        for employee in employees:
            # Calculate attendance
            attendance_records = Attendance.objects.filter(
                employee=employee,
                date__month=payrun.month,
                date__year=payrun.year
            )
            
            days_worked = attendance_records.filter(status='present').count()
            leaves_taken = attendance_records.filter(status='leave').count()
            
            # Calculate salary components
            basic_salary = employee.basic_salary
            hra = basic_salary * (employee.hra_percentage / 100)
            da = basic_salary * (employee.da_percentage / 100)
            gross_salary = basic_salary + hra + da
            
            # Calculate deductions
            pf_deduction = basic_salary * 0.12  # 12% PF
            professional_tax = 200  # Fixed professional tax
            total_deductions = pf_deduction + professional_tax
            
            # Calculate net salary (pro-rated based on attendance)
            working_days = 26
            net_salary = (gross_salary * days_worked / working_days) - total_deductions
            
            # Create payslip
            Payslip.objects.create(
                payrun=payrun,
                employee=employee,
                basic_salary=basic_salary,
                hra=hra,
                da=da,
                gross_salary=gross_salary,
                pf_deduction=pf_deduction,
                professional_tax=professional_tax,
                total_deductions=total_deductions,
                net_salary=net_salary,
                working_days=working_days,
                days_worked=days_worked,
                leaves_taken=leaves_taken,
                status='draft'
            )
            
            payslips_created += 1
        
        # Update payrun summary
        payrun.total_employees = payslips_created
        payrun.status = 'processing'
        payrun.save()
        
        return f"Generated {payslips_created} payslips"
    
    except Exception as e:
        return f"Error: {str(e)}"
