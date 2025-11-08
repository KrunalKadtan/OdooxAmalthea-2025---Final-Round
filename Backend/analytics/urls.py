"""
URL patterns for analytics app
"""
from django.urls import path
from . import views

urlpatterns = [
    path('sentiment-dashboard/', views.get_sentiment_dashboard, name='sentiment-dashboard'),
    path('attrition-risk/', views.get_attrition_risk, name='attrition-risk'),
    path('employee-of-month/', views.get_employee_of_month, name='employee-of-month'),
    path('calculate-attrition/', views.calculate_attrition, name='calculate-attrition'),
]
