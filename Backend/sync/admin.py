"""
Admin configuration for sync app
"""
from django.contrib import admin
from .models import SyncLog, DocumentFingerprint


@admin.register(SyncLog)
class SyncLogAdmin(admin.ModelAdmin):
    list_display = ['database_target', 'status', 'changes_count', 'timestamp']
    list_filter = ['status', 'database_target', 'timestamp']


@admin.register(DocumentFingerprint)
class DocumentFingerprintAdmin(admin.ModelAdmin):
    list_display = ['document_type', 'document_id', 'verified', 'timestamp']
    list_filter = ['document_type', 'verified']
