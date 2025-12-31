# Google Authentication Setup Guide

This guide explains how to set up Google OAuth authentication for the Alberta Travel Buddy app using Supabase.

## Overview

The app now supports two authentication methods:
1. **Email/Password**: Traditional email-based authentication
2. **Google OAuth**: Sign in with Google account

## Prerequisites

- Supabase project created and configured
- Google Cloud Platform account
- App deployed or development environment set up

## Step 1: Configure Google Cloud Console

### 1.1 Create OAuth 2.0 Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Select application type: **Web application**
6. Add authorized redirect URIs:
   ```
   https://[YOUR-SUPABASE-PROJECT-REF].supabase.co/auth/v1/callback
   ```
   Replace `[YOUR-SUPABASE-PROJECT-REF]` with your actual Supabase project reference ID

7. Click **Create**
8. Save the **Client ID** and **Client Secret** (you'll need these for Supabase)

### 1.2 Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Select **External** user type (or Internal if using Google Workspace)
3. Fill in required information:
   - App name: `Alberta Travel Buddy`
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes (recommended):
   - `userinfo.email`
   - `userinfo.profile`
5. Add test users if in testing mode
6. Save and continue

## Step 2: Configure Supabase

### 2.1 Enable Google Provider

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Navigate to **Authentication** > **Providers**
3. Find **Google** in the list and toggle it **ON**
4. Enter the **Client ID** from Step 1.1
5. Enter the **Client Secret** from Step 1.1
6. Click **Save**

### 2.2 Configure Redirect URLs (Optional)

If using custom domains or deep linking:

1. Navigate to **Authentication** > **URL Configuration**
2. Add your site URL: `https://yourdomain.com` (or for development: `http://localhost:19006`)
3. Add redirect URLs:
   - For web: `https://yourdomain.com/auth/callback`
   - For mobile: `myapp://auth/callback`

## Step 3: Update App Configuration

### 3.1 Update app.json

The app is already configured with the scheme `myapp`. This is defined in:

```json
{
  "expo": {
    "scheme": "myapp"
  }
}
```

### 3.2 Verify Dependencies

The required packages are already installed:
- `expo-auth-session`
- `expo-crypto`
- `expo-web-browser`
- `expo-linking`

## Step 4: Test the Authentication

### 4.1 Test on Web

1. Start the development server: `npm start -- --web`
2. Click "Continue with Google" on the login screen
3. Select a Google account
4. Grant permissions
5. You should be redirected back and logged in

### 4.2 Test on iOS/Android

1. Build a development client: `npx expo run:ios` or `npx expo run:android`
2. Click "Continue with Google" on the login screen
3. Complete the OAuth flow
4. Verify successful login

## How It Works

### Authentication Flow

1. User clicks "Continue with Google" button
2. App calls `supabase.auth.signInWithOAuth({ provider: 'google' })`
3. Supabase returns an authorization URL
4. App opens URL in WebBrowser
5. User authenticates with Google
6. Google redirects back to app with tokens
7. App extracts tokens and creates Supabase session
8. User profile is created/updated in database

### Code Implementation

**Auth Context** (`hooks/auth-context.tsx`):
```typescript
const loginWithGoogle = async () => {
  const redirectUrl = makeRedirectUri({
    scheme: 'myapp',
    path: 'auth/callback',
  });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: false,
    },
  });

  if (data.url) {
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
    // Handle result and set session
  }
};
```

**UI Components**:
- `LoginScreen.tsx` - Google Sign In button
- `RegisterScreen.tsx` - Google Sign Up button

Both screens use the same `loginWithGoogle` function since Google OAuth handles both new and existing users.

## Troubleshooting

### Issue: "Redirect URI mismatch" error

**Solution**: Verify that the redirect URI in Google Cloud Console exactly matches the Supabase callback URL:
```
https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
```

### Issue: "OAuth consent screen not configured"

**Solution**: Complete the OAuth consent screen configuration in Google Cloud Console (Step 1.2)

### Issue: "Invalid redirect URI scheme"

**Solution**: Ensure the `scheme` in app.json matches the scheme used in `makeRedirectUri`

### Issue: User profile not created

**Solution**: Check that the `create_user_profile` function or RPC exists in Supabase. The app automatically creates profiles for OAuth users.

### Issue: Google Sign In works on web but not mobile

**Solution**: 
1. Ensure you've built a development client (not Expo Go)
2. Verify the scheme is correctly configured in app.json
3. Check that expo-web-browser is properly installed

## Security Best Practices

1. **Never commit Google OAuth credentials** to version control
2. **Use environment variables** for sensitive data (though Supabase handles this)
3. **Rotate OAuth secrets** periodically
4. **Monitor OAuth usage** in Google Cloud Console
5. **Implement proper session management** (already handled by Supabase)
6. **Validate user data** from OAuth providers before creating profiles

## User Data Handling

### Data Retrieved from Google

The app receives the following data from Google:
- Email address
- Full name (from `user_metadata.full_name` or `user_metadata.name`)
- Profile picture URL (available in `user_metadata`)
- Google ID (stored in Supabase auth.users)

### Profile Creation

When a user signs in with Google:
1. Supabase creates an auth.users record
2. App calls `createUserProfile()` with user data
3. Profile is created in `profiles` table with:
   - User ID (from Supabase auth)
   - Email
   - Name (from Google)
   - Location (defaults to "Unknown", can be updated later)
   - Subscription tier (defaults to "free")

## Additional Configuration

### For Production

1. **Verify your domain** in Google Cloud Console
2. **Submit for OAuth verification** if you need access to sensitive scopes
3. **Configure proper error handling** for OAuth failures
4. **Set up monitoring** for authentication metrics
5. **Update privacy policy** to mention Google OAuth

### For App Store/Play Store

1. Include OAuth redirect URL handling in app capabilities
2. Update app permissions if needed
3. Document Google Sign In in store listings
4. Ensure compliance with Google's branding guidelines

## Support

For issues related to:
- **Supabase Auth**: Check [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- **Google OAuth**: See [Google Identity Documentation](https://developers.google.com/identity)
- **Expo Auth**: Refer to [Expo AuthSession Docs](https://docs.expo.dev/versions/latest/sdk/auth-session/)

## Files Modified

1. `hooks/auth-context.tsx` - Added `loginWithGoogle` function
2. `components/auth/LoginScreen.tsx` - Added Google Sign In button and UI
3. `components/auth/RegisterScreen.tsx` - Added Google Sign Up button and UI
4. `package.json` - Added auth-related dependencies

## Next Steps

1. Complete Google Cloud Console setup
2. Configure Supabase with Google OAuth credentials
3. Test authentication flow
4. Update privacy policy
5. Submit for production OAuth verification (if needed)
