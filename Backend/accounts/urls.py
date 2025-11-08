"""
URL patterns for accounts app
"""
from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('change-password-first-login/', views.change_password_first_login, name='change-password-first-login'),
    
    # User Profile
    path('profile/', views.get_user_profile, name='get-profile'),
    path('profile/update/', views.update_user_profile, name='update-profile'),
    
    # User Management
    path('list/', views.list_users, name='list-users'),
]
