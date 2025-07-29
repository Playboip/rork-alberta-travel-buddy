# 🚨 URGENT: Database Setup Required

Your authentication system is failing because the database tables haven't been created yet. Follow these steps **exactly** to fix the login/registration issues.

## Step 1: Access Supabase Dashboard

1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your **Alberta Travel Buddy** project

## Step 2: Run the Database Schema

1. Click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy the **entire contents** from `supabase/schema.sql` (342 lines)
4. Paste it into the SQL Editor
5. Click **Run** (the blue button)
6. Wait for it to complete - you should see "Success. No rows returned" messages

## Step 3: Verify Setup

1. Still in SQL Editor, create another **New Query**
2. Copy the contents from `supabase/setup-verification.sql`
3. Paste and click **Run**
4. You should see:
   - ✅ 7 tables listed (profiles, travel_plans, etc.)
   - ✅ 4 functions listed (create_user_profile, etc.)
   - ✅ 3 RLS policies for profiles
   - ✅ "Database connection successful" message

## Step 4: Check Tables Were Created

1. Go to **Table Editor** in the left sidebar
2. You should see these tables:
   - `profiles` ✅
   - `travel_plans` ✅
   - `usage_tracking` ✅
   - `reviews` ✅
   - `visited_places` ✅
   - `review_likes` ✅
   - `bookings` ✅

## Step 5: Test Authentication

1. Go back to your app
2. Try registering a new user
3. Check your email for confirmation
4. Click the confirmation link
5. Try logging in

## Common Issues & Solutions

### Issue: "Function not found" errors
**Solution:** The schema script didn't run completely. Re-run the entire `supabase/schema.sql` script.

### Issue: "Row-level security policy" errors
**Solution:** This is normal during registration. The RLS policies are working correctly.

### Issue: "Email not confirmed" 
**Solution:** 
1. Check spam folder for confirmation email
2. Or manually confirm in Supabase Dashboard:
   - Go to **Authentication** → **Users**
   - Find the user and click **Confirm User**

### Issue: No tables visible
**Solution:** 
1. Make sure you're in the correct Supabase project
2. Re-run the schema script completely
3. Check for any error messages in the SQL Editor

## Environment Variables

Make sure your `.env` file has the correct Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key
```

Get these from **Settings** → **API** in your Supabase dashboard.

## What This Fixes

After completing these steps, your app will:
- ✅ Allow user registration
- ✅ Send confirmation emails
- ✅ Allow user login after email confirmation
- ✅ Create user profiles automatically
- ✅ Protect user data with RLS policies
- ✅ Support all subscription tiers (free, explorer, adventurer)

## Next Steps

Once authentication is working:
1. Test the complete user flow (register → confirm → login)
2. Test subscription upgrades
3. Test all app features with a logged-in user

---

**⚠️ IMPORTANT:** You must complete Step 2 (running the schema script) for authentication to work. The app cannot function without the database tables and functions.