-- Venue seeding script for Supabase SQL Editor
-- Run this directly in your Supabase dashboard > SQL Editor

-- Insert venues with deduplication (upsert based on name+city)
INSERT INTO venues (name, city, region, category, type, address, how_to_find, vibe, known_for, description, latitude, longitude, website, instagram)
VALUES
-- Calgary Speakeasies
('Betty Lou''s Library', 'Calgary', NULL, 'speakeasy', 'classic jazz library', NULL, 'Unmarked door off 17th Ave SW alley. Reservation required; door code sent by email.', 'Intimate, dark, romantic 1920s jazz library with live piano and no-phone policy', 'Expertly crafted classic cocktails and curated menu', NULL, NULL, NULL, NULL, NULL),
('Shelter', 'Calgary', NULL, 'speakeasy', 'apothecary', NULL, 'Look for the "Canadian Ace" sign on 1st St SW; enter via unmarked black door', 'Moody basement bunker vibe', 'Innovative cocktails with unique ingredients', NULL, NULL, NULL, NULL, NULL),
('The Wednesday Room', 'Calgary', NULL, 'bar', 'upstairs hideaway', NULL, 'Enter Native Tongues Taqueria, walk to back staircase and go up', 'Lively, stylish, great for groups', 'Mezcal and tequila-based cocktails', NULL, NULL, NULL, NULL, NULL),
('Mini Mall', 'Calgary', NULL, 'speakeasy', 'quirky', NULL, 'Inside the Janitor''s Closet at the back of Crack Macs noodle bar on 10th St NW', 'Fun, irreverent, blink-and-you-miss-it', 'Short, creative cocktail list and surprising entrance', NULL, NULL, NULL, NULL, NULL),
('Bridget Bar', 'Calgary', NULL, 'bar', 'subterranean', NULL, 'Descend stairs next to Model Milk on 17th Ave SW', 'Cool, dark basement with excellent sound', 'Late-night cocktails and DJs', NULL, NULL, NULL, NULL, NULL),
('The Blind Beggar', 'Calgary', NULL, 'speakeasy', 'pub-style', NULL, 'Enter through red phone booth inside the main pub on 4th St SW', 'Cozy British-inspired hideaway', 'Large Scotch and whisky selection', NULL, NULL, NULL, NULL, NULL),

-- Edmonton Speakeasies
('Clementine Cocktail House', 'Edmonton', NULL, 'speakeasy', NULL, NULL, 'Chinatown back alley, neon "Clementine"; enter through unmarked industrial door', 'Sprawling, impeccably designed hidden grand space', 'Iconic cocktail program', NULL, NULL, NULL, NULL, NULL),
('The Cocktail Loft', 'Edmonton', NULL, 'speakeasy', 'reservations-only', NULL, 'Above the Mayfair on Jasper Ave; reservation yields entry instructions', 'Small, sophisticated, quiet lounge', 'Bespoke, personalized cocktails', NULL, NULL, NULL, NULL, NULL),
('The Den at River City Revival House', 'Edmonton', NULL, 'speakeasy', 'bookcase secret', NULL, 'Inside River City Revival House; hidden sliding bookcase door', 'Cozy, intimate, Prohibition club feel', 'Exclusive cocktail menu different from the restaurant', NULL, NULL, NULL, NULL, NULL),
('Honi Honi Tiki Lounge', 'Edmonton', NULL, 'bar', 'tiki', NULL, 'Downstairs beneath The Common on 109th St', 'Transportive Polynesian tiki decor', 'Elaborate shareable tiki bowls with flaming garnishes', NULL, NULL, NULL, NULL, NULL),
('The Bothy Wine & Whisky Bar', 'Edmonton', NULL, 'bar', 'wine & whisky', NULL, 'Tucked on 105th St next to Tiramisu Bistro', 'Warm, rustic, intimate Scottish lodge feel', 'Enormous whisky selection; curated wines by the glass', NULL, NULL, NULL, NULL, NULL),

