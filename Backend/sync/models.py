from django.db import models
from django.db.models import Index
import uuid


class SyncLog(models.Model):
    """Track all synchronization events for audit"""
    
    SYNC_STATUSES = [
        ('pending', 'Pending'),
        ('syncing', 'Syncing'),
        ('success', 'Success'),
        ('failed', 'Failed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='sync_logs')
    
    # What was synced
    document_type = models.CharField(max_length=50)  # attendance, leave, payslip, etc
    document_id = models.CharField(max_length=255)
    
    # Sync details
    synced_from = models.CharField(max_length=20)  # local_device, postgres, supabase
    synced_to = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=SYNC_STATUSES)
    
    # Metadata
    data_size_bytes = models.IntegerField()
    sync_duration_ms = models.IntegerField()
    error_message = models.TextField(blank=True)
    
    # Conflict resolution
    conflict_detected = models.BooleanField(default=False)
    conflict_resolution_method = models.CharField(max_length=50, blank=True)
    
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'sync_sync_log'
        indexes = [
            Index(fields=['user', '-timestamp']),
            Index(fields=['status', 'timestamp']),
            Index(fields=['conflict_detected']),
        ]
    
    def __str__(self):
        return f"{self.document_type} {self.status} - {self.timestamp}"


class DocumentFingerprint(models.Model):
    """Store cryptographic fingerprints for document verification"""
    document_type = models.CharField(max_length=50)
    document_id = models.CharField(max_length=255)
    fingerprint = models.CharField(max_length=64, unique=True)  # SHA-256

    # For blockchain integration (future)
    blockchain_hash = models.CharField(max_length=66, null=True, blank=True)
    blockchain_timestamp = models.DateTimeField(null=True, blank=True)
    verified = models.BooleanField(default=False)
    verification_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'sync_document_fingerprint'
        indexes = [
            Index(fields=['fingerprint']),
            Index(fields=['document_type', 'document_id']),
        ]
    
    def __str__(self):
        return f"{self.document_type} - {self.fingerprint}"
