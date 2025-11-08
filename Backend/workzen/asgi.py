"""
ASGI config for WorkZen HRMS project.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'workzen.settings')

application = get_asgi_application()
