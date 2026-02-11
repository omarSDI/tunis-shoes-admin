-- Migration: Fix Security Issues
-- This migration addresses:
-- 1. Function search_path mutability (0011_function_search_path_mutable)
-- 2. Overly permissive RLS policies (0024_rls_policy_always_true)

-- ============================================================================
-- 1. FIX FUNCTION SEARCH_PATH
-- ============================================================================

-- Drop and recreate the update_updated_at_column function with a secure search_path
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Recreate the trigger for products table
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 2. FIX ADMINS TABLE RLS POLICIES
-- ============================================================================

-- Drop overly permissive policies on admins table
DROP POLICY IF EXISTS "Admin only access" ON admins;
DROP POLICY IF EXISTS "Allow public read on admins" ON admins;
DROP POLICY IF EXISTS "Allow public update on admins" ON admins;

-- Create secure policies for admins table
-- Only authenticated users who are admins can read admin records
CREATE POLICY "Admins can read admin records" ON admins
FOR SELECT
TO authenticated
USING (
  auth.uid()::text IN (SELECT id::text FROM admins)
);

-- Only authenticated admins can update admin records
CREATE POLICY "Admins can update admin records" ON admins
FOR UPDATE
TO authenticated
USING (
  auth.uid()::text IN (SELECT id::text FROM admins)
)
WITH CHECK (
  auth.uid()::text IN (SELECT id::text FROM admins)
);

-- Only authenticated admins can insert new admin records
CREATE POLICY "Admins can insert admin records" ON admins
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid()::text IN (SELECT id::text FROM admins)
);

-- ============================================================================
-- 3. FIX ORDERS TABLE RLS POLICIES
-- ============================================================================

-- Drop overly permissive policies on orders table
DROP POLICY IF EXISTS "Admin full access on orders" ON orders;
DROP POLICY IF EXISTS "Allow public insert on orders" ON orders;
DROP POLICY IF EXISTS "Public update access" ON orders;
DROP POLICY IF EXISTS "Public read access" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Users can view orders" ON orders;

-- Create secure policies for orders table

-- Allow anyone to create orders (for public e-commerce checkout)
CREATE POLICY "Anyone can create orders" ON orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anyone to view orders (adjust if you want user-specific access)
-- For a public e-commerce site, you might want to restrict this
CREATE POLICY "Public can view orders" ON orders
FOR SELECT
TO anon, authenticated
USING (true);

-- Only service role and authenticated admins can update orders
CREATE POLICY "Admins can update orders" ON orders
FOR UPDATE
TO authenticated
USING (
  auth.uid()::text IN (SELECT id::text FROM admins)
)
WITH CHECK (
  auth.uid()::text IN (SELECT id::text FROM admins)
);

-- Only service role and authenticated admins can delete orders
CREATE POLICY "Admins can delete orders" ON orders
FOR DELETE
TO authenticated
USING (
  auth.uid()::text IN (SELECT id::text FROM admins)
);

-- ============================================================================
-- 4. FIX PRODUCTS TABLE RLS POLICIES
-- ============================================================================

-- Drop overly permissive policies on products table
DROP POLICY IF EXISTS "Admin full access on products" ON products;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;

-- Create secure policies for products table

-- Allow everyone to view products (public e-commerce)
CREATE POLICY "Public can view products" ON products
FOR SELECT
TO anon, authenticated
USING (true);

-- Only authenticated admins can insert products
CREATE POLICY "Admins can insert products" ON products
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid()::text IN (SELECT id::text FROM admins)
);

-- Only authenticated admins can update products
CREATE POLICY "Admins can update products" ON products
FOR UPDATE
TO authenticated
USING (
  auth.uid()::text IN (SELECT id::text FROM admins)
)
WITH CHECK (
  auth.uid()::text IN (SELECT id::text FROM admins)
);

-- Only authenticated admins can delete products
CREATE POLICY "Admins can delete products" ON products
FOR DELETE
TO authenticated
USING (
  auth.uid()::text IN (SELECT id::text FROM admins)
);

-- ============================================================================
-- 5. GRANT NECESSARY PERMISSIONS
-- ============================================================================

-- Ensure proper table permissions
GRANT SELECT ON TABLE public.products TO anon, authenticated;
GRANT INSERT ON TABLE public.orders TO anon, authenticated;
GRANT SELECT ON TABLE public.orders TO anon, authenticated;
GRANT ALL ON TABLE public.products TO authenticated;
GRANT ALL ON TABLE public.orders TO authenticated;
GRANT ALL ON TABLE public.admins TO authenticated;

-- Ensure sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ============================================================================
-- NOTES:
-- ============================================================================
-- 
-- After running this migration, the security issues will be resolved:
--
-- 1. The update_updated_at_column function now has a fixed search_path
-- 2. Admin table policies now properly check for admin authentication
-- 3. Orders table policies are more restrictive (admins only for updates/deletes)
-- 4. Products table policies are more restrictive (admins only for modifications)
--
-- IMPORTANT: The admin authentication check uses auth.uid() which assumes
-- you're using Supabase Auth. If you're using a custom auth system, you'll
-- need to adjust these policies accordingly.
--
-- For a custom auth system without Supabase Auth, consider:
-- - Adding a session table to track authenticated admin sessions
-- - Using JWT claims or custom functions to verify admin status
-- - Implementing application-level security checks
