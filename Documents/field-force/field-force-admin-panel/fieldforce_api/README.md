# Field Force Management System - API Server

Next.js API server for Field Force Management System with separate endpoints for Admin Panel and Mobile App.

## Project Structure

```
fieldforce_api/
├── app/
│   └── api/
│       ├── admin/              # Admin Panel APIs
│       │   └── employees/      # Employee management APIs
│       │       ├── route.ts              # GET, POST /api/admin/employees
│       │       ├── [id]/
│       │       │   └── route.ts          # GET, PUT, DELETE /api/admin/employees/[id]
│       │       ├── lookup/
│       │       │   └── [employeeId]/
│       │       │       └── route.ts     # GET /api/admin/employees/lookup/[employeeId]
│       │       ├── devices/
│       │       │   └── route.ts          # GET, POST /api/admin/employees/devices
│       │       └── vehicles/
│       │           └── route.ts          # GET, POST /api/admin/employees/vehicles
│       └── mobile/             # Mobile App APIs (to be implemented)
│           └── .gitkeep
├── lib/
│   ├── db.ts                   # Database connection pool
│   └── apiResponse.ts          # Response helpers
├── types/
│   └── employee.ts             # TypeScript interfaces
├── sample-data/
│   └── employees-sample.sql    # Sample data for testing
└── package.json
```

## Setup

1. **Install Dependencies**
```bash
cd fieldforce_api
npm install
```

2. **Configure Environment Variables**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Run Database Migrations**
```bash
# Run the SQL schema from database-schema-final.md
# Then run sample data:
psql -U your_user -d field_force_db -f sample-data/employees-sample.sql
# Run roles and entitlements setup:
psql -U your_user -d field_force_db -f sample-data/roles-and-entitlements.sql
```

4. **Start Development Server**
```bash
npm run dev
```

The API will be available at `http://localhost:4000`

## API Endpoints

### Authentication APIs

- `POST /api/auth/login` - Login with employee_id and password
  - Request: `{ employee_id: string, password: string }`
  - Response: `{ token: string, user: { ... } }`
- `GET /api/auth/verify` - Verify JWT token and get current user
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ user: { ... } }`

### Admin Panel APIs

#### Employee Management

- `GET /api/admin/employees` - Get all employees (with pagination, search, filters)
- `GET /api/admin/employees/[id]` - Get employee by ID
- `GET /api/admin/employees/lookup/[employeeId]` - Lookup employee by employee_id (for AddEmployeeModal)
- `POST /api/admin/employees` - Create new employee
- `PUT /api/admin/employees/[id]` - Update employee
- `DELETE /api/admin/employees/[id]` - Soft delete employee (set is_active = false)

#### Employee Devices

- `GET /api/admin/employees/devices` - Get all employee devices
- `POST /api/admin/employees/devices` - Add employee device

#### Employee Vehicles

- `GET /api/admin/employees/vehicles` - Get all employee vehicles
- `POST /api/admin/employees/vehicles` - Assign vehicle to employee

### Mobile App APIs

**Note:** Mobile app APIs will be created later. Mobile app will only update visits and tracking tables.

## Environment Variables

### FieldForce Database
- `DATABASE_URL` - PostgreSQL connection string (or use individual DB_* variables)
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_NAME` - Database name (default: field_force_db)
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password

### HRMS Database (for employee lookup)
- `HRMS_DATABASE_URL` - HRMS PostgreSQL connection string (or use individual HRMS_DB_* variables)
- `HRMS_DB_HOST` - HRMS database host
- `HRMS_DB_PORT` - HRMS database port
- `HRMS_DB_NAME` - HRMS database name
- `HRMS_DB_USER` - HRMS database user
- `HRMS_DB_PASSWORD` - HRMS database password

### Authentication & API
- `JWT_SECRET` - JWT secret for authentication
- `NEXT_PUBLIC_API_URL` - API base URL (default: http://localhost:4000)

## Frontend Integration

Update your frontend API client to use the new admin endpoints:

```typescript
// utils/apiClient.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const employeesApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string; is_active?: boolean }) =>
    apiClient.get('/admin/employees', params),

  getById: (id: string) =>
    apiClient.get(`/admin/employees/${id}`),

  lookup: (employeeId: string) =>
    apiClient.get(`/admin/employees/lookup/${employeeId}`),

  create: (data: any) =>
    apiClient.post('/admin/employees', data),

  update: (id: string, data: any) =>
    apiClient.put(`/admin/employees/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/admin/employees/${id}`),
};
```

## Sample Data

Default password for all sample employees: `password123`

Sample Employee IDs:
- 136869 - Sam Smith (Admin)
- 136870 - Oscar Bob (Executive)
- 136871 - Ethan Johnson (Executive)
- 136872 - John Smith (Manager)
- 136873 - Jane Doe (Senior Executive)

## Notes

- All passwords are hashed using bcrypt
- Soft deletes are used (is_active flag)
- All tables have audit fields (created_at, updated_at, created_by, updated_by)
- UUIDs are used for all primary keys
- Foreign key relationships are enforced
- Mobile app APIs will be implemented separately when requested

