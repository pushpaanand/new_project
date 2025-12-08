-- =====================================================
-- ALTER branch_id to branch (VARCHAR) in clients_contact table
-- =====================================================
-- This script changes branch_id from UUID (referencing branches table)
-- to branch as VARCHAR (text field) for client contacts
-- =====================================================

-- Step 1: Drop the foreign key constraint
ALTER TABLE clients_contact 
DROP CONSTRAINT IF EXISTS clients_contact_branch_id_fkey;

-- Step 2: Drop the index
DROP INDEX IF EXISTS idx_clients_contact_branch;

-- Step 3: Change column type from UUID to VARCHAR(255)
-- First convert UUID to text, then we'll update to branch name if needed
ALTER TABLE clients_contact 
ALTER COLUMN branch_id TYPE VARCHAR(255) USING branch_id::text;

-- Step 4: Rename the column from branch_id to branch
ALTER TABLE clients_contact 
RENAME COLUMN branch_id TO branch;

-- Step 5: Add comment
COMMENT ON COLUMN clients_contact.branch IS 'Client branch name (text field, not referencing branches table)';

