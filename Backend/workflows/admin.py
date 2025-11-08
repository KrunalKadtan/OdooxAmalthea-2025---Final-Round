"""
Admin configuration for workflows app
"""
from django.contrib import admin
from .models import Workflow, WorkflowInstance


@admin.register(Workflow)
class WorkflowAdmin(admin.ModelAdmin):
    list_display = ['name', 'workflow_type']
    list_filter = ['workflow_type']


@admin.register(WorkflowInstance)
class WorkflowInstanceAdmin(admin.ModelAdmin):
    list_display = ['workflow', 'initiated_by', 'status', 'current_step', 'created_at']
    list_filter = ['status', 'workflow']
