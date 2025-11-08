from django.db import models
from accounts.models import User

class Payrun(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payruns')
    month = models.CharField(max_length=20)
    year = models.IntegerField()
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2)
    present_days = models.IntegerField(default=0)
    absent_days = models.IntegerField(default=0)
    leave_days = models.IntegerField(default=0)
    working_days = models.IntegerField(default=26)
    pf = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    professional_tax = models.DecimalField(max_digits=10, decimal_places=2, default=200)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    gross_pay = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    net_pay = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    generated_at = models.DateTimeField(auto_now_add=True)
    generated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='generated_payruns')
    
    class Meta:
        unique_together = ['user', 'month', 'year']
        ordering = ['-year', '-month']
    
    def __str__(self):
        return f"{self.user.username} - {self.month}/{self.year}"
    
    def calculate_payroll(self):
        self.gross_pay = self.basic_salary
        self.pf = round(self.basic_salary * 0.12, 2)
        per_day_salary = self.basic_salary / self.working_days
        absent_deduction = round(per_day_salary * self.absent_days, 2)
        self.deductions = self.pf + self.professional_tax + absent_deduction
        self.net_pay = self.gross_pay - self.deductions
        self.save()
