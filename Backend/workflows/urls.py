"""
URL patterns for workflows app
"""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_workflows, name='list-workflows'),
    path('<int:pk>/approve/', views.approve_workflow, name='approve-workflow'),
    path('<int:pk>/reject/', views.reject_workflow, name='reject-workflow'),
]
