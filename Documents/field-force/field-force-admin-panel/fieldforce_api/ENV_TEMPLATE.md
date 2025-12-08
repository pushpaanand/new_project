# Environment Variables Template

Create a `.env` file in the `fieldforce_api/` directory with the following variables:

```env
# FieldForce Database Configuration
# Use either DATABASE_URL (connection string) OR individual DB_* variables

# Option 1: Connection String (recommended)
# DATABASE_URL=postgresql://username:password@host:port/database_name
# Example:
# DATABASE_URL=postgresql://postgres:your_password@192.168.52.47:5432/field_force_db

# Option 2: Individual Connection Parameters
DB_HOST=192.168.52.47
DB_PORT=5432
DB_NAME=field_force_db
DB_USER=postgres
DB_PASSWORD=your_password_here

# HRMS Database Configuration (for employee lookup)
# Use either HRMS_DATABASE_URL (connection string) OR individual HRMS_DB_* variables

# Option 1: Connection String (recommended)
# HRMS_DATABASE_URL=postgresql://username:password@host:port/database_name
# Example:
# HRMS_DATABASE_URL=postgresql://postgres:your_password@192.168.52.47:5432/hrms_db

# Option 2: Individual Connection Parameters
HRMS_DB_HOST=192.168.52.47
HRMS_DB_PORT=5432
HRMS_DB_NAME=hrms_db
HRMS_DB_USER=postgres
HRMS_DB_PASSWORD=your_password_here

# Alternative HRMS variables (if using DB_HOST1, DB_PORT1, etc.)
# DB_HOST1=192.168.52.47
# DB_PORT1=5432
# DB_NAME1=hrms_db
# DB_USER1=postgres
# DB_PASSWORD1=your_password_here

# JWT Secret for authentication
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production

# Node Environment
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## Quick Setup

1. Copy this template to `.env`:
   ```bash
   # On Windows PowerShell
   Copy-Item ENV_TEMPLATE.md .env
   # Then edit .env and fill in your actual values
   ```

2. Edit `.env` and replace:
   - `your_password_here` with your actual database password
   - `192.168.52.47` with your actual database host (if different)
   - `field_force_db` with your actual database name (if different)
   - `your_jwt_secret_key_here_change_this_in_production` with a secure random string

3. Test the connection:
   ```bash
   npm install  # Install dotenv if not already installed
   node scripts/test-db-connection.js
   ```

