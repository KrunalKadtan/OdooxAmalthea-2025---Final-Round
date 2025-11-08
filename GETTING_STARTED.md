# 🚀 WorkZen HRMS - Getting Started Guide

Welcome! This guide will help you get the WorkZen HRMS system up and running.

## 📋 What You Have

A complete HRMS system with:
- **Backend:** Django REST API (Test/Backend/)
- **Frontend:** React Application (Test/Frontend/ - if exists)
- **Database:** PostgreSQL with optional Supabase backup
- **Features:** 40+ API endpoints, ML analytics, PDF generation

## 🎯 Quick Navigation

### For Backend Setup
👉 Go to: `Test/Backend/START_HERE.md`

### For API Reference
👉 Go to: `Test/Backend/API_DOCUMENTATION.md`

### For Complete Overview
👉 Go to: `Test/Backend/PROJECT_SUMMARY.md`

## ⚡ Super Quick Start (10 Minutes)

### Step 1: Install PostgreSQL (if not installed)
Download from: https://www.postgresql.org/download/

### Step 2: Create Database
```cmd
psql -U postgres
```
```sql
CREATE USER workzen_user WITH PASSWORD 'WorkZen@2025';
ALTER USER workzen_user CREATEDB;
CREATE DATABASE workzen_db OWNER workzen_user;
GRANT ALL PRIVILEGES ON DATABASE workzen_db TO workzen_user;
\q
```

### Step 3: Setup Backend
```cmd
cd Test\Backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Step 4: Configure Environment
```cmd
copy .env.example .env
```
Edit `.env` and set:
```
DB_PASSWORD=WorkZen@2025
```

### Step 5: Initialize Database
```cmd
python manage.py migrate
python manage.py createsuperuser
```
Create admin user:
- Username: admin
- Email: admin@workzen.com
- Password: Admin@123 (or your choice)

### Step 6: Start Server
```cmd
python manage.py runserver 8000
```

### Step 7: Test
Open browser: http://localhost:8000/api/

You should see the API root!

## 🎓 What's Next?

### 1. Explore the API
Visit: http://localhost:8000/api/

Available endpoints:
- `/api/auth/login/` - Login
- `/api/users/profile/` - User profile
- `/api/attendance/mark/` - Mark attendance
- `/api/leaves/apply/` - Apply for leave
- `/api/payroll/payslips/` - View payslips
- `/api/analytics/employee-of-month/` - EOTM
- `/api/health/` - Health check

### 2. Test with Admin Panel
Visit: http://localhost:8000/admin/
Login with your superuser credentials

### 3. Test API with cURL
```bash
# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'

# Health Check
curl http://localhost:8000/api/health/
```

### 4. Read Documentation
- **API Reference:** `Backend/API_DOCUMENTATION.md`
- **Setup Guide:** `Backend/SETUP_GUIDE.md`
- **Database Setup:** `Backend/DATABASE_SETUP.md`

## 📚 Documentation Structure

```
Test/
├── GETTING_STARTED.md          ← You are here
├── README.md                   ← Project overview
│
└── Backend/
    ├── START_HERE.md           ← Backend navigation
    ├── QUICKSTART.md           ← 5-minute setup
    ├── SETUP_GUIDE.md          ← Detailed setup
    ├── DATABASE_SETUP.md       ← Database config
    ├── API_DOCUMENTATION.md    ← API reference
    ├── DEPLOYMENT_GUIDE.md     ← Production deploy
    ├── PROJECT_SUMMARY.md      ← Complete overview
    ├── COMPLETE_SETUP_COMMANDS.md  ← Copy-paste commands
    ├── FINAL_CHECKLIST.md      ← Implementation checklist
    └── README.md               ← Backend overview
```

## 🎯 Choose Your Path

### Path 1: Quick Demo (5 minutes)
1. Follow "Super Quick Start" above
2. Visit http://localhost:8000/api/
3. Test with admin panel

### Path 2: Complete Setup (15 minutes)
1. Read `Backend/SETUP_GUIDE.md`
2. Follow all steps carefully
3. Test all features

### Path 3: API Integration (For Frontend Devs)
1. Start backend (Quick Start above)
2. Read `Backend/API_DOCUMENTATION.md`
3. Test endpoints with Postman/cURL
4. Integrate with your frontend

### Path 4: Production Deployment
1. Complete setup locally
2. Read `Backend/DEPLOYMENT_GUIDE.md`
3. Configure production settings
4. Deploy to server

## 🔧 System Requirements

### Required
- Python 3.10 or higher
- PostgreSQL 15
- pip (Python package manager)
- 2GB RAM minimum
- 1GB disk space

### Optional
- Redis (for Celery background tasks)
- Supabase account (for cloud backup)
- Docker (for containerized deployment)

## 🆘 Troubleshooting

### Issue: "psql is not recognized"
**Solution:** Add PostgreSQL to PATH:
`C:\Program Files\PostgreSQL\15\bin`

### Issue: "python is not recognized"
**Solution:** Install Python from python.org and add to PATH

### Issue: "pip install fails"
**Solution:** 
```cmd
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Issue: "Database connection failed"
**Solution:** 
1. Check PostgreSQL is running
2. Verify .env DB_PASSWORD matches PostgreSQL password
3. Test connection: `psql -U workzen_user -d workzen_db`

### Issue: "Port 8000 already in use"
**Solution:** 
```cmd
python manage.py runserver 8001
```

### Issue: "Module not found"
**Solution:** 
```cmd
venv\Scripts\activate
pip install -r requirements.txt
```

## 📞 Need More Help?

### For Setup Issues
→ `Backend/SETUP_GUIDE.md` (Troubleshooting section)

### For Database Issues
→ `Backend/DATABASE_SETUP.md`

### For API Questions
→ `Backend/API_DOCUMENTATION.md`

### For Deployment
→ `Backend/DEPLOYMENT_GUIDE.md`

## ✅ Verification Checklist

After setup, verify:
- [ ] PostgreSQL is running
- [ ] Database `workzen_db` exists
- [ ] Virtual environment is activated
- [ ] Dependencies are installed
- [ ] Migrations are applied
- [ ] Superuser is created
- [ ] Server starts without errors
- [ ] Can access http://localhost:8000/api/
- [ ] Can login to admin panel
- [ ] Health check returns success

## 🎉 Success!

If you can access http://localhost:8000/api/ and see the API root, you're all set!

### What You Can Do Now:
✅ Test API endpoints  
✅ Create users via admin panel  
✅ Mark attendance  
✅ Apply for leaves  
✅ Generate payroll  
✅ View analytics  
✅ Connect your frontend  

## 🚀 Ready to Build!

Your WorkZen HRMS backend is ready. Time to:
1. Test the APIs
2. Connect your frontend
3. Add sample data
4. Demo your project
5. Deploy to production

**Happy coding! 🎊**

---

**Need detailed instructions?**
→ Start with `Backend/START_HERE.md`

**Want to dive into code?**
→ Check `Backend/PROJECT_SUMMARY.md`

**Ready to deploy?**
→ Follow `Backend/DEPLOYMENT_GUIDE.md`
