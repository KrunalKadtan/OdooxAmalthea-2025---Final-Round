# WorkZen HRMS - System Architecture

## Overview

WorkZen HRMS is a production-grade Human Resource Management System built with Django REST Framework, featuring three-tier database synchronization, machine learning capabilities, and enterprise-grade functionality.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                  │
│                  IndexedDB (PouchDB) - Local                 │
└────────────────────┬────────────────────────────────────────┘
                     │ REST API (HTTPS)
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   Django REST Framework                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Authentication Layer (JWT)                          │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Layer (ViewSets, Serializers)                   │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Business Logic Layer (Models, Signals, Utils)       │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ML Layer (Sentiment Analysis, Predictions)          │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
┌──────────────┐ ┌──────────┐ ┌──────────────┐
│  PostgreSQL  │ │  Redis   │ │   Supabase   │
│   (Primary)  │ │ (Cache)  │ │   (Cloud)    │
└──────────────┘ └──────────┘ └──────────────┘
        │
        ▼
┌──────────────┐
│    Celery    │
│  (Workers)   │
└──────────────┘
```

## Technology Stack

### Backend
- **Framework**: Django 5.2.8
- **API**: Django REST Framework 3.15.2
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Database**: PostgreSQL 14+ (Production), SQLite (Development)
- **Cache**: Redis 7+
- **Task Queue**: Celery 5.4.0
- **ML**: scikit-learn, TextBlob, NLTK

### Infrastructure
- **Web Server**: Nginx
- **Application Server**: Gunicorn
- **Process Manager**: Supervisor
- **Cloud Sync**: Supabase

## Application Structure

```
Backend/
├── testproj/                 # Django project
│   ├── settings.py          # Configuration
│   ├── urls.py              # URL routing
│   ├── celery.py            # Celery config
│   └── wsgi.py              # WSGI entry point
│
├── users/                    # User management app
│   ├── models.py            # User, LoginAudit
│   ├── serializers.py       # User serializers
│   ├── views.py             # User ViewSets
│   └── urls.py              # User routes
│
├── attendance/               # Attendance tracking app
│   ├── models.py            # Attendance, OvertimeRecord
│   ├── serializers.py       # Attendance serializers
│   ├── views.py             # Attendance ViewSets
│   └── urls.py              # Attendance routes
│
├── leaves/                   # Leave management app
│   ├── models.py            # LeaveRequest, LeaveBalance
│   ├── serializers.py       # Leave serializers
│   ├── views.py             # Leave ViewSets
│   ├── ml_utils.py          # Sentiment analysis
│   ├── signals.py           # Auto sentiment analysis
│   └── urls.py              # Leave routes
│
├── payroll/                  # Payroll management app
│   ├── models.py            # Payrun, Payslip
│   ├── serializers.py       # Payroll serializers
│   ├── views.py             # Payroll ViewSets
│   ├── tasks.py             # Celery tasks
│   └── urls.py              # Payroll routes
│
├── analytics/                # Analytics & ML app
│   ├── models.py            # Sentiment, AttritionRisk
│   ├── serializers.py       # Analytics serializers
│   ├── views.py             # Analytics ViewSets
│   └── urls.py              # Analytics routes
│
└── sync/                     # Synchronization app
    ├── models.py            # SyncLog, DocumentFingerprint
    ├── serializers.py       # Sync serializers
    ├── views.py             # Sync ViewSets
    ├── sync_utils.py        # Sync utilities
    └── urls.py              # Sync routes
```

## Database Schema

### Core Tables

#### users_user
- Primary user table with role-based access
- Indexes: email, role, designation, department
- Relationships: One-to-Many with all other tables

#### attendance_attendance
- Daily attendance records
- Unique constraint: (employee, date)
- Indexes: employee+date, date, status+date

#### leaves_leave_request
- Leave applications with ML sentiment
- Indexes: employee+status, employee+start_date
- Triggers: Auto sentiment analysis on save

#### payroll_payslip
- Monthly payslips with digital fingerprint
- Unique constraint: (payrun, employee)
- Indexes: employee+payrun, fingerprint

#### sync_sync_log
- Audit trail for all sync operations
- Indexes: user+timestamp, status+timestamp

## Three-Tier Synchronization

### Tier 1: Local (IndexedDB)
- Offline-first storage in browser
- PouchDB for IndexedDB management
- Immediate data availability

### Tier 2: PostgreSQL (Primary)
- Central database server
- Source of truth for all data
- Optimized with indexes and caching

### Tier 3: Supabase (Cloud Backup)
- Cloud-based backup and sync
- Real-time capabilities
- Disaster recovery

### Sync Flow

```
User Action → IndexedDB (Local)
                    ↓
            PostgreSQL (Primary)
                    ↓
            Supabase (Cloud)
