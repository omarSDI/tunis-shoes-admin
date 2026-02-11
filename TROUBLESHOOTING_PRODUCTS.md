# Quick Fix Guide - Products Not Showing

## 🚨 Problem
Your website shows "No items found" - products aren't loading from the database.

## 🔍 Diagnosis Steps

### Step 1: Check Current Policies
1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to **SQL Editor**
3. Copy and paste the contents of `supabase/CHECK_CURRENT_POLICIES.sql`
4. Click **Run**
5. Review the results

### Step 2: Interpret Results

#### Scenario A: No Policies on Products Table
**Symptoms**: The "Products Policies" section returns 0 rows

**Solution**: Run `EMERGENCY_FIX_PRODUCTS.sql` immediately

#### Scenario B: Wrong/Conflicting Policies
**Symptoms**: You see policies but they don't match the expected ones

**Solution**: Run `QUICK_FIX_SECURITY.sql` (the full fix)

#### Scenario C: No Products in Database
**Symptoms**: "Total Products" shows 0

**Solution**: You need to add products to your database first

---

## ⚡ Quick Fix (Choose One)

### Option 1: Emergency Fix (Fastest - 30 seconds)
**Use this if**: Products aren't showing and you need them visible NOW

```sql
-- Copy and run this in Supabase SQL Editor:
```

Then copy the contents of `supabase/EMERGENCY_FIX_PRODUCTS.sql` and run it.

**Result**: Products will be visible immediately ✅

---

### Option 2: Complete Fix (Recommended - 2 minutes)
**Use this if**: You want to fix ALL security issues at once

```sql
-- Copy and run this in Supabase SQL Editor:
```

Then copy the contents of `supabase/QUICK_FIX_SECURITY.sql` and run it.

**Result**: All 5 security warnings resolved + products visible ✅

---

## 🧪 Verify the Fix

### Test 1: Check in Supabase
```sql
-- Run this in SQL Editor:
SELECT id, title, price FROM products LIMIT 5;
```
**Expected**: Should return your products

### Test 2: Check Policies
1. Go to **Database → Policies**
2. Click on **products** table
3. You should see: "Public views products" policy

### Test 3: Check Your Website
1. Visit your deployed site
2. Go to the shop page
3. Products should now be visible ✅

---

## 📋 Complete Checklist

- [ ] Run `CHECK_CURRENT_POLICIES.sql` to diagnose
- [ ] Run either `EMERGENCY_FIX_PRODUCTS.sql` OR `QUICK_FIX_SECURITY.sql`
- [ ] Verify products show in SQL query
- [ ] Check policies in Database → Policies
- [ ] Refresh your website
- [ ] Confirm products are visible
- [ ] (Optional) Run database linter to verify all warnings are gone

---

## 🆘 Still Not Working?

### Check 1: Do you have products in the database?
```sql
SELECT COUNT(*) FROM products;
```
If this returns 0, you need to add products first.

### Check 2: Are your environment variables correct?
- Verify `NEXT_PUBLIC_SUPABASE_URL` in Vercel
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel

### Check 3: Check browser console
1. Open your website
2. Press F12
3. Look for errors in the Console tab
4. Share any errors you see

---

## 📞 Next Steps

1. **Run the diagnostic** (`CHECK_CURRENT_POLICIES.sql`)
2. **Apply the fix** (Emergency or Complete)
3. **Verify** products are showing
4. **Report back** with the results

---

**Files Created:**
- ✅ `CHECK_CURRENT_POLICIES.sql` - Diagnostic script
- ✅ `EMERGENCY_FIX_PRODUCTS.sql` - Quick fix for products
- ✅ `QUICK_FIX_SECURITY.sql` - Complete security fix (already exists)

**Start with the diagnostic, then choose your fix!** 🚀
