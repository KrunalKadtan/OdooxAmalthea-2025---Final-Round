"""
URL patterns for attendance app
"""
from django.urls import path
from . import views

urlpatterns = [
    path('mark/', views.mark_attendance, name='mark-attendance'),
    path('history/', views.get_attendance_history, name='attendance-history'),
    path('calendar/', views.get_attendance_calendar, name='attendance-calendar'),
    path('overtime/', views.mark_overtime, name='mark-overtime'),
    path('predict/', views.predict_attendance, name='predict-attendance'),
]
