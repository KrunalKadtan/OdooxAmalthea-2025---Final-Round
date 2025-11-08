"""
Custom exception handler for consistent API responses
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response


def custom_exception_handler(exc, context):
    """
    Custom exception handler that returns consistent error format
    """
    response = exception_handler(exc, context)
    
    if response is not None:
        custom_response_data = {
            'error': str(exc),
            'status': response.status_code
        }
        
        if hasattr(exc, 'detail'):
            if isinstance(exc.detail, dict):
                custom_response_data['error'] = exc.detail
            else:
                custom_response_data['error'] = str(exc.detail)
        
        response.data = custom_response_data
    
    return response
