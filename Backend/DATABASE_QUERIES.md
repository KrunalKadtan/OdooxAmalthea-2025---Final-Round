# PostgreSQL Database Setup Queries

## Complete Database Setup Commands

Open PostgreSQL command line as **postgres** superuser:

```cmd
psql -U postgres
```

Then execute these SQL commands:

```sql
-- 1. Create the database user
CREATE USER workzen_user WITH PASSWORD 'WorkZen@2025';

-- 2. Grant user privileges
ALTER USER workzen_user CREATEDB;
ALTER USER workzen_user WITH SUPERUSER;

-- 3. Create the database
CREATE DATABASE workzen_db OWNER workzen_user;

-- 4. Connect to the database
\c workzen_db

-- 5. Grant schema permissions
GRANT ALL ON SCHEMA public TO workzen_user;
ALTER SCHEMA public OWNER TO workzen_user;

-- 6. Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO workzen_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO workzen_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO workzen_user;

-- 7. Verify setup
\du workzen_user
\l workzen_db
\dn+

-- 8. Exit
\q
```

## Test Connection

Test if the user can connect:

```cmd
psql -U workzen_user -d workzen_db -h localhost
```

If successful, you should see:
```
workzen_db=>
```

Type `\q` to exit.

## Troubleshooting

### If user already exists:
```sql
DROP USER IF EXISTS workzen_user;
-- Then create again
```

### If database already exists:
```sql
DROP DATABASE IF EXISTS workzen_db;
-- Then create again
```

### Complete Reset (if needed):
```sql
-- Drop everything
DROP DATABASE IF EXISTS workzen_db;
DROP USER IF EXISTS workzen_user;

-- Recreate from step 1
CREATE USER workzen_user WITH PASSWORD 'WorkZen@2025';
ALTER USER workzen_user CREATEDB;
ALTER USER workzen_user WITH SUPERUSER;
CREATE DATABASE workzen_db OWNER workzen_user;
\c workzen_db
GRANT ALL ON SCHEMA public TO workzen_user;
ALTER SCHEMA public OWNER TO workzen_user;
\q
```

## Quick Copy-Paste Version

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

Done! Database is ready for Django.
