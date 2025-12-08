import { Pool } from 'pg';

// HRMS Database connection pool (separate from fieldforce database)
let hrmsPool: Pool | null = null;

export function getHrmsDbPool(): Pool {
  if (!hrmsPool) {
    const connectionString = process.env.HRMS_DATABASE_URL;
    
    if (connectionString) {
      hrmsPool = new Pool({
        connectionString,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      });
    } else {
      // Use individual connection parameters for HRMS database
      hrmsPool = new Pool({
        host: process.env.DB_HOST1 || 'localhost',
        port: parseInt(process.env.DB_PORT1 || ''),
        database: process.env.DB_NAME1 || 'hrms_db', // Default HRMS database name
        user: process.env.DB_USER1 || 'postgres',
        password: process.env.DB_PASSWORD1 || '',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
    }

    // Handle pool errors
    hrmsPool.on('error', (err) => {
      console.error('Unexpected error on idle HRMS client', err);
    });
  }

  return hrmsPool;
}

// Helper function to execute queries on HRMS database
export async function queryHrms(text: string, params?: any[]) {
  const pool = getHrmsDbPool();
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed HRMS query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('HRMS database query error', { text, error });
    throw error;
  }
}

// Close HRMS pool (useful for testing or graceful shutdown)
export async function closeHrmsPool() {
  if (hrmsPool) {
    await hrmsPool.end();
    hrmsPool = null;
  }
}

