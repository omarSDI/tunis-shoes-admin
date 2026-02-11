-- EMERGENCY FIX: Restore Product Visibility Immediately
-- Run this ONLY if your products are not showing on the website
-- This will allow public access to view products right away

-- Enable RLS if not already enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop any existing conflicting policies
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Public views products" ON products;
DROP POLICY IF EXISTS "Admin full access on products" ON products;

-- Create policy to allow everyone to view products
CREATE POLICY "Public views products" ON products
FOR SELECT 
TO anon, authenticated
USING (true);

-- Grant SELECT permission to anon and authenticated roles
GRANT SELECT ON TABLE public.products TO anon, authenticated;

-- Verify it worked - this should return your products
SELECT id, title, price FROM products LIMIT 5;

-- ============================================================================
-- After running this, your products should be visible immediately!
-- Then run the full QUICK_FIX_SECURITY.sql to fix all other issues.
-- ============================================================================
