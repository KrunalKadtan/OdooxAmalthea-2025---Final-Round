"""
URL configuration for WorkZen HRMS project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers

# API Router
router = routers.DefaultRouter()

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('accounts.urls')),
    path('api/users/', include('accounts.urls')),
    path('api/attendance/', include('attendance.urls')),
    path('api/leaves/', include('leaves.urls')),
    path('api/payroll/', include('payroll.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/', include('sync.urls')),
    path('api/workflows/', include('workflows.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Admin site customization
admin.site.site_header = "WorkZen HRMS Administration"
admin.site.site_title = "WorkZen HRMS"
admin.site.index_title = "Welcome to WorkZen HRMS"
