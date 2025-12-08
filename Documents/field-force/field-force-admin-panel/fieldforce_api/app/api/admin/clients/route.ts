import { NextRequest, NextResponse } from 'next/server';
import { query, sanitizeUUID } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { CreateClientDto } from '@/types/client';

// GET /api/admin/clients - Get all clients
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('is_active');
    const categoryId = searchParams.get('category_id');
    const empId = searchParams.get('emp_id'); // Filter by employee ID
    
    const offset = (page - 1) * limit;
    
    // If emp_id is provided, we need to join with clients_contact to filter
    const needsContactJoin = empId !== null && empId !== undefined;
    
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (search) {
      // Search across multiple fields: client name, contact number, address
      whereClause += ` AND (
        c.client_name ILIKE $${paramIndex} OR
        EXISTS (
          SELECT 1 FROM clients_contact cc_search 
          WHERE cc_search.client_id = c.id 
          AND cc_search.is_active = true
          AND (
            cc_search.primary_contact_number ILIKE $${paramIndex} OR
            cc_search.secondary_contact_number ILIKE $${paramIndex} OR
            cc_search.contact_name ILIKE $${paramIndex} OR
            cc_search.address ILIKE $${paramIndex} OR
            cc_search.primary_email ILIKE $${paramIndex} OR
            cc_search.secondary_email ILIKE $${paramIndex}
          )
        )
      )`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (isActive !== null && isActive !== undefined) {
      whereClause += ` AND c.is_active = $${paramIndex}`;
      params.push(isActive === 'true');
      paramIndex++;
    }

    if (categoryId) {
      whereClause += ` AND c.category_id = $${paramIndex}`;
      params.push(categoryId);
      paramIndex++;
    }

    if (empId) {
      whereClause += ` AND cc_contact.emp_id = $${paramIndex}`;
      params.push(empId);
      paramIndex++;
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(DISTINCT c.id) as total
      FROM client c
      ${needsContactJoin ? 'INNER JOIN clients_contact cc_contact ON cc_contact.client_id = c.id AND cc_contact.is_active = true' : ''}
      LEFT JOIN client_categories cc ON cc.id = c.category_id
      ${whereClause}
    `;
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Get clients with related data and contact information
    const clientsQuery = `
      SELECT DISTINCT
        c.id,
        c.client_name,
        c.is_active,
        c.created_at,
        c.updated_at,
        c.category_id,
        cc.name as category_name,
        c.created_by,
        c.updated_by,
        -- Get primary contact info (first active contact)
        (
          SELECT cc1.primary_contact_number 
          FROM clients_contact cc1 
          WHERE cc1.client_id = c.id AND cc1.is_active = true 
          ORDER BY cc1.created_at ASC 
          LIMIT 1
        ) as primary_contact_number,
        (
          SELECT cc1.address 
          FROM clients_contact cc1 
          WHERE cc1.client_id = c.id AND cc1.is_active = true 
          ORDER BY cc1.created_at ASC 
          LIMIT 1
        ) as address,
        (
          SELECT rl.name 
          FROM clients_contact cc1 
          LEFT JOIN lookup rl ON rl.id = cc1.region AND rl.key = 'region'
          WHERE cc1.client_id = c.id AND cc1.is_active = true 
          ORDER BY cc1.created_at ASC 
          LIMIT 1
        ) as region_name,
        (
          SELECT cc1.branch 
          FROM clients_contact cc1 
          WHERE cc1.client_id = c.id AND cc1.is_active = true 
          ORDER BY cc1.created_at ASC 
          LIMIT 1
        ) as branch
      FROM client c
      ${needsContactJoin ? 'INNER JOIN clients_contact cc_contact ON cc_contact.client_id = c.id AND cc_contact.is_active = true' : ''}
      LEFT JOIN client_categories cc ON cc.id = c.category_id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);
    
    const result = await query(clientsQuery, params);

    // Get assigned employees for each client
    const clientIds = result.rows.map((row: any) => row.id);
    let assignedEmployeesMap: Record<string, any[]> = {};
    
    if (clientIds.length > 0) {
      const employeesQuery = `
        SELECT 
          cc.client_id,
          e.id as employee_id,
          e.employee_id as employee_code,
          e.first_name,
          e.last_name,
          e.email,
          e.phone
        FROM clients_contact cc
        INNER JOIN employees e ON e.id = cc.emp_id
        WHERE cc.client_id = ANY($1::uuid[]) 
          AND cc.emp_id IS NOT NULL 
          AND cc.is_active = true 
          AND e.is_active = true
        ORDER BY cc.client_id, e.first_name
      `;
      
      const employeesResult = await query(employeesQuery, [clientIds]);
      
      // Group employees by client_id
      employeesResult.rows.forEach((row: any) => {
        if (!assignedEmployeesMap[row.client_id]) {
          assignedEmployeesMap[row.client_id] = [];
        }
        assignedEmployeesMap[row.client_id].push({
          id: row.employee_id,
          employee_id: row.employee_code,
          first_name: row.first_name,
          last_name: row.last_name,
          email: row.email,
          phone: row.phone,
        });
      });
    }

    // Add assigned employees to each client
    const clientsWithEmployees = result.rows.map((client: any) => ({
      ...client,
      assigned_employees: assignedEmployeesMap[client.id] || [],
    }));

    return successResponse({
      clients: clientsWithEmployees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }, '', origin);
  } catch (error: any) {
    console.error('Error fetching clients:', error);
    if (error.message?.includes('Database connection failed')) {
      return errorResponse(error.message, 503, origin);
    }
    return errorResponse('Failed to fetch clients', 500, origin);
  }
}

// OPTIONS handler for CORS preflight
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

// POST /api/admin/clients - Create new client
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  try {
    const body: CreateClientDto = await request.json();
    
    // Validate required fields
    if (!body.client_name) {
      return errorResponse('Missing required field: client_name', 400, origin);
    }

    // Check if client_name already exists
    const existingCheck = await query(
      'SELECT id FROM client WHERE LOWER(client_name) = LOWER($1)',
      [body.client_name]
    );
    
    if (existingCheck.rows.length > 0) {
      return errorResponse('Client name already exists', 409, origin);
    }

    const insertQuery = `
      INSERT INTO client (
        client_name, category_id, created_by, is_active
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id, client_name, category_id, is_active, created_at
    `;

    const result = await query(insertQuery, [
      body.client_name,
      body.category_id || null,
      sanitizeUUID(body.created_by) || null, // Sanitize UUID - set to null if not valid
      true, // is_active default
    ]);

    return successResponse(result.rows[0], 'Client created successfully', origin);
  } catch (error: any) {
    console.error('Error creating client:', error);

    if (error.code === '23505') { // Unique violation
      return errorResponse('Client name already exists.', 409, origin);
    }
    if (error.code === '23503') { // Foreign key violation
      return errorResponse('Invalid category reference.', 400, origin);
    }
    if (error.message?.includes('Database connection failed')) {
      return errorResponse(error.message, 503, origin);
    }
    return errorResponse(error.message || 'Failed to create client', 500, origin);
  }
}

