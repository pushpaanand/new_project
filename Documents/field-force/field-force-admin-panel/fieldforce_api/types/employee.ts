export interface Employee {
  id: string;
  employee_id: string;
  password_hash?: string;
  first_name: string;
  last_name: string;
  gender?: string;
  email?: string;
  phone: string;
  date_of_birth?: string;
  joining_date: string;
  address?: string;
  branch_id?: string;
  department_id?: string;
  role_id?: string;
  manager_id?: string;
  jobtitle_id?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface CreateEmployeeDto {
  employee_id: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  gender?: string;
  email?: string;
  phone: string;
  date_of_birth?: string;
  joining_date: string;
  address?: string;
  branch_id?: string;
  department_id?: string;
  role_id?: string;
  manager_id?: string;
  jobtitle_id?: string;
  created_by?: string;
}

export interface UpdateEmployeeDto {
  first_name?: string;
  last_name?: string;
  gender?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  joining_date?: string;
  address?: string;
  branch_id?: string;
  department_id?: string;
  role_id?: string;
  manager_id?: string;
  jobtitle_id?: string;
  is_active?: boolean;
  updated_by?: string;
}

export interface EmployeeLookupResponse {
  employee_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  date_of_birth?: string;
  joining_date?: string;
  gender?: string;
  address?: string;
  department?: string; // From HRMS (TEXT field)
  manager?: string; // From HRMS (TEXT field)
  jobtitle?: string; // From HRMS (TEXT field)
  synced_from_hrms: boolean;
  hrms_sync_date?: string;
}

