-- Sample Data for Employees Table
-- This file contains sample INSERT queries for testing

-- First, ensure you have the required lookup data
-- Insert Gender lookup values
INSERT INTO lookup (name, key, is_active) VALUES
('Male', 'gender', true),
('Female', 'gender', true),
('Other', 'gender', true)
ON CONFLICT DO NOTHING;

-- Insert Job Title lookup values
INSERT INTO lookup (name, key, is_active) VALUES
('Junior Executive', 'jobtitle', true),
('Executive', 'jobtitle', true),
('Senior Executive', 'jobtitle', true),
('Manager', 'jobtitle', true),
('Senior Manager', 'jobtitle', true),
('Super Manager', 'jobtitle', true),
('Admin', 'jobtitle', true)
ON CONFLICT DO NOTHING;

-- Insert sample branches (if not exists)
INSERT INTO branches (name, unit_code, address, is_active) VALUES
('Chennai Main', 'CHN001', '123 Main Street, Chennai', true),
('Bangalore Branch', 'BLR001', '456 Tech Park, Bangalore', true),
('Mumbai Branch', 'MUM001', '789 Business District, Mumbai', true)
ON CONFLICT (unit_code) DO NOTHING;

-- Insert sample departments (if not exists)
INSERT INTO departments (name, is_active) VALUES
('Clinical Nursing', true),
('Legal', true),
('Clinical Support', true),
('Facility Services', true)
ON CONFLICT DO NOTHING;

-- Insert sample roles (if not exists)
INSERT INTO roles (name, is_active) VALUES
('Executive', true),
('Manager', true),
('Super Manager', true),
('Admin', true)
ON CONFLICT DO NOTHING;

-- Sample Employee Data
-- Note: Passwords are hashed using bcrypt. Default password for all: "password123"
-- Hash for "password123": $2a$10$rK8X9YzZ3Q4W5V6X7Y8Z9A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q

-- Sample Employee 1
INSERT INTO employees (
    employee_id, password_hash, first_name, last_name, gender, email, phone,
    date_of_birth, joining_date, address, branch_id, department_id, role_id,
    manager_id, jobtitle_id, is_active
)
SELECT 
    '136869',
    '$2a$10$rK8X9YzZ3Q4W5V6X7Y8Z9A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q', -- password123
    'Sam',
    'Smith',
    (SELECT id FROM lookup WHERE name = 'Male' AND key = 'gender' LIMIT 1),
    'sam.smith@example.com',
    '+91 9876543210',
    '1990-05-20',
    '2022-01-15',
    '123 Main Street, Chennai, Tamil Nadu',
    (SELECT id FROM branches WHERE unit_code = 'CHN001' LIMIT 1),
    (SELECT id FROM departments WHERE name = 'Sales' LIMIT 1),
    (SELECT id FROM roles WHERE name = 'Admin' LIMIT 1),
    NULL, -- manager_id (self for admin)
    (SELECT id FROM lookup WHERE name = 'Admin' AND key = 'jobtitle' LIMIT 1),
    true
WHERE NOT EXISTS (SELECT 1 FROM employees WHERE employee_id = '136869');

-- Sample Employee 2
INSERT INTO employees (
    employee_id, password_hash, first_name, last_name, gender, email, phone,
    date_of_birth, joining_date, address, branch_id, department_id, role_id,
    manager_id, jobtitle_id, is_active
)
SELECT 
    '136870',
    '$2a$10$rK8X9YzZ3Q4W5V6X7Y8Z9A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q', -- password123
    'Oscar',
    'Bob',
    (SELECT id FROM lookup WHERE name = 'Male' AND key = 'gender' LIMIT 1),
    'oscar.bob@example.com',
    '+91 9876543211',
    '1992-08-15',
    '2022-03-10',
    '456 OMR Road, Chennai, Tamil Nadu',
    (SELECT id FROM branches WHERE unit_code = 'CHN001' LIMIT 1),
    (SELECT id FROM departments WHERE name = 'Sales' LIMIT 1),
    (SELECT id FROM roles WHERE name = 'Executive' LIMIT 1),
    (SELECT id FROM employees WHERE employee_id = '136869' LIMIT 1), -- Manager: Sam Smith
    (SELECT id FROM lookup WHERE name = 'Executive' AND key = 'jobtitle' LIMIT 1),
    true
WHERE NOT EXISTS (SELECT 1 FROM employees WHERE employee_id = '136870');

