"""
Utilities for three-tier synchronization
"""
import hashlib
import json
from datetime import datetime


def generate_fingerprint(data):
    """
    Generate SHA-256 fingerprint for data
    """
    if isinstance(data, dict):
        data_str = json.dumps(data, sort_keys=True)
    else:
        data_str = str(data)
    
    return hashlib.sha256(data_str.encode()).hexdigest()


def sync_to_supabase(document_type, document_id, data):
    """
    Sync data to Supabase cloud storage
    Returns: (success, error_message)
    """
    try:
        from django.conf import settings
        import requests
        
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            return False, 'Supabase not configured'
        
        # Prepare Supabase request
        url = f"{settings.SUPABASE_URL}/rest/v1/{document_type}"
        headers = {
            'apikey': settings.SUPABASE_KEY,
            'Authorization': f'Bearer {settings.SUPABASE_KEY}',
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        }
        
        # Upsert data
        response = requests.post(url, json=data, headers=headers)
        
        if response.status_code in [200, 201]:
            return True, None
        else:
            return False, f'Supabase error: {response.text}'
    
    except Exception as e:
        return False, str(e)


def create_sync_log(user, document_type, document_id, synced_from, synced_to, status, **kwargs):
    """
    Create a sync log entry
    """
    from sync.models import SyncLog
    
    return SyncLog.objects.create(
        user=user,
        document_type=document_type,
        document_id=document_id,
        synced_from=synced_from,
        synced_to=synced_to,
        status=status,
        **kwargs
    )


def verify_document_integrity(document_type, document_id, fingerprint):
    """
    Verify document integrity using fingerprint
    """
    from sync.models import DocumentFingerprint
    
    try:
        doc_fingerprint = DocumentFingerprint.objects.get(
            document_type=document_type,
            document_id=document_id
        )
        return doc_fingerprint.fingerprint == fingerprint
    except DocumentFingerprint.DoesNotExist:
        return False
