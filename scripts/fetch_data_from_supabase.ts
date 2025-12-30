/* eslint-disable no-console */
/**
 * Script to fetch and display restaurant/venue data from Supabase
 * 
 * This script connects to Supabase and queries the venues table,
 * specifically focusing on restaurant data.
 * 
 * Usage:
 *   npx tsx scripts/fetch_data_from_supabase.ts
 * 
 * Environment variables required:
 *   EXPO_PUBLIC_SUPABASE_URL - Your Supabase project URL
 *   EXPO_PUBLIC_SUPABASE_ANON_KEY - Your Supabase anonymous key
 */

import { createClient } from '@supabase/supabase-js';

type VenueCategory = 'speakeasy' | 'restaurant' | 'bar' | 'cafe';

interface Venue {
  id: string;
  name: string;
  city: string;
  region?: string;
  category: VenueCategory;
  type?: string;
  address?: string;
  how_to_find?: string;
  vibe?: string;
  known_for?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  website?: string;
  instagram?: string;
  created_at?: string;
  updated_at?: string;
}

async function fetchVenuesFromSupabase() {
  // Get Supabase credentials from environment
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Missing Supabase credentials in environment variables');
    console.error('Please ensure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set in your .env file');
    process.exit(1);
  }

  console.log('🔗 Connecting to Supabase...');
  console.log(`   URL: ${supabaseUrl}`);

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  try {
    // Fetch all venues
    console.log('\n📊 Fetching all venues...');
    const { data: allVenues, error: allError } = await supabase
      .from('venues')
      .select('*')
      .order('city', { ascending: true });

    if (allError) {
      throw new Error(`Failed to fetch venues: ${allError.message}`);
    }

    console.log(`✅ Found ${allVenues?.length || 0} total venues`);

    // Fetch restaurants specifically
    console.log('\n🍽️  Fetching restaurants...');
    const { data: restaurants, error: restaurantError } = await supabase
      .from('venues')
      .select('*')
      .eq('category', 'restaurant')
      .order('city', { ascending: true });

    if (restaurantError) {
      throw new Error(`Failed to fetch restaurants: ${restaurantError.message}`);
    }

    console.log(`✅ Found ${restaurants?.length || 0} restaurants`);

    // Display summary by category
    console.log('\n📈 Summary by category:');
    const categoryCounts: Record<string, number> = {};
    allVenues?.forEach((venue) => {
      categoryCounts[venue.category] = (categoryCounts[venue.category] || 0) + 1;
    });
    
    Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        console.log(`   ${category}: ${count}`);
      });

    // Display sample restaurants
    if (restaurants && restaurants.length > 0) {
      console.log('\n🍴 Sample restaurants (first 5):');
      restaurants.slice(0, 5).forEach((restaurant, index) => {
        console.log(`\n   ${index + 1}. ${restaurant.name}`);
        console.log(`      📍 City: ${restaurant.city}`);
        if (restaurant.known_for) {
          console.log(`      ⭐ Known for: ${restaurant.known_for}`);
        }
        if (restaurant.website) {
          console.log(`      🔗 Website: ${restaurant.website}`);
        }
      });
    }

    // Fetch locations (cities) with restaurant counts
    console.log('\n🗺️  Restaurants by city:');
    const cityCounts: Record<string, number> = {};
    restaurants?.forEach((restaurant) => {
      cityCounts[restaurant.city] = (cityCounts[restaurant.city] || 0) + 1;
    });

    Object.entries(cityCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([city, count]) => {
        console.log(`   ${city}: ${count} restaurants`);
      });

    console.log('\n✅ Data fetch completed successfully!');
    
    return {
      allVenues,
      restaurants,
      categoryCounts,
      cityCounts,
    };

  } catch (error) {
    console.error('\n❌ Error fetching data from Supabase:');
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  fetchVenuesFromSupabase()
    .then(() => {
      console.log('\n✨ Script execution completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Fatal error:', error);
      process.exit(1);
    });
}

export { fetchVenuesFromSupabase };
