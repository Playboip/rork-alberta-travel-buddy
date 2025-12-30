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
 * Get restaurant recommendations from Supabase
 * Supports filtering by city, cuisine type, and price range
 */
export default publicProcedure
  .input(
    z.object({
      city: z.string().optional(),
      cuisine: z.string().optional(),
      priceRange: z.string().optional(),
      limit: z.number().min(1).max(100).default(20),
    })
  )
  .query(async ({ input }) => {
    try {
      // Build query
      let query = supabase
        .from('venues')
        .select('*')
        .eq('category', 'restaurant')
        .order('name', { ascending: true });

      // Apply filters if provided
      if (input.city) {
        query = query.ilike('city', `%${input.city}%`);
      }

      if (input.cuisine) {
        query = query.ilike('type', `%${input.cuisine}%`);
      }

      // Limit results
      query = query.limit(input.limit);

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch restaurants: ${error.message}`);
      }

      return {
        success: true,
        count: data?.length || 0,
        restaurants: data || [],
      };
    } catch (error) {
      return {
        success: false,
        count: 0,
        restaurants: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });
