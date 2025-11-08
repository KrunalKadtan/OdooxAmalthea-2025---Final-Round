"""
URL patterns for sync app
"""
from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health_check, name='health-check'),
    path('write/', views.write_document, name='write-document'),
    path('verify/<str:doc_id>/', views.verify_document, name='verify-document'),
    path('sync/trigger/', views.trigger_sync, name='trigger-sync'),
    path('sync/status/', views.get_sync_status, name='sync-status'),
]
