import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env file');
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

/**
 * Get all restaurants from Supabase
 * Returns all venues with category 'restaurant'
 */
export default publicProcedure
  .query(async () => {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .eq('category', 'restaurant')
      .order('city', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch restaurants: ${error.message}`);
    }

    return {
      success: true,
      count: data?.length || 0,
      restaurants: data || [],
    };
  });
