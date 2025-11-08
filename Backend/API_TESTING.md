# WorkZen HRMS API Testing Guide

## Quick Start

### 1. Register a New User

```bash
POST http://localhost:8000/api/users/register/
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@workzen.com",
  "password": "Test@123",
  "password_confirm": "Test@123",
  "first_name": "Test",
  "last_name": "User",
  "role": "employee",
  "designation": "Software Engineer",
  "department": "Engineering",
  "basic_salary": 50000,
  "hra_percentage": 40,
  "da_percentage": 50
}
```

### 2. Login

```bash
POST http://localhost:8000/api/users/login/
Content-Type: application/json

{
  "email": "admin@workzen.com",
  "password": "admin123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "tokens": {
      "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
      "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
    }
  }
}
```

### 3. Get Current User Profile

```bash
GET http://localhost:8000/api/users/me/
Authorization: Bearer <access_token>
```

### 4. Mark Attendance

```bash
POST http://localhost:8000/api/attendance/attendance/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "employee": "<employee_uuid>",
  "date": "2025-11-08",
  "status": "present",
  "check_in_time": "09:00:00",
  "check_out_time": "18:00:00"
}
```

### 5. Create Leave Request

```bash
POST http://localhost:8000/api/leaves/requests/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "employee": "<employee_uuid>",
  "leave_type": "casual",
  "start_date": "2025-11-15",
  "end_date": "2025-11-17",
  "reason": "Family function"
}
```

### 6. Get My Leave Balance

```bash
GET http://localhost:8000/api/leaves/balances/my_balance/?year=2025
Authorization: Bearer <access_token>
```

### 7. Approve Leave Request (HR/Admin only)

```bash
POST http://localhost:8000/api/leaves/requests/<leave_id>/approve/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "comments": "Approved"
}
```

### 8. Get My Attendance

```bash
GET http://localhost:8000/api/attendance/attendance/my_attendance/?month=11&year=2025
Authorization: Bearer <access_token>
```

### 9. Get Attendance Statistics

```bash
GET http://localhost:8000/api/attendance/attendance/statistics/?month=11&year=2025
Authorization: Bearer <access_token>
```

### 10. Get My Payslips

```bash
GET http://localhost:8000/api/payroll/payslips/my_payslips/
Authorization: Bearer <access_token>
```

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@workzen.com","password":"admin123"}'
```

### Get Users (with token)
```bash
curl -X GET http://localhost:8000/api/users/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Testing with Python

```python
import requests

# Base URL
BASE_URL = "http://localhost:8000/api"

# Login
response = requests.post(f"{BASE_URL}/users/login/", json={
    "email": "admin@workzen.com",
    "password": "admin123"
})

data = response.json()
access_token = data['data']['tokens']['access']

# Get users
headers = {"Authorization": f"Bearer {access_token}"}
response = requests.get(f"{BASE_URL}/users/", headers=headers)
print(response.json())
```

## Common Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2025-11-08T12:00:00Z"
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": { ... }
}
```

## Authentication

All protected endpoints require JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

Token expires after 60 minutes (configurable). Use refresh token to get new access token:

```bash
POST http://localhost:8000/api/token/refresh/
Content-Type: application/json

{
  "refresh": "<refresh_token>"
}
```

## Role-Based Access

- **Admin**: Full access to all endpoints
- **HR Officer**: Can manage employees, approve leaves
- **Payroll Officer**: Can manage payroll, generate payslips
- **Employee**: Can only access own data

## Pagination

List endpoints support pagination:

```bash
GET http://localhost:8000/api/users/?page=1&page_size=25
```

Response includes:
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/users/?page=2",
  "previous": null,
  "results": [ ... ]
}
```

## Filtering

Many endpoints support filtering:

```bash
# Filter attendance by date range
GET /api/attendance/attendance/?start_date=2025-11-01&end_date=2025-11-30

# Filter leave requests by status
GET /api/leaves/requests/?status=pending

# Filter by employee
GET /api/attendance/attendance/?employee=<uuid>
```

## Testing Checklist

- [ ] User registration
- [ ] User login
- [ ] Get current user profile
- [ ] Mark attendance
- [ ] Create leave request
- [ ] Approve/reject leave
- [ ] Get leave balance
- [ ] Generate payslips
- [ ] View payslips
- [ ] Sync operations
- [ ] Document verification

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
