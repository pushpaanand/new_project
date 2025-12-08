-- =====================================================
-- Sample Data for Client Management Tables
-- =====================================================
-- This script inserts sample data for:
-- 1. client_categories
-- 2. client
-- 3. clients_contact (optional, can be added separately)
-- =====================================================

-- Enable UUID extension if not already enabled
-- This enables uuid-ossp extension which provides uuid_generate_v4() function
-- Required for generating UUIDs in PostgreSQL versions < 13
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CLIENT CATEGORIES
-- =====================================================

INSERT INTO client_categories (id, name, is_active, created_at, updated_at) VALUES
('a1b2c3d4-e5f6-4789-a012-345678901234', 'GHC', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b2c3d4e5-f6a7-4890-b123-456789012345', 'Corporate', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('c3d4e5f6-a7b8-4901-c234-567890123456', 'Retail', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('d4e5f6a7-b8c9-4012-d345-678901234567', 'Institutional', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('e5f6a7b8-c9d0-4123-e456-789012345678', 'Government', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. CLIENTS
-- =====================================================
-- Note: Replace the category_id UUIDs with actual IDs from client_categories table
-- You can query: SELECT id FROM client_categories WHERE name = 'GHC';

-- Get category IDs (using subquery for flexibility)
WITH category_ids AS (
    SELECT 
        id as ghc_id,
        (SELECT id FROM client_categories WHERE name = 'Corporate' LIMIT 1) as corporate_id,
        (SELECT id FROM client_categories WHERE name = 'Retail' LIMIT 1) as retail_id,
        (SELECT id FROM client_categories WHERE name = 'Institutional' LIMIT 1) as institutional_id,
        (SELECT id FROM client_categories WHERE name = 'Government' LIMIT 1) as government_id
    FROM client_categories 
    WHERE name = 'GHC' 
    LIMIT 1
)
INSERT INTO client (id, client_name, category_id, is_active, created_at, updated_at)
SELECT 
    uuid_generate_v4(),  -- Uses uuid-ossp extension (enabled above)
    client_name,
    category_id,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM (VALUES
    -- GHC Clients
    ('Apollo Hospitals', (SELECT id FROM client_categories WHERE name = 'GHC' LIMIT 1)),
    ('Fortis Healthcare', (SELECT id FROM client_categories WHERE name = 'GHC' LIMIT 1)),
    ('Max Healthcare', (SELECT id FROM client_categories WHERE name = 'GHC' LIMIT 1)),
    ('Manipal Hospitals', (SELECT id FROM client_categories WHERE name = 'GHC' LIMIT 1)),
    ('Narayana Health', (SELECT id FROM client_categories WHERE name = 'GHC' LIMIT 1)),
    
    -- Corporate Clients
    ('TCS Healthcare Division', (SELECT id FROM client_categories WHERE name = 'Corporate' LIMIT 1)),
    ('Infosys Wellness Center', (SELECT id FROM client_categories WHERE name = 'Corporate' LIMIT 1)),
    ('Wipro Health Services', (SELECT id FROM client_categories WHERE name = 'Corporate' LIMIT 1)),
    ('HCL Medical Services', (SELECT id FROM client_categories WHERE name = 'Corporate' LIMIT 1)),
    ('Accenture Health Solutions', (SELECT id FROM client_categories WHERE name = 'Corporate' LIMIT 1)),
    
    -- Retail Clients
    ('Reliance Health Store', (SELECT id FROM client_categories WHERE name = 'Retail' LIMIT 1)),
    ('DMart Pharmacy', (SELECT id FROM client_categories WHERE name = 'Retail' LIMIT 1)),
    ('Apollo Pharmacy', (SELECT id FROM client_categories WHERE name = 'Retail' LIMIT 1)),
    ('MedPlus Pharmacy', (SELECT id FROM client_categories WHERE name = 'Retail' LIMIT 1)),
    ('Wellness Forever', (SELECT id FROM client_categories WHERE name = 'Retail' LIMIT 1)),
    
    -- Institutional Clients
    ('AIIMS Delhi', (SELECT id FROM client_categories WHERE name = 'Institutional' LIMIT 1)),
    ('PGI Chandigarh', (SELECT id FROM client_categories WHERE name = 'Institutional' LIMIT 1)),
    ('CMC Vellore', (SELECT id FROM client_categories WHERE name = 'Institutional' LIMIT 1)),
    ('JIPMER Puducherry', (SELECT id FROM client_categories WHERE name = 'Institutional' LIMIT 1)),
    ('NIMHANS Bangalore', (SELECT id FROM client_categories WHERE name = 'Institutional' LIMIT 1)),
    
    -- Government Clients
    ('CGHS Delhi', (SELECT id FROM client_categories WHERE name = 'Government' LIMIT 1)),
    ('ESIC Hospital', (SELECT id FROM client_categories WHERE name = 'Government' LIMIT 1)),
    ('Railway Hospital', (SELECT id FROM client_categories WHERE name = 'Government' LIMIT 1)),
    ('Defense Hospital', (SELECT id FROM client_categories WHERE name = 'Government' LIMIT 1)),
    ('Municipal Corporation Hospital', (SELECT id FROM client_categories WHERE name = 'Government' LIMIT 1))
) AS clients(client_name, category_id)
WHERE NOT EXISTS (
    SELECT 1 FROM client WHERE client.client_name = clients.client_name
);

-- =====================================================
-- Alternative: Direct INSERT with specific UUIDs (if you prefer)
-- =====================================================
-- Uncomment and use this if you want specific UUIDs for clients

/*
INSERT INTO client (id, client_name, category_id, is_active, created_at, updated_at) VALUES
-- GHC Clients
('f1a2b3c4-d5e6-4789-f012-345678901234', 'Apollo Hospitals', 
    (SELECT id FROM client_categories WHERE name = 'GHC' LIMIT 1), 
    true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f2a3b4c5-d6e7-4890-f123-456789012345', 'Fortis Healthcare', 
    (SELECT id FROM client_categories WHERE name = 'GHC' LIMIT 1), 
    true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f3a4b5c6-d7e8-4901-f234-567890123456', 'Max Healthcare', 
    (SELECT id FROM client_categories WHERE name = 'GHC' LIMIT 1), 
    true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f4a5b6c7-d8e9-4012-f345-678901234567', 'Manipal Hospitals', 
    (SELECT id FROM client_categories WHERE name = 'GHC' LIMIT 1), 
    true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f5a6b7c8-d9e0-4123-f456-789012345678', 'Narayana Health', 
    (SELECT id FROM client_categories WHERE name = 'GHC' LIMIT 1), 
    true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Corporate Clients
('c1a2b3c4-d5e6-4789-c012-345678901234', 'TCS Healthcare Division', 
    (SELECT id FROM client_categories WHERE name = 'Corporate' LIMIT 1), 
    true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('c2a3b4c5-d6e7-4890-c123-456789012345', 'Infosys Wellness Center', 
    (SELECT id FROM client_categories WHERE name = 'Corporate' LIMIT 1), 
    true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('c3a4b5c6-d7e8-4901-c234-567890123456', 'Wipro Health Services', 
    (SELECT id FROM client_categories WHERE name = 'Corporate' LIMIT 1), 
    true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Retail Clients
('r1a2b3c4-d5e6-4789-r012-345678901234', 'Reliance Health Store', 
    (SELECT id FROM client_categories WHERE name = 'Retail' LIMIT 1), 
    true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('r2a3b4c5-d6e7-4890-r123-456789012345', 'DMart Pharmacy', 
    (SELECT id FROM client_categories WHERE name = 'Retail' LIMIT 1), 
    true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Institutional Clients
('i1a2b3c4-d5e6-4789-i012-345678901234', 'AIIMS Delhi', 
    (SELECT id FROM client_categories WHERE name = 'Institutional' LIMIT 1), 
    true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('i2a3b4c5-d6e7-4890-i123-456789012345', 'PGI Chandigarh', 
    (SELECT id FROM client_categories WHERE name = 'Institutional' LIMIT 1), 
    true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Government Clients
('g1a2b3c4-d5e6-4789-g012-345678901234', 'CGHS Delhi', 
    (SELECT id FROM client_categories WHERE name = 'Government' LIMIT 1), 
    true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('g2a3b4c5-d6e7-4890-g123-456789012345', 'ESIC Hospital', 
    (SELECT id FROM client_categories WHERE name = 'Government' LIMIT 1), 
    true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;
*/

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check inserted categories
SELECT id, name, is_active FROM client_categories ORDER BY name;

-- Check inserted clients with category names
SELECT 
    c.id,
    c.client_name,
    cc.name as category_name,
    c.is_active,
    c.created_at
FROM client c
LEFT JOIN client_categories cc ON cc.id = c.category_id
ORDER BY cc.name, c.client_name;

-- Count clients by category
SELECT 
    cc.name as category_name,
    COUNT(c.id) as client_count
FROM client_categories cc
LEFT JOIN client c ON c.category_id = cc.id
GROUP BY cc.name
ORDER BY client_count DESC;

