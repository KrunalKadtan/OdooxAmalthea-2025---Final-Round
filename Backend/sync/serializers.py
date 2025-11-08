from rest_framework import serializers
from .models import SyncLog, DocumentFingerprint


class SyncLogSerializer(serializers.ModelSerializer):
    """Serializer for Sync Log"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = SyncLog
        fields = '__all__'
        read_only_fields = ['id', 'timestamp']


class DocumentFingerprintSerializer(serializers.ModelSerializer):
    """Serializer for Document Fingerprint"""
    class Meta:
        model = DocumentFingerprint
        fields = '__all__'
        read_only_fields = ['created_at']
