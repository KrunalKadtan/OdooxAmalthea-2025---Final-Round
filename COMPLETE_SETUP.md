# WorkZen HRMS - Complete Setup Guide

## Full Stack Setup (Backend + Frontend)

### Prerequisites

- Python 3.10+
- PostgreSQL 18
- Node.js 16+

---

## Part 1: Backend Setup

### 1. Database Setup

Open PostgreSQL (pgAdmin or psql):

```sql
CREATE USER workzen_user WITH PASSWORD 'WorkZen@2025';
ALTER USER workzen_user WITH SUPERUSER;
CREATE DATABASE workzen_db OWNER workzen_user;
\c workzen_db
GRANT ALL ON SCHEMA public TO workzen_user;
ALTER SCHEMA public OWNER TO workzen_user;
```

### 2. Backend Installation

```cmd
cd Test\Backend
python -m venv venv
venv\Scripts\activate
pip install --upgrade pip setuptools
pip install -r requirements.txt
```

### 3. Configure Environment

The `.env` file is already configured. Verify it has:
```env
DB_PASSWORD=WorkZen@2025
CORS_ALLOWED_ORIGINS=http://localhost:3001
```

### 4. Run Migrations

```cmd
python manage.py makemigrations accounts
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser

```cmd
python manage.py createsuperuser
```

Enter:
- Username: `admin`
- Email: `admin@workzen.com`
- Password: `Admin@123`

### 6. Start Backend Server

```cmd
python manage.py runserver 8000
```

Keep this terminal open. Backend runs on: http://localhost:8000

---

## Part 2: Frontend Setup

### 1. Install Dependencies

Open a **NEW terminal**:

```cmd
cd Test
npm install
```

### 2. Start Frontend Server

```cmd
npm run dev
```

Frontend will open automatically on: http://localhost:3001

---

## Testing the Application

### 1. Test Backend API

Visit: http://localhost:8000/api/

You should see the API root with available endpoints.

### 2. Test Admin Panel

Visit: http://localhost:8000/admin/

Login with:
- Username: `admin`
- Password: `Admin@123`

### 3. Test Frontend

Visit: http://localhost:3001

The React app should load with login page.

### 4. Test Integration

Try logging in on the frontend with your admin credentials.

---

## Quick Start Commands

### Terminal 1 (Backend):
```cmd
cd Test\Backend
venv\Scripts\activate
python manage.py runserver 8000
```

### Terminal 2 (Frontend):
```cmd
cd Test
npm run dev
```

---

## Project URLs

- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:8000/api/
- **Admin Panel:** http://localhost:8000/admin/
- **API Health:** http://localhost:8000/api/health/

---

## Troubleshooting

### Backend Issues

**Error: "permission denied for schema public"**
```sql
\c workzen_db
ALTER SCHEMA public OWNER TO workzen_user;
```

**Error: "No module named 'psycopg'"**
```cmd
pip install setuptools
pip install -r requirements.txt
```

### Frontend Issues

**Error: "npm is not recognized"**
- Install Node.js from https://nodejs.org/

**Error: "CORS error"**
- Check backend .env has: `CORS_ALLOWED_ORIGINS=http://localhost:3001`
- Restart backend server

**Error: "Cannot connect to API"**
- Make sure backend is running on port 8000
- Visit http://localhost:8000/api/health/

---

## Development Workflow

1. **Start Backend** (Terminal 1)
   ```cmd
   cd Test\Backend
   venv\Scripts\activate
   python manage.py runserver 8000
   ```

2. **Start Frontend** (Terminal 2)
   ```cmd
   cd Test
   npm run dev
   ```

3. **Develop**
   - Backend code: `Test/Backend/`
   - Frontend code: `Test/src/`
   - Make changes and they'll auto-reload

4. **Test**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:8000/api/
   - Admin: http://localhost:8000/admin/

---

## Next Steps

1. ✅ Backend is running
2. ✅ Frontend is running
3. ✅ Database is connected
4. 🎯 Start developing features!

### Backend Development
- Add new API endpoints in `Backend/*/views.py`
- Create new models in `Backend/*/models.py`
- Test APIs in admin panel or Postman

### Frontend Development
- Edit components in `Test/src/components/`
- Add new pages
- Connect to backend APIs
- Implement authentication flow

---

## Production Deployment

### Backend
1. Set `DEBUG=False` in .env
2. Change SECRET_KEY and JWT_SECRET_KEY
3. Use Gunicorn + Nginx
4. Setup HTTPS

### Frontend
1. Build: `npm run build`
2. Deploy `dist/` folder
3. Update API URL to production backend

---

**Setup Complete! Both backend and frontend are ready.** 🎉

**Access your application at: http://localhost:3001**