-- Southern Alberta & Calgary area
('Rouge Restaurant', 'Calgary', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Refined Canadian cuisine in historic Inglewood house; garden patio', NULL, NULL, NULL, NULL, NULL),
('Japanese Village', 'Calgary', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Iconic basement teppanyaki', NULL, NULL, NULL, NULL, NULL),
('The Himalayan', 'Canmore', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Authentic Nepalese & Indian; momos', NULL, NULL, NULL, NULL, NULL),
('The Grizzly Paw Brewing Co. — Tank 310', 'Canmore', NULL, 'bar', NULL, NULL, NULL, NULL, 'Craft beer and elevated pub grub', NULL, NULL, NULL, NULL, NULL),
('The Cinnamon Bear', 'Waterton', NULL, 'cafe', NULL, NULL, NULL, NULL, 'Homemade pies in tiny park café', NULL, NULL, NULL, NULL, NULL),
('Phô Bình Minh', 'Calgary', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Beloved authentic pho in strip mall', NULL, NULL, NULL, NULL, NULL),
('Alumni Sandwiches', 'Calgary', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Creative sandwiches in industrial area', NULL, NULL, NULL, NULL, NULL),
('Charbar', 'Calgary', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Argentinian-inspired; rooftop patio with Bow River views', NULL, NULL, NULL, NULL, NULL),
('Pigeonhole', 'Calgary', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Tiny wine bar; innovative small plates', NULL, NULL, NULL, NULL, NULL),
('Paradise Valley Garden & Sushi', 'Airdrie', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Indoor garden setting with koi ponds; excellent sushi', NULL, NULL, NULL, NULL, NULL),
('The Jester''s Court', 'Drumheller', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Quirky café/pub in the badlands', NULL, NULL, NULL, NULL, NULL),

-- Central Alberta & Rockies
('Bear Street Tavern', 'Banff', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Famous pizzas; great atmosphere', NULL, NULL, NULL, NULL, NULL),
('The Balkan Restaurant', 'Canmore', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Authentic family-run Greek', NULL, NULL, NULL, NULL, NULL),
('The Sunflower Café', 'Canmore', NULL, 'cafe', NULL, NULL, NULL, NULL, 'Healthy, affordable breakfast/lunch', NULL, NULL, NULL, NULL, NULL),
('The Other Paw', 'Banff', NULL, 'cafe', NULL, NULL, NULL, NULL, 'Great pastries and coffee; less crowded', NULL, NULL, NULL, NULL, NULL),
('Fiddle River Restaurant', 'Jasper', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Seafood and regional cuisine; mountain views', NULL, NULL, NULL, NULL, NULL),
('The Spice Joint', 'Jasper', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Indian and Nepalese food', NULL, NULL, NULL, NULL, NULL),
('The Grizzly House', 'Banff', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Legendary fondue & exotic meats', NULL, NULL, NULL, NULL, NULL),
('The Crossing Resort', 'Saskatchewan River Crossing', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Surprisingly good meals in remote corridor', NULL, NULL, NULL, NULL, NULL),
('The Siding Café', 'Lacombe', NULL, 'cafe', NULL, NULL, NULL, NULL, 'Historic railway station café', NULL, NULL, NULL, NULL, NULL),

-- Northern Alberta
('The Black Jack''s Saloon', 'Val Quentin', NULL, 'bar', NULL, NULL, NULL, NULL, 'Massive burgers; lakeside legend', NULL, NULL, NULL, NULL, NULL),
('Tony''s Pizza Palace', 'Edmonton', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Old-school Italian-Canadian since 1964', NULL, NULL, NULL, NULL, NULL),
('The Bistro', 'Grande Prairie', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Local ingredients; creative dishes', NULL, NULL, NULL, NULL, NULL),
('La Crema', 'Edmonton', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Spanish restaurant & dessert bar; intimate', NULL, NULL, NULL, NULL, NULL),
('DOSC', 'Edmonton', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Steakhouse + coffee in moody basement', NULL, NULL, NULL, NULL, NULL),
('Amaranto Italian Pantry & Café', 'Edmonton', NULL, 'cafe', NULL, NULL, NULL, NULL, 'Italian grocery & café; sandwiches & pasta', NULL, NULL, NULL, NULL, NULL),
('The Red Ox Inn', 'Edmonton', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Intimate fine dining classic', NULL, NULL, NULL, NULL, NULL),
('The Moose''s Caboose', 'Wabamun', NULL, 'cafe', NULL, NULL, NULL, NULL, 'Hearty breakfasts; friendly atmosphere', NULL, NULL, NULL, NULL, NULL),
('Brewsters Brewing Company', 'Fort McMurray', NULL, 'bar', NULL, NULL, NULL, NULL, 'Community staple for pub food & beer', NULL, NULL, NULL, NULL, NULL),

-- Prairie & Eastern Alberta
('The Turquoise Barn', 'Vegreville', NULL, 'cafe', NULL, NULL, NULL, NULL, 'Historic building; Ukrainian specialties', NULL, NULL, NULL, NULL, NULL),
('The Black Diamond Hotel — The Westwood', 'Black Diamond', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Local, seasonal ingredients; unassuming spot', NULL, NULL, NULL, NULL, NULL),
('The Chuckwagon Café', 'Turner Valley', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Classic diner; huge breakfasts', NULL, NULL, NULL, NULL, NULL),
('Ukrainian Cultural Heritage Village — Riverside Cafe', 'Lamont County', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Authentic historical Ukrainian meals', NULL, NULL, NULL, NULL, NULL),
('Whif''s Flapjack House', 'Drumheller', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Pancake flights; family-friendly', NULL, NULL, NULL, NULL, NULL),
('The Rosebud Café', 'Rosebud', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Pre-show meals in quaint setting', NULL, NULL, NULL, NULL, NULL),
('Mighty Moose Pizza', 'Fort Saskatchewan', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Some of the best pizza in Edmonton metro', NULL, NULL, NULL, NULL, NULL),

-- Brand New & Trendy / Noteworthy (2023/2024)
('Pom Pom', 'Edmonton', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Trendy sandwiches and salads on 124th St', NULL, NULL, NULL, NULL, NULL),
('Phatbar', 'Edmonton', NULL, 'restaurant', 'izakaya & wine bar', NULL, NULL, NULL, 'Shareable plates; natural wine', NULL, NULL, NULL, NULL, NULL),
('RGE RD', 'Edmonton', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'New Gateway Blvd location; prairie cuisine', NULL, NULL, NULL, NULL, NULL),
('Orchard', 'Calgary', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Shareable plates; strong wine list', NULL, NULL, NULL, NULL, NULL),
('Nupo', 'Calgary', NULL, 'restaurant', 'omakase sushi', NULL, NULL, NULL, 'Intimate sushi bar inside the Cambie', NULL, NULL, NULL, NULL, NULL),
('Calle Mexico', 'Edmonton', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'New colourful Calgary Trail location; authentic tacos', NULL, NULL, NULL, NULL, NULL),
('The Deane House', 'Calgary', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Historic riverside fine dining; hyper-local', NULL, NULL, NULL, NULL, NULL),
('Scratch Breakfast', 'Edmonton', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Modern breakfast; from-scratch meals', NULL, NULL, NULL, NULL, NULL),
('SFC (Southern Fried Chicken)', 'Edmonton', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Nashville hot, Korean and classic buttermilk fried chicken', NULL, NULL, NULL, NULL, NULL),
('The Butternut Tree', 'Edmonton', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'New downtown Ultima location; Canadian ingredients', NULL, NULL, NULL, NULL, NULL),

-- Bars & Cocktail Lounges / Hidden Gems
('The Ordinary', 'Edmonton', NULL, 'bar', NULL, NULL, NULL, NULL, 'Swanky cocktails and oysters on 104th St', NULL, NULL, NULL, NULL, NULL),
('Bodega Taps & Tales', 'Edmonton', NULL, 'bar', 'tapas & beer bar', NULL, NULL, NULL, 'Rotating craft taps; Spanish small plates', NULL, NULL, NULL, NULL, NULL),
('Tzin Wine & Tapas', 'Edmonton', NULL, 'restaurant', 'tapas', NULL, NULL, NULL, 'Tiny, legendary spot for wine lovers', NULL, NULL, NULL, NULL, NULL),
('Swiss2Go', 'Edmonton', NULL, 'cafe', NULL, NULL, NULL, NULL, 'European deli & café; sandwiches and chocolate', NULL, NULL, NULL, NULL, NULL),
('The Black Pearl', 'Edmonton', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Seafood shack & oyster bar on 109th', NULL, NULL, NULL, NULL, NULL),
('Kanto 98 St. Food', 'Edmonton', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Authentic Filipino stall; legit flavours', NULL, NULL, NULL, NULL, NULL),
('La Petite Iza', 'Edmonton', NULL, 'restaurant', 'French bistro', NULL, NULL, NULL, 'Perfect French classics', NULL, NULL, NULL, NULL, NULL),
('Dang Good', 'Edmonton', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Korean stall inside H‑Mart North', NULL, NULL, NULL, NULL, NULL),

-- Food Trucks (city varies; use Edmonton as default hub)
('The Local Omnivore (Truck)', 'Edmonton', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Massive Trailer Park sandwich', NULL, NULL, NULL, NULL, NULL),
('Drift Food Truck', 'Edmonton', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Globally-inspired street food', NULL, NULL, NULL, NULL, NULL),
('El Fogon Tacos (Truck)', 'Edmonton', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Authentic Mexican street tacos', NULL, NULL, NULL, NULL, NULL),
('Smoke & Ash BBQ (Truck)', 'Edmonton', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'Texas-style BBQ; tender brisket', NULL, NULL, NULL, NULL, NULL),

-- Worth the Short Drive (Edmonton area)
('Bianco', 'Sherwood Park', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'House-made pasta; elegant dishes', NULL, NULL, NULL, NULL, NULL),
('Chartier', 'Beaumont', NULL, 'restaurant', NULL, NULL, NULL, NULL, 'French-Canadian; famed brunch', NULL, NULL, NULL, NULL, NULL),
('The Columbian Coffee Co. & Eatery', 'Sherwood Park', NULL, 'cafe', NULL, NULL, NULL, NULL, 'Excellent coffee; breakfast & lunch', NULL, NULL, NULL, NULL, NULL),
('Sugar Swing Lounge — Cocktail Bar', 'Sherwood Park', NULL, 'bar', NULL, NULL, NULL, NULL, 'Hidden cocktail bar with small plates', NULL, NULL, NULL, NULL, NULL),

-- New & Sweet Treats / Cafés
('Koffie Works', 'Edmonton', NULL, 'cafe', NULL, NULL, NULL, NULL, 'Minimalist brew methods; top-tier coffee', NULL, NULL, NULL, NULL, NULL),
('Swirl Ice Cream', 'Edmonton', NULL, 'cafe', NULL, NULL, NULL, NULL, 'Artisan ice cream; rotating flavours', NULL, NULL, NULL, NULL, NULL),
('The Art of Cake', 'Edmonton', NULL, 'cafe', NULL, NULL, NULL, NULL, 'Stunning cakes & pastries', NULL, NULL, NULL, NULL, NULL),
('Lock Stock Coffee', 'Edmonton', NULL, 'cafe', NULL, NULL, NULL, NULL, 'Industrial-chic coffee bar', NULL, NULL, NULL, NULL, NULL),
('Doughnut Party', 'Edmonton', NULL, 'cafe', NULL, NULL, NULL, NULL, 'Creative cake doughnuts; multiple locations', NULL, NULL, NULL, NULL, NULL)

ON CONFLICT (name, city) DO UPDATE SET
  region = EXCLUDED.region,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  address = EXCLUDED.address,
  how_to_find = EXCLUDED.how_to_find,
  vibe = EXCLUDED.vibe,
  known_for = EXCLUDED.known_for,
  description = EXCLUDED.description,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  website = EXCLUDED.website,
  instagram = EXCLUDED.instagram,
  updated_at = NOW();

-- Show results
SELECT COUNT(*) as total_venues FROM venues;
SELECT category, COUNT(*) as count FROM venues GROUP BY category ORDER BY count DESC;