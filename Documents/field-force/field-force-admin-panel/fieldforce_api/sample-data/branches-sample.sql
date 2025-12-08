-- Sample Data for Branches Table
-- This file contains INSERT queries for all Kauvery Hospital branches
-- Based on the provided branch list

-- =====================================================
-- 1. First, ensure cities and regions exist in lookup table
-- =====================================================

-- Insert Cities
INSERT INTO lookup (name, key, is_active) VALUES
('Chennai', 'city', true),
('Trichy', 'city', true),
('Salem', 'city', true),
('Tirunelveli', 'city', true),
('Hosur', 'city', true),
('Bangalore', 'city', true)
ON CONFLICT DO NOTHING;

-- Insert Regions
INSERT INTO lookup (name, key, is_active) VALUES
('Alwarpet', 'region', true),
('Vadapalani', 'region', true),
('Kovilambakkam', 'region', true),
('Heartcity', 'region', true),
('Tennur', 'region', true),
('Salem', 'region', true),
('Tirunelveli', 'region', true),
('Hosur', 'region', true),
('Electronic City', 'region', true),
('Marathahalli', 'region', true),
('Cantonment', 'region', true),
('Trichy', 'region', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 2. Insert Branches
-- =====================================================

-- Note: city and region are UUIDs from lookup table
-- We use subqueries to get the lookup IDs

INSERT INTO branches (name, unit_code, address, city, region, is_active) VALUES
-- 1. Kauvery Hospital, Chennai (Alwarpet)
(
    'Kauvery Hospital, Chennai (A Unit Of Sri Kauvery Medical Care India Limited)',
    'KCH',
    'No. 199, Luz Church Road, Mylapore, Chennai - 600004',
    (SELECT id FROM lookup WHERE name = 'Chennai' AND key = 'city' LIMIT 1),
    (SELECT id FROM lookup WHERE name = 'Alwarpet' AND key = 'region' LIMIT 1),
    true
),

-- 2. Kauvery Hospital, Vadapalani
(
    'Kauvery Hospital, Vadapalani (A Unit Of Sri Kauvery Medical Care India Limited)',
    'KVP',
    'No.23/1,Arcot Road,Vadapalani,Chennai-26', -- Address not provided in the table
    (SELECT id FROM lookup WHERE name = 'Chennai' AND key = 'city' LIMIT 1),
    (SELECT id FROM lookup WHERE name = 'Vadapalani' AND key = 'region' LIMIT 1),
    true
),

-- 3. Kauvery Hospital, Kovilambakkam
(
    'Kauvery Hospital, Kovilambakkam (A Unit Of Sri Kauvery Medical Care India Limited)',
    'KRR',
    'No.2/473,Radial road,200ft, Kovilambakkam,Chennai -600129', -- Address not provided in the table
    (SELECT id FROM lookup WHERE name = 'Chennai' AND key = 'city' LIMIT 1),
    (SELECT id FROM lookup WHERE name = 'Kovilambakkam' AND key = 'region' LIMIT 1),
    true
),

-- 4. Kauvery Hospital, Heartcity
(
    'Kauvery Hospital, Heartcity (A Unit Of Sri Kauvery Medical Care India Limited)',
    'KHC',
    'No. 12/52 Alexandria Road, Cantonment, Trichy - 620001 (Near Park)', -- Address not provided in the table
    (SELECT id FROM lookup WHERE name = 'Chennai' AND key = 'city' LIMIT 1),
    (SELECT id FROM lookup WHERE name = 'Heartcity' AND key = 'region' LIMIT 1),
    true
),

-- 5. Kauvery Hospital, Tennur (Trichy)
(
    'Kauvery Hospital, Tennur (A Unit Of Sri Kauvery Medical Care India Limited)',
    'KTN',
    'No. 1 K.C.Road, Tennur, Trichy - 620017 (Near SS Garments)', -- Address not provided in the table
    (SELECT id FROM lookup WHERE name = 'Trichy' AND key = 'city' LIMIT 1),
    (SELECT id FROM lookup WHERE name = 'Tennur' AND key = 'region' LIMIT 1),
    true
),

-- 6. Kauvery Hospital, Salem
(
    'Kauvery Hospital, Salem (A Unit Of Sri Kauvery Medical Care India Limited)',
    'KSM',
    'No. 9/50, Trichy Main Road, Seelanayakkanpatti, Salem - 636201 (Near Ramani Honda)', -- Address not provided in the table
    (SELECT id FROM lookup WHERE name = 'Salem' AND key = 'city' LIMIT 1),
    (SELECT id FROM lookup WHERE name = 'Salem' AND key = 'region' LIMIT 1),
    true
),

-- 7. Kauvery Hospital, Tirunelveli
(
    'Kauvery Hospital, Tirunelveli (A Unit Of Sri Kauvery Medical Care India Limited)',
    'KTV',
    'No. 110 E/20/1, North Bypass Road, Vannarpet, Palayamkottai, Tirunelveli- 627003 Tamil Nadu. (opp to maruti opticals)', -- Address not provided in the table
    (SELECT id FROM lookup WHERE name = 'Tirunelveli' AND key = 'city' LIMIT 1),
    (SELECT id FROM lookup WHERE name = 'Tirunelveli' AND key = 'region' LIMIT 1),
    true
),

-- 8. Kauvery Hospital, Hosur
(
    'Kauvery Hospital, Hosur (A Unit Of Sri Kauvery Medical Care India Limited)',
    'KHO',
    'No. 35, Denkanikotta Road, Opp. CSI Church, Shanthi Nagar, Hosur - 635109 (Near PMK scans & Labs)', -- Address not provided in the table
    (SELECT id FROM lookup WHERE name = 'Hosur' AND key = 'city' LIMIT 1),
    (SELECT id FROM lookup WHERE name = 'Hosur' AND key = 'region' LIMIT 1),
    true
),

-- 9. Sri Kauvery Medical Care India Limited (Electronic City, Chennai)
(
    'Sri Kauvery Medical Care India Limited',
    'KEC',
    'No: 92/ 1B, Konappana Agrahara, Electronic City, Bengaluru South -560100', -- Address not provided in the table
    (SELECT id FROM lookup WHERE name = 'Chennai' AND key = 'city' LIMIT 1),
    (SELECT id FROM lookup WHERE name = 'Electronic City' AND key = 'region' LIMIT 1),
    true
),

-- 10. Sri Kauvery Medical Care India Limited (Marathahalli, Bangalore)
(
    'Sri Kauvery Medical Care India Limited',
    'KMH',
    ' No.23713/3, Old HAL Airport Varthur Road, Marathahalli, Bengaluru-560037.', -- Address not provided in the table
    (SELECT id FROM lookup WHERE name = 'Bangalore' AND key = 'city' LIMIT 1),
    (SELECT id FROM lookup WHERE name = 'Marathahalli' AND key = 'region' LIMIT 1),
    true
),

-- 11. KMC Specialty Hospitals India Limited - Cantonment, Trichy
(
    'KMC Specialty Hospitals India Limited - Cantonment, Trichy',
    'KCN',
    'No. 6 Royal Road, Cantonment, Trichy - 620001 (Near Cantonment park)', -- Address not provided in the table
    (SELECT id FROM lookup WHERE name = 'Trichy' AND key = 'city' LIMIT 1),
    (SELECT id FROM lookup WHERE name = 'Cantonment' AND key = 'region' LIMIT 1),
    true
),

-- 12. MAA Kauvery (A Unit of KMC Specialty Hospitals India Limited - Trichy)
(
    'MAA Kauvery (A Unit of KMC Specialty Hospitals India Limited - Trichy)',
    'KMC',
    'No:27,Alexandria Road,Cantonment,Trichy-620001', -- Address not provided in the table
    (SELECT id FROM lookup WHERE name = 'Trichy' AND key = 'city' LIMIT 1),
    (SELECT id FROM lookup WHERE name = 'Trichy' AND key = 'region' LIMIT 1),
    true
)

ON CONFLICT (unit_code) DO UPDATE
SET 
    name = EXCLUDED.name,
    address = COALESCE(EXCLUDED.address, branches.address),
    city = EXCLUDED.city,
    region = EXCLUDED.region,
    updated_at = CURRENT_TIMESTAMP;

-- =====================================================
-- 3. Verification Query
-- =====================================================

-- View all inserted branches with city and region names
SELECT 
    b.id,
    b.name,
    b.unit_code,
    b.address,
    city_lookup.name as city,
    region_lookup.name as region,
    b.is_active,
    b.created_at
FROM branches b
LEFT JOIN lookup city_lookup ON b.city = city_lookup.id
LEFT JOIN lookup region_lookup ON b.region = region_lookup.id
ORDER BY b.unit_code;

