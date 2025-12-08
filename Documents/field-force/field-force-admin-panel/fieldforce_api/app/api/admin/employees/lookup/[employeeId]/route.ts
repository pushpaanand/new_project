import { NextRequest } from 'next/server';
import { queryHrms } from '@/lib/hrmsDb';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { EmployeeLookupResponse } from '@/types/employee';

// GET /api/admin/employees/lookup/[employeeId] - Lookup employee by employee_id from HRMS database
// This fetches employee data directly from the HRMS database
export async function GET(
  request: NextRequest,
  { params }: { params: { employeeId: string } }
) {
  const origin = request.headers.get('origin');
  
  try {
    // Trim and normalize employee_id
    const employeeId = params.employeeId.trim();
    
    // Query HRMS database for employee data
    // Try multiple approaches: exact match, case-insensitive, and without is_active check
    const employeeQuery = `
      SELECT 
        employee_id,
        first_name,
        last_name,
        email,
        phone,
        date_of_birth,
        joining_date,
        address,
        department,
        manager,
        jobtitle,
        is_active
      FROM employees
      WHERE TRIM(employee_id) = $1
      ORDER BY is_active DESC
      LIMIT 1
    `;

    const result = await queryHrms(employeeQuery, [employeeId]);
    
    // Log for debugging
    console.log('HRMS Lookup:', {
      searchedEmployeeId: employeeId,
      foundRows: result.rows.length,
      firstRow: result.rows[0] || null
    });

    if (result.rows.length === 0) {
      // Try case-insensitive search as fallback
      const caseInsensitiveQuery = `
        SELECT 
          employee_id,
          first_name,
          last_name,
          email,
          phone,
          date_of_birth,
          joining_date,
          address,
          department,
          manager,
          jobtitle,
          is_active
        FROM employees
        WHERE UPPER(TRIM(employee_id)) = UPPER($1)
        LIMIT 1
      `;
      
      const fallbackResult = await queryHrms(caseInsensitiveQuery, [employeeId]);
      
      if (fallbackResult.rows.length === 0) {
        console.error('Employee not found in HRMS:', {
          searchedId: employeeId,
          originalId: params.employeeId
        });
        return errorResponse(`Employee ID "${employeeId}" not found in HRMS database. Please verify the employee ID exists and is active.`, 404, origin);
      }
      
      // Use fallback result
      const hrmsEmployee = fallbackResult.rows[0];
      
      // Warn if employee is inactive
      if (!hrmsEmployee.is_active) {
        console.warn(`Employee ${employeeId} found but is inactive`);
      }
      
      // Map HRMS data to fieldforce format
      const employee: EmployeeLookupResponse = {
        employee_id: hrmsEmployee.employee_id,
        first_name: hrmsEmployee.first_name,
        last_name: hrmsEmployee.last_name,
        email: hrmsEmployee.email || undefined,
        phone: hrmsEmployee.phone,
        date_of_birth: hrmsEmployee.date_of_birth ? new Date(hrmsEmployee.date_of_birth).toISOString().split('T')[0] : undefined,
        joining_date: hrmsEmployee.joining_date ? new Date(hrmsEmployee.joining_date).toISOString().split('T')[0] : undefined,
        address: hrmsEmployee.address || undefined,
        department: hrmsEmployee.department || undefined,
        manager: hrmsEmployee.manager || undefined,
        jobtitle: hrmsEmployee.jobtitle || undefined,
        synced_from_hrms: true,
        hrms_sync_date: new Date().toISOString(),
      };

      return successResponse(employee, '', origin);
    }

    const hrmsEmployee = result.rows[0];
    
    // Warn if employee is inactive
    if (!hrmsEmployee.is_active) {
      console.warn(`Employee ${employeeId} found but is inactive`);
    }

    // Map HRMS data to fieldforce format
    const employee: EmployeeLookupResponse = {
      employee_id: hrmsEmployee.employee_id,
      first_name: hrmsEmployee.first_name,
      last_name: hrmsEmployee.last_name,
      email: hrmsEmployee.email || undefined,
      phone: hrmsEmployee.phone,
      date_of_birth: hrmsEmployee.date_of_birth ? new Date(hrmsEmployee.date_of_birth).toISOString().split('T')[0] : undefined,
      joining_date: hrmsEmployee.joining_date ? new Date(hrmsEmployee.joining_date).toISOString().split('T')[0] : undefined,
      address: hrmsEmployee.address || undefined,
      // Additional fields from HRMS that need to be mapped
      department: hrmsEmployee.department || undefined,
      manager: hrmsEmployee.manager || undefined,
      jobtitle: hrmsEmployee.jobtitle || undefined,
      synced_from_hrms: true,
      hrms_sync_date: new Date().toISOString(),
    };

    return successResponse(employee, '', origin);
  } catch (error) {
    console.error('Error looking up employee from HRMS:', error);
    return errorResponse('Failed to lookup employee from HRMS database', 500, origin);
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    },
  });
}

