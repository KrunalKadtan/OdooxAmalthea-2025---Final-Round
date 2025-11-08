from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import SyncLog, DocumentFingerprint
from .serializers import SyncLogSerializer, DocumentFingerprintSerializer


class SyncLogViewSet(viewsets.ModelViewSet):
    """ViewSet for Sync Log operations"""
    queryset = SyncLog.objects.all()
    serializer_class = SyncLogSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = SyncLog.objects.select_related('user')
        user = self.request.user
        
        if user.role != 'admin':
            queryset = queryset.filter(user=user)
        
        return queryset.order_by('-timestamp')
    
    @action(detail=False, methods=['get'])
    def my_sync_logs(self, request):
        """Get current user's sync logs"""
        logs = SyncLog.objects.filter(user=request.user).order_by('-timestamp')[:50]
        serializer = SyncLogSerializer(logs, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })


class DocumentFingerprintViewSet(viewsets.ModelViewSet):
    """ViewSet for Document Fingerprint operations"""
    queryset = DocumentFingerprint.objects.all()
    serializer_class = DocumentFingerprintSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['post'])
    def verify(self, request):
        """Verify a document fingerprint"""
        fingerprint = request.data.get('fingerprint')
        
        try:
            doc = DocumentFingerprint.objects.get(fingerprint=fingerprint)
            doc.verification_count += 1
            doc.save()
            
            serializer = DocumentFingerprintSerializer(doc)
            return Response({
                'success': True,
                'verified': True,
                'data': serializer.data
            })
        except DocumentFingerprint.DoesNotExist:
            return Response({
                'success': False,
                'verified': False,
                'message': 'Document fingerprint not found'
            }, status=status.HTTP_404_NOT_FOUND)
