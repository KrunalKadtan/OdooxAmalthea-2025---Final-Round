"""
Workflow Management Models
"""
from django.db import models
from accounts.models import User


class Workflow(models.Model):
    """Workflow definition"""
    
    WORKFLOW_TYPE_CHOICES = [
        ('leave_approval', 'Leave Approval'),
        ('promotion', 'Promotion'),
        ('salary_revision', 'Salary Revision'),
    ]
    
    name = models.CharField(max_length=100)
    workflow_type = models.CharField(max_length=50, choices=WORKFLOW_TYPE_CHOICES)
    steps = models.JSONField(default=list)  # ['hr_officer', 'admin']
    
    class Meta:
        db_table = 'workflows'
    
    def __str__(self):
        return self.name


class WorkflowInstance(models.Model):
    """Workflow instance"""
    
    workflow = models.ForeignKey(Workflow, on_delete=models.CASCADE)
    initiated_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='initiated_workflows')
    status = models.CharField(max_length=20, default='pending')
    current_step = models.IntegerField(default=0)
    data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'workflow_instances'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.workflow.name} - {self.status}"
