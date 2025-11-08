"""
Views for Workflow Management
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Workflow, WorkflowInstance
from .serializers import WorkflowSerializer, WorkflowInstanceSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_workflows(request):
    """
    List all workflows
    GET /api/workflows/
    """
    workflows = Workflow.objects.all()
    serializer = WorkflowSerializer(workflows, many=True)
    
    return Response({
        'success': True,
        'data': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_workflow(request, pk):
    """
    Approve current workflow step
    POST /api/workflows/{id}/approve/
    """
    try:
        instance = WorkflowInstance.objects.get(pk=pk)
    except WorkflowInstance.DoesNotExist:
        return Response({
            'error': 'Workflow instance not found',
            'status': 404
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Move to next step
    instance.current_step += 1
    
    # Check if workflow is complete
    if instance.current_step >= len(instance.workflow.steps):
        instance.status = 'completed'
    
    instance.save()
    
    return Response({
        'success': True,
        'message': 'Workflow step approved'
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_workflow(request, pk):
    """
    Reject workflow
    POST /api/workflows/{id}/reject/
    """
    try:
        instance = WorkflowInstance.objects.get(pk=pk)
    except WorkflowInstance.DoesNotExist:
        return Response({
            'error': 'Workflow instance not found',
            'status': 404
        }, status=status.HTTP_404_NOT_FOUND)
    
    instance.status = 'rejected'
    instance.save()
    
    return Response({
        'success': True,
        'message': 'Workflow rejected'
    }, status=status.HTTP_200_OK)
