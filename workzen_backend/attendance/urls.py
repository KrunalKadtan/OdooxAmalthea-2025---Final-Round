from django.urls import path
from .views import mark_attendance, my_attendance

urlpatterns = [
    path('mark/', mark_attendance, name='mark-attendance'),
    path('my/', my_attendance, name='my-attendance'),
]
