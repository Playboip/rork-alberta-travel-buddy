import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const envUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const envAnon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';
const configUrl = Constants.expoConfig?.extra?.supabaseUrl ?? '';
const configAnon = Constants.expoConfig?.extra?.supabaseAnonKey ?? '';

const supabaseUrl = envUrl || configUrl;
const supabaseAnonKey = envAnon || configAnon;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration missing', {
    hasUrl: !!supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
  });
  throw new Error('Supabase is not configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY or add extra.supabaseUrl and extra.supabaseAnonKey in app.config.js');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});