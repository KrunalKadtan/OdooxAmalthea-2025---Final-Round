from django.core.management.base import BaseCommand
from django.utils import timezone
from users.models import User
from leaves.models import LeaveType, LeaveBalance
from datetime import datetime


class Command(BaseCommand):
    help = 'Seed initial data for WorkZen HRMS'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding initial data...')
        
        # Create admin user
        if not User.objects.filter(email='admin@workzen.com').exists():
            admin = User.objects.create_user(
                username='admin',
                email='admin@workzen.com',
                password='admin123',
                first_name='Admin',
                last_name='User',
                role='admin',
                designation='System Administrator',
                department='IT',
                basic_salary=100000
            )
            self.stdout.write(self.style.SUCCESS(f'Created admin user: {admin.email}'))
        
        # Create HR Officer
        if not User.objects.filter(email='hr@workzen.com').exists():
            hr = User.objects.create_user(
                username='hr_officer',
                email='hr@workzen.com',
                password='hr123',
                first_name='HR',
                last_name='Officer',
                role='hr_officer',
                designation='HR Manager',
                department='Human Resources',
                basic_salary=60000
            )
            self.stdout.write(self.style.SUCCESS(f'Created HR officer: {hr.email}'))
        
        # Create Payroll Officer
        if not User.objects.filter(email='payroll@workzen.com').exists():
            payroll = User.objects.create_user(
                username='payroll_officer',
                email='payroll@workzen.com',
                password='payroll123',
                first_name='Payroll',
                last_name='Officer',
                role='payroll_officer',
                designation='Payroll Manager',
                department='Finance',
                basic_salary=55000
            )
            self.stdout.write(self.style.SUCCESS(f'Created payroll officer: {payroll.email}'))
        
        # Create sample employees
        employees_data = [
            {
                'username': 'john_doe',
                'email': 'john@workzen.com',
                'password': 'employee123',
                'first_name': 'John',
                'last_name': 'Doe',
                'designation': 'Software Engineer',
                'department': 'Engineering',
                'basic_salary': 50000
            },
            {
                'username': 'jane_smith',
                'email': 'jane@workzen.com',
                'password': 'employee123',
                'first_name': 'Jane',
                'last_name': 'Smith',
                'designation': 'Product Manager',
                'department': 'Product',
                'basic_salary': 60000
            },
        ]
        
        for emp_data in employees_data:
            if not User.objects.filter(email=emp_data['email']).exists():
                employee = User.objects.create_user(
                    role='employee',
                    **emp_data
                )
                
                # Create leave balance for current year
                LeaveBalance.objects.create(
                    employee=employee,
                    year=datetime.now().year
                )
                
                self.stdout.write(self.style.SUCCESS(f'Created employee: {employee.email}'))
        
        # Create leave types
        leave_types = [
            {
                'name': 'Casual Leave',
                'annual_allocation': 12,
                'is_carryforward_allowed': True,
                'max_carryforward': 5,
                'description': 'For personal reasons and short breaks'
            },
            {
                'name': 'Sick Leave',
                'annual_allocation': 8,
                'is_carryforward_allowed': False,
                'max_carryforward': 0,
                'description': 'For medical reasons and health issues'
            },
            {
                'name': 'Personal Leave',
                'annual_allocation': 5,
                'is_carryforward_allowed': False,
                'max_carryforward': 0,
                'description': 'For personal emergencies'
            },
            {
                'name': 'Earned Leave',
                'annual_allocation': 5,
                'is_carryforward_allowed': True,
                'max_carryforward': 10,
                'description': 'Earned after completing tenure'
            },
        ]
        
        for lt_data in leave_types:
            if not LeaveType.objects.filter(name=lt_data['name']).exists():
                leave_type = LeaveType.objects.create(**lt_data)
                self.stdout.write(self.style.SUCCESS(f'Created leave type: {leave_type.name}'))
        
        self.stdout.write(self.style.SUCCESS('Data seeding completed!'))
        self.stdout.write('')
        self.stdout.write('Login credentials:')
        self.stdout.write('Admin: admin@workzen.com / admin123')
        self.stdout.write('HR: hr@workzen.com / hr123')
        self.stdout.write('Payroll: payroll@workzen.com / payroll123')
        self.stdout.write('Employee: john@workzen.com / employee123')
