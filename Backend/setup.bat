@echo off
echo ========================================
echo WorkZen HRMS Backend Setup
echo ========================================
echo.

echo Step 1: Creating virtual environment...
python -m venv venv
echo Virtual environment created!
echo.

echo Step 2: Activating virtual environment...
call venv\Scripts\activate
echo.

echo Step 3: Installing dependencies...
pip install -r requirements.txt
echo Dependencies installed!
echo.

echo Step 4: Creating .env file...
if not exist .env (
    copy .env.example .env
    echo .env file created! Please update it with your configuration.
) else (
    echo .env file already exists.
)
echo.

echo Step 5: Running migrations...
python manage.py makemigrations
python manage.py migrate
echo Migrations completed!
echo.

echo Step 6: Seeding initial data...
python manage.py seed_data
echo Data seeding completed!
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the development server:
echo   python manage.py runserver
echo.
echo API Documentation will be available at:
echo   http://localhost:8000/api/docs/
echo.
pause
