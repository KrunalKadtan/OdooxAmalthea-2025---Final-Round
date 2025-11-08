from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Payrun
from .serializers import PayrunSerializer

class MyPayslipsView(generics.ListAPIView):
    serializer_class = PayrunSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Payrun.objects.filter(user=self.request.user)
