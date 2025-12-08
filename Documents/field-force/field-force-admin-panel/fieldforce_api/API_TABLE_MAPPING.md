# API Table Mapping Documentation

This document describes how employee and client data is mapped from database tables in the API endpoints.

## Employee APIs

### GET /api/admin/employees/[id] - Get Employee by ID

**Tables Used:**
- `employees` (e) - Main employee table
- `branches` (b) - Branch information
- `departments` (d) - Department information
- `roles` (r) - Role information
- `employees` (m) - Manager employee (self-join)
- `lookup` (l) - Job title lookup
- `lookup` (g) - Gender lookup

**Data Mapping:**
```sql
SELECT 
  e.id, e.employee_id, e.first_name, e.last_name, e.email, e.phone,
  e.date_of_birth, e.joining_date, e.address, e.is_active, e.last_login,
  e.created_at, e.updated_at,
  e.branch_id, e.department_id, e.role_id, e.manager_id, e.jobtitle_id, e.gender,
  b.name as branch_name,                    -- From branches table
  d.name as department_name,                -- From departments table
  r.name as role_name,                      -- From roles table
  m.first_name || ' ' || m.last_name as manager_name,  -- From employees (self-join)
  m.employee_id as manager_employee_id,     -- Manager's employee_id
  l.name as jobtitle_name,                  -- From lookup (key='jobtitle')
  g.name as gender_name                     -- From lookup (key='gender')
FROM employees e
LEFT JOIN branches b ON b.id = e.branch_id
LEFT JOIN departments d ON d.id = e.department_id
LEFT JOIN roles r ON r.id = e.role_id
LEFT JOIN employees m ON m.employee_id = e.manager_id  -- manager_id is VARCHAR
LEFT JOIN lookup l ON l.id = e.jobtitle_id AND l.key = 'jobtitle'
LEFT JOIN lookup g ON g.id = e.gender AND g.key = 'gender'
```

**Key Relationships:**
- `manager_id` (VARCHAR) → `employees.employee_id` (not UUID)
- `branch_id` (UUID) → `branches.id`
- `department_id` (UUID) → `departments.id`
- `role_id` (UUID) → `roles.id`
- `jobtitle_id` (UUID) → `lookup.id` WHERE `key = 'jobtitle'`
- `gender` (UUID) → `lookup.id` WHERE `key = 'gender'`

### PUT /api/admin/employees/[id] - Update Employee

**Tables Updated:**
- `employees` - Direct update with field mapping

**Field Mapping:**
- `manager_id` - Accepts VARCHAR (employee_id), validates existence
- `gender` - Accepts UUID or text (maps to lookup)
- `jobtitle_id` - Accepts UUID
- `branch_id`, `department_id`, `role_id` - Accepts UUIDs

## Client APIs

### GET /api/admin/clients - Get All Clients

**Tables Used:**
- `client` (c) - Main client table
- `client_categories` (cc) - Client category information

**Data Mapping:**
```sql
SELECT 
  c.id, c.client_name, c.is_active, c.created_at, c.updated_at,
  c.category_id, c.created_by, c.updated_by,
  cc.name as category_name                  -- From client_categories table
FROM client c
LEFT JOIN client_categories cc ON cc.id = c.category_id
```

**Key Relationships:**
- `category_id` (UUID) → `client_categories.id`

### GET /api/admin/clients/[id] - Get Client by ID

**Tables Used:**
- `client` (c)
- `client_categories` (cc)

**Same mapping as GET /api/admin/clients**

### PUT /api/admin/clients/[id] - Update Client

**Tables Updated:**
- `client` - Direct update

**Field Mapping:**
- `category_id` - Accepts UUID

## Client Contact APIs

### GET /api/admin/clients/contacts - Get All Client Contacts

**Tables Used:**
- `clients_contact` (cc) - Main contact table
- `client` (c) - Client information
- `employees` (e) - Employee information
- `lookup` (city_lookup) - City lookup
- `lookup` (state_lookup) - State lookup
- `lookup` (region_lookup) - Region lookup

**Data Mapping:**
```sql
SELECT 
  cc.id, cc.emp_id, cc.client_id, cc.contact_name,
  cc.primary_contact_number, cc.secondary_contact_number,
  cc.primary_email, cc.secondary_email, cc.address,
  cc.city, cc.state, cc.pincode, cc.latitude, cc.longitude,
  cc.region, cc.branch, cc.is_active,
  cc.created_at, cc.updated_at, cc.created_by, cc.updated_by,
  e.employee_id,                                    -- From employees table
  e.first_name || ' ' || e.last_name as employee_name,
  c.client_name,                                    -- From client table
  city_lookup.name as city_name,                   -- From lookup (key='city')
  state_lookup.name as state_name,                 -- From lookup (key='state')
  region_lookup.name as region_name,               -- From lookup (key='region')
  cc.branch                                        -- Text field (not from branches table)
FROM clients_contact cc
LEFT JOIN client c ON c.id = cc.client_id
LEFT JOIN employees e ON e.id = cc.emp_id
LEFT JOIN lookup city_lookup ON city_lookup.id = cc.city AND city_lookup.key = 'city'
LEFT JOIN lookup state_lookup ON state_lookup.id = cc.state AND state_lookup.key = 'state'
LEFT JOIN lookup region_lookup ON region_lookup.id = cc.region AND region_lookup.key = 'region'
```

