-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table (with IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  emergency_contact TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'pro')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing')),
  subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Create policy for profiles - users can only see and edit their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- More permissive insert policy for registration
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);

-- Create travel_plans table for storing AI-generated plans (with IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS public.travel_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  destination TEXT NOT NULL,
  duration TEXT NOT NULL,
  budget TEXT,
  travelers TEXT,
  interests TEXT[],
  plan_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on travel_plans table
ALTER TABLE public.travel_plans ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own travel plans" ON public.travel_plans;
DROP POLICY IF EXISTS "Users can insert own travel plans" ON public.travel_plans;
DROP POLICY IF EXISTS "Users can update own travel plans" ON public.travel_plans;
DROP POLICY IF EXISTS "Users can delete own travel plans" ON public.travel_plans;

-- Create policies for travel_plans
CREATE POLICY "Users can view own travel plans" ON public.travel_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own travel plans" ON public.travel_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own travel plans" ON public.travel_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own travel plans" ON public.travel_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Create usage_tracking table for subscription limits (with IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS public.usage_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  feature_type TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  month_year TEXT NOT NULL, -- Format: YYYY-MM
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, feature_type, month_year)
);

-- Enable RLS on usage_tracking table
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own usage" ON public.usage_tracking;
DROP POLICY IF EXISTS "Users can insert own usage" ON public.usage_tracking;
DROP POLICY IF EXISTS "Users can update own usage" ON public.usage_tracking;

-- Create policies for usage_tracking
CREATE POLICY "Users can view own usage" ON public.usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage" ON public.usage_tracking
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage" ON public.usage_tracking
  FOR UPDATE USING (auth.uid() = user_id);

-- Create reviews table for community features (with IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  destination_name TEXT NOT NULL,
  location TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT NOT NULL,
  images TEXT[],
  visited_date DATE NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on reviews table
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Create visited_places table (with IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS public.visited_places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  visited_date DATE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  notes TEXT,
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on visited_places table
ALTER TABLE public.visited_places ENABLE ROW LEVEL SECURITY;

-- Create policies for visited_places
CREATE POLICY "Users can view own visited places" ON public.visited_places
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own visited places" ON public.visited_places
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own visited places" ON public.visited_places
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own visited places" ON public.visited_places
  FOR DELETE USING (auth.uid() = user_id);

-- Create review_likes table for tracking likes (with IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS public.review_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  review_id UUID REFERENCES public.reviews ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, review_id)
);

-- Enable RLS on review_likes table
ALTER TABLE public.review_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for review_likes
CREATE POLICY "Users can view own likes" ON public.review_likes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own likes" ON public.review_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes" ON public.review_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Create bookings table for trip bookings (with IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  trip_plan_id UUID REFERENCES public.travel_plans ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('hotel', 'flight', 'activity', 'car_rental', 'restaurant')),
  item_id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  item_description TEXT NOT NULL,
  location TEXT NOT NULL,
  check_in_date DATE,
  check_out_date DATE,
  booking_date DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'CAD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  confirmation_number TEXT,
  provider TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on bookings table
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for bookings
CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookings" ON public.bookings
  FOR DELETE USING (auth.uid() = user_id);

-- Function to get or create usage tracking record
CREATE OR REPLACE FUNCTION get_or_create_usage(
  p_user_id UUID,
  p_feature_type TEXT,
  p_month_year TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM')
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_usage INTEGER;
BEGIN
  -- Try to get existing usage
  SELECT usage_count INTO current_usage
  FROM public.usage_tracking
  WHERE user_id = p_user_id 
    AND feature_type = p_feature_type 
    AND month_year = p_month_year;
  
  -- If no record exists, create one
  IF current_usage IS NULL THEN
    INSERT INTO public.usage_tracking (user_id, feature_type, month_year, usage_count)
    VALUES (p_user_id, p_feature_type, p_month_year, 0)
    ON CONFLICT (user_id, feature_type, month_year) DO NOTHING;
    current_usage := 0;
  END IF;
  
  RETURN current_usage;
END;
$$;

-- Function to increment usage
CREATE OR REPLACE FUNCTION increment_usage(
  p_user_id UUID,
  p_feature_type TEXT,
  p_month_year TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM')
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_usage INTEGER;
BEGIN
  -- Ensure record exists
  PERFORM get_or_create_usage(p_user_id, p_feature_type, p_month_year);
  
  -- Increment usage
  UPDATE public.usage_tracking
  SET usage_count = usage_count + 1,
      updated_at = NOW()
  WHERE user_id = p_user_id 
    AND feature_type = p_feature_type 
    AND month_year = p_month_year
  RETURNING usage_count INTO new_usage;
  
  RETURN new_usage;
END;
$$;

-- Function to create user profile (with elevated privileges and upsert logic)
CREATE OR REPLACE FUNCTION create_user_profile(
  p_user_id UUID,
  p_email TEXT,
  p_name TEXT,
  p_location TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Use INSERT ... ON CONFLICT to handle existing profiles
  INSERT INTO public.profiles (id, email, name, location, subscription_tier, subscription_status, created_at)
  VALUES (p_user_id, p_email, p_name, p_location, 'free', 'active', NOW())
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    location = EXCLUDED.location;
END;
$$;