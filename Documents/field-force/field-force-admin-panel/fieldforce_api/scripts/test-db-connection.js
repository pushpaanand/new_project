/**
 * Database Connection Test Script
 * 
 * This script tests the connection to both FieldForce and HRMS databases
 * Run with: node scripts/test-db-connection.js
 */

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function testConnection(name, config) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing ${name} Database Connection`);
  console.log('='.repeat(60));
  
  const pool = new Pool(config);
  
  try {
    console.log('Connection Config:', {
      host: config.host || (config.connectionString ? new URL(config.connectionString).hostname : 'N/A'),
      port: config.port || (config.connectionString ? new URL(config.connectionString).port : 'N/A'),
      database: config.database || (config.connectionString ? new URL(config.connectionString).pathname.replace('/', '') : 'N/A'),
      user: config.user || (config.connectionString ? new URL(config.connectionString).username : 'N/A'),
      password: config.password || (config.connectionString ? new URL(config.connectionString).password ? '***' : 'not set' : 'not set'),
    });
    
    console.log('\nAttempting to connect...');
    const client = await pool.connect();
    console.log('✅ Connection successful!');
    
    const result = await client.query('SELECT version(), current_database(), current_user');
    console.log('\nDatabase Info:');
    console.log('  - PostgreSQL Version:', result.rows[0].version.split(',')[0]);
    console.log('  - Current Database:', result.rows[0].current_database);
    console.log('  - Current User:', result.rows[0].current_user);
    
    // Test a simple query
    const tableResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      LIMIT 5
    `);
    console.log('\nSample Tables (first 5):');
    tableResult.rows.forEach(row => {
      console.log('  -', row.table_name);
    });
    
    client.release();
    await pool.end();
    return true;
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('\nError Details:');
    console.error('  - Code:', error.code);
    console.error('  - Message:', error.message);
    console.error('  - Address:', error.address || 'N/A');
    console.error('  - Port:', error.port || 'N/A');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n🔴 ECONNREFUSED Error - Possible causes:');
      console.error('  1. Database server is not running');
      console.error('  2. Wrong host/port in connection string');
      console.error('  3. Firewall is blocking the connection');
      console.error('  4. PostgreSQL is not listening on that IP/port');
      console.error('  5. Network connectivity issue');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('\n🔴 ETIMEDOUT Error - Possible causes:');
      console.error('  1. Database server is not reachable');
      console.error('  2. Firewall is blocking the connection');
      console.error('  3. Network routing issue');
    } else if (error.code === '28P01') {
      console.error('\n🔴 Authentication Error - Possible causes:');
      console.error('  1. Wrong username or password');
      console.error('  2. User does not exist');
      console.error('  3. Password authentication failed');
    } else if (error.code === '3D000') {
      console.error('\n🔴 Database Not Found - Possible causes:');
      console.error('  1. Database name is incorrect');
      console.error('  2. Database does not exist');
    }
    
    await pool.end();
    return false;
  }
}

async function main() {
  console.log('🔍 Database Connection Diagnostic Tool');
  console.log('=====================================\n');
  
  // Test FieldForce Database
  const fieldforceConfig = process.env.DATABASE_URL 
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'field_force_db',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
      };
  
  const fieldforceSuccess = await testConnection('FieldForce', fieldforceConfig);
  
  // Test HRMS Database
  const hrmsConfig = process.env.HRMS_DATABASE_URL
    ? { connectionString: process.env.HRMS_DATABASE_URL }
    : {
        host: process.env.HRMS_DB_HOST || process.env.DB_HOST1 || 'localhost',
        port: parseInt(process.env.HRMS_DB_PORT || process.env.DB_PORT1 || '5432'),
        database: process.env.HRMS_DB_NAME || process.env.DB_NAME1 || 'hrms_db',
        user: process.env.HRMS_DB_USER || process.env.DB_USER1 || 'postgres',
        password: process.env.HRMS_DB_PASSWORD || process.env.DB_PASSWORD1 || '',
      };
  
  const hrmsSuccess = await testConnection('HRMS', hrmsConfig);
  
  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('Summary');
  console.log('='.repeat(60));
  console.log('FieldForce DB:', fieldforceSuccess ? '✅ Connected' : '❌ Failed');
  console.log('HRMS DB:', hrmsSuccess ? '✅ Connected' : '❌ Failed');
  
  if (!fieldforceSuccess) {
    console.log('\n⚠️  FieldForce database connection failed!');
    console.log('Please check your .env file and ensure:');
    console.log('  1. DB_HOST or DATABASE_URL is correct');
    console.log('  2. Database server is running');
    console.log('  3. Network/firewall allows connection');
    console.log('  4. Credentials are correct');
  }
  
  process.exit(fieldforceSuccess && hrmsSuccess ? 0 : 1);
}

main().catch(console.error);

