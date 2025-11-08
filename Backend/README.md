# WorkZen HRMS Backend

Production-grade Django REST API for WorkZen HRMS with three-tier synchronization, ML features, and enterprise functionality.

## Features

- **User Management**: Role-based access control (Admin, HR Officer, Payroll Officer, Employee)
- **Attendance Tracking**: Daily attendance with overtime management
- **Leave Management**: Leave requests with sentiment analysis and burnout detection
- **Payroll System**: Automated payslip generation with digital fingerprinting
- **Analytics**: Employee sentiment tracking, attrition risk prediction, awards
- **Three-Tier Sync**: PostgreSQL (primary) + Supabase (cloud) + IndexedDB (local)
- **ML Features**: Sentiment analysis, burnout detection, attendance prediction

## Tech Stack

- Django 5.2.8
- Django REST Framework 3.15.2
- PostgreSQL / SQLite
- Redis (caching & Celery)
- Celery (background tasks)
- JWT Authentication
- Supabase (cloud sync)

## Quick Start

### 1. Install Dependencies

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt
```

### 2. Environment Setup

```bash
# Copy example env file
copy .env.example .env

# Edit .env with your configuration
```

### 3. Database Setup

```bash
# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### 4. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## API Documentation

- Swagger UI: `http://localhost:8000/api/docs/`
- OpenAPI Schema: `http://localhost:8000/api/schema/`

## API Endpoints

### Authentication
- `POST /api/token/` - Obtain JWT token
- `POST /api/token/refresh/` - Refresh JWT token
- `POST /api/users/register/` - Register new user
- `POST /api/users/login/` - User login
- `GET /api/users/me/` - Get current user profile

### Users
- `GET /api/users/` - List users
- `POST /api/users/` - Create user
- `GET /api/users/{id}/` - Get user details
- `PUT /api/users/{id}/` - Update user
- `DELETE /api/users/{id}/` - Delete user

### Attendance
- `GET /api/attendance/attendance/` - List attendance records
- `POST /api/attendance/attendance/` - Mark attendance
- `GET /api/attendance/attendance/my_attendance/` - Get my attendance
- `GET /api/attendance/attendance/statistics/` - Get attendance stats
- `GET /api/attendance/overtime/` - List overtime records

### Leaves
- `GET /api/leaves/requests/` - List leave requests
- `POST /api/leaves/requests/` - Create leave request
- `POST /api/leaves/requests/{id}/approve/` - Approve leave
- `POST /api/leaves/requests/{id}/reject/` - Reject leave
- `GET /api/leaves/balances/my_balance/` - Get my leave balance

### Payroll
- `GET /api/payroll/payruns/` - List payruns
- `POST /api/payroll/payruns/` - Create payrun
- `GET /api/payroll/payslips/` - List payslips
- `GET /api/payroll/payslips/my_payslips/` - Get my payslips

### Analytics
- `GET /api/analytics/sentiment/` - Employee sentiment data
- `GET /api/analytics/attrition/` - Attrition risk predictions
- `GET /api/analytics/awards/` - Employee awards
- `GET /api/analytics/predictions/` - Attendance predictions

### Sync
- `GET /api/sync/logs/` - Sync logs
- `GET /api/sync/logs/my_sync_logs/` - My sync logs
- `POST /api/sync/fingerprints/verify/` - Verify document fingerprint

## Database Schema

### Core Models
- **User**: Extended user model with role-based access
- **Attendance**: Daily attendance tracking
- **LeaveRequest**: Leave applications with ML sentiment analysis
- **LeaveBalance**: Leave balance tracking per employee
- **Payrun**: Monthly payroll cycle
- **Payslip**: Individual employee payslips
- **SyncLog**: Three-tier synchronization tracking

## Performance Optimizations

### Database Indexing
- Composite indexes on frequently queried fields
- Foreign key indexes for join optimization
- Date range indexes for time-based queries

### Query Optimization
- `select_related()` for ForeignKey relations
- `prefetch_related()` for reverse relations
- Query result caching with Redis

### Caching Strategy
- User profiles cached for 2 hours
- Leave balances cached for 1 hour
- Attendance stats cached for 30 minutes

## Background Tasks (Celery)

### Available Tasks
- `generate_payslips_for_payrun` - Generate payslips for all employees

### Running Celery Worker

```bash
# Start Celery worker
celery -A testproj worker -l info

# Start Celery beat (for scheduled tasks)
celery -A testproj beat -l info
```

## Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=.
```

## Production Deployment

### 1. Update Settings
- Set `DEBUG=False`
- Configure PostgreSQL database
- Set strong `SECRET_KEY`
- Configure Redis for caching
- Set up Supabase for cloud sync

### 2. Collect Static Files
```bash
python manage.py collectstatic
```

### 3. Run with Gunicorn
```bash
gunicorn testproj.wsgi:application --bind 0.0.0.0:8000
```

### 4. Set up Nginx (reverse proxy)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /media/ {
        alias /path/to/media/;
    }
}
```

## Security Features

- JWT token authentication
- Password hashing with Django's PBKDF2
- Account lockout after 5 failed login attempts
- Login audit trail
- CORS configuration
- CSRF protection

## ML Features

### Sentiment Analysis
- Analyzes leave request reasons
- Detects burnout risk keywords
- Sentiment scoring (-1 to 1)

### Attrition Risk Prediction
- Factors: tenure, leave patterns, sentiment, salary
- Risk levels: Low, Medium, High
- Actionable recommendations

## Three-Tier Sync Architecture

1. **Local (IndexedDB)**: Offline-first storage in browser
2. **PostgreSQL**: Primary database server
3. **Supabase**: Cloud backup and sync

### Sync Flow
- Changes made locally → Sync to PostgreSQL → Sync to Supabase
- Conflict resolution using timestamps
- Document fingerprinting for integrity verification

## Support

For issues and questions, please contact the development team.

## License

Proprietary - WorkZen HRMS © 2025
