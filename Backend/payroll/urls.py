"""
URL patterns for payroll app
"""
from django.urls import path
from . import views

urlpatterns = [
    path('payslips/', views.get_payslips, name='get-payslips'),
    path('payslips/<int:pk>/pdf/', views.download_payslip_pdf, name='download-payslip-pdf'),
    path('generate/', views.generate_payroll, name='generate-payroll'),
    path('verify/<int:pk>/', views.verify_payslip, name='verify-payslip'),
]
