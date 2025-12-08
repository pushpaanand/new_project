export interface LoginRequest {
  employee_id: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    employee_id: string;
    first_name: string;
    last_name: string;
    email?: string;
    phone: string;
    role: {
      id: string;
      name: string;
    };
    entitlements: {
      id: string;
      name: string;
      is_read: boolean;
      is_write: boolean;
    }[];
  };
}

export interface AuthUser {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  role: {
    id: string;
    name: string;
  };
  entitlements: {
    id: string;
    name: string;
    is_read: boolean;
    is_write: boolean;
  }[];
}

