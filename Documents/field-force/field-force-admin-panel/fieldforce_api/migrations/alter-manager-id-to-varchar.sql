-- =====================================================
-- Simple ALTER: Change manager_id from UUID to VARCHAR(100)
-- =====================================================
-- This script changes manager_id to store employee_id (6 digits) directly
-- =====================================================

-- Step 1: Drop the foreign key constraint
ALTER TABLE employees 
DROP CONSTRAINT IF EXISTS employees_manager_id_fkey;

-- Step 2: Drop the index
DROP INDEX IF EXISTS idx_employees_manager;

-- Step 3: Change column type from UUID to VARCHAR(100) first
-- Convert UUID to text using USING clause
ALTER TABLE employees 
ALTER COLUMN manager_id TYPE VARCHAR(100) USING manager_id::text;

-- Step 4: Now update existing UUID text values to employee_id values
-- Convert UUID text (like 'uuid-here') to corresponding employee_id
UPDATE employees e1
SET manager_id = e2.employee_id
FROM employees e2
WHERE e1.manager_id = e2.id::text
AND e1.manager_id IS NOT NULL
AND e1.manager_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Step 5: Recreate the foreign key constraint referencing employees(employee_id)
ALTER TABLE employees 
ADD CONSTRAINT employees_manager_id_fkey 
FOREIGN KEY (manager_id) REFERENCES employees(employee_id);

-- Step 6: Recreate the index
CREATE INDEX idx_employees_manager ON employees(manager_id);

-- Step 7: Add comment
COMMENT ON COLUMN employees.manager_id IS 'References employees.employee_id (VARCHAR) - stores the 6-digit employee_id of the manager';
