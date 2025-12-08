-- =====================================================
-- Drop Foreign Key Constraint on manager_id
-- =====================================================
-- manager_id is VARCHAR(100) storing employee_id (6 digits)
-- It should NOT have a foreign key constraint because:
-- 1. Manager might not exist in employees table yet
-- 2. It's just a text field for reference, not strict referential integrity
-- =====================================================

-- Drop the foreign key constraint
ALTER TABLE employees 
DROP CONSTRAINT IF EXISTS employees_manager_id_fkey;

-- Keep the index for performance
-- (Index already exists from previous migration)

-- Add comment
COMMENT ON COLUMN employees.manager_id IS 'Stores the 6-digit employee_id of the manager (VARCHAR) - no foreign key constraint to allow flexibility';

