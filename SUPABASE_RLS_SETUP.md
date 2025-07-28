# Supabase RLS Configuration Guide

## Step-by-Step Setup Instructions

### 1. Access Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project: **Alberta Travel Buddy**

### 2. Navigate to SQL Editor
1. In the left sidebar, click **SQL Editor**
2. Click **New Query** to create a new SQL script

### 3. Execute the Schema Script
1. Copy the entire contents from `supabase/schema.sql`
2. Paste it into the SQL Editor
3. Click **Run** to execute the script
4. ✅ You should see "Success. No rows returned" for each statement

### 4. Verify Tables Were Created
1. Go to **Table Editor** in the left sidebar
2. You should see these tables:
   - `profiles`
   - `travel_plans`
   - `usage_tracking`
   - `reviews`
   - `visited_places`
   - `review_likes`
   - `bookings`

### 5. Check RLS Policies
1. In **Table Editor**, click on the `profiles` table
2. Go to the **Policies** tab
3. You should see these policies:
   - ✅ "Users can view own profile"
   - ✅ "Users can update own profile"
   - ✅ "Users can insert own profile"

### 6. Verify Functions
1. Go to **Database** → **Functions** in the sidebar
2. You should see:
   - ✅ `create_user_profile`
   - ✅ `get_or_create_usage`
   - ✅ `increment_usage`

### 7. Test Authentication Settings
1. Go to **Authentication** → **Settings**
2. Under **User Signups**, ensure:
   - ✅ "Enable email confirmations" is **ON**
   - ✅ "Enable custom SMTP" (if you want custom emails)

### 8. Configure Email Templates (Optional)
1. Go to **Authentication** → **Email Templates**
2. Customize the confirmation email template:
   ```html
   <h2>Welcome to Alberta Travel Buddy!</h2>
   <p>Click the link below to confirm your email address:</p>
   <p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
   ```

## Environment Variables Setup

### 1. Get Your Supabase Credentials
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)

### 2. Update Your .env File
```env
EXPO_PUBLIC_SUPABASE_URL=your_project_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Update app.config.js
Ensure your `app.config.js` includes:
```javascript
export default {
  expo: {
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
};
```

## Testing the Setup

### 1. Use the Test Component
1. Navigate to the **Test** tab in your app
2. Run the "Complete User Flow Test"
3. Check for these results:
   - ✅ Database connection successful
   - ✅ RLS policies are active
   - ✅ Function exists

### 2. Test Registration Flow
1. Try registering a new user
2. Check your email for confirmation
3. Click the confirmation link
4. Try logging in

### 3. Common Issues & Solutions

#### Issue: "new row violates row-level security policy"
**Solution:** The RLS policies are working correctly, but there might be an authentication issue.

**Fix:**
1. Check that the user is properly authenticated before profile creation
2. Verify the `create_user_profile` function has `SECURITY DEFINER`
3. Ensure the function is being called with the correct user ID

#### Issue: "Email not confirmed"
**Solution:** User needs to confirm their email before logging in.

**Fix:**
1. Check spam folder for confirmation email
2. Use the "Resend Confirmation" button in the app
3. Or manually confirm in Supabase Dashboard:
   - Go to **Authentication** → **Users**
   - Find the user and click **Confirm User**

#### Issue: Database connection failed
**Solution:** Check environment variables and network connection.

**Fix:**
1. Verify `.env` file has correct values
2. Restart the development server
3. Check Supabase project status

## Security Best Practices

### 1. RLS Policies Explained
- **SELECT policies**: Control who can read data
- **INSERT policies**: Control who can create new records
- **UPDATE policies**: Control who can modify existing records
- **DELETE policies**: Control who can remove records

### 2. Our Current Policies
```sql
-- Users can only see their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can create their own profile (with function)
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);
```

### 3. Function Security
- Functions use `SECURITY DEFINER` to run with elevated privileges
- This allows profile creation even when RLS would normally block it
- The function validates the user ID matches the authenticated user

## Monitoring & Maintenance

### 1. Check User Activity
1. Go to **Authentication** → **Users**
2. Monitor user registrations and confirmations
3. Check for any failed authentication attempts

### 2. Database Performance
1. Go to **Reports** to monitor database performance
2. Check for slow queries or high resource usage
3. Monitor storage usage

### 3. Error Monitoring
1. Check the **Logs** section for any errors
2. Monitor authentication failures
3. Watch for RLS policy violations (these are normal and expected)

## Troubleshooting Commands

### Reset RLS Policies (if needed)
```sql
-- Drop all policies for profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Recreate policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);
```

### Check Current Policies
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'profiles';
```

### Manually Confirm User Email
```sql
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'user@example.com';
```

## Success Indicators

When everything is working correctly, you should see:

1. ✅ Users can register successfully
2. ✅ Email confirmation emails are sent
3. ✅ Users can log in after email confirmation
4. ✅ User profiles are created automatically
5. ✅ RLS policies prevent unauthorized access
6. ✅ All database functions work properly

## Next Steps

After RLS is configured:

1. **Add Stripe Payment Links** - Configure subscription payments
2. **Add App Logo** - Upload your custom logo
3. **Test Complete User Flow** - Registration → Confirmation → Login → Features
4. **Deploy to Production** - When ready for customers

## Support

If you encounter issues:

1. Check the app's **Test** tab for diagnostic information
2. Review Supabase logs in the dashboard
3. Verify all environment variables are correct
4. Ensure the schema script ran without errors

The RLS setup is critical for security - it ensures users can only access their own data while allowing the app to function properly.