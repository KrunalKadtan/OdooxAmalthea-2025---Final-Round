"""
WSGI config for WorkZen HRMS project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'workzen.settings')

application = get_wsgi_application()
