-- =====================================================
-- Roles and Entitlements Setup Script
-- =====================================================
-- This script creates the three admin panel roles and
-- sets up entitlements for all current pages
-- =====================================================

-- Note: This script assumes you have at least one employee record
-- to use as created_by. Replace the UUID below with an actual employee ID
-- or set it to NULL if your schema allows it.

-- =====================================================
-- 1. CREATE ROLES
-- =====================================================

-- Insert the three admin panel roles
INSERT INTO roles (id, name, is_active, created_at, updated_at)
VALUES 
    (uuid_generate_v4(), 'Admin', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4(), 'Super Manager', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4(), 'Manager', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 2. CREATE ENTITLEMENTS (All Current Pages)
-- =====================================================

-- Insert entitlements for all pages in the application
INSERT INTO entitlement (id, name, is_active, created_at, updated_at)
VALUES 
    -- Dashboard
    (uuid_generate_v4(), 'View Dashboard', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    
    -- Visits
    (uuid_generate_v4(), 'View Visits', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4(), 'Manage Visits', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    
    -- Employees
    (uuid_generate_v4(), 'View Employees', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4(), 'Manage Employees', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    
    -- Clients
    (uuid_generate_v4(), 'View Clients', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4(), 'Manage Clients', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    
    -- Reports
    (uuid_generate_v4(), 'View Reports', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4(), 'Generate Reports', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    
    -- Attendance
    (uuid_generate_v4(), 'View Attendance', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4(), 'Manage Attendance', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    
    -- Leaves
    (uuid_generate_v4(), 'View Leaves', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4(), 'Manage Leaves', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    
    -- Tasks
    (uuid_generate_v4(), 'View Tasks', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4(), 'Manage Tasks', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    
    -- Expenses
    (uuid_generate_v4(), 'View Expenses', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4(), 'Manage Expenses', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    
    -- Organization
    (uuid_generate_v4(), 'View Organization', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4(), 'Manage Organization', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    
    -- Profile
    (uuid_generate_v4(), 'View Profile', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4(), 'Manage Profile', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    
    -- Settings
    (uuid_generate_v4(), 'View Settings', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4(), 'Manage Settings', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 3. ASSIGN ENTITLEMENTS TO ROLES
-- =====================================================
-- For now, all three roles get all entitlements with both read and write access
-- You can modify this later to restrict specific permissions

-- Get role IDs
DO $$
DECLARE
    admin_role_id UUID;
    super_manager_role_id UUID;
    manager_role_id UUID;
    entitlement_record RECORD;
BEGIN
    -- Get role IDs
    SELECT id INTO admin_role_id FROM roles WHERE name = 'Admin' LIMIT 1;
    SELECT id INTO super_manager_role_id FROM roles WHERE name = 'Super Manager' LIMIT 1;
    SELECT id INTO manager_role_id FROM roles WHERE name = 'Manager' LIMIT 1;

    -- Assign all entitlements to Admin role (read and write)
    FOR entitlement_record IN SELECT id FROM entitlement WHERE is_active = true
    LOOP
        INSERT INTO role_entitlement (role_id, entitlement_id, is_read, is_write, is_active, created_at, updated_at)
        VALUES (admin_role_id, entitlement_record.id, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (role_id, entitlement_id) DO NOTHING;
    END LOOP;

    -- Assign all entitlements to Super Manager role (read and write)
    FOR entitlement_record IN SELECT id FROM entitlement WHERE is_active = true
    LOOP
        INSERT INTO role_entitlement (role_id, entitlement_id, is_read, is_write, is_active, created_at, updated_at)
        VALUES (super_manager_role_id, entitlement_record.id, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (role_id, entitlement_id) DO NOTHING;
    END LOOP;

    -- Assign all entitlements to Manager role (read and write)
    FOR entitlement_record IN SELECT id FROM entitlement WHERE is_active = true
    LOOP
        INSERT INTO role_entitlement (role_id, entitlement_id, is_read, is_write, is_active, created_at, updated_at)
        VALUES (manager_role_id, entitlement_record.id, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (role_id, entitlement_id) DO NOTHING;
    END LOOP;
END $$;

-- =====================================================
-- 4. VERIFICATION QUERIES
-- =====================================================

-- View all roles
SELECT id, name, is_active, created_at FROM roles ORDER BY name;

-- View all entitlements
SELECT id, name, is_active, created_at FROM entitlement ORDER BY name;

-- View role-entitlement mappings
SELECT 
    r.name as role_name,
    e.name as entitlement_name,
    re.is_read,
    re.is_write,
    re.is_active
FROM role_entitlement re
INNER JOIN roles r ON re.role_id = r.id
INNER JOIN entitlement e ON re.entitlement_id = e.id
WHERE re.is_active = true
ORDER BY r.name, e.name;