**Key Relationships:**
- `emp_id` (UUID) → `employees.id`
- `client_id` (UUID) → `client.id`
- `branch` (VARCHAR) → Text field (not referencing branches table)
- `city` (UUID) → `lookup.id` WHERE `key = 'city'`
- `state` (UUID) → `lookup.id` WHERE `key = 'state'`
- `region` (UUID) → `lookup.id` WHERE `key = 'region'`

### POST /api/admin/clients/contacts - Create Client Contact

**Tables Updated:**
- `clients_contact` - Direct insert

**Field Mapping:**
- `city`, `state`, `region` - Accepts UUID or text (maps to lookup table)
- `emp_id`, `client_id` - Accepts UUIDs
- `branch` - Accepts text (not referencing branches table)

### PUT /api/admin/clients/contacts/[id] - Update Client Contact

**Tables Updated:**
- `clients_contact` - Direct update

**Same field mapping as POST**

## Common Patterns

### Lookup Table Mapping

For fields that reference the `lookup` table:
1. Accept UUID directly if provided
2. If text is provided, query lookup table by name and key
3. Map to UUID before insert/update

Example:
```typescript
if (cityId && typeof cityId === 'string' && !cityId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
  const cityResult = await query(
    `SELECT id FROM lookup WHERE LOWER(name) = LOWER($1) AND key = 'city' AND is_active = true LIMIT 1`,
    [cityId]
  );
  if (cityResult.rows.length > 0) {
    cityId = cityResult.rows[0].id;
  }
}
```

### Manager ID Mapping

For `manager_id` in employees table:
- Stored as VARCHAR (employee_id, not UUID)
- References `employees.employee_id` directly
- No UUID conversion needed

### Foreign Key Validation

All APIs validate foreign key references:
- Check existence before insert/update
- Return appropriate error messages for invalid references
- Database constraints provide final validation

## Mobile App APIs

### GET /api/mobile/clients - Get Clients Assigned to Employee

**Purpose**: Get all clients assigned to the logged-in employee (for mobile app)

**Tables Used:**
- `client` (c) - Main client table
- `clients_contact` (cc) - Client contact table (filtered by emp_id)
- `client_categories` (cc_cat) - Client category information
- `lookup` (city_lookup, state_lookup, region_lookup) - Location lookups

**Data Mapping:**
```sql
SELECT DISTINCT
  c.id, c.client_name, c.category_id,
  cc_cat.name as category_name,
  cc.id as contact_id, cc.contact_name,
  cc.primary_contact_number, cc.secondary_contact_number,
  cc.primary_email, cc.secondary_email, cc.address,
  cc.city, city_lookup.name as city_name,
  cc.state, state_lookup.name as state_name,
  cc.pincode, cc.latitude, cc.longitude,
  cc.region, region_lookup.name as region_name,
  cc.branch, cc.created_at, cc.updated_at
FROM client c
INNER JOIN clients_contact cc ON cc.client_id = c.id AND cc.emp_id = $1 AND cc.is_active = true
LEFT JOIN client_categories cc_cat ON cc_cat.id = c.category_id
LEFT JOIN lookup city_lookup ON city_lookup.id = cc.city AND city_lookup.key = 'city'
LEFT JOIN lookup state_lookup ON state_lookup.id = cc.state AND state_lookup.key = 'state'
LEFT JOIN lookup region_lookup ON region_lookup.id = cc.region AND region_lookup.key = 'region'
WHERE c.is_active = true AND cc.emp_id = $1 AND cc.is_active = true
```

**Key Relationships:**
- Filters by `cc.emp_id` to show only clients assigned to the employee
- Returns contact information specific to that employee's assignment
- Supports pagination and search

**Authentication:**
- Requires `employee_id` via query parameter or `x-employee-id` header
- In production, should extract from JWT token

### GET /api/mobile/clients/[id] - Get Specific Client

**Purpose**: Get a specific client assigned to the logged-in employee

**Tables Used:**
- Same as GET /api/mobile/clients
- Additional WHERE clause: `c.id = $2`

**Key Features:**
- Verifies that the client is assigned to the requesting employee
- Returns 404 if client not found or not assigned to employee

### PUT /api/mobile/clients/[id] - Update Client Contact

**Purpose**: Update client contact information (for mobile app)

**Tables Updated:**
- `clients_contact` - Only the contact record assigned to the employee

**Field Mapping:**
- Only contact fields can be updated (contact_name, phone, email, address, location, etc.)
- Client name and category cannot be updated via mobile API
- `city`, `state`, `region` - Accepts UUID or text (maps to lookup table)
- `branch` - Accepts text (not referencing branches table)

**Security:**
- Verifies that the client is assigned to the requesting employee before allowing update
- Only updates the specific contact record for that employee
- Automatically sets `updated_by` and `updated_at`

**Data Mapping:**
```sql
-- First verify assignment
SELECT cc.id as contact_id
FROM client c
INNER JOIN clients_contact cc ON cc.client_id = c.id AND cc.emp_id = $1 AND cc.is_active = true
WHERE c.id = $2 AND c.is_active = true

-- Then update only the contact record
UPDATE clients_contact
SET contact_name = $1, primary_contact_number = $2, ...
WHERE id = $contact_id
```

## Error Handling

All APIs handle:
- Database connection errors (503)
- Foreign key violations (400)
- Unique constraint violations (409)
- Not found errors (404)
- Validation errors (400)
- Unauthorized access (404 for mobile APIs when client not assigned to employee)

