export interface Client {
  id: string;
  client_name: string;
  category_id?: string;
  category_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface ClientContact {
  id: string;
  emp_id?: string;
  employee_name?: string;
  employee_id?: string;
  client_id: string;
  client_name?: string;
  contact_name?: string;
  primary_contact_number: string;
  secondary_contact_number?: string;
  primary_email?: string;
  secondary_email?: string;
  address?: string;
  city?: string;
  city_id?: string;
  state?: string;
  state_id?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  region?: string;
  region_id?: string;
  branch?: string; // Text field, not referencing branches table
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by?: string;
}

export interface CreateClientDto {
  client_name: string;
  category_id?: string;
  created_by?: string;
}

export interface UpdateClientDto {
  client_name?: string;
  category_id?: string;
  is_active?: boolean;
  updated_by?: string;
}

export interface CreateClientContactDto {
  emp_id?: string;
  client_id: string;
  contact_name?: string;
  primary_contact_number: string;
  secondary_contact_number?: string;
  primary_email?: string;
  secondary_email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  region?: string;
  branch?: string; // Text field for client branch name
  created_by: string;
}

export interface UpdateClientContactDto {
  emp_id?: string;
  client_id?: string;
  contact_name?: string;
  primary_contact_number?: string;
  secondary_contact_number?: string;
  primary_email?: string;
  secondary_email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  region?: string;
  branch?: string; // Text field for client branch name
  is_active?: boolean;
  updated_by?: string;
}

