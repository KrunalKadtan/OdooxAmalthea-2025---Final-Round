from django.urls import path
from .views import ApplyLeaveView, MyLeavesView

urlpatterns = [
    path('apply/', ApplyLeaveView.as_view(), name='apply-leave'),
    path('my/', MyLeavesView.as_view(), name='my-leaves'),
]