```

### Conflict Resolution
1. Timestamp-based (last write wins)
2. Document fingerprinting for integrity
3. Conflict logs for manual resolution

## Machine Learning Features

### 1. Sentiment Analysis
- **Library**: TextBlob
- **Input**: Leave request reason text
- **Output**: Sentiment score (-1 to 1), label, burnout risk
- **Keywords**: Stress, burnout, exhausted, overwhelmed, etc.

### 2. Attrition Risk Prediction
- **Factors**: Tenure, leave patterns, sentiment, salary
- **Output**: Risk score (0-100), risk level, recommendations
- **Thresholds**: High (60+), Medium (30-59), Low (<30)

### 3. Attendance Prediction
- **Factors**: Day of week, sentiment, recent leaves
- **Output**: Predicted absence probability
- **Use Case**: Workforce planning

## Performance Optimizations

### Database Level
1. **Indexing Strategy**
   - Single column indexes on frequently queried fields
   - Composite indexes for common query patterns
   - Covering indexes for read-heavy queries

2. **Query Optimization**
   - `select_related()` for ForeignKey joins
   - `prefetch_related()` for reverse relations
   - `only()` and `defer()` for column selection

3. **Connection Pooling**
   - `CONN_MAX_AGE = 600` (10 minutes)
   - Persistent database connections

### Application Level
1. **Caching Strategy**
   - Redis for session and query caching
   - Cache user profiles (2 hours)
   - Cache leave balances (1 hour)
   - Cache attendance stats (30 minutes)

2. **Pagination**
   - Default page size: 25
   - Cursor pagination for large datasets
   - Limit query results

3. **Async Tasks**
   - Celery for background processing
   - Payslip generation
   - Report generation
   - Email notifications

### API Level
1. **Response Optimization**
   - Minimal serializer fields
   - Nested serializers only when needed
   - Lazy loading of related data

2. **Rate Limiting**
   - Throttling for API endpoints
   - Per-user rate limits

## Security Features

### Authentication
- JWT token-based authentication
- Access token: 60 minutes
- Refresh token: 24 hours
- Token rotation on refresh

### Authorization
- Role-based access control (RBAC)
- Admin: Full access
- HR Officer: Employee management, leave approval
- Payroll Officer: Payroll management
- Employee: Own data only

### Security Measures
1. **Password Security**
   - PBKDF2 hashing
   - Minimum 8 characters
   - Complexity requirements

2. **Account Protection**
   - Account lockout after 5 failed attempts
   - 30-minute lockout duration
   - Login audit trail

3. **Data Protection**
   - HTTPS enforcement
   - CSRF protection
   - XSS prevention
   - SQL injection prevention (ORM)

4. **API Security**
   - CORS configuration
   - Rate limiting
   - Input validation
   - Output sanitization

## Monitoring & Logging

### Application Logs
- Request/response logging
- Error tracking
- Performance metrics

### Database Logs
- Slow query logging
- Connection pool stats
- Transaction logs

### Celery Logs
- Task execution logs
- Task failure logs
- Worker health

### Security Logs
- Login attempts
- Failed authentications
- Permission denials

## Scalability Considerations

### Horizontal Scaling
- Stateless application design
- Load balancer ready
- Session storage in Redis

### Vertical Scaling
- Database connection pooling
- Query optimization
- Caching strategy

### Database Scaling
- Read replicas for reporting
- Partitioning for large tables
- Archive old data

## Backup & Recovery

### Database Backups
- Daily automated backups
- 7-day retention
- Point-in-time recovery

### Application Backups
- Code repository (Git)
- Configuration files
- Media files

### Disaster Recovery
- Supabase cloud backup
- Multi-region deployment
- Failover procedures

## API Design Principles

### RESTful Design
- Resource-based URLs
- HTTP methods (GET, POST, PUT, DELETE)
- Status codes (200, 201, 400, 401, 404, 500)

### Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2025-11-08T12:00:00Z"
}
```

### Error Handling
- Consistent error format
- Descriptive error messages
- Error codes for client handling

### Versioning
- URL versioning (/api/v1/)
- Backward compatibility
- Deprecation notices

## Testing Strategy

### Unit Tests
- Model tests
- Serializer tests
- Utility function tests

### Integration Tests
- API endpoint tests
- Authentication tests
- Permission tests

### Performance Tests
- Load testing
- Stress testing
- Query performance

## Deployment Architecture

### Production Environment
```
Internet
    ↓
Nginx (Reverse Proxy + SSL)
    ↓
Gunicorn (4 workers)
    ↓
Django Application
    ↓
PostgreSQL + Redis
```

### High Availability Setup
```
Load Balancer
    ↓
┌─────────┬─────────┐
│  App 1  │  App 2  │
└─────────┴─────────┘
    ↓
PostgreSQL Primary
    ↓
PostgreSQL Replica
```

## Future Enhancements

1. **Advanced ML Features**
   - Predictive analytics
   - Anomaly detection
   - Recommendation engine

2. **Real-time Features**
   - WebSocket support
   - Live notifications
   - Real-time dashboards

3. **Mobile App**
   - Native mobile apps
   - Offline sync
   - Push notifications

4. **Blockchain Integration**
   - Document verification
   - Immutable audit trail
   - Smart contracts

5. **Advanced Reporting**
   - Custom report builder
   - Data visualization
   - Export to multiple formats

## Conclusion

WorkZen HRMS is designed as a scalable, secure, and performant system that can handle enterprise-level workloads while maintaining code quality and maintainability. The architecture supports future enhancements and can be easily extended with new features.
