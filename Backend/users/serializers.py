from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, LoginAudit


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    gross_salary = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'designation', 'department', 'phone_number',
            'date_of_birth', 'basic_salary', 'hra_percentage',
            'da_percentage', 'gross_salary', 'is_active',
            'is_first_login', 'created_at', 'updated_at',
            '_id', 'synced', 'synced_at', 'synced_to'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'gross_salary']
        extra_kwargs = {
            'password': {'write_only': True}
        }


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new users"""
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'role', 'designation',
            'department', 'phone_number', 'date_of_birth',
            'basic_salary', 'hra_percentage', 'da_percentage'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords don't match"})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})


class LoginAuditSerializer(serializers.ModelSerializer):
    """Serializer for login audit logs"""
    class Meta:
        model = LoginAudit
        fields = '__all__'
        read_only_fields = ['timestamp']
