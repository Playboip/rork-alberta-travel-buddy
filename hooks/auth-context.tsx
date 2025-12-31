import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { makeRedirectUri } from 'expo-auth-session';

// Needed for Google OAuth to work properly
WebBrowser.maybeCompleteAuthSession();

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string, location: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<void>;
}

export const [AuthProvider, useAuth] = createContextHook((): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.id);
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      setSession(session);
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string, retryCount = 0) => {
    try {
      console.log('Loading profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        if (error.code === 'PGRST116' && retryCount === 0) {
          // Profile doesn't exist, try to get user info from auth and create profile
          console.log('Profile not found, attempting to create from auth data');
          const { data: { user } } = await supabase.auth.getUser();
          if (user && user.id === userId) {
            const userData = user.user_metadata;
            await createUserProfile(
              userId,
              user.email || '',
              userData?.name || 'User',
              userData?.location || 'Unknown'
            );
            // Retry loading the profile once
            await loadUserProfile(userId, 1);
            return;
          }
        }
      } else if (data) {
        console.log('Profile loaded:', data);
        setUser({
          id: data.id,
          email: data.email,
          name: data.name,
          location: data.location,
          emergencyContact: data.emergency_contact,
          subscriptionTier: data.subscription_tier,
          subscriptionStatus: data.subscription_status,
          subscriptionId: data.subscription_id,
          createdAt: data.created_at
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw new Error(error.message || 'Login failed. Please try again.');
      }

      if (!data.user) {
        throw new Error('Login failed. No user data received.');
      }

      console.log('Login successful for user:', data.user.id);
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      console.log('Attempting Google login...');
      
      const redirectUrl = makeRedirectUri({
        scheme: 'myapp',
        path: 'auth/callback',
      });
      
      console.log('Redirect URL:', redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: false,
        },
      });

      if (error) {
        console.error('Google login error:', error);
        throw new Error(error.message || 'Google login failed. Please try again.');
      }

      if (data.url) {
        console.log('Opening Google auth URL...');
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        
        if (result.type === 'success' && result.url) {
          const url = Linking.parse(result.url);
          const access_token = url.queryParams?.access_token as string;
          const refresh_token = url.queryParams?.refresh_token as string;

          if (access_token && refresh_token) {
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });

            if (sessionError) {
              throw new Error(sessionError.message);
            }

            if (sessionData.user) {
              console.log('Google login successful for user:', sessionData.user.id);
              
              // Create or update user profile
              await createUserProfile(
                sessionData.user.id,
                sessionData.user.email || '',
                sessionData.user.user_metadata?.full_name || sessionData.user.user_metadata?.name || 'User',
                'Unknown'
              );
            }
          }
        } else if (result.type === 'cancel') {
          throw new Error('Google login was cancelled.');
        }
      }
      
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, location: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting registration for:', email);
      
      // Check if user already exists
      console.log('Checking if user already exists...');
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();
      
      if (existingProfile) {
        throw new Error('An account with this email already exists. Please try signing in instead.');
      }

      // Attempt to sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            location: location
          },
          emailRedirectTo: undefined // Disable email confirmation for now
        }
      });

      if (error) {
        console.error('Supabase auth signup error:', error);
        if (error.message.includes('already registered')) {
          throw new Error('An account with this email already exists. Please try signing in instead.');
        } else if (error.message.includes('Password should be')) {
          throw new Error('Password is too weak. Please use a stronger password with at least 6 characters.');
        } else {
          throw new Error(error.message || 'Registration failed. Please try again.');
        }
      }

      if (!data.user) {
        throw new Error('Registration failed. No user data received.');
      }

      console.log('User created successfully:', data.user.id);

      // Create user profile
      await createUserProfile(data.user.id, email, name, location);

      // If user has a session (auto-confirmed), load the profile
      if (data.session) {
        console.log('User registered and logged in successfully');
        await loadUserProfile(data.user.id);
      }

    } catch (error) {
      const readable = (error as any)?.message ?? String(error);
      console.error('Registration error:', readable);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createUserProfile = async (userId: string, email: string, name: string, location: string) => {
    console.log('Creating user profile for user:', userId);
    
    try {
      // Try RPC function first
      console.log('Attempting RPC function call...');
      const { error: rpcError } = await supabase.rpc('create_user_profile', {
        p_user_id: userId,
        p_email: email,
        p_name: name,
        p_location: location
      });

      if (!rpcError) {
        console.log('Profile created successfully via RPC');
        return;
      }

      console.error('RPC function failed:', rpcError);
      console.log('Attempting direct profile creation...');
      
      // Fallback to direct insert with upsert
      const { error: insertError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: email,
          name: name,
          location: location,
          subscription_tier: 'free',
          subscription_status: 'active'
        }, {
          onConflict: 'id'
        });
      
      if (insertError) {
        console.error('Direct profile creation failed:', insertError);
        // Don't throw error for duplicate key - profile already exists
        if (insertError.code === '23505') {
          console.log('Profile already exists, skipping creation');
          return;
        }
        console.log('Profile creation failed, will retry on next login');
      } else {
        console.log('Profile created successfully via direct insert');
      }
    } catch (error) {
      console.error('Error in createUserProfile:', error);
      // Don't throw - allow registration to continue
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      console.log('Updating user:', updates);
      const dbUpdates: any = {};
      
      // Map User interface to database columns
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.location !== undefined) dbUpdates.location = updates.location;
      if (updates.emergencyContact !== undefined) dbUpdates.emergency_contact = updates.emergencyContact;
      if (updates.subscriptionTier !== undefined) dbUpdates.subscription_tier = updates.subscriptionTier;
      if (updates.subscriptionStatus !== undefined) dbUpdates.subscription_status = updates.subscriptionStatus;
      if (updates.subscriptionId !== undefined) dbUpdates.subscription_id = updates.subscriptionId;

      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', user.id);

      if (error) {
        console.error('Update user error:', error);
        throw error;
      }

      setUser({ ...user, ...updates });
      console.log('User updated successfully');
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    if (!session?.user) return;
    console.log('Refreshing user profile');
    await loadUserProfile(session.user.id);
  };

  const resendConfirmation = async (email: string) => {
    try {
      console.log('Attempting to resend confirmation email to:', email);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        console.error('Resend confirmation error:', error);
        throw new Error(error.message);
      }

      console.log('Confirmation email sent successfully');
    } catch (error) {
      console.error('Resend confirmation error:', error);
      throw error;
    }
  };

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!session && !!user,
    login,
    loginWithGoogle,
    register,
    logout,
    updateUser,
    refreshUser,
    resendConfirmation
  };
});