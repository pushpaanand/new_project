-- Migration: Make created_by and updated_by nullable in clients_contact table
-- Reason: Mock authentication uses string IDs (e.g., "admin-001") instead of UUIDs
-- These are sanitized to NULL, so the columns need to allow NULL values

-- Make created_by nullable in clients_contact table
ALTER TABLE clients_contact 
ALTER COLUMN created_by DROP NOT NULL;

-- Make updated_by nullable in clients_contact table (if it has NOT NULL constraint)
ALTER TABLE clients_contact 
ALTER COLUMN updated_by DROP NOT NULL;

-- Optional: Also make created_by and updated_by nullable in client table for consistency
ALTER TABLE client 
ALTER COLUMN created_by DROP NOT NULL;

ALTER TABLE client 
ALTER COLUMN updated_by DROP NOT NULL;

