import { createClient } from '@supabase/supabase-js';

import { ADMIN_COOKIE_NAME } from '@/lib/constants';

// Initialize a direct Supabase client for auth checks (bypassing Next.js cache issues for auth)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function validateAdminCredentials(username: string, password: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('password_hash')
      .eq('username', username)
      .single();

    if (error || !data) {
      console.error('Admin user not found or database error:', error?.message);
      return false;
    }

    // Direct string comparison for now as per the current seed implementation.
    // IMPROVEMENT: Once a registration flow or admin management tool is added, 
    // we should use a library like 'bcryptjs' to hash and compare.
    return password === data.password_hash;
  } catch (e) {
    console.error('System authentication error:', e);
    return false;
  }
}

import { isValidAdminToken } from '@/lib/constants';

/**
 * Server-side session verification helper for Server Actions.
 * Returns the username if valid, otherwise null.
 */
export async function verifyAdminSession(): Promise<string | null> {
  try {
    const { cookies } = await import('next/headers');
    const jar = await cookies();
    const token = jar.get(ADMIN_COOKIE_NAME)?.value;

    if (isValidAdminToken(token)) {
      const decoded = Buffer.from(token!, 'base64').toString('utf-8');
      return decoded.split(':')[0]; // Return the username
    }
  } catch (error) {
    console.error('Session verification error:', error);
  }
  return null;
}


