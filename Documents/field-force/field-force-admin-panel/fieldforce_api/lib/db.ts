import { Pool, PoolClient } from 'pg';

// Database connection pool
let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    
    // Common pool configuration
    const poolConfig: any = {
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 10000, // Wait 10 seconds for a connection (increased from 2s)
      statement_timeout: 30000, // Query timeout: 30 seconds
      query_timeout: 30000, // Query timeout: 30 seconds
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
    };
    
    // Log connection details (without password) for debugging
    if (connectionString) {
      // Parse connection string to show details (hide password)
      const urlParts = new URL(connectionString);
      console.log('🔍 FieldForce DB Connection Details:');
      console.log('  - Using DATABASE_URL connection string');
      console.log('  - Host:', urlParts.hostname);
      console.log('  - Port:', urlParts.port || '5432');
      console.log('  - Database:', urlParts.pathname.replace('/', ''));
      console.log('  - User:', urlParts.username);
      console.log('  - Password:', urlParts.password ? '***' : 'not set');
      
      pool = new Pool({
        connectionString,
        ...poolConfig,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      });
    } else {
      // Use individual connection parameters
      const host = process.env.DB_HOST || 'localhost';
      const port = parseInt(process.env.DB_PORT || '5432');
      const database = process.env.DB_NAME || 'field_force_db';
      const user = process.env.DB_USER || 'postgres';
      const password = process.env.DB_PASSWORD || '';
      
      console.log('🔍 FieldForce DB Connection Details:');
      console.log('  - Using individual connection parameters');
      console.log('  - Host:', host);
      console.log('  - Port:', port);
      console.log('  - Database:', database);
      console.log('  - User:', user);
      console.log('  - Password:', password ? '***' : 'not set');
      console.log('  - Environment Variables Check:');
      console.log('    DB_HOST:', process.env.DB_HOST || '(not set, using default: localhost)');
      console.log('    DB_PORT:', process.env.DB_PORT || '(not set, using default: 5432)');
      console.log('    DB_NAME:', process.env.DB_NAME || '(not set, using default: field_force_db)');
      console.log('    DB_USER:', process.env.DB_USER || '(not set, using default: postgres)');
      console.log('    DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : '(not set)');
      
      pool = new Pool({
        host,
        port,
        database,
        user,
        password,
        ...poolConfig,
      });
    }

    // Handle pool errors - reconnect on error
    pool.on('error', (err) => {
      console.error('Unexpected error on idle database client', err);
      // Don't end the pool here, let it try to reconnect
    });

    // Test connection on pool creation
    pool.query('SELECT 1')
      .then(() => {
        console.log('Database connection pool initialized successfully');
      })
      .catch((err) => {
        console.error('Failed to initialize database connection pool:', err);
      });
  }

  return pool;
}

// Helper function to execute queries with retry logic
export async function query(text: string, params?: any[], retries: number = 2): Promise<any> {
  const pool = getDbPool();
  const start = Date.now();
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error: any) {
      const isConnectionError = 
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT' ||
        error.message?.includes('Connection terminated') ||
        error.message?.includes('timeout') ||
        error.cause?.message?.includes('terminated');
      
      if (isConnectionError && attempt < retries) {
        console.warn(`Database connection error (attempt ${attempt + 1}/${retries + 1}), retrying...`, error.message);
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }
      
      console.error('Database query error', { 
        text: text.substring(0, 100), // Log first 100 chars to avoid huge logs
        error: error.message,
        code: error.code,
        attempt: attempt + 1
      });
      throw error;
    }
  }
  
  throw new Error('Query failed after retries');
}

// Close pool (useful for testing or graceful shutdown)
export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

// Helper function to validate UUID format
export function isValidUUID(uuid: string | null | undefined): boolean {
  if (!uuid) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// Helper function to sanitize UUID - returns null if not a valid UUID
export function sanitizeUUID(uuid: string | null | undefined): string | null {
  if (!uuid) return null;
  return isValidUUID(uuid) ? uuid : null;
}

