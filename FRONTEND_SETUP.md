# WorkZen HRMS - Frontend Setup

## Prerequisites

- Node.js 16+ installed
- Backend running on http://localhost:8000

## Quick Start

### 1. Install Dependencies

```cmd
cd Test
npm install
```

### 2. Start Development Server

```cmd
npm run dev
```

The frontend will start on: http://localhost:5173 (or http://localhost:3000)

### 3. Open in Browser

Visit: http://localhost:5173

## Project Structure

```
Test/
├── src/
│   ├── components/
│   │   ├── LoginPage.jsx       # Login page
│   │   ├── RegisterPage.jsx    # Registration page
│   │   ├── EmployeesPage.jsx   # Employees list
│   │   ├── Header.jsx          # Header component
│   │   ├── Sidebar.jsx         # Sidebar navigation
│   │   └── BlankPage.jsx       # Blank template
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── index.html                  # HTML template
├── package.json                # Dependencies
└── vite.config.js              # Vite configuration
```

## Available Scripts

```cmd
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Backend Integration

The frontend expects the backend API at:
- **Development:** http://localhost:8000/api/
- **Production:** Update in environment variables

### API Endpoints Used

- POST `/api/auth/login/` - User login
- POST `/api/auth/register/` - User registration
- GET `/api/users/profile/` - Get user profile
- GET `/api/attendance/` - Attendance data
- GET `/api/leaves/` - Leave data
- GET `/api/payroll/` - Payroll data

## Environment Variables

Create `.env` file in Test folder:

```env
VITE_API_URL=http://localhost:8000/api
```

## Connecting to Backend

### 1. Make sure backend is running:

```cmd
cd Test\Backend
venv\Scripts\activate
python manage.py runserver 8000
```

### 2. Start frontend:

```cmd
cd Test
npm run dev
```

### 3. Test the connection:

- Open http://localhost:5173
- Try logging in with your superuser credentials
- Username: `admin`
- Password: (what you set during createsuperuser)

## Troubleshooting

### Issue: "npm is not recognized"
**Solution:** Install Node.js from https://nodejs.org/

### Issue: "CORS error"
**Solution:** Backend already configured for CORS. Make sure backend is running.

### Issue: "Cannot connect to API"
**Solution:** 
1. Check backend is running on port 8000
2. Visit http://localhost:8000/api/health/ to verify

### Issue: "Port 5173 already in use"
**Solution:** Kill the process or use different port:
```cmd
npm run dev -- --port 3000
```

## Development Workflow

### 1. Start Backend (Terminal 1)
```cmd
cd Test\Backend
venv\Scripts\activate
python manage.py runserver 8000
```

### 2. Start Frontend (Terminal 2)
```cmd
cd Test
npm run dev
```

### 3. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/
- Admin Panel: http://localhost:8000/admin/

## Building for Production

### 1. Build frontend:
```cmd
npm run build
```

This creates a `dist/` folder with optimized files.

### 2. Preview production build:
```cmd
npm run preview
```

### 3. Deploy:
- Upload `dist/` folder to your web server
- Configure backend URL in production environment

## Next Steps

1. **Customize components** in `src/components/`
2. **Add API integration** for all features
3. **Implement authentication** flow
4. **Add routing** for different pages
5. **Connect to backend** endpoints

---

**Frontend is ready! Start with `npm run dev`** 🚀
