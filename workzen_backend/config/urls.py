from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_home(request):
    return JsonResponse({
        'message': 'WorkZEN Backend API',
        'version': '1.0',
        'status': 'running',
        'endpoints': {
            'admin': '/admin/',
            'auth': '/api/auth/',
            'attendance': '/api/attendance/',
            'leaves': '/api/leaves/',
            'payroll': '/api/payroll/',
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', api_home, name='home'),
    path('api/auth/', include('accounts.urls')),
    path('api/attendance/', include('attendance.urls')),
    path('api/leaves/', include('leaves.urls')),
    path('api/payroll/', include('payroll.urls')),
]
