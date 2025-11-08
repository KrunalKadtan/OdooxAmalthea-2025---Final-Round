"""
Database Sync Models
"""
from django.db import models
from accounts.models import User
from django.utils import timezone


class SyncLog(models.Model):
    """Log of sync operations"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20)
    changes_count = models.IntegerField(default=0)
    database_target = models.CharField(max_length=20)  # 'postgres', 'supabase'
    
    class Meta:
        db_table = 'sync_logs'
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.database_target} - {self.timestamp}"


class DocumentFingerprint(models.Model):
    """Document fingerprints for verification"""
    
    document_type = models.CharField(max_length=50)
    document_id = models.CharField(max_length=100)
    fingerprint = models.CharField(max_length=64)  # SHA-256
    timestamp = models.DateTimeField(auto_now_add=True)
    verified = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'document_fingerprints'
        unique_together = ['document_type', 'document_id']
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.document_type} - {self.document_id}"
