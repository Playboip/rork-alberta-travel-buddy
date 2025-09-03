/* eslint-disable no-console */
import { createClient } from '@supabase/supabase-js';

type Venue = {
  name: string;
  city: string;
  region?: string;
  category: 'speakeasy' | 'restaurant' | 'bar' | 'cafe';
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
};

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var ${name}`);
  return v;
}

async function main(): Promise<void> {
  const SUPABASE_URL = env('SUPABASE_URL');
  const SUPABASE_SERVICE_ROLE_KEY = env('SUPABASE_SERVICE_ROLE_KEY');

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const venuesRaw: Venue[] = [
    // Calgary Speakeasies
    {
      name: "Betty Lou's Library",
      city: 'Calgary',
      category: 'speakeasy',
      type: 'classic jazz library',
      how_to_find: "Unmarked door off 17th Ave SW alley. Reservation required; door code sent by email.",
      vibe: 'Intimate, dark, romantic 1920s jazz library with live piano and no-phone policy',
      known_for: 'Expertly crafted classic cocktails and curated menu',
    },
    {
      name: 'Shelter',
      city: 'Calgary',
      category: 'speakeasy',
      type: 'apothecary',
      how_to_find: 'Look for the "Canadian Ace" sign on 1st St SW; enter via unmarked black door',
      vibe: 'Moody basement bunker vibe',
      known_for: 'Innovative cocktails with unique ingredients',
    },
    {
      name: 'The Wednesday Room',
      city: 'Calgary',
      category: 'bar',
      type: 'upstairs hideaway',
      how_to_find: 'Enter Native Tongues Taqueria, walk to back staircase and go up',
      vibe: 'Lively, stylish, great for groups',
      known_for: 'Mezcal and tequila-based cocktails',
    },
    {
      name: 'Mini Mall',
      city: 'Calgary',
      category: 'speakeasy',
      type: 'quirky',
      how_to_find: "Inside the Janitor's Closet at the back of Crack Macs noodle bar on 10th St NW",
      vibe: 'Fun, irreverent, blink-and-you-miss-it',
      known_for: 'Short, creative cocktail list and surprising entrance',
    },
    {
      name: 'Bridget Bar',
      city: 'Calgary',
      category: 'bar',
      type: 'subterranean',
      how_to_find: 'Descend stairs next to Model Milk on 17th Ave SW',
      vibe: 'Cool, dark basement with excellent sound',
      known_for: 'Late-night cocktails and DJs',
    },
    {
      name: 'The Blind Beggar',
      city: 'Calgary',
      category: 'speakeasy',
      type: 'pub-style',
      how_to_find: 'Enter through red phone booth inside the main pub on 4th St SW',
      vibe: 'Cozy British-inspired hideaway',
      known_for: 'Large Scotch and whisky selection',
    },
    // Edmonton Speakeasies
    {
      name: 'Clementine Cocktail House',
      city: 'Edmonton',
      category: 'speakeasy',
      how_to_find: 'Chinatown back alley, neon "Clementine"; enter through unmarked industrial door',
      vibe: 'Sprawling, impeccably designed hidden grand space',
      known_for: 'Iconic cocktail program',
    },
    {
      name: 'The Cocktail Loft',
      city: 'Edmonton',
      category: 'speakeasy',
      type: 'reservations-only',
      how_to_find: 'Above the Mayfair on Jasper Ave; reservation yields entry instructions',
      vibe: 'Small, sophisticated, quiet lounge',
      known_for: 'Bespoke, personalized cocktails',
    },
    {
      name: 'The Den at River City Revival House',
      city: 'Edmonton',
      category: 'speakeasy',
      type: 'bookcase secret',
      how_to_find: 'Inside River City Revival House; hidden sliding bookcase door',
      vibe: 'Cozy, intimate, Prohibition club feel',
      known_for: 'Exclusive cocktail menu different from the restaurant',
    },
    {
      name: 'Honi Honi Tiki Lounge',
      city: 'Edmonton',
      category: 'bar',
      type: 'tiki',
      how_to_find: 'Downstairs beneath The Common on 109th St',
      vibe: 'Transportive Polynesian tiki decor',
      known_for: 'Elaborate shareable tiki bowls with flaming garnishes',
    },
    {
      name: 'The Bothy Wine & Whisky Bar',
      city: 'Edmonton',
      category: 'bar',
      type: 'wine & whisky',
      how_to_find: 'Tucked on 105th St next to Tiramisu Bistro',
      vibe: 'Warm, rustic, intimate Scottish lodge feel',
      known_for: 'Enormous whisky selection; curated wines by the glass',
    },
    // Southern Alberta & Calgary area
    { name: 'Rouge Restaurant', city: 'Calgary', category: 'restaurant', known_for: 'Refined Canadian cuisine in historic Inglewood house; garden patio' },
    { name: 'Japanese Village', city: 'Calgary', category: 'restaurant', known_for: 'Iconic basement teppanyaki' },
    { name: 'The Himalayan', city: 'Canmore', category: 'restaurant', known_for: 'Authentic Nepalese & Indian; momos' },
    { name: 'The Grizzly Paw Brewing Co. — Tank 310', city: 'Canmore', category: 'bar', known_for: 'Craft beer and elevated pub grub' },
    { name: 'The Cinnamon Bear', city: 'Waterton', category: 'cafe', known_for: 'Homemade pies in tiny park café' },
    { name: 'Phô Bình Minh', city: 'Calgary', category: 'restaurant', known_for: 'Beloved authentic pho in strip mall' },
    { name: 'Alumni Sandwiches', city: 'Calgary', category: 'restaurant', known_for: 'Creative sandwiches in industrial area' },
    { name: 'Charbar', city: 'Calgary', category: 'restaurant', known_for: 'Argentinian-inspired; rooftop patio with Bow River views' },
    { name: 'Pigeonhole', city: 'Calgary', category: 'restaurant', known_for: 'Tiny wine bar; innovative small plates' },
    { name: 'Paradise Valley Garden & Sushi', city: 'Airdrie', category: 'restaurant', known_for: 'Indoor garden setting with koi ponds; excellent sushi' },
    { name: "The Jester's Court", city: 'Drumheller', category: 'restaurant', known_for: 'Quirky café/pub in the badlands' },
    // Central Alberta & Rockies
    { name: 'Bear Street Tavern', city: 'Banff', category: 'restaurant', known_for: 'Famous pizzas; great atmosphere' },
    { name: 'The Balkan Restaurant', city: 'Canmore', category: 'restaurant', known_for: 'Authentic family-run Greek' },
    { name: 'The Sunflower Café', city: 'Canmore', category: 'cafe', known_for: 'Healthy, affordable breakfast/lunch' },
    { name: 'The Other Paw', city: 'Banff', category: 'cafe', known_for: 'Great pastries and coffee; less crowded' },
    { name: 'Fiddle River Restaurant', city: 'Jasper', category: 'restaurant', known_for: 'Seafood and regional cuisine; mountain views' },
    { name: 'The Spice Joint', city: 'Jasper', category: 'restaurant', known_for: 'Indian and Nepalese food' },
    { name: 'The Grizzly House', city: 'Banff', category: 'restaurant', known_for: 'Legendary fondue & exotic meats' },
    { name: 'The Crossing Resort', city: 'Saskatchewan River Crossing', category: 'restaurant', known_for: 'Surprisingly good meals in remote corridor' },
    { name: 'The Siding Café', city: 'Lacombe', category: 'cafe', known_for: 'Historic railway station café' },
    // Northern Alberta
    { name: "The Black Jack's Saloon", city: 'Val Quentin', category: 'bar', known_for: 'Massive burgers; lakeside legend' },
    { name: "Tony's Pizza Palace", city: 'Edmonton', category: 'restaurant', known_for: 'Old-school Italian-Canadian since 1964' },
    { name: 'The Bistro', city: 'Grande Prairie', category: 'restaurant', known_for: 'Local ingredients; creative dishes' },
    { name: 'La Crema', city: 'Edmonton', category: 'restaurant', known_for: 'Spanish restaurant & dessert bar; intimate' },
    { name: 'DOSC', city: 'Edmonton', category: 'restaurant', known_for: 'Steakhouse + coffee in moody basement' },
    { name: 'Amaranto Italian Pantry & Café', city: 'Edmonton', category: 'cafe', known_for: 'Italian grocery & café; sandwiches & pasta' },
    { name: 'The Red Ox Inn', city: 'Edmonton', category: 'restaurant', known_for: 'Intimate fine dining classic' },
    { name: "The Moose's Caboose", city: 'Wabamun', category: 'cafe', known_for: 'Hearty breakfasts; friendly atmosphere' },
    { name: 'Brewsters Brewing Company', city: 'Fort McMurray', category: 'bar', known_for: 'Community staple for pub food & beer' },
    // Prairie & Eastern Alberta
    { name: 'The Turquoise Barn', city: 'Vegreville', category: 'cafe', known_for: 'Historic building; Ukrainian specialties' },
    { name: 'The Black Diamond Hotel — The Westwood', city: 'Black Diamond', category: 'restaurant', known_for: 'Local, seasonal ingredients; unassuming spot' },
    { name: 'The Chuckwagon Café', city: 'Turner Valley', category: 'restaurant', known_for: 'Classic diner; huge breakfasts' },
    { name: 'Ukrainian Cultural Heritage Village — Riverside Cafe', city: 'Lamont County', category: 'restaurant', known_for: 'Authentic historical Ukrainian meals' },
    { name: "Whif's Flapjack House", city: 'Drumheller', category: 'restaurant', known_for: 'Pancake flights; family-friendly' },
    { name: 'The Rosebud Café', city: 'Rosebud', category: 'restaurant', known_for: 'Pre-show meals in quaint setting' },
    { name: 'Mighty Moose Pizza', city: 'Fort Saskatchewan', category: 'restaurant', known_for: 'Some of the best pizza in Edmonton metro' },
    // Brand New & Trendy / Noteworthy (2023/2024)
    { name: 'Pom Pom', city: 'Edmonton', category: 'restaurant', known_for: 'Trendy sandwiches and salads on 124th St' },
    { name: 'Phatbar', city: 'Edmonton', category: 'restaurant', type: 'izakaya & wine bar', known_for: 'Shareable plates; natural wine' },
    { name: 'RGE RD', city: 'Edmonton', category: 'restaurant', known_for: 'New Gateway Blvd location; prairie cuisine' },
    { name: 'Orchard', city: 'Calgary', category: 'restaurant', known_for: 'Shareable plates; strong wine list' },
    { name: 'Nupo', city: 'Calgary', category: 'restaurant', type: 'omakase sushi', known_for: 'Intimate sushi bar inside the Cambie' },
    { name: 'Calle Mexico', city: 'Edmonton', category: 'restaurant', known_for: 'New colourful Calgary Trail location; authentic tacos' },
    { name: 'The Deane House', city: 'Calgary', category: 'restaurant', known_for: 'Historic riverside fine dining; hyper-local' },
    { name: 'Scratch Breakfast', city: 'Edmonton', category: 'restaurant', known_for: 'Modern breakfast; from-scratch meals' },
    { name: 'SFC (Southern Fried Chicken)', city: 'Edmonton', category: 'restaurant', known_for: 'Nashville hot, Korean and classic buttermilk fried chicken' },
    { name: 'The Butternut Tree', city: 'Edmonton', category: 'restaurant', known_for: 'New downtown Ultima location; Canadian ingredients' },
    // Bars & Cocktail Lounges / Hidden Gems
    { name: 'The Ordinary', city: 'Edmonton', category: 'bar', known_for: 'Swanky cocktails and oysters on 104th St' },
    { name: 'Bodega Taps & Tales', city: 'Edmonton', category: 'bar', type: 'tapas & beer bar', known_for: 'Rotating craft taps; Spanish small plates' },
    { name: 'Tzin Wine & Tapas', city: 'Edmonton', category: 'restaurant', type: 'tapas', known_for: 'Tiny, legendary spot for wine lovers' },
    { name: 'Swiss2Go', city: 'Edmonton', category: 'cafe', known_for: 'European deli & café; sandwiches and chocolate' },
    { name: 'The Black Pearl', city: 'Edmonton', category: 'restaurant', known_for: 'Seafood shack & oyster bar on 109th' },
    { name: 'Kanto 98 St. Food', city: 'Edmonton', category: 'restaurant', known_for: 'Authentic Filipino stall; legit flavours' },
    { name: 'La Petite Iza', city: 'Edmonton', category: 'restaurant', type: 'French bistro', known_for: 'Perfect French classics' },
    { name: 'Dang Good', city: 'Edmonton', category: 'restaurant', known_for: 'Korean stall inside H‑Mart North' },
    // Food Trucks (city varies; use Edmonton as default hub)
    { name: 'The Local Omnivore (Truck)', city: 'Edmonton', category: 'restaurant', known_for: 'Massive Trailer Park sandwich' },
    { name: 'Drift Food Truck', city: 'Edmonton', category: 'restaurant', known_for: 'Globally-inspired street food' },
    { name: 'El Fogon Tacos (Truck)', city: 'Edmonton', category: 'restaurant', known_for: 'Authentic Mexican street tacos' },
    { name: 'Smoke & Ash BBQ (Truck)', city: 'Edmonton', category: 'restaurant', known_for: 'Texas-style BBQ; tender brisket' },
    // Worth the Short Drive (Edmonton area)
    { name: 'Bianco', city: 'Sherwood Park', category: 'restaurant', known_for: 'House-made pasta; elegant dishes' },
    { name: 'Chartier', city: 'Beaumont', category: 'restaurant', known_for: 'French-Canadian; famed brunch' },
    { name: 'The Columbian Coffee Co. & Eatery', city: 'Sherwood Park', category: 'cafe', known_for: 'Excellent coffee; breakfast & lunch' },
    { name: 'Sugar Swing Lounge — Cocktail Bar', city: 'Sherwood Park', category: 'bar', known_for: 'Hidden cocktail bar with small plates' },
    // New & Sweet Treats / Cafés
    { name: 'Koffie Works', city: 'Edmonton', category: 'cafe', known_for: 'Minimalist brew methods; top-tier coffee' },
    { name: 'Swirl Ice Cream', city: 'Edmonton', category: 'cafe', known_for: 'Artisan ice cream; rotating flavours' },
    { name: 'The Art of Cake', city: 'Edmonton', category: 'cafe', known_for: 'Stunning cakes & pastries' },
    { name: 'Lock Stock Coffee', city: 'Edmonton', category: 'cafe', known_for: 'Industrial-chic coffee bar' },
    { name: 'Doughnut Party', city: 'Edmonton', category: 'cafe', known_for: 'Creative cake doughnuts; multiple locations' },
  ];

  const deduped = Array.from(
    venuesRaw.reduce((map, v) => {
      const key = `${v.name.toLowerCase()}__${v.city.toLowerCase()}`;
      if (!map.has(key)) map.set(key, v);
      return map;
    }, new Map<string, Venue>()).values()
  );

  console.log(`[seed-venues] Prepared ${deduped.length} unique venues (deduped by name+city).`);

  const chunkSize = 50;
  for (let i = 0; i < deduped.length; i += chunkSize) {
    const chunk = deduped.slice(i, i + chunkSize);
    console.log(`[seed-venues] Upserting chunk ${i / chunkSize + 1} (${chunk.length} items)...`);
    const { error } = await supabase
      .from('venues')
      .upsert(chunk, { onConflict: 'name,city', ignoreDuplicates: false });
    if (error) {
      console.error('[seed-venues] Upsert error:', error.message);
      throw error;
    }
  }

  console.log('[seed-venues] Done.');
}

main().catch((err) => {
  console.error('[seed-venues] Fatal error:', err);
  process.exit(1);
});
