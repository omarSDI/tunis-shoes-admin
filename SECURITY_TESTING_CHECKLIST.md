# Security Fix Testing Checklist

After applying the security fixes, use this checklist to verify everything works correctly.

## ✅ Pre-Migration Checklist

- [ ] Backup your database (Supabase Dashboard → Database → Backups)
- [ ] Note current admin credentials
- [ ] Document any custom policies you've added
- [ ] Save a copy of current RLS policies (Database → Policies)

## ✅ Migration Steps

- [ ] Open Supabase Dashboard → SQL Editor
- [ ] Copy contents of `supabase/QUICK_FIX_SECURITY.sql`
- [ ] Paste into SQL Editor
- [ ] Run the migration
- [ ] Check for any errors in the output
- [ ] Verify "Success" message

## ✅ Immediate Verification

### 1. Check Policies Were Created
- [ ] Go to Database → Policies
- [ ] Verify `admins` table has "Service role manages admins" policy
- [ ] Verify `orders` table has "Public creates orders" and "Service role manages orders" policies
- [ ] Verify `products` table has "Public views products" and "Service role manages products" policies

### 2. Check Function Was Updated
- [ ] Go to Database → Functions
- [ ] Find `update_updated_at_column`
- [ ] Verify it shows `search_path = public` in the definition

### 3. Run Linter Again
- [ ] Go to Database → Database Linter (or wherever you ran it)
- [ ] Run the linter
- [ ] Verify all 5 warnings are resolved:
  - [ ] `function_search_path_mutable` - RESOLVED
  - [ ] `rls_policy_always_true` (admins) - RESOLVED
  - [ ] `rls_policy_always_true` (orders - Admin full access) - RESOLVED
  - [ ] `rls_policy_always_true` (orders - Allow public insert) - RESOLVED
  - [ ] `rls_policy_always_true` (products) - RESOLVED

## ✅ Functional Testing

### Public Shop (Should Still Work)
- [ ] Visit your shop page
- [ ] Products are visible
- [ ] Can view product details
- [ ] Can add products to cart
- [ ] Can complete checkout (create order)
- [ ] Order is created successfully

### Admin Panel (May Need Updates)
⚠️ **Note**: Admin operations may require code updates to use service_role

#### If You Haven't Updated Code Yet:
- [ ] Admin login still works
- [ ] Can view dashboard
- [ ] Can view products list
- [ ] Can view orders list
- [ ] **EXPECTED**: Cannot create/update/delete products (will fail - this is correct!)
- [ ] **EXPECTED**: Cannot update orders (will fail - this is correct!)

#### If You've Updated Code (Using Service Role):
- [ ] Admin login works
- [ ] Can view dashboard
- [ ] Can view products list
- [ ] Can create new products
- [ ] Can update existing products
- [ ] Can delete products
- [ ] Can view orders list
- [ ] Can update order status
- [ ] Can delete orders

## ✅ Security Testing

### Test Unauthorized Access
Try these in Supabase SQL Editor or via API:

#### 1. Try to Read Admins Table (Should Fail for anon/authenticated)
```sql
-- Run this as anon role (should return no rows or error)
SELECT * FROM admins;
```
- [ ] Returns no rows or access denied

#### 2. Try to Update Product as Anon (Should Fail)
```sql
-- Should fail
UPDATE products SET price = 0 WHERE id = 'some-id';
```
- [ ] Update fails with permission error

#### 3. Try to Delete Order as Anon (Should Fail)
```sql
-- Should fail
DELETE FROM orders WHERE id = 'some-id';
```
- [ ] Delete fails with permission error

### Test Authorized Access (Service Role)
In your API routes with service_role client:

- [ ] Can create products
- [ ] Can update products
- [ ] Can delete products
- [ ] Can update orders
- [ ] Can delete orders
- [ ] Can manage admins

## ✅ Code Update Checklist (If Implementing Full Solution)

### Environment Setup
- [ ] Added `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`
- [ ] Verified `.env.local` is in `.gitignore`
- [ ] Restarted dev server after adding env variable

### Service Role Client
- [ ] Created `lib/supabase-service.ts`
- [ ] Imported and configured service role client
- [ ] Tested connection

### Admin API Routes
Update each admin API route:

- [ ] `app/api/admin/products/route.ts` (POST - create product)
- [ ] `app/api/admin/products/[id]/route.ts` (PUT - update product)
- [ ] `app/api/admin/products/[id]/route.ts` (DELETE - delete product)
- [ ] `app/api/admin/orders/[id]/route.ts` (PUT - update order)
- [ ] Any other admin endpoints

For each route:
- [ ] Added session validation
- [ ] Using `supabaseServiceRole` instead of regular client
- [ ] Returns 401 for invalid sessions
- [ ] Tested functionality

### Admin Login
- [ ] Updated login API to create sessions
- [ ] Session token stored in httpOnly cookie
- [ ] Session expiration set (24 hours recommended)
- [ ] Tested login flow
- [ ] Tested logout (clear session)

## ✅ Performance Verification

- [ ] Page load times are similar to before
- [ ] No new errors in browser console
- [ ] No new errors in server logs
- [ ] Database queries are performing well

## ✅ Final Checks

- [ ] All linter warnings resolved
- [ ] Public shop fully functional
- [ ] Admin panel fully functional (with code updates)
- [ ] No unauthorized access possible
- [ ] Session management working (if implemented)
- [ ] All tests passing
- [ ] Documentation updated

## 🐛 Troubleshooting

### Issue: "permission denied for table products"
**Solution**: Verify you're using `supabaseServiceRole` in admin API routes

### Issue: "Admin login works but can't create products"
**Solution**: 
1. Check if you've updated API routes to use service_role
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
3. Check session validation is working

### Issue: "Public shop can't create orders"
**Solution**: 
1. Verify "Public creates orders" policy exists
2. Check that anon role has INSERT permission
3. Review Supabase logs for specific error

### Issue: "Linter still shows warnings"
**Solution**:
1. Verify migration ran successfully
2. Check for duplicate policies with old names
3. Try dropping old policies manually
4. Refresh linter cache

## 📝 Notes

- Keep this checklist for future reference
- Document any custom changes you make
- Update this checklist if you add new features
- Share with your team if applicable

---

**Once all items are checked, your security fixes are complete! 🎉**
