# WorkZen HRMS - Complete Setup Guide

## Prerequisites

- Python 3.10+ (Python 3.13 supported)
- PostgreSQL 15+ (PostgreSQL 18 supported ✅)
- Git (optional)

## Step 1: PostgreSQL Setup

### PostgreSQL 18 Installed ✅

You already have PostgreSQL 18 installed, which is perfect!

### Create Database

Open Command Prompt and run:

```cmd
psql -U postgres
```

Copy and paste these commands:

```sql
CREATE USER workzen_user WITH PASSWORD 'WorkZen@2025';
ALTER USER workzen_user CREATEDB;
ALTER USER workzen_user WITH SUPERUSER;
CREATE DATABASE workzen_db OWNER workzen_user;
\c workzen_db
GRANT ALL ON SCHEMA public TO workzen_user;
ALTER SCHEMA public OWNER TO workzen_user;
\q
```

**See DATABASE_QUERIES.md for detailed SQL commands**

## Step 2: Backend Setup

### Navigate to Backend Directory

```cmd
cd Test\Backend
```

### Create Virtual Environment

```cmd
python -m venv venv
```

### Activate Virtual Environment

```cmd
venv\Scripts\activate
```

You should see `(venv)` in your prompt.

### Upgrade pip

```cmd
python -m pip install --upgrade pip
```

### Install Dependencies

```cmd
pip install setuptools
pip install -r requirements.txt
```

This will install:
- Django 4.2.7
- Django REST Framework
- PostgreSQL adapter (psycopg3)
- JWT authentication
- ML libraries (TextBlob, scikit-learn)
- PDF generation (ReportLab)
- And more...

## Step 3: Environment Configuration

### Create .env File

```cmd
copy .env.example .env
```

### Edit .env File

Open `.env` in a text editor and verify these settings:

```env
SECRET_KEY=django-insecure-workzen-hrms-change-this-in-production-key
DEBUG=True
DB_NAME=workzen_db
DB_USER=workzen_user
DB_PASSWORD=WorkZen@2025
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET_KEY=your-jwt-secret-key-change-this
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

**See DATABASE_CONNECTION.md for detailed configuration**

## Step 4: Database Migrations

### Create Migrations

```cmd
python manage.py makemigrations accounts
python manage.py makemigrations
```

### Run Migrations

```cmd
python manage.py migrate
```

Expected output:
```
Operations to perform:
  Apply all migrations: accounts, admin, analytics, attendance, auth, contenttypes, leaves, payroll, sessions, sync, workflows
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  ...
```

## Step 5: Create Superuser

```cmd
python manage.py createsuperuser
```

Enter details:
- Username: `admin`
- Email: `admin@workzen.com`
- Password: `Admin@123` (or your choice)

## Step 6: Start Development Server

```cmd
python manage.py runserver 8000
```

Expected output:
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

## Step 7: Verify Installation

### Test API Root

Open browser: http://localhost:8000/api/

You should see the API root with available endpoints.

### Test Admin Panel

Open browser: http://localhost:8000/admin/

Login with superuser credentials.

### Test Health Check

Open browser: http://localhost:8000/api/health/

Should return:
```json
{
  "postgres_online": true,
  "supabase_online": false,
  "timestamp": "2025-11-08T..."
}
```

## Quick Setup Commands

For experienced users, here's the complete setup in one go:

```cmd
# 1. Database (in psql)
CREATE USER workzen_user WITH PASSWORD 'WorkZen@2025';
ALTER USER workzen_user WITH SUPERUSER;
CREATE DATABASE workzen_db OWNER workzen_user;
\c workzen_db
GRANT ALL ON SCHEMA public TO workzen_user;
ALTER SCHEMA public OWNER TO workzen_user;
\q

# 2. Backend
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

## Troubleshooting

### Issue: "psql is not recognized"
**Solution:** Add PostgreSQL to PATH:
`C:\Program Files\PostgreSQL\15\bin`

### Issue: "python is not recognized"
**Solution:** Install Python and add to PATH

### Issue: "permission denied for schema public"
**Solution:** Run in psql:
```sql
\c workzen_db
ALTER SCHEMA public OWNER TO workzen_user;
\q
```

### Issue: "No module named 'psycopg'"
**Solution:**
```cmd
pip install setuptools
pip install -r requirements.txt
```

### Issue: "Database connection failed"
**Solution:** Check .env file has correct password: `WorkZen@2025`

### Issue: "Port 8000 already in use"
**Solution:** Use different port:
```cmd
python manage.py runserver 8001
```

## Project Structure

```
Backend/
├── manage.py              # Django management script
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables (create this)
├── .env.example          # Environment template
│
├── workzen/              # Main Django project
│   ├── settings.py       # Django settings
│   ├── urls.py           # URL routing
│   └── ...
│
├── accounts/             # User & Authentication
├── attendance/           # Attendance Management
├── leaves/               # Leave Management
├── payroll/              # Payroll & PDF Generation
├── analytics/            # ML Analytics
├── sync/                 # Database Sync
└── workflows/            # Workflow Management
```

## API Endpoints

After setup, available endpoints:

- **Authentication:**
  - POST `/api/auth/register/` - Register user
  - POST `/api/auth/login/` - Login
  - POST `/api/auth/change-password-first-login/` - Change password

- **Users:**
  - GET `/api/users/profile/` - Get profile
  - PUT `/api/users/profile/` - Update profile

- **Attendance:**
  - POST `/api/attendance/mark/` - Mark attendance
  - GET `/api/attendance/history/` - Get history
  - POST `/api/attendance/overtime/` - Mark overtime

- **Leaves:**
  - POST `/api/leaves/apply/` - Apply leave
  - GET `/api/leaves/balance/` - Get balance
  - GET `/api/leaves/pending/` - Pending approvals

- **Payroll:**
  - GET `/api/payroll/payslips/` - Get payslips
  - GET `/api/payroll/payslips/{id}/pdf/` - Download PDF
  - POST `/api/payroll/generate/` - Generate payroll

- **Analytics:**
  - GET `/api/analytics/sentiment-dashboard/` - Sentiment analysis
  - GET `/api/analytics/employee-of-month/` - EOTM
  - GET `/api/analytics/attrition-risk/` - Attrition prediction

- **Sync:**
  - GET `/api/health/` - Health check
  - POST `/api/write/` - Write document
  - GET `/api/verify/{doc_id}/` - Verify document

## Features

✅ JWT Authentication with 4 user roles  
✅ Attendance tracking with overtime  
✅ Leave management with ML sentiment analysis  
✅ Automated payroll with PDF generation  
✅ Employee of Month auto-selection  
✅ Attrition risk prediction  
✅ Three-tier database sync  
✅ 40+ RESTful API endpoints  

## Next Steps

1. **Test API endpoints** using Postman or cURL
2. **Connect frontend** (React app in Test/Frontend)
3. **Load sample data** (optional)
4. **Configure Supabase** for cloud backup (optional)
5. **Setup Redis** for background tasks (optional)

## Support

- **Database issues:** See DATABASE_QUERIES.md
- **Connection issues:** See DATABASE_CONNECTION.md
- **API documentation:** Check Django admin or use DRF browsable API

## Production Deployment

For production:
1. Set `DEBUG=False` in .env
2. Change `SECRET_KEY` and `JWT_SECRET_KEY`
3. Use strong database password
4. Configure HTTPS
5. Setup Gunicorn + Nginx
6. Enable database backups

---

**Setup complete! Your WorkZen HRMS backend is ready.** 🎉

Visit: http://localhost:8000/api/
