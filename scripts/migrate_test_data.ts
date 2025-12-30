/* eslint-disable no-console */
/**
 * Script to migrate hardcoded restaurant data from dining.tsx to Supabase
 * 
 * This script reads the hardcoded restaurant data and inserts it into
 * the Supabase venues table with appropriate transformations.
 * 
 * Usage:
 *   npx tsx scripts/migrate_test_data.ts
 * 
 * Environment variables required:
 *   EXPO_PUBLIC_SUPABASE_URL - Your Supabase project URL
 *   EXPO_PUBLIC_SUPABASE_ANON_KEY - Your Supabase anonymous key
 */

import { createClient } from '@supabase/supabase-js';

interface Restaurant {
  id: string;
  name: string;
  area: string;
  phone: string;
  website: string;
  hours: {
    weekdays: string;
    weekends: string;
    seasonal?: string;
  };
  cuisine: string;
  rating: number;
  priceRange: string;
  description: string;
  specialties: string[];
}

interface VenueInsert {
  name: string;
  city: string;
  region: string;
  category: 'restaurant';
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
}

// Hardcoded restaurant data from app/(tabs)/dining.tsx
const RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'The Bison Restaurant',
    area: 'Banff',
    phone: '(403) 762-5550',
    website: 'https://www.thebison.ca',
    hours: {
      weekdays: '5:00 PM - 10:00 PM',
      weekends: '5:00 PM - 10:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Canadian',
    rating: 4.5,
    priceRange: '$$$',
    description: 'Upscale Canadian cuisine featuring locally sourced ingredients',
    specialties: ['Bison Tenderloin', 'Alberta Beef', 'Local Game'],
  },
  {
    id: '2',
    name: 'Chateau Lake Louise Fairview Bar & Restaurant',
    area: 'Lake Louise',
    phone: '(403) 522-3511',
    website: 'https://www.fairmont.com/lake-louise',
    hours: {
      weekdays: '6:30 AM - 10:00 PM',
      weekends: '6:30 AM - 10:00 PM',
      seasonal: 'Seasonal hours may vary',
    },
    cuisine: 'Fine Dining',
    rating: 4.7,
    priceRange: '$$$$',
    description: 'Elegant dining with spectacular lake views',
    specialties: ['Lake Views', 'Wine Selection', 'Afternoon Tea'],
  },
  {
    id: '3',
    name: 'Earls Kitchen + Bar',
    area: 'Calgary - Downtown',
    phone: '(403) 269-3275',
    website: 'https://earls.ca/locations/tin-palace',
    hours: {
      weekdays: '11:00 AM - 12:00 AM',
      weekends: '10:00 AM - 1:00 AM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Contemporary',
    rating: 4.2,
    priceRange: '$$',
    description: 'Contemporary casual dining with global influences',
    specialties: ['Cajun Chicken', 'Dynamite Roll', 'Truffle Fries'],
  },
  {
    id: '4',
    name: "River Cafe",
    area: "Calgary - Prince's Island Park",
    phone: '(403) 261-7670',
    website: 'https://river-cafe.com',
    hours: {
      weekdays: '11:30 AM - 2:00 PM, 5:30 PM - 9:00 PM',
      weekends: '10:00 AM - 2:00 PM, 5:30 PM - 9:00 PM',
      seasonal: 'Closed Mondays in winter, hours may vary seasonally',
    },
    cuisine: 'Canadian',
    rating: 4.6,
    priceRange: '$$$$',
    description: 'Award-winning restaurant featuring Canadian cuisine',
    specialties: ['Seasonal Menu', 'Local Ingredients', 'River Views'],
  },
  {
    id: '5',
    name: 'The Grizzly House',
    area: 'Banff',
    phone: '(403) 762-4055',
    website: 'https://banffgrizzlyhouse.com',
    hours: {
      weekdays: '11:30 AM - 12:00 AM',
      weekends: '11:30 AM - 12:00 AM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Fondue',
    rating: 4.3,
    priceRange: '$$$',
    description: 'Famous fondue restaurant with exotic meats',
    specialties: ['Cheese Fondue', 'Exotic Meats', 'Chocolate Fondue'],
  },
  {
    id: '6',
    name: 'Saltlik',
    area: 'Calgary - Downtown',
    phone: '(403) 537-1160',
    website: 'https://saltlik.com/calgary',
    hours: {
      weekdays: '11:30 AM - 10:00 PM',
      weekends: '4:00 PM - 11:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Steakhouse',
    rating: 4.4,
    priceRange: '$$$$',
    description: 'Premium steakhouse featuring Alberta beef',
    specialties: ['Alberta Beef', 'Seafood', 'Wine Selection'],
  },
  {
    id: '7',
    name: 'Canmore Hotel',
    area: 'Canmore',
    phone: '(403) 678-5181',
    website: 'https://canmorehotel.com',
    hours: {
      weekdays: '11:00 AM - 11:00 PM',
      weekends: '11:00 AM - 12:00 AM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Pub Food',
    rating: 4.1,
    priceRange: '$$',
    description: 'Historic hotel pub with mountain atmosphere',
    specialties: ['Fish & Chips', 'Burgers', 'Local Beers'],
  },
  {
    id: '8',
    name: 'Jasper Brewing Company',
    area: 'Jasper',
    phone: '(403) 852-4111',
    website: 'https://jasperbrewingco.ca',
    hours: {
      weekdays: '11:30 AM - 11:00 PM',
      weekends: '11:30 AM - 12:00 AM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Brewpub',
    rating: 4.2,
    priceRange: '$$',
    description: 'Local brewery with hearty pub fare',
    specialties: ['Craft Beer', 'Pizza', 'Wings'],
  },
  {
    id: '9',
    name: 'Symons Valley Ranch',
    area: 'Calgary - Rural North',
    phone: '(403) 274-4666',
    website: 'https://symonsvalleyranch.com',
    hours: {
      weekdays: '5:00 PM - 9:00 PM',
      weekends: '5:00 PM - 10:00 PM',
      seasonal: 'Closed Mondays, hours may vary seasonally',
    },
    cuisine: 'Steakhouse',
    rating: 4.5,
    priceRange: '$$$$',
    description: 'Ranch-style steakhouse in rural setting',
    specialties: ['Prime Rib', 'Ranch Atmosphere', 'Private Events'],
  },
  {
    id: '10',
    name: 'Heartwood Inn & Spa Restaurant',
    area: 'Rural - Timmins',
    phone: '(780) 675-5777',
    website: 'https://heartwoodinn.com',
    hours: {
      weekdays: '7:00 AM - 9:00 PM',
      weekends: '7:00 AM - 9:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Farm-to-Table',
    rating: 4.4,
    priceRange: '$$$',
    description: 'Farm-to-table dining in peaceful rural setting',
    specialties: ['Local Ingredients', 'Seasonal Menu', 'Spa Cuisine'],
  },
  {
    id: '11',
    name: 'Chuckwagon Cafe',
    area: 'Rural - Turner Valley',
    phone: '(403) 933-7797',
    website: 'https://chuckwagoncafe.ca',
    hours: {
      weekdays: '8:00 AM - 8:00 PM',
      weekends: '8:00 AM - 9:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Cafe',
    rating: 4.6,
    priceRange: '$$',
    description:
      'A bright red barn-turned-café serving burgers with hand-ground aged beef, scratch-made fries, and scratch-baked pies in a charming countryside setting',
    specialties: ['Hand-ground Aged Beef Burgers', 'Scratch-made Fries', 'Scratch-baked Pies'],
  },
  {
    id: '12',
    name: 'Dining Car at Aspen Crossing',
    area: 'Rural - Mossleigh',
    phone: '(403) 934-3500',
    website: 'https://aspencrossing.ca',
    hours: {
      weekdays: '11:00 AM - 8:00 PM',
      weekends: '10:00 AM - 9:00 PM',
      seasonal: 'Seasonal operation, hours may vary',
    },
    cuisine: 'Comfort Food',
    rating: 4.4,
    priceRange: '$$',
    description:
      'Dine inside a restored 1887 railcar, enjoying comfort food surrounded by nostalgic train-era vibes',
    specialties: ['Historic Railcar Dining', 'Comfort Food', 'Train-era Atmosphere'],
  },
  {
    id: '13',
    name: 'The Overlander Mountain Lodge',
    area: 'Rural - Jasper East',
    phone: '(780) 866-2330',
    website: 'https://overlander.ca',
    hours: {
      weekdays: '6:00 PM - 9:00 PM',
      weekends: '6:00 PM - 9:00 PM',
      seasonal: 'Seasonal operation May-October, hours may vary',
    },
    cuisine: 'Fine Dining',
    rating: 4.7,
    priceRange: '$$$$',
    description:
      'A lodge-style restaurant offering refined, seasonal cuisine paired with sweeping views of the Miette Range and Athabasca Valley',
    specialties: ['Seasonal Cuisine', 'Mountain Views', 'Lodge Atmosphere'],
  },
  {
    id: '14',
    name: 'Longview Steakhouse',
    area: 'Rural - Longview',
    phone: '(403) 558-3336',
    website: 'https://longviewsteakhouse.com',
    hours: {
      weekdays: '5:00 PM - 9:00 PM',
      weekends: '5:00 PM - 10:00 PM',
      seasonal: 'Closed Mondays, hours may vary seasonally',
    },
    cuisine: 'Steakhouse',
    rating: 4.5,
    priceRange: '$$$',
    description:
      'Elevated steakhouse fare paired with a classic rural backdrop—perfect for a memorable, low-key night out',
    specialties: ['Premium Steaks', 'Rural Atmosphere', 'Classic Fare'],
  },
  {
    id: '15',
    name: 'Silver Slate Steakhouse',
    area: 'Rural - Stavely',
    phone: '(403) 549-2233',
    website: 'https://silverslatesteakhouse.ca',
    hours: {
      weekdays: '5:00 PM - 9:00 PM',
      weekends: '5:00 PM - 10:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Steakhouse',
    rating: 4.4,
    priceRange: '$$$',
    description:
      'Tucked off the beaten path beside an equestrian centre, this cozy steakhouse serves hearty, old-fashioned meals made to impress',
    specialties: ['Hearty Steaks', 'Equestrian Setting', 'Old-fashioned Meals'],
  },
  {
    id: '16',
    name: 'The Crossing at Ghost River',
    area: 'Rural - Near Cochrane',
    phone: '(403) 932-6985',
    website: 'https://ghostrivercrossing.com',
    hours: {
      weekdays: 'By Reservation Only',
      weekends: 'By Reservation Only',
      seasonal: 'Seasonal operation, private events',
    },
    cuisine: 'Fine Dining',
    rating: 4.6,
    priceRange: '$$$',
    description:
      'A secluded retreat hosting occasional public dinners with seasonal dishes in a serene forested setting',
    specialties: ['Seasonal Dinners', 'Forest Setting', 'Special Occasions'],
  },
];

function extractCityFromArea(area: string): string {
  // Remove prefixes like "Rural -", "Calgary -", etc.
  const cleaned = area
    .replace(/^Rural\s*-\s*/i, '')
    .replace(/^Calgary\s*-\s*/i, 'Calgary')
    .replace(/^Edmonton\s*-\s*/i, 'Edmonton')
    .trim();
  
  // If it still contains a dash, take the first part
  if (cleaned.includes(' - ')) {
    return cleaned.split(' - ')[0].trim();
  }
  
  return cleaned;
}

function transformRestaurantToVenue(restaurant: Restaurant): VenueInsert {
  const city = extractCityFromArea(restaurant.area);
  
  return {
    name: restaurant.name,
    city: city,
    region: 'Alberta',
    category: 'restaurant',
    type: restaurant.cuisine,
    website: restaurant.website,
    description: restaurant.description,
    known_for: restaurant.specialties.join(', '),
    vibe: `${restaurant.priceRange} | ${restaurant.cuisine} | Rating: ${restaurant.rating}/5`,
  };
}

async function migrateRestaurantsToSupabase() {
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
    console.log(`\n📊 Preparing to migrate ${RESTAURANTS.length} restaurants...`);

    // Transform all restaurants to venue format
    const venues: VenueInsert[] = RESTAURANTS.map(transformRestaurantToVenue);

    console.log('\n📝 Sample transformed data:');
    console.log(JSON.stringify(venues[0], null, 2));

    // Insert venues in chunks to avoid rate limits
    const chunkSize = 10;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < venues.length; i += chunkSize) {
      const chunk = venues.slice(i, i + chunkSize);
      console.log(`\n⬆️  Upserting chunk ${Math.floor(i / chunkSize) + 1}/${Math.ceil(venues.length / chunkSize)} (${chunk.length} items)...`);

      const { data, error } = await supabase
        .from('venues')
        .upsert(chunk, { onConflict: 'name,city', ignoreDuplicates: false });

      if (error) {
        console.error(`   ❌ Error upserting chunk: ${error.message}`);
        errorCount += chunk.length;
      } else {
        console.log(`   ✅ Successfully upserted ${chunk.length} restaurants`);
        successCount += chunk.length;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n📈 Migration Summary:');
    console.log(`   ✅ Successfully migrated: ${successCount} restaurants`);
    if (errorCount > 0) {
      console.log(`   ❌ Failed to migrate: ${errorCount} restaurants`);
    }

    // Verify the data
    console.log('\n🔍 Verifying migration...');
    const { data: restaurantCount, error: countError } = await supabase
      .from('venues')
      .select('*', { count: 'exact', head: true })
      .eq('category', 'restaurant');

    if (countError) {
      console.error(`   ❌ Error counting restaurants: ${countError.message}`);
    } else {
      console.log(`   ✅ Total restaurants in database: ${restaurantCount}`);
    }

    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('\n❌ Error during migration:');
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  migrateRestaurantsToSupabase()
    .then(() => {
      console.log('\n✨ Script execution completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Fatal error:', error);
      process.exit(1);
    });
}

export { migrateRestaurantsToSupabase, RESTAURANTS };