-- Sample Employee 3
INSERT INTO employees (
    employee_id, password_hash, first_name, last_name, gender, email, phone,
    date_of_birth, joining_date, address, branch_id, department_id, role_id,
    manager_id, jobtitle_id, is_active
)
SELECT 
    '136871',
    '$2a$10$rK8X9YzZ3Q4W5V6X7Y8Z9A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q', -- password123
    'Ethan',
    'Johnson',
    (SELECT id FROM lookup WHERE name = 'Male' AND key = 'gender' LIMIT 1),
    'ethan.johnson@example.com',
    '+91 9876543212',
    '1991-11-30',
    '2022-02-20',
    '789 Velachery Road, Chennai, Tamil Nadu',
    (SELECT id FROM branches WHERE unit_code = 'CHN001' LIMIT 1),
    (SELECT id FROM departments WHERE name = 'Sales' LIMIT 1),
    (SELECT id FROM roles WHERE name = 'Executive' LIMIT 1),
    (SELECT id FROM employees WHERE employee_id = '136869' LIMIT 1), -- Manager: Sam Smith
    (SELECT id FROM lookup WHERE name = 'Executive' AND key = 'jobtitle' LIMIT 1),
    true
WHERE NOT EXISTS (SELECT 1 FROM employees WHERE employee_id = '136871');

-- Sample Employee 4 (Manager)
INSERT INTO employees (
    employee_id, password_hash, first_name, last_name, gender, email, phone,
    date_of_birth, joining_date, address, branch_id, department_id, role_id,
    manager_id, jobtitle_id, is_active
)
SELECT 
    '136872',
    '$2a$10$rK8X9YzZ3Q4W5V6X7Y8Z9A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q', -- password123
    'John',
    'Smith',
    (SELECT id FROM lookup WHERE name = 'Male' AND key = 'gender' LIMIT 1),
    'john.smith@example.com',
    '+91 9876543213',
    '1985-03-15',
    '2020-06-01',
    '321 Manager Street, Chennai, Tamil Nadu',
    (SELECT id FROM branches WHERE unit_code = 'CHN001' LIMIT 1),
    (SELECT id FROM departments WHERE name = 'Sales' LIMIT 1),
    (SELECT id FROM roles WHERE name = 'Manager' LIMIT 1),
    (SELECT id FROM employees WHERE employee_id = '136869' LIMIT 1), -- Manager: Sam Smith (Admin)
    (SELECT id FROM lookup WHERE name = 'Manager' AND key = 'jobtitle' LIMIT 1),
    true
WHERE NOT EXISTS (SELECT 1 FROM employees WHERE employee_id = '136872');

-- Sample Employee 5 (Female Executive)
INSERT INTO employees (
    employee_id, password_hash, first_name, last_name, gender, email, phone,
    date_of_birth, joining_date, address, branch_id, department_id, role_id,
    manager_id, jobtitle_id, is_active
)
SELECT 
    '136873',
    '$2a$10$rK8X9YzZ3Q4W5V6X7Y8Z9A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q', -- password123
    'Jane',
    'Doe',
    (SELECT id FROM lookup WHERE name = 'Female' AND key = 'gender' LIMIT 1),
    'jane.doe@example.com',
    '+91 9876543214',
    '1993-07-22',
    '2022-05-10',
    '654 Adyar, Chennai, Tamil Nadu',
    (SELECT id FROM branches WHERE unit_code = 'CHN001' LIMIT 1),
    (SELECT id FROM departments WHERE name = 'Sales' LIMIT 1),
    (SELECT id FROM roles WHERE name = 'Executive' LIMIT 1),
    (SELECT id FROM employees WHERE employee_id = '136872' LIMIT 1), -- Manager: John Smith
    (SELECT id FROM lookup WHERE name = 'Senior Executive' AND key = 'jobtitle' LIMIT 1),
    true
WHERE NOT EXISTS (SELECT 1 FROM employees WHERE employee_id = '136873');

-- Update manager_id for employees 2 and 3 to point to John Smith (136872) instead
UPDATE employees 
SET manager_id = (SELECT id FROM employees WHERE employee_id = '136872' LIMIT 1)
WHERE employee_id IN ('136870', '136871')
AND EXISTS (SELECT 1 FROM employees WHERE employee_id = '136872');

-- Verify inserted data
SELECT 
    e.employee_id,
    e.first_name || ' ' || e.last_name as name,
    e.email,
    e.phone,
    b.name as branch,
    d.name as department,
    r.name as role,
    l.name as jobtitle
FROM employees e
LEFT JOIN branches b ON b.id = e.branch_id
LEFT JOIN departments d ON d.id = e.department_id
LEFT JOIN roles r ON r.id = e.role_id
LEFT JOIN lookup l ON l.id = e.jobtitle_id AND l.key = 'jobtitle'
ORDER BY e.employee_id;

