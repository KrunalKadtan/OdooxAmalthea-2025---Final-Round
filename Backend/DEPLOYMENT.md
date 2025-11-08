# WorkZen HRMS - Production Deployment Guide

## Prerequisites

- Python 3.10+
- PostgreSQL 14+
- Redis 7+
- Nginx
- Supervisor (for process management)

## Step 1: Server Setup

### Install System Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and dependencies
sudo apt install python3.10 python3.10-venv python3-pip -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Redis
sudo apt install redis-server -y

# Install Nginx
sudo apt install nginx -y

# Install Supervisor
sudo apt install supervisor -y
```

## Step 2: Database Setup

### Create PostgreSQL Database

```bash
sudo -u postgres psql

CREATE DATABASE workzen_db;
CREATE USER workzen_user WITH PASSWORD 'your_secure_password';
ALTER ROLE workzen_user SET client_encoding TO 'utf8';
ALTER ROLE workzen_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE workzen_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE workzen_db TO workzen_user;
\q
```

## Step 3: Application Setup

### Clone and Setup Application

```bash
# Create application directory
sudo mkdir -p /var/www/workzen
cd /var/www/workzen

# Clone repository (or upload files)
# git clone <repository_url> .

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn psycopg2-binary
```

### Configure Environment

```bash
# Create .env file
nano .env
```

Add the following:

```env
SECRET_KEY=your_very_secure_secret_key_here
DEBUG=False
ALLOWED_HOSTS=your-domain.com,www.your-domain.com

DATABASE_URL=postgresql://workzen_user:your_secure_password@localhost:5432/workzen_db

REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/2

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com

JWT_SECRET_KEY=your_jwt_secret_key
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440

SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

### Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py seed_data
```

## Step 4: Gunicorn Configuration

Create Gunicorn configuration:

```bash
sudo nano /etc/supervisor/conf.d/workzen.conf
```

Add:

```ini
[program:workzen]
directory=/var/www/workzen
command=/var/www/workzen/venv/bin/gunicorn testproj.wsgi:application --bind 127.0.0.1:8000 --workers 4 --timeout 120
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/workzen/gunicorn.log
stderr_logfile=/var/log/workzen/gunicorn_error.log
```

Create log directory:

```bash
sudo mkdir -p /var/log/workzen
sudo chown www-data:www-data /var/log/workzen
```

## Step 5: Celery Configuration

Create Celery worker configuration:

```bash
sudo nano /etc/supervisor/conf.d/workzen-celery.conf
```

Add:

```ini
[program:workzen-celery]
directory=/var/www/workzen
command=/var/www/workzen/venv/bin/celery -A testproj worker -l info
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/workzen/celery.log
stderr_logfile=/var/log/workzen/celery_error.log

[program:workzen-celery-beat]
directory=/var/www/workzen
command=/var/www/workzen/venv/bin/celery -A testproj beat -l info
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/workzen/celery_beat.log
stderr_logfile=/var/log/workzen/celery_beat_error.log
```

## Step 6: Nginx Configuration

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/workzen
```

Add:

```nginx
upstream workzen_backend {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    client_max_body_size 10M;

    # Static files
    location /static/ {
        alias /var/www/workzen/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Media files
    location /media/ {
        alias /var/www/workzen/media/;
        expires 7d;
    }

    # API endpoints
    location / {
        proxy_pass http://workzen_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/workzen /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 7: SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Step 8: Start Services

```bash
# Update supervisor
sudo supervisorctl reread
sudo supervisorctl update

# Start all services
sudo supervisorctl start workzen
sudo supervisorctl start workzen-celery
sudo supervisorctl start workzen-celery-beat

# Check status
sudo supervisorctl status
```

## Step 9: Firewall Configuration

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Step 10: Monitoring & Logs

### View Logs

```bash
# Application logs
sudo tail -f /var/log/workzen/gunicorn.log

# Celery logs
sudo tail -f /var/log/workzen/celery.log

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Restart Services

```bash
# Restart application
sudo supervisorctl restart workzen

# Restart Celery
sudo supervisorctl restart workzen-celery
sudo supervisorctl restart workzen-celery-beat

# Restart Nginx
sudo systemctl restart nginx
```

## Backup Strategy

### Database Backup

Create backup script:

```bash
sudo nano /usr/local/bin/backup-workzen-db.sh
```

Add:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/workzen"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -U workzen_user workzen_db | gzip > $BACKUP_DIR/workzen_db_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "workzen_db_*.sql.gz" -mtime +7 -delete
```

Make executable and add to cron:

```bash
sudo chmod +x /usr/local/bin/backup-workzen-db.sh
sudo crontab -e

# Add daily backup at 2 AM
0 2 * * * /usr/local/bin/backup-workzen-db.sh
```

## Performance Tuning

### PostgreSQL Optimization

Edit `/etc/postgresql/14/main/postgresql.conf`:

```ini
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 4MB
min_wal_size = 1GB
max_wal_size = 4GB
```

### Redis Optimization

Edit `/etc/redis/redis.conf`:

```ini
maxmemory 256mb
maxmemory-policy allkeys-lru
```

## Health Checks

Create health check endpoint and monitor:

```bash
# Check if application is running
curl https://your-domain.com/api/users/

# Check database connection
sudo -u postgres psql -d workzen_db -c "SELECT 1;"

# Check Redis
redis-cli ping
```

## Troubleshooting

### Application won't start

```bash
# Check logs
sudo supervisorctl tail -f workzen stderr

# Check permissions
sudo chown -R www-data:www-data /var/www/workzen
```

### Database connection issues

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -U workzen_user -d workzen_db -h localhost
```

### High memory usage

```bash
# Check processes
htop

# Restart services
sudo supervisorctl restart all
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Enable firewall (UFW)
- [ ] Install SSL certificate
- [ ] Set DEBUG=False
- [ ] Use strong SECRET_KEY
- [ ] Configure CORS properly
- [ ] Enable security headers
- [ ] Regular security updates
- [ ] Database backups configured
- [ ] Monitor logs regularly

## Maintenance

### Update Application

```bash
cd /var/www/workzen
source venv/bin/activate
git pull origin main
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo supervisorctl restart workzen
```

### Database Maintenance

```bash
# Vacuum database
sudo -u postgres psql -d workzen_db -c "VACUUM ANALYZE;"

# Reindex
sudo -u postgres psql -d workzen_db -c "REINDEX DATABASE workzen_db;"
```

## Support

For production issues, check logs and contact the development team.
