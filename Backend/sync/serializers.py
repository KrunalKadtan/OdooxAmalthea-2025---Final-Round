"""
Serializers for Sync
"""
from rest_framework import serializers
from .models import SyncLog, DocumentFingerprint


class SyncLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SyncLog
        fields = ['id', 'user', 'timestamp', 'status', 'changes_count', 'database_target']


class DocumentFingerprintSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentFingerprint
        fields = ['id', 'document_type', 'document_id', 'fingerprint', 'timestamp', 'verified']
