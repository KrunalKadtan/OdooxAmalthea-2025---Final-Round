# WorkZen HRMS - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Option 1: Automated Setup (Recommended)

```bash
# Windows
setup.bat

# That's it! The script will:
# ✅ Create virtual environment
# ✅ Install dependencies
# ✅ Create .env file
# ✅ Run migrations
# ✅ Seed initial data
```

### Option 2: Manual Setup

```bash
# 1. Create virtual environment
python -m venv venv

# 2. Activate virtual environment
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env file
copy .env.example .env  # Windows
cp .env.example .env    # Linux/Mac

# 5. Run migrations
python manage.py makemigrations
python manage.py migrate

# 6. Seed initial data
python manage.py seed_data

# 7. Start server
python manage.py runserver
```

## 🎯 Test the API

### 1. Open API Documentation
```
http://localhost:8000/api/docs/
```

### 2. Login as Admin
```bash
POST http://localhost:8000/api/users/login/
Content-Type: application/json

{
  "email": "admin@workzen.com",
  "password": "admin123"
}
```

### 3. Copy the Access Token
```json
{
  "success": true,
  "data": {
    "tokens": {
      "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."  ← Copy this
    }
  }
}
```

### 4. Test Protected Endpoint
```bash
GET http://localhost:8000/api/users/me/
Authorization: Bearer <paste_token_here>
```

## 📝 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | admin@workzen.com | admin123 |
| 👔 HR Officer | hr@workzen.com | hr123 |
| 💰 Payroll Officer | payroll@workzen.com | payroll123 |
| 👤 Employee | john@workzen.com | employee123 |

## 🧪 Test Key Features

### 1. Mark Attendance
```bash
POST http://localhost:8000/api/attendance/attendance/
Authorization: Bearer <token>
Content-Type: application/json

{
  "employee": "<employee_uuid>",
  "date": "2025-11-08",
  "status": "present",
  "check_in_time": "09:00:00",
  "check_out_time": "18:00:00"
}
```

### 2. Create Leave Request (with ML Sentiment Analysis)
```bash
POST http://localhost:8000/api/leaves/requests/
Authorization: Bearer <token>
Content-Type: application/json

{
  "employee": "<employee_uuid>",
  "leave_type": "casual",
  "start_date": "2025-11-15",
  "end_date": "2025-11-17",
  "reason": "Feeling stressed and need a break"
}

# Response will include:
# - sentiment_score: -0.5 (negative)
# - sentiment_label: "negative"
# - burnout_risk_detected: true
```

### 3. Get My Leave Balance
```bash
GET http://localhost:8000/api/leaves/balances/my_balance/?year=2025
Authorization: Bearer <token>
```

### 4. Approve Leave (HR/Admin only)
```bash
POST http://localhost:8000/api/leaves/requests/<leave_id>/approve/
Authorization: Bearer <token>
Content-Type: application/json

{
  "comments": "Approved"
}
```

## 📊 Available Endpoints

### Authentication
- `POST /api/token/` - Get JWT token
- `POST /api/token/refresh/` - Refresh token
- `POST /api/users/register/` - Register
- `POST /api/users/login/` - Login

### Users
- `GET /api/users/` - List users
- `GET /api/users/me/` - My profile
- `POST /api/users/` - Create user

### Attendance
- `GET /api/attendance/attendance/` - List
- `POST /api/attendance/attendance/` - Mark
- `GET /api/attendance/attendance/my_attendance/` - My records
- `GET /api/attendance/attendance/statistics/` - Stats

### Leaves
- `GET /api/leaves/requests/` - List
- `POST /api/leaves/requests/` - Create
- `POST /api/leaves/requests/{id}/approve/` - Approve
- `POST /api/leaves/requests/{id}/reject/` - Reject
- `GET /api/leaves/balances/my_balance/` - My balance

### Payroll
- `GET /api/payroll/payslips/` - List
- `GET /api/payroll/payslips/my_payslips/` - My payslips

### Analytics
- `GET /api/analytics/sentiment/` - Sentiment data
- `GET /api/analytics/attrition/` - Attrition risks

## 🔧 Common Tasks

### Create a New Employee
```bash
POST http://localhost:8000/api/users/register/
Content-Type: application/json

{
  "username": "newemployee",
  "email": "new@workzen.com",
  "password": "Employee@123",
  "password_confirm": "Employee@123",
  "first_name": "New",
  "last_name": "Employee",
  "role": "employee",
  "designation": "Software Engineer",
  "department": "Engineering",
  "basic_salary": 50000
}
```

### Get Attendance Statistics
```bash
GET /api/attendance/attendance/statistics/?month=11&year=2025
Authorization: Bearer <token>

# Response:
{
  "success": true,
  "data": {
    "total_days": 20,
    "present": 18,
    "absent": 1,
    "leave": 1,
    "half_day": 0,
    "wfh": 0
  }
}
```

### Filter Leave Requests by Status
```bash
GET /api/leaves/requests/?status=pending
Authorization: Bearer <token>
```

## 🐛 Troubleshooting

### Issue: Module not found
```bash
# Solution: Install dependencies
pip install -r requirements.txt
```

### Issue: Database error
```bash
# Solution: Run migrations
python manage.py makemigrations
python manage.py migrate
```

### Issue: No users found
```bash
# Solution: Seed data
python manage.py seed_data
```

### Issue: Token expired
```bash
# Solution: Use refresh token
POST /api/token/refresh/
{
  "refresh": "<refresh_token>"
}
```

## 📚 Documentation

- **README.md** - Full documentation
- **API_TESTING.md** - API testing examples
- **DEPLOYMENT.md** - Production deployment
- **ARCHITECTURE.md** - System architecture
- **PROJECT_SUMMARY.md** - Quick reference

## 🎓 Learning Path

1. **Start Here** (5 min)
   - Run setup.bat
   - Test login endpoint
   - View API docs

2. **Basic Features** (15 min)
   - Mark attendance
   - Create leave request
   - View leave balance

3. **Advanced Features** (30 min)
   - Test ML sentiment analysis
   - Approve/reject leaves
   - Generate payslips

4. **Production** (1 hour)
   - Read DEPLOYMENT.md
   - Configure PostgreSQL
   - Deploy to server

## 💡 Tips

1. **Use API Documentation**
   - Interactive Swagger UI at `/api/docs/`
   - Test endpoints directly in browser

2. **Check Response Format**
   - All responses follow consistent format
   - `success`, `message`, `data` fields

3. **Use Pagination**
   - Add `?page=1&page_size=25` to list endpoints
   - Default page size is 25

4. **Filter Data**
   - Use query parameters for filtering
   - Example: `?status=pending&month=11`

5. **Role-Based Access**
   - Admin: Full access
   - HR: Employee management
   - Payroll: Payroll management
   - Employee: Own data only

## 🚀 Next Steps

1. ✅ Complete setup
2. ✅ Test basic endpoints
3. ✅ Test ML features
4. ✅ Read documentation
5. ✅ Deploy to production

## 📞 Need Help?

1. Check documentation files
2. Review error messages
3. Check logs: `python manage.py runserver`
4. Contact development team

## 🎉 You're Ready!

Your WorkZen HRMS backend is now running!

- API: http://localhost:8000/api/
- Docs: http://localhost:8000/api/docs/
- Admin: http://localhost:8000/admin/

Happy coding! 🚀
