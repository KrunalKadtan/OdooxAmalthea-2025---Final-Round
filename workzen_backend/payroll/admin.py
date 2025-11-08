from django.contrib import admin
from .models import Payrun

@admin.register(Payrun)
class PayrunAdmin(admin.ModelAdmin):
    list_display = ['user', 'month', 'year', 'basic_salary', 'net_pay', 'generated_at']
    list_filter = ['year', 'month', 'generated_at']
    search_fields = ['user__username']
