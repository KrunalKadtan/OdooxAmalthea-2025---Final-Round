# WorkZen HRMS Backend

A comprehensive Human Resource Management System backend built with Django REST Framework.

## Quick Start

1. **Setup Database** (see DATABASE_QUERIES.md)
2. **Install Dependencies** (see SETUP.md)
3. **Configure Environment** (see DATABASE_CONNECTION.md)
4. **Run Migrations**
5. **Start Server**

## Documentation

- **SETUP.md** - Complete setup guide
- **DATABASE_QUERIES.md** - PostgreSQL setup commands
- **DATABASE_CONNECTION.md** - Database configuration

## Features

- JWT Authentication (4 user roles)
- Attendance Management
- Leave Management with ML Sentiment Analysis
- Payroll with PDF Generation
- Employee Analytics
- Three-Tier Database Sync

## Tech Stack

- Django 4.2.7
- Django REST Framework
- PostgreSQL 15+ (psycopg3) - PostgreSQL 18 supported ✅
- TextBlob (Sentiment Analysis)
- scikit-learn (ML)
- ReportLab (PDF)

## Installation

```cmd
cd Test\Backend
python -m venv venv
venv\Scripts\activate
pip install --upgrade pip setuptools
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 8000
```

## API Endpoints

- `/api/auth/` - Authentication
- `/api/users/` - User management
- `/api/attendance/` - Attendance tracking
- `/api/leaves/` - Leave management
- `/api/payroll/` - Payroll & PDF
- `/api/analytics/` - ML Analytics
- `/api/health/` - Health check

## Support

See SETUP.md for detailed instructions and troubleshooting.
