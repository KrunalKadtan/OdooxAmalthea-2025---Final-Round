from django.urls import path
from .views import MyPayslipsView

urlpatterns = [
    path('my/', MyPayslipsView.as_view(), name='my-payslips'),
]
