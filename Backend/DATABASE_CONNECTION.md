# Database Connection Setup

## Prerequisites

- PostgreSQL 18 installed ✅
- Database created (see DATABASE_QUERIES.md)
- User `workzen_user` created with password `WorkZen@2025`

## Environment Configuration

### 1. Create .env file

Copy the example file:
```cmd
copy .env.example .env
```

### 2. Edit .env file

Open `.env` and configure:

```env
# Django Settings
SECRET_KEY=django-insecure-workzen-hrms-change-this-in-production-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# PostgreSQL Database
DB_NAME=workzen_db
DB_USER=workzen_user
DB_PASSWORD=WorkZen@2025
DB_HOST=localhost
DB_PORT=5432

# JWT Authentication
JWT_SECRET_KEY=your-jwt-secret-key-change-this
JWT_EXPIRY_HOURS=24

# CORS (Frontend URL)
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Optional: Supabase Cloud Backup
SUPABASE_HOST=
SUPABASE_PASSWORD=
SUPABASE_DB=postgres

# Optional: Redis for Celery
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Verify Connection

### Test PostgreSQL Connection

```cmd
psql -U workzen_user -d workzen_db -h localhost
```

Enter password: `WorkZen@2025`

If successful, you'll see:
```
workzen_db=>
```

### Test Django Connection

```cmd
python manage.py check --database default
```

Should output:
```
System check identified no issues (0 silenced).
```

## Connection String Format

If you need the connection string:

```
postgresql://workzen_user:WorkZen@2025@localhost:5432/workzen_db
```

## Troubleshooting

### Error: "password authentication failed"
- Check password in .env matches: `WorkZen@2025`
- Verify user exists: `psql -U postgres -c "\du"`

### Error: "database does not exist"
- Create database: See DATABASE_QUERIES.md
- Verify: `psql -U postgres -c "\l"`

### Error: "could not connect to server"
- Check PostgreSQL is running
- Windows: Services → PostgreSQL
- Verify port 5432 is open

### Error: "permission denied"
- Grant permissions: See DATABASE_QUERIES.md
- Run: `ALTER SCHEMA public OWNER TO workzen_user;`

## Security Notes

### For Production:
1. Change `SECRET_KEY` to a random 50-character string
2. Change `DB_PASSWORD` to a strong password
3. Set `DEBUG=False`
4. Update `ALLOWED_HOSTS` with your domain
5. Never commit `.env` to version control

### Generate Secret Key:
```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## Next Steps

After database connection is configured:
1. Run migrations: `python manage.py migrate`
2. Create superuser: `python manage.py createsuperuser`
3. Start server: `python manage.py runserver 8000`
