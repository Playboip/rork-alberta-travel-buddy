import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, location: string) => Promise<{ requiresEmailConfirmation?: boolean; emailDelayed?: boolean } | void>;
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
        console.log('Error details:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        
        // Handle specific error cases
        if (error.message.includes('Email not confirmed') || 
            error.message.includes('email_not_confirmed') ||
            error.message.includes('signup_disabled')) {
          throw new Error('UNCONFIRMED_EMAIL_DELAYED');
        } else if (error.message.includes('Invalid login credentials') || 
                   error.message.includes('invalid_credentials') ||
                   error.status === 400) {
          // For invalid credentials, mention email service issues
          throw new Error('Invalid email or password. If you recently registered, email confirmation may be delayed due to temporary service restrictions. Please try again in a few minutes.');
        } else if (error.message.includes('Too many requests')) {
          throw new Error('Too many login attempts. Please wait a moment and try again.');
        } else {
          throw new Error(error.message || 'Login failed. Please try again.');
        }
      }

      if (!data.user) {
        throw new Error('Login failed. No user data received.');
      }

      // TEMPORARY: Skip email confirmation check due to email service restrictions
      // This allows users to login even if confirmation email wasn't received
      console.log('Login successful for user:', data.user.id);
      console.log('Email confirmation status:', data.user.email_confirmed_at ? 'confirmed' : 'pending (bypassed due to email service issues)');
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, location: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting registration for:', email);
      
      // Test database connection first
      console.log('Testing database connection...');
      const { error: connectionError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (connectionError) {
        console.error('Database connection failed:', connectionError);
        throw new Error(`Database connection failed: ${connectionError.message}`);
      }
      
      console.log('Database connection successful');

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

      // TEMPORARY: Due to email sending restrictions, we'll show a warning
      // but still attempt registration
      console.log('WARNING: Email confirmation may be affected due to temporary email restrictions');

      // Attempt to sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            location: location
          }
        }
      });

      if (error) {
        console.error('Supabase auth signup error:', error);
        if (error.message.includes('already registered')) {
          throw new Error('An account with this email already exists. Please try signing in instead.');
        } else if (error.message.includes('Password should be')) {
          throw new Error('Password is too weak. Please use a stronger password with at least 6 characters.');
        } else if (error.message.includes('email') && error.message.includes('rate')) {
          throw new Error('Email service is temporarily unavailable. Your account has been created but email confirmation is delayed. Please try logging in after a few minutes.');
        } else {
          throw new Error(error.message || 'Registration failed. Please try again.');
        }
      }

      if (!data.user) {
        throw new Error('Registration failed. No user data received.');
      }

      console.log('User created successfully:', data.user.id);

      // Create user profile - try multiple approaches
      await createUserProfile(data.user.id, email, name, location);

      // Handle different registration scenarios
      if (data.session) {
        // User is immediately logged in (email confirmation disabled)
        console.log('User registered and logged in successfully');
        await loadUserProfile(data.user.id);
      } else if (data.user && !data.user.email_confirmed_at) {
        // Email confirmation required - but may be delayed due to email restrictions
        console.log('Registration successful, email confirmation required (may be delayed)');
        // Return a special success object with additional info
        return { 
          requiresEmailConfirmation: true,
          emailDelayed: true
        };
      } else {
        // Other scenarios
        console.log('Registration completed, user needs to sign in');
      }

    } catch (error) {
      console.error('Registration error:', error);
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
        if (error.message.includes('rate') || error.message.includes('limit')) {
          throw new Error('Email service is temporarily restricted. Please try logging in directly as your account may already be active.');
        }
        throw new Error(error.message);
      }

      console.log('Confirmation email request sent (may be delayed due to service restrictions)');
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
    register,
    logout,
    updateUser,
    refreshUser,
    resendConfirmation
  };
});