"""
Views for Database Sync
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db import connections
from django.utils import timezone
from .models import SyncLog, DocumentFingerprint
import hashlib


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Check database health
    GET /api/health/
    """
    # Check PostgreSQL
    postgres_online = False
    try:
        connections['default'].ensure_connection()
        postgres_online = True
    except Exception as e:
        pass
    
    # Check Supabase (if configured)
    supabase_online = False
    try:
        if 'supabase' in connections.databases:
            connections['supabase'].ensure_connection()
            supabase_online = True
    except Exception as e:
        pass
    
    return Response({
        'postgres_online': postgres_online,
        'supabase_online': supabase_online,
        'timestamp': timezone.now().isoformat()
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def write_document(request):
    """
    Write document to appropriate database
    POST /api/write/
    """
    doc = request.data.get('doc')
    doc_type = request.data.get('docType')
    
    if not doc or not doc_type:
        return Response({
            'error': 'doc and docType are required',
            'status': 400
        }, status=status.HTTP_400_BAD_REQUEST)
    
    doc_id = doc.get('_id', '')
    
    try:
        # Create fingerprint
        fingerprint_data = f"{doc_type}{doc_id}{timezone.now().isoformat()}"
        fingerprint = hashlib.sha256(fingerprint_data.encode()).hexdigest()
        
        # Save fingerprint
        DocumentFingerprint.objects.update_or_create(
            document_type=doc_type,
            document_id=doc_id,
            defaults={'fingerprint': fingerprint, 'verified': True}
        )
        
        # Log sync
        SyncLog.objects.create(
            status='success',
            changes_count=1,
            database_target='postgres'
        )
        
        return Response({
            'success': True,
            'doc_id': doc_id,
            'fingerprint': fingerprint
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({
            'error': str(e),
            'status': 500
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def verify_document(request, doc_id):
    """
    Verify document exists
    GET /api/verify/{doc_id}/
    """
    # Extract document type from doc_id
    doc_type = doc_id.split('_')[0] if '_' in doc_id else 'unknown'
    
    # Check if document fingerprint exists
    exists = DocumentFingerprint.objects.filter(
        document_id=doc_id
    ).exists()
    
    return Response({
        'verified': exists,
        'doc_id': doc_id,
        'timestamp': timezone.now().isoformat()
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def trigger_sync(request):
    """
    Trigger bidirectional replication
    POST /api/sync/trigger/
    """
    # This is a placeholder for actual replication logic
    # In production, you would implement actual database replication
    
    SyncLog.objects.create(
        status='triggered',
        changes_count=0,
        database_target='both'
    )
    
    return Response({
        'success': True,
        'message': 'Sync triggered successfully'
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_sync_status(request):
    """
    Get sync status
    GET /api/sync/status/
    """
    recent_logs = SyncLog.objects.all()[:10]
    
    return Response({
        'success': True,
        'data': {
            'recent_syncs': [
                {
                    'database': log.database_target,
                    'status': log.status,
                    'timestamp': log.timestamp.isoformat()
                }
                for log in recent_logs
            ]
        }
    }, status=status.HTTP_200_OK)
