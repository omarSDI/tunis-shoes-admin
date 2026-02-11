-- Diagnostic Script: Check Current RLS Policies and Permissions
-- Run this in Supabase SQL Editor to see what's currently configured

-- ============================================================================
-- 1. CHECK RLS STATUS
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('products', 'orders', 'admins')
ORDER BY tablename;

-- ============================================================================
-- 2. CHECK PRODUCTS TABLE POLICIES
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    policyname as "Policy Name",
    permissive as "Permissive",
    roles as "Roles",
    cmd as "Command",
    qual as "USING Expression",
    with_check as "WITH CHECK Expression"
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'products'
ORDER BY policyname;

-- ============================================================================
-- 3. CHECK ORDERS TABLE POLICIES
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    policyname as "Policy Name",
    permissive as "Permissive",
    roles as "Roles",
    cmd as "Command",
    qual as "USING Expression",
    with_check as "WITH CHECK Expression"
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'orders'
ORDER BY policyname;

-- ============================================================================
-- 4. CHECK ADMINS TABLE POLICIES
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    policyname as "Policy Name",
    permissive as "Permissive",
    roles as "Roles",
    cmd as "Command",
    qual as "USING Expression",
    with_check as "WITH CHECK Expression"
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'admins'
ORDER BY policyname;

-- ============================================================================
-- 5. CHECK TABLE PERMISSIONS
-- ============================================================================
SELECT 
    grantee,
    table_schema,
    table_name,
    string_agg(privilege_type, ', ') as privileges
FROM information_schema.table_privileges
WHERE table_schema = 'public'
AND table_name IN ('products', 'orders', 'admins')
AND grantee IN ('anon', 'authenticated', 'service_role')
GROUP BY grantee, table_schema, table_name
ORDER BY table_name, grantee;

-- ============================================================================
-- 6. CHECK IF PRODUCTS EXIST
-- ============================================================================
SELECT COUNT(*) as "Total Products" FROM products;

-- ============================================================================
-- 7. CHECK UPDATE_UPDATED_AT_COLUMN FUNCTION
-- ============================================================================
SELECT 
    routine_name,
    routine_type,
    security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'update_updated_at_column';

-- ============================================================================
-- INTERPRETATION GUIDE:
-- ============================================================================
-- 
-- Expected Results After Running QUICK_FIX_SECURITY.sql:
--
-- 1. RLS Status:
--    - All three tables should have RLS Enabled = true
--
-- 2. Products Policies:
--    - "Public views products" - SELECT for anon, authenticated
--    - "Service role manages products" - ALL for service_role
--
-- 3. Orders Policies:
--    - "Public creates orders" - INSERT for anon, authenticated (WITH CHECK: total_price > 0)
--    - "Public views orders" - SELECT for anon, authenticated
--    - "Service role manages orders" - ALL for service_role
--
-- 4. Admins Policies:
--    - "Service role manages admins" - ALL for service_role
--
-- 5. Permissions:
--    - anon & authenticated should have SELECT on products
--    - anon & authenticated should have INSERT, SELECT on orders
--    - service_role should have ALL on all tables
--
-- 6. Products Count:
--    - Should show your total number of products
--    - If 0, you need to add products to your database
--
-- 7. Function:
--    - Should show update_updated_at_column with security_type = DEFINER
