from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Leave
from .serializers import LeaveSerializer

class ApplyLeaveView(generics.CreateAPIView):
    serializer_class = LeaveSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MyLeavesView(generics.ListAPIView):
    serializer_class = LeaveSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Leave.objects.filter(user=self.request.user)
