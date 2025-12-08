# Database Connection Timeout Fix

## Problem
The application was experiencing database connection timeout errors when creating employees:
- `Connection terminated due to connection timeout`
- `Connection terminated unexpectedly`

## Solution Implemented

### 1. Increased Connection Timeouts
- **Connection Timeout**: Increased from 2 seconds to 10 seconds (`connectionTimeoutMillis: 10000`)
- **Query Timeout**: Added 30-second timeout for queries
- **Idle Timeout**: Set to 30 seconds

### 2. Added Retry Logic
- Implemented automatic retry mechanism (up to 2 retries) for connection errors
- Exponential backoff between retries (1s, 2s)
- Detects connection errors and retries automatically

### 3. Improved Error Handling
- Better error messages for connection failures
- Specific handling for:
  - Connection timeouts
  - Connection refused errors
  - Unique constraint violations
  - Foreign key violations

### 4. Connection Pool Configuration
- Added keepAlive settings to maintain connections
- Proper error handling on pool errors
- Connection health check on pool initialization

## Configuration Changes

### `lib/db.ts`
```typescript
const poolConfig = {
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased from 2000
  statement_timeout: 30000,
  query_timeout: 30000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
};
```

### Query Function with Retry
- Automatically retries failed queries up to 2 times
- Detects connection errors and retries with exponential backoff
- Provides better error logging

## Testing

To verify the fix works:

1. **Check Database Connection**:
   - Ensure PostgreSQL is running
   - Verify connection credentials in `.env`
   - Test connection with: `psql -U your_user -d field_force_db`

2. **Test Employee Creation**:
   - Try adding an employee through the frontend
   - Should no longer get timeout errors
   - If connection fails, you'll get a clear error message

3. **Monitor Logs**:
   - Check for "Database connection pool initialized successfully"
   - Watch for retry attempts in logs
   - Connection errors are now logged with more detail

## Environment Variables

Ensure these are set in your `.env` file:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=field_force_db
DB_USER=postgres
DB_PASSWORD=your_password

# OR use connection string:
# DATABASE_URL=postgresql://user:password@host:port/database
```

## Troubleshooting

If you still experience connection issues:

1. **Check Database Status**:
   ```bash
   # Check if PostgreSQL is running
   pg_isready
   ```

2. **Verify Connection**:
   ```bash
   psql -U postgres -d field_force_db -c "SELECT 1;"
   ```

3. **Check Firewall**:
   - Ensure port 5432 is not blocked
   - Check if database allows connections from your IP

4. **Increase Timeouts Further** (if needed):
   - Edit `fieldforce_api/lib/db.ts`
   - Increase `connectionTimeoutMillis` to 30000 (30 seconds)

5. **Check Database Logs**:
   - Review PostgreSQL logs for connection issues
   - Check for max connection limits

## Notes

- The retry logic only applies to connection errors, not query errors
- Connection pool is reused across requests for better performance
- Failed connections are automatically cleaned up by the pool

