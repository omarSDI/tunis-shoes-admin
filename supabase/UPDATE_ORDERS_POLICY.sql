-- Quick Update: Fix the remaining "Public creates orders" linter warning
-- Run this if you already ran the previous QUICK_FIX_SECURITY.sql

-- Drop the old policy
DROP POLICY IF EXISTS "Public creates orders" ON orders;

-- Create the updated policy with validation
CREATE POLICY "Public creates orders" ON orders
FOR INSERT TO anon, authenticated
WITH CHECK (total_price > 0);

-- Done! This should resolve the final linter warning.
