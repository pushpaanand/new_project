# Database Connection Troubleshooting Guide

## Error: `ECONNREFUSED 192.168.52.47:5432`

This error means the connection to the PostgreSQL database at `192.168.52.47:5432` is being **actively refused**.

### What This Means

The connection attempt reached the server, but the server rejected it. This is different from a timeout (which would mean the server didn't respond at all).

### Common Causes & Solutions

#### 1. **Database Server Not Running**
- **Check:** Is PostgreSQL running on `192.168.52.47`?
- **Solution:** 
  - SSH to the server and check: `sudo systemctl status postgresql`
  - Start PostgreSQL: `sudo systemctl start postgresql`

#### 2. **PostgreSQL Not Listening on That IP/Port**
- **Check:** Is PostgreSQL configured to listen on `192.168.52.47`?
- **Solution:**
  - Check `postgresql.conf`: `listen_addresses = '*'` or `listen_addresses = '192.168.52.47'`
  - Check `pg_hba.conf` for allowed connections
  - Restart PostgreSQL after changes

#### 3. **Firewall Blocking Connection**
- **Check:** Is port 5432 open on the server?
- **Solution:**
  ```bash
  # On the database server
  sudo ufw allow 5432/tcp
  # Or for Windows Firewall, add an inbound rule for port 5432
  ```

#### 4. **Wrong Host/Port in Environment Variables**
- **Check:** Verify your `.env` file has correct values
- **Solution:** 
  - Check `DB_HOST` matches the actual database server IP
  - Check `DB_PORT` matches the actual PostgreSQL port (default: 5432)

#### 5. **Network Connectivity Issue**
- **Check:** Can you reach the server from your machine?
- **Solution:**
  ```bash
  # Test network connectivity
  ping 192.168.52.47
  telnet 192.168.52.47 5432
  # Or use PowerShell: Test-NetConnection -ComputerName 192.168.52.47 -Port 5432
  ```

#### 6. **PostgreSQL Configuration Issues**
- **Check:** `pg_hba.conf` must allow connections from your IP
- **Solution:**
  ```bash
  # On database server, edit /etc/postgresql/*/main/pg_hba.conf
  # Add line:
  host    all    all    192.168.52.0/24    md5
  # Or for specific IP:
  host    all    all    192.168.52.47    md5
  # Then restart PostgreSQL
  ```

### Diagnostic Steps

1. **Run the Connection Test Script:**
   ```bash
   cd fieldforce_api
   node scripts/test-db-connection.js
   ```

2. **Check Environment Variables:**
   ```bash
   # In fieldforce_api directory
   # Check if .env file exists and has correct values
   cat .env
   # Or on Windows:
   type .env
   ```

3. **Verify Database Server Status:**
   ```bash
   # If you have SSH access to the database server
   ssh user@192.168.52.47
   sudo systemctl status postgresql
   sudo netstat -tlnp | grep 5432
   ```

4. **Test Network Connectivity:**
   ```bash
   # From your development machine
   ping 192.168.52.47
   telnet 192.168.52.47 5432
   ```

5. **Check PostgreSQL Logs:**
   ```bash
   # On database server
   sudo tail -f /var/log/postgresql/postgresql-*.log
   ```

### Environment Variables Checklist

Make sure your `.env` file in `fieldforce_api/` has:

```env
# FieldForce Database (Main)
DB_HOST=192.168.52.47
DB_PORT=5432
DB_NAME=field_force_db
DB_USER=postgres
DB_PASSWORD=your_password

# OR use connection string:
# DATABASE_URL=postgresql://postgres:password@192.168.52.47:5432/field_force_db

# HRMS Database (Secondary - this one is working)
HRMS_DB_HOST=192.168.52.47
HRMS_DB_PORT=5432
HRMS_DB_NAME=hrms_db
HRMS_DB_USER=postgres
HRMS_DB_PASSWORD=your_password

# OR use connection string:
# HRMS_DATABASE_URL=postgresql://postgres:password@192.168.52.47:5432/hrms_db
```

### Why HRMS Works But FieldForce Doesn't

If HRMS database connects successfully but FieldForce doesn't:

1. **Different Database Names:** They might be on different databases
2. **Different Credentials:** Check if `DB_USER`/`DB_PASSWORD` differ from `HRMS_DB_USER`/`HRMS_DB_PASSWORD`
3. **Database Doesn't Exist:** The `field_force_db` database might not exist yet
4. **Permissions:** The user might not have access to `field_force_db`

### Quick Fix: Create Database

If the database doesn't exist:

```sql
-- Connect to PostgreSQL as superuser
psql -U postgres -h 192.168.52.47

-- Create database
CREATE DATABASE field_force_db;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE field_force_db TO postgres;

-- Exit
\q
```

### Next Steps

1. Run the diagnostic script: `node scripts/test-db-connection.js`
2. Check the detailed error output
3. Verify environment variables
4. Test network connectivity
5. Check PostgreSQL server configuration
6. Review PostgreSQL logs

If the issue persists, share the output of the diagnostic script for further assistance.

