# Security Issues Fix Guide

## Issues Detected

Your Supabase database linter detected the following security issues:

### 1. Function Search Path Mutable (WARN)
- **Function**: `public.update_updated_at_column`
- **Issue**: The function doesn't have a fixed `search_path`, making it vulnerable to search path manipulation attacks
- **Risk**: Medium - Could allow privilege escalation

### 2. RLS Policy Always True (WARN) - Multiple instances
- **Tables affected**: `admins`, `orders`, `products`
- **Issue**: Policies using `USING (true)` or `WITH CHECK (true)` for INSERT/UPDATE/DELETE operations
- **Risk**: High - Effectively bypasses row-level security

## Which Migration to Use?

I've created two migration files. Choose based on your authentication setup:

### Option 1: `002_fix_security_issues.sql`
**Use this if**: You plan to use Supabase Auth (auth.users table)

**Pros**:
- Leverages Supabase's built-in authentication
- Simpler to implement
- Better integration with Supabase ecosystem

**Cons**:
- Requires migrating from custom auth to Supabase Auth
- More work to implement initially

### Option 2: `002_fix_security_issues_custom_auth.sql` ⭐ RECOMMENDED
**Use this if**: You're using custom authentication (like your current setup)

**Pros**:
- Works with your existing custom admin login
- No need to migrate to Supabase Auth
- Uses service_role for admin operations (more secure)

**Cons**:
- Requires updating your API routes to use service_role client
- Need to implement session management

## How to Apply the Migration

### Step 1: Choose Your Migration
Based on the above, I recommend **Option 2** since you're using custom authentication.

### Step 2: Run the Migration in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `002_fix_security_issues_custom_auth.sql`
4. Paste and run it

### Step 3: Update Your Application Code

After running the migration, you need to update your admin API routes to properly authenticate:

#### Create a Service Role Client

Create a new file: `lib/supabase-service.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

// This client has elevated privileges - NEVER expose to client-side
export const supabaseServiceRole = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Add this to your .env.local
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
```

#### Update Your .env.local

Add your service role key (find it in Supabase Dashboard → Settings → API):

```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

⚠️ **IMPORTANT**: Never commit this key to git! It's already in your `.gitignore`.

#### Update Admin API Routes

For any admin operations (create/update/delete products, update orders), use the service role client:

**Before:**
```typescript
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  // ... admin operation
}
```

**After:**
```typescript
import { supabaseServiceRole } from '@/lib/supabase-service';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  // Verify admin session
  const sessionToken = cookies().get('admin_session')?.value;
  
  if (!sessionToken) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Validate session
  const { data: session } = await supabaseServiceRole
    .from('admin_sessions')
    .select('*')
    .eq('session_token', sessionToken)
    .gt('expires_at', new Date().toISOString())
    .single();
  
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Proceed with admin operation using service role
  const { data, error } = await supabaseServiceRole
    .from('products')
    .insert({ ... });
  
  // ...
}
```

#### Update Admin Login to Create Sessions

Update your admin login API to create sessions:

```typescript
import { supabaseServiceRole } from '@/lib/supabase-service';
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  
  // Verify admin credentials
  const { data: admin } = await supabaseServiceRole
    .from('admins')
    .select('*')
    .eq('username', username)
    .eq('password_hash', password) // In production, use proper hashing!
    .single();
  
  if (!admin) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  
  // Create session
  const sessionToken = randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour session
  
  await supabaseServiceRole
    .from('admin_sessions')
    .insert({
      admin_id: admin.id,
      session_token: sessionToken,
      expires_at: expiresAt.toISOString()
    });
  
  // Set cookie
  cookies().set('admin_session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt
  });
  
  return Response.json({ success: true });
}
```

## Verification

After applying the migration and updating your code:

1. Test admin login - should work as before
2. Test creating/updating products as admin - should work
3. Test creating orders from the public shop - should work
4. Try accessing admin endpoints without being logged in - should fail
5. Run the Supabase linter again - all warnings should be resolved

## Security Improvements

After this migration:

✅ Function has fixed search_path (prevents search path attacks)  
✅ Admins table is protected (no public access)  
✅ Products can only be modified by authenticated admins  
✅ Orders can only be updated by authenticated admins  
✅ Public users can still view products and create orders  
✅ All admin operations are tracked via sessions  

## Need Help?

If you encounter any issues:
1. Check the Supabase logs in the Dashboard
2. Verify your service role key is correct
3. Ensure cookies are being set properly
4. Check that admin_sessions table was created successfully
