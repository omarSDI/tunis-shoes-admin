-- FIX: Allow Adding Products from Supabase Dashboard
-- This adds a policy so you can insert/update products directly in the Table Editor

-- ============================================================================
-- OPTION 1: Temporarily Disable RLS (Quick but less secure)
-- ============================================================================
-- Uncomment this if you want to quickly add products, then re-enable RLS after
-- ALTER TABLE products DISABLE ROW LEVEL SECURITY;
-- 
-- After adding products, re-enable with:
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- OPTION 2: Add Policy for Authenticated Users (Recommended)
-- ============================================================================
-- This allows authenticated users (like you in the dashboard) to manage products

-- Drop existing policies
DROP POLICY IF EXISTS "Public views products" ON products;
DROP POLICY IF EXISTS "Service role manages products" ON products;
DROP POLICY IF EXISTS "Authenticated users can manage products" ON products;

-- Allow everyone to view products (for the shop)
CREATE POLICY "Public views products" ON products
FOR SELECT 
TO anon, authenticated
USING (true);

-- Allow authenticated users to insert/update/delete products (for dashboard)
CREATE POLICY "Authenticated users can manage products" ON products
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Also allow service_role (for admin API operations)
CREATE POLICY "Service role manages products" ON products
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON TABLE public.products TO authenticated;
GRANT SELECT ON TABLE public.products TO anon;

-- ============================================================================
-- Verify the policies
-- ============================================================================
SELECT 
    policyname as "Policy Name",
    roles as "Roles",
    cmd as "Command"
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY policyname;

-- ============================================================================
-- DONE! You should now be able to:
-- 1. Add products from Supabase Table Editor ✅
-- 2. View products on your website ✅
-- 3. Manage products from admin panel (when using service_role) ✅
-- ============================================================================

-- Now you can add products! Try running ADD_SAMPLE_PRODUCTS.sql or use Table Editor
