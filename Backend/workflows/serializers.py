"""
Serializers for Workflows
"""
from rest_framework import serializers
from .models import Workflow, WorkflowInstance


class WorkflowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workflow
        fields = ['id', 'name', 'workflow_type', 'steps']


class WorkflowInstanceSerializer(serializers.ModelSerializer):
    workflow_name = serializers.CharField(source='workflow.name', read_only=True)
    initiated_by_name = serializers.CharField(source='initiated_by.get_full_name', read_only=True)
    
    class Meta:
        model = WorkflowInstance
        fields = ['id', 'workflow', 'workflow_name', 'initiated_by', 'initiated_by_name', 'status', 'current_step', 'data', 'created_at', 'updated_at']
