import { NextRequest } from 'next/server';
import { queryHrms } from '@/lib/hrmsDb';
import { successResponse, errorResponse } from '@/lib/apiResponse';

// GET /api/admin/employees/lookup/test - Test HRMS database connection and query
// This endpoint helps debug HRMS database connectivity
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  try {
    // Test 1: Check if we can connect to HRMS database
    const testConnection = await queryHrms('SELECT 1 as test');
    
    // Test 2: Get table structure
    const tableInfo = await queryHrms(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'employees'
      ORDER BY ordinal_position
    `);
    
    // Test 3: Get sample employee IDs
    const sampleEmployees = await queryHrms(`
      SELECT 
        employee_id,
        first_name,
        last_name,
        is_active
      FROM employees
      LIMIT 10
    `);
    
    // Test 4: Count total employees
    const countResult = await queryHrms('SELECT COUNT(*) as total FROM employees');
    
    return successResponse({
      connection: 'OK',
      tableStructure: tableInfo.rows,
      sampleEmployees: sampleEmployees.rows,
      totalEmployees: countResult.rows[0]?.total || 0,
    }, '', origin);
  } catch (error: any) {
    console.error('HRMS Test Error:', error);
    return errorResponse(`HRMS Database Error: ${error.message}`, 500, origin);
  }
}

