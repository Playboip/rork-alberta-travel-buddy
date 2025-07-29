-- Supabase Setup Verification Script
-- Run this in your Supabase SQL Editor to verify everything is working

-- 1. Check if tables exist
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'travel_plans', 'usage_tracking', 'reviews', 'visited_places', 'review_likes', 'bookings')
ORDER BY table_name;

-- 2. Check if functions exist
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('create_user_profile', 'get_or_create_usage', 'increment_usage', 'handle_new_user')
ORDER BY routine_name;

-- 3. Check RLS policies for profiles table
SELECT 
  policyname,
  permissive,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- 4. Test database connection (should return 1 row)
SELECT 'Database connection successful' as status, NOW() as timestamp;

-- 5. Check if profiles table structure is correct
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;