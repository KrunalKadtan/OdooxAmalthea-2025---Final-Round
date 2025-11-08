"""
URL patterns for leaves app
"""
from django.urls import path
from . import views

urlpatterns = [
    path('apply/', views.apply_leave, name='apply-leave'),
    path('balance/', views.get_leave_balance, name='leave-balance'),
    path('templates/', views.get_leave_templates, name='leave-templates'),
    path('pending/', views.get_pending_leaves, name='pending-leaves'),
    path('<int:pk>/approve/', views.approve_leave, name='approve-leave'),
    path('<int:pk>/reject/', views.reject_leave, name='reject-leave'),
    path('sentiment-analysis/', views.get_sentiment_analysis, name='sentiment-analysis'),
]
