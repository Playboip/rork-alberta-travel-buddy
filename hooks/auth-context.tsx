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

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('Loading profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, this might be a new user
          console.log('Profile not found, user might need to complete registration');
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
        
        // Handle specific error cases
        if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
          throw new Error('Please check your email and click the confirmation link before signing in.');
        } else if (error.message.includes('Invalid login credentials') || error.message.includes('invalid_credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Too many requests')) {
          throw new Error('Too many login attempts. Please wait a moment and try again.');
        } else {
          throw new Error(error.message || 'Login failed. Please try again.');
        }
      }

      if (!data.user) {
        throw new Error('Login failed. No user data received.');
      }

      // Check if user has confirmed their email
      if (!data.user.email_confirmed_at) {
        console.log('User email not confirmed');
        await supabase.auth.signOut(); // Sign out the unconfirmed user
        throw new Error('Please check your email and click the confirmation link to activate your account.');
      }

      console.log('Login successful for user:', data.user.id);
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

      // Check if user already exists by trying to sign in first
      // This is a safer approach than using admin methods
      console.log('Checking if user already exists...');
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();
      
      if (existingProfile) {
        throw new Error('An account with this email already exists. Please try signing in instead.');
      }

      // Attempt to sign up the user with email confirmation disabled for now
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
        } else {
          throw new Error(error.message || 'Registration failed. Please try again.');
        }
      }

      if (!data.user) {
        throw new Error('Registration failed. No user data received.');
      }

      console.log('User created successfully:', data.user.id);

      // Create user profile using the secure function
      console.log('Creating user profile...');
      const { error: profileError } = await supabase.rpc('create_user_profile', {
        p_user_id: data.user.id,
        p_email: email,
        p_name: name,
        p_location: location
      });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't clean up auth user as it might be needed for email confirmation
        console.log('Profile will be created after email confirmation');
      } else {
        console.log('Profile created successfully');
      }

      // Handle email confirmation requirement
      if (!data.session && data.user && !data.user.email_confirmed_at) {
        throw new Error('Registration successful! Please check your email and click the confirmation link to activate your account.');
      }

      // If we have a session, the user is immediately logged in (email confirmation disabled)
      if (data.session) {
        console.log('User registered and logged in successfully');
      }

    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
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
      console.log('Resending confirmation email to:', email);
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
    register,
    logout,
    updateUser,
    refreshUser,
    resendConfirmation
  };
});