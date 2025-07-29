# Database Trigger Setup Guide

## Overview
Your database schema is already complete and includes an automatic trigger that creates user profiles when new users sign up. This guide will help you verify everything is working correctly.

## What the Trigger Does
The `on_auth_user_created` trigger automatically:
1. Creates a profile record in `public.profiles` table when a new user signs up
2. Uses the user's email and metadata (name, location) from the signup process
3. Sets default subscription tier to 'free' and status to 'active'
4. Handles conflicts gracefully (won't create duplicates)

## Verification Steps

### 1. Run the Verification Script
Copy and paste the contents of `supabase/setup-verification.sql` into your Supabase SQL Editor and run it. This will check:
- All required tables exist
- RLS is enabled
- Functions are created
- **The trigger is active** (most important)
- Table structure is correct
- Subscription constraints allow 'explorer' and 'adventurer'

### 2. Expected Results
You should see:
- ✅ 7 tables with RLS ENABLED
- ✅ 4 functions created
- ✅ 1 trigger `on_auth_user_created` on `auth.users`
- ✅ Profiles table with all required columns
- ✅ Subscription constraint allowing all 5 tiers

### 3. Test User Registration
After verification, test the complete flow:
1. Register a new user through your app
2. Check if a profile was automatically created in the `profiles` table
3. Verify the profile has correct default values

## Manual Configuration in Supabase Dashboard

Since you mentioned needing to configure some settings manually, here's what to do:

### Authentication Settings
Go to **Authentication** → **Settings** in your Supabase dashboard:

1. **Sessions** tab:
   - Set session timeout to 45 minutes (2700 seconds)

2. **Attack Protection** tab:
   - Enable "Check for leaked passwords"
   - Enable rate limiting for auth endpoints

3. **Multi-Factor** tab:
   - Enable MFA if desired (optional for now)

4. **Advanced** tab:
   - Configure any IP restrictions if needed
   - Enable security monitoring

### Email Templates (Optional)
Go to **Authentication** → **Emails** to customize:
- Confirmation email template
- Password reset email template
- Magic link email template

## Troubleshooting

### If the trigger isn't working:
1. Check if the trigger exists using the verification script
2. Ensure the `handle_new_user()` function has proper permissions
3. Verify RLS policies allow profile creation

### If profiles aren't being created:
1. Check the auth.users table to see if users are being created
2. Look at the trigger function logs in Supabase
3. Ensure the profiles table structure matches the schema

### Common Issues:
- **RLS blocking inserts**: The schema includes a permissive insert policy
- **Missing columns**: Run the full schema.sql again if columns are missing
- **Constraint violations**: The schema allows all subscription tiers including 'explorer' and 'adventurer'

## Next Steps
1. Run the verification script
2. Test user registration
3. Configure the manual settings in the dashboard
4. Your app should now handle user registration automatically!

The trigger will handle profile creation automatically, so you don't need to manually call `create_user_profile()` in your app code anymore.