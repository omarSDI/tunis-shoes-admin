-- SQL Snippet to ensure UPDATE permissions on orders table for anon and authenticated roles
-- Run this in your Supabase SQL Editor

-- 1. Enable RLS (if not already enabled)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 2. Grant permissions to roles
GRANT ALL ON TABLE public.orders TO postgres, anon, authenticated, service_role;

-- 3. Create/Update Policies
-- Note: Adjust these policies based on your specific security requirements.
-- This allows anyone (anon/auth) to see and update orders for demo purposes.

DROP POLICY IF EXISTS "Public update access" ON public.orders;
CREATE POLICY "Public update access" ON public.orders
FOR UPDATE
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Public read access" ON public.orders;
CREATE POLICY "Public read access" ON public.orders
FOR SELECT
USING (true);

-- 4. Add payment_status column (unpaid by default)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'unpaid';

-- Ensure sequences are accessible if updates involve inserts elsewhere
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
