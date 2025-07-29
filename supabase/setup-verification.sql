-- Supabase Setup Verification Script
-- Run this in your Supabase SQL Editor to verify everything is working

-- 1. Check if all required tables exist
SELECT 
  '1. Tables Check' as check_type,
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'travel_plans', 'usage_tracking', 'reviews', 'visited_places', 'review_likes', 'bookings')
ORDER BY table_name;

-- 2. Check if RLS is enabled on all tables
SELECT 
  '2. RLS Check' as check_type,
  tablename,
  CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as rls_status
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'travel_plans', 'usage_tracking', 'reviews', 'visited_places', 'review_likes', 'bookings')
ORDER BY tablename;

-- 3. Check if required functions exist
SELECT 
  '3. Functions Check' as check_type,
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('create_user_profile', 'get_or_create_usage', 'increment_usage', 'handle_new_user')
ORDER BY routine_name;

-- 4. Check if the auth trigger exists (CRITICAL)
SELECT 
  '4. Trigger Check' as check_type,
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created'
  AND event_object_schema = 'auth'
  AND event_object_table = 'users';

-- 5. Check profiles table structure
SELECT 
  '5. Profiles Table Structure' as check_type,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 6. Check subscription tier constraints (should allow explorer/adventurer)
SELECT 
  '6. Subscription Constraints' as check_type,
  constraint_name,
  check_clause
FROM information_schema.check_constraints 
WHERE constraint_schema = 'public'
  AND constraint_name LIKE '%subscription_tier%';

-- 7. Check RLS policies for profiles table
SELECT 
  '7. Profiles Policies' as check_type,
  policyname,
  permissive,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- 8. Test database connection
SELECT '8. Connection Test' as check_type, 'Database connection successful' as status, NOW() as timestamp;

-- EXPECTED RESULTS:
-- 1. Should show 7 tables (profiles, travel_plans, usage_tracking, reviews, visited_places, review_likes, bookings)
-- 2. All tables should have RLS ENABLED
-- 3. Should show 4 functions (create_user_profile, get_or_create_usage, increment_usage, handle_new_user)
-- 4. Should show 1 trigger (on_auth_user_created) on auth.users table
-- 5. Profiles table should have columns: id, email, name, location, emergency_contact, subscription_tier, subscription_status, subscription_id, created_at
-- 6. Subscription constraint should allow: 'free', 'starter', 'pro', 'explorer', 'adventurer'
-- 7. Should show 3 policies for profiles: view own, update own, insert own
-- 8. Should show current timestamp