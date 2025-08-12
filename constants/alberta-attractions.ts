export interface AlbertaAttraction {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  description: string;
  category:
    | 'hiking'
    | 'hotspring'
    | 'hidden-gem'
    | 'cycling'
    | 'walking'
    | 'adventure'
    | 'sightseeing'
    | 'accommodation'
    | 'food'
    | 'camping'
    | 'rv-camping'
    | 'fishing'
    | 'waterfall'
    | 'birdwatching'
    | 'river'
    | 'lake'
    | 'foodtruck'
    | 'scenic-flight'
    | 'winery'
    | 'winery-tour'
    | 'ski'
    | 'snowmobile'
    | 'ice-skating'
    | 'horseback'
    | 'show'
    | 'winter-festival';
  difficulty?: 'easy' | 'moderate' | 'difficult' | 'expert';
  season: string;
  image: string;
  rating: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$' | 'free';
  duration?: string;
  features: string[];
  nearestCity: string;
  distanceFromCalgary?: string;
  distanceFromEdmonton?: string;
  isHidden: boolean;
  tips?: string[];
  dangerousAnimals?: string[];
  safetyWarnings?: string[];
  bestTimeToVisit?: string;
  accessibility?: string;
  operatorName?: string;
  operatorUrl?: string;
  priceMinCad?: number;
  priceMaxCad?: number;
  pricingNotes?: string;
}

export const ALBERTA_HIKING_TRAILS: AlbertaAttraction[] = [
  {
    id: 'h1',
    name: 'Iceline Trail',
    location: 'Yoho National Park',
    coordinates: { lat: 51.4254, lng: -116.4816 },
    description:
      'Spectacular glacier views and waterfalls. One of the most rewarding day hikes in the Rockies.',
    category: 'hiking',
    difficulty: 'difficult',
    season: 'June - September',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    rating: 4.9,
    priceRange: 'free',
    duration: '6-8 hours',
    features: ['Glacier views', 'Waterfalls', 'Alpine meadows', 'Wildlife'],
    nearestCity: 'Field, BC',
    distanceFromCalgary: '3.5 hours',
    distanceFromEdmonton: '5 hours',
    isHidden: false,
    tips: [
      'Start early to avoid crowds',
      'Bring layers - weather changes quickly',
      'Microspikes recommended in early season',
    ],
  },
  {
    id: 'h2',
    name: 'Grassi Lakes Trail',
    location: 'Canmore',
    coordinates: { lat: 51.0918, lng: -115.3441 },
    description:
      'Two stunning turquoise lakes with ancient pictographs and incredible mountain views.',
    category: 'hiking',
    difficulty: 'easy',
    season: 'May - October',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    rating: 4.7,
    priceRange: 'free',
    duration: '2-3 hours',
    features: ['Turquoise lakes', 'Pictographs', 'Mountain views', 'Easy access'],
    nearestCity: 'Canmore',
    distanceFromCalgary: '1.5 hours',
    distanceFromEdmonton: '4.5 hours',
    isHidden: false,
    tips: [
      'Visit early morning for best photos',
      'Look for ancient pictographs on cliff face',
      'Great for families',
    ],
  },
  {
    id: 'h3',
    name: 'Rawson Lake Trail',
    location: 'Kananaskis Country',
    coordinates: { lat: 50.7234, lng: -115.2876 },
    description:
      'Hidden alpine lake surrounded by towering peaks. A local favorite with fewer crowds.',
    category: 'hiking',
    difficulty: 'moderate',
    season: 'June - September',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
    rating: 4.8,
    priceRange: 'free',
    duration: '4-5 hours',
    features: ['Alpine lake', 'Mountain reflections', 'Wildflowers', 'Less crowded'],
    nearestCity: 'Canmore',
    distanceFromCalgary: '2 hours',
    distanceFromEdmonton: '5 hours',
    isHidden: true,
    tips: [
      'Parking fills up quickly on weekends',
      'Bring bug spray in early summer',
      'Continue to Sarrail Ridge for advanced hikers',
    ],
  },
  {
    id: 'h4',
    name: 'Wilcox Pass Trail',
    location: 'Jasper National Park',
    coordinates: { lat: 52.2167, lng: -117.2267 },
    description:
      'Incredible views of the Athabasca Glacier and Columbia Icefield from above.',
    category: 'hiking',
    difficulty: 'moderate',
    season: 'July - September',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    rating: 4.9,
    priceRange: 'free',
    duration: '3-4 hours',
    features: ['Glacier views', 'Alpine meadows', 'Wildflowers', 'Panoramic vistas'],
    nearestCity: 'Jasper',
    distanceFromCalgary: '4 hours',
    distanceFromEdmonton: '3.5 hours',
    isHidden: false,
    tips: ['Best wildflowers in late July', 'Can be windy at the top', 'Great for photography'],
  },
  {
    id: 'h5',
    name: 'Troll Falls',
    location: 'Kananaskis Country',
    coordinates: { lat: 50.7789, lng: -115.1234 },
    description:
      'Easy family-friendly hike to a beautiful waterfall tucked behind a rock wall.',
    category: 'hiking',
    difficulty: 'easy',
    season: 'May - October',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    rating: 4.5,
    priceRange: 'free',
    duration: '1-2 hours',
    features: ['Waterfall', 'Family-friendly', 'Short hike', 'Year-round access'],
    nearestCity: 'Canmore',
    distanceFromCalgary: '1.5 hours',
    distanceFromEdmonton: '4.5 hours',
    isHidden: false,
    tips: ['Can be icy in winter', 'Great for kids', 'Combine with Stoney Squaw hike'],
  },
];

export const ALBERTA_HOT_SPRINGS: AlbertaAttraction[] = [
  {
    id: 'hs1',
    name: 'Miette Hot Springs',
    location: 'Jasper National Park',
    coordinates: { lat: 52.6667, lng: -117.8833 },
    description:
      'Hottest natural hot springs in the Canadian Rockies with stunning mountain views.',
    category: 'hotspring',
    season: 'May - October',
    image:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    rating: 4.6,
    priceRange: '$$',
    duration: '2-4 hours',
    features: ['Natural hot springs', 'Mountain views', 'Facilities', 'Changing rooms'],
    nearestCity: 'Jasper',
    distanceFromCalgary: '4.5 hours',
    distanceFromEdmonton: '4 hours',
    isHidden: false,
    tips: ['Book ahead in summer', 'Bring water bottle', 'Best at sunset'],
  },
  {
    id: 'hs2',
    name: 'Radium Hot Springs',
    location: 'Kootenay National Park',
    coordinates: { lat: 50.6167, lng: -116.0667 },
    description:
      'Relaxing mineral hot springs with year-round access and beautiful mountain backdrop.',
    category: 'hotspring',
    season: 'Year-round',
    image:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    rating: 4.4,
    priceRange: '$$',
    duration: '2-3 hours',
    features: ['Mineral springs', 'Year-round', 'Facilities', 'Spa services'],
    nearestCity: 'Radium Hot Springs',
    distanceFromCalgary: '3 hours',
    distanceFromEdmonton: '6 hours',
    isHidden: false,
    tips: ['Less crowded on weekdays', 'Combine with hiking in Kootenay NP', 'Spa packages available'],
  },
  {
    id: 'hs3',
    name: 'Ram Falls Hot Springs',
    location: 'Nordegg',
    coordinates: { lat: 52.4167, lng: -116.0833 },
    description:
      'Hidden natural hot springs requiring a short hike. Undeveloped and free!',
    category: 'hotspring',
    season: 'Year-round',
    image:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    rating: 4.2,
    priceRange: 'free',
    duration: '3-5 hours',
    features: ['Natural pools', 'Undeveloped', 'Free access', 'Scenic hike'],
    nearestCity: 'Nordegg',
    distanceFromCalgary: '3 hours',
    distanceFromEdmonton: '2.5 hours',
    isHidden: true,
    tips: ['Bring towel and water', 'Can be crowded on weekends', 'Respect the natural environment'],
  },
];

export const ALBERTA_HIDDEN_GEMS: AlbertaAttraction[] = [
  {
    id: 'hg1',
    name: 'Writing-on-Stone Provincial Park',
    location: 'Southern Alberta',
    coordinates: { lat: 49.0833, lng: -111.6167 },
    description:
      'Ancient petroglyphs and pictographs in a stunning badlands landscape.',
    category: 'hidden-gem',
    season: 'April - October',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    rating: 4.7,
    priceRange: '$',
    duration: 'Half day',
    features: ['Ancient rock art', 'Badlands', 'Guided tours', 'Camping'],
    nearestCity: 'Milk River',
    distanceFromCalgary: '3 hours',
    distanceFromEdmonton: '5.5 hours',
    isHidden: true,
    tips: [
      'Book guided tours in advance',
      'Bring sun protection',
      'Sacred site - be respectful',
    ],
  },
  {
    id: 'hg2',
    name: 'Abraham Lake (Bubble Lake)',
    location: 'David Thompson Highway',
    coordinates: { lat: 52.2167, lng: -116.5833 },
    description:
      'Frozen methane bubbles create stunning ice formations in winter.',
    category: 'hidden-gem',
    season: 'December - March (bubbles), Year-round',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
    rating: 4.8,
    priceRange: 'free',
    duration: '2-4 hours',
    features: ['Frozen bubbles', 'Photography', 'Mountain views', 'Unique phenomenon'],
    nearestCity: 'Nordegg',
    distanceFromCalgary: '3 hours',
    distanceFromEdmonton: '2.5 hours',
    isHidden: true,
    tips: [
      'Best bubbles January-February',
      'Ice can be dangerous - stay safe',
      'Bring warm clothes',
    ],
  },
  {
    id: 'hg3',
    name: 'Horseshoe Canyon',
    location: 'Drumheller',
    coordinates: { lat: 51.4167, lng: -112.7833 },
    description:
      'Dramatic badlands canyon with easy access and stunning geological formations.',
    category: 'hidden-gem',
    season: 'Year-round',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    rating: 4.6,
    priceRange: 'free',
    duration: '1-2 hours',
    features: ['Badlands', 'Easy access', 'Photography', 'Geological formations'],
    nearestCity: 'Drumheller',
    distanceFromCalgary: '1.5 hours',
    distanceFromEdmonton: '3 hours',
    isHidden: false,
    tips: [
      'Best light at sunrise/sunset',
      'Wear good shoes',
      'Combine with Royal Tyrrell Museum',
    ],
  },
  {
    id: 'hg4',
    name: 'Maligne Canyon Ice Walk',
    location: 'Jasper National Park',
    coordinates: { lat: 52.9167, lng: -117.9833 },
    description:
      'Winter ice walk through a frozen canyon with spectacular ice formations.',
    category: 'hidden-gem',
    season: 'December - March',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    rating: 4.9,
    priceRange: '$$',
    duration: '2-3 hours',
    features: ['Ice formations', 'Guided tours', 'Winter activity', 'Unique experience'],
    nearestCity: 'Jasper',
    distanceFromCalgary: '4 hours',
    distanceFromEdmonton: '3.5 hours',
    isHidden: false,
    tips: ['Book guided tour', 'Dress very warmly', 'Ice cleats provided'],
  },
];

export const ALBERTA_CYCLING_TRAILS: AlbertaAttraction[] = [
  {
    id: 'c1',
    name: 'Bow River Pathway',
    location: 'Calgary',
    coordinates: { lat: 51.0447, lng: -114.0719 },
    description:
      'Scenic urban pathway following the Bow River through downtown Calgary.',
    category: 'cycling',
    difficulty: 'easy',
    season: 'April - October',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    rating: 4.5,
    priceRange: 'free',
    duration: '1-3 hours',
    features: ['Urban pathway', 'River views', 'City skyline', 'Bike rentals available'],
    nearestCity: 'Calgary',
    distanceFromCalgary: '0 km',
    distanceFromEdmonton: '3 hours',
    isHidden: false,
    tips: ['Bike rentals downtown', 'Connect to other pathways', 'Great for families'],
  },
  {
    id: 'c2',
    name: 'Icefields Parkway',
    location: 'Banff to Jasper',
    coordinates: { lat: 52.1167, lng: -117.1667 },
    description:
      'One of the most scenic drives/rides in the world through the heart of the Rockies.',
    category: 'cycling',
    difficulty: 'expert',
    season: 'June - September',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    rating: 4.9,
    priceRange: 'free',
    duration: '2-5 days',
    features: ['Mountain views', 'Glaciers', 'Multi-day ride', 'Epic scenery'],
    nearestCity: 'Banff/Jasper',
    distanceFromCalgary: '1.5 hours to start',
    distanceFromEdmonton: '3.5 hours to start',
    isHidden: false,
    tips: [
      'Plan accommodation ahead',
      'Weather can change quickly',
      'Support vehicle recommended',
    ],
  },
];

export const ALBERTA_ACCOMMODATIONS: AlbertaAttraction[] = [
  {
    id: 'a1',
    name: 'Fairmont Banff Springs',
    location: 'Banff',
    coordinates: { lat: 51.1628, lng: -115.5736 },
    description: 'Iconic castle hotel in the heart of the Canadian Rockies.',
    category: 'accommodation',
    season: 'Year-round',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    rating: 4.7,
    priceRange: '$$$$',
    features: ['Luxury hotel', 'Spa', 'Golf course', 'Multiple restaurants'],
    nearestCity: 'Banff',
    distanceFromCalgary: '1.5 hours',
    distanceFromEdmonton: '4.5 hours',
    isHidden: false,
    tips: ['Book well in advance', 'Afternoon tea is famous', 'Free shuttle to downtown'],
  },
  {
    id: 'a2',
    name: 'HI-Canmore',
    location: 'Canmore',
    coordinates: { lat: 51.0918, lng: -115.3441 },
    description: 'Modern hostel with stunning mountain views and great amenities.',
    category: 'accommodation',
    season: 'Year-round',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    rating: 4.4,
    priceRange: '$',
    features: ['Budget-friendly', 'Mountain views', 'Kitchen facilities', 'Common areas'],
    nearestCity: 'Canmore',
    distanceFromCalgary: '1.5 hours',
    distanceFromEdmonton: '4.5 hours',
    isHidden: false,
    tips: ['Book private rooms early', 'Great base for hiking', 'Free parking'],
  },
  {
    id: 'a3',
    name: 'Tunnel Mountain Village Campground',
    location: 'Banff',
    coordinates: { lat: 51.1667, lng: -115.55 },
    description:
      'Popular campground with RV and tent sites near Banff townsite.',
    category: 'camping',
    season: 'May - October',
    image:
      'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=400&h=300&fit=crop',
    rating: 4.2,
    priceRange: '$',
    features: ['RV sites', 'Tent camping', 'Showers', 'Near town'],
    nearestCity: 'Banff',
    distanceFromCalgary: '1.5 hours',
    distanceFromEdmonton: '4.5 hours',
    isHidden: false,
    tips: ['Reserve well ahead', 'Shuttle to downtown', 'Bear safety important'],
  },
];

export const ALBERTA_FOOD_GEMS: AlbertaAttraction[] = [
  {
    id: 'f1',
    name: 'The Bison Restaurant',
    location: 'Banff',
    coordinates: { lat: 51.1784, lng: -115.5708 },
    description:
      'Farm-to-table restaurant featuring local Alberta ingredients and craft cocktails.',
    category: 'food',
    season: 'Year-round',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    rating: 4.6,
    priceRange: '$$$',
    features: ['Farm-to-table', 'Local ingredients', 'Craft cocktails', 'Cozy atmosphere'],
    nearestCity: 'Banff',
    distanceFromCalgary: '1.5 hours',
    distanceFromEdmonton: '4.5 hours',
    isHidden: false,
    tips: ['Reservations recommended', 'Try the bison dishes', 'Great wine selection'],
    operatorUrl: 'https://thebison.ca/',
  },
  {
    id: 'f2',
    name: 'Symons Valley Ranch',
    location: 'Calgary',
    coordinates: { lat: 51.1667, lng: -114.1667 },
    description: 'Authentic ranch experience with Alberta beef and western hospitality.',
    category: 'food',
    season: 'Year-round',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    rating: 4.5,
    priceRange: '$$',
    features: ['Ranch experience', 'Alberta beef', 'Western atmosphere', 'Family-friendly'],
    nearestCity: 'Calgary',
    distanceFromCalgary: '30 minutes',
    distanceFromEdmonton: '3 hours',
    isHidden: true,
    tips: ['Call ahead for tours', 'Great for groups', 'Authentic cowboy experience'],
  },
  {
    id: 'f3',
    name: 'Chuckwagon Cafe',
    location: 'Turner Valley',
    coordinates: { lat: 50.6677, lng: -114.2821 },
    description:
      'Bright red barn-turned-café serving hand-ground aged beef burgers, scratch-made fries, and pies in a countryside setting.',
    category: 'food',
    season: 'Year-round',
    image:
      'https://images.unsplash.com/photo-1551782450-17144c3a8f5e?w=400&h=300&fit=crop',
    rating: 4.7,
    priceRange: '$$',
    features: ['Burgers', 'Scratch-made pies', 'Countryside vibe'],
    nearestCity: 'Turner Valley',
    distanceFromCalgary: '1 hour',
    distanceFromEdmonton: '4 hours',
    isHidden: true,
    operatorUrl: 'https://www.facebook.com/chuckwagoncafe/',
  },
  {
    id: 'f4',
    name: 'Dining Car at Aspen Crossing',
    location: 'Mossleigh',
    coordinates: { lat: 50.5826, lng: -113.4572 },
    description:
      'Dine inside a restored 1887 railcar with comfort food and nostalgic train-era vibes.',
    category: 'food',
    season: 'Year-round',
    image:
      'https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=400&h=300&fit=crop',
    rating: 4.6,
    priceRange: '$$',
    features: ['Historic railcar', 'Comfort food', 'Nostalgia'],
    nearestCity: 'Mossleigh',
    distanceFromCalgary: '1 hour',
    distanceFromEdmonton: '3.5 hours',
    isHidden: true,
    operatorUrl: 'https://www.aspencrossing.com/dining',
  },
  {
    id: 'f5',
    name: 'The Overlander Mountain Lodge',
    location: 'Jasper East',
    coordinates: { lat: 53.2611, lng: -117.8123 },
    description:
      'Lodge restaurant with refined seasonal cuisine and sweeping views of the Miette Range and Athabasca Valley.',
    category: 'food',
    season: 'Year-round',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
    rating: 4.6,
    priceRange: '$$$',
    features: ['Mountain views', 'Seasonal menu', 'Lodge setting'],
    nearestCity: 'Jasper',
    distanceFromCalgary: '5 hours',
    distanceFromEdmonton: '3.5 hours',
    isHidden: false,
    operatorUrl: 'https://overlandermountainlodge.com/dining/',
  },
  {
    id: 'f6',
    name: 'Longview Steakhouse',
    location: 'Longview',
    coordinates: { lat: 50.4834, lng: -114.2357 },
    description:
      'Elevated steakhouse fare with a classic rural backdrop for a memorable, low-key night out.',
    category: 'food',
    season: 'Year-round',
    image:
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop',
    rating: 4.8,
    priceRange: '$$$',
    features: ['Steakhouse', 'Rural setting', 'Date night'],
    nearestCity: 'Longview',
    distanceFromCalgary: '1 hour',
    distanceFromEdmonton: '4 hours',
    isHidden: false,
    operatorUrl: 'https://longviewsteakhouse.com/',
  },
  {
    id: 'f7',
    name: 'Silver Slate Steakhouse',
    location: 'Stavely',
    coordinates: { lat: 50.1665, lng: -113.6367 },
    description:
      'Cozy steakhouse beside an equestrian centre, serving hearty, old-fashioned meals.',
    category: 'food',
    season: 'Year-round',
    image:
      'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400&h=300&fit=crop',
    rating: 4.5,
    priceRange: '$$',
    features: ['Hearty meals', 'Equestrian setting', 'Cozy vibe'],
    nearestCity: 'Stavely',
    distanceFromCalgary: '1.5 hours',
    distanceFromEdmonton: '4 hours',
    isHidden: true,
    operatorUrl: 'https://www.silverslatearena.com/steakhouse',
  },
  {
    id: 'f8',
    name: 'The Crossing at Ghost River',
    location: 'Near Cochrane',
    coordinates: { lat: 51.2796, lng: -114.7753 },
    description:
      'Secluded retreat with occasional public dinners featuring seasonal dishes in a serene forested setting.',
    category: 'food',
    season: 'Seasonal',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    rating: 4.6,
    priceRange: '$$$',
    features: ['Seasonal dinners', 'Forest setting', 'Special occasions'],
    nearestCity: 'Cochrane',
    distanceFromCalgary: '1 hour',
    distanceFromEdmonton: '3.5 hours',
    isHidden: true,
    operatorUrl: 'https://www.crossingexperience.ca/',
  },
  {
    id: 'f9',
    name: 'Chartier',
    location: 'Beaumont',
    coordinates: { lat: 53.3493, lng: -113.4156 },
    description:
      'Québecois-inspired spot known for rustic vibe, house-baked bread, generous portions, and delightful cocktails.',
    category: 'food',
    season: 'Year-round',
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
    rating: 4.7,
    priceRange: '$$',
    features: ['House-baked bread', 'Québecois-inspired', 'Cocktails'],
    nearestCity: 'Edmonton',
    distanceFromCalgary: '3 hours',
    distanceFromEdmonton: '30 minutes',
    isHidden: false,
    operatorUrl: 'https://dinechartier.com/',
  },
  {
    id: 'f10',
    name: 'Orso Trattoria',
    location: 'Jasper',
    coordinates: { lat: 52.8734, lng: -118.0814 },
    description:
      'Northern Italian restaurant with handmade pasta and imported ingredients, enhanced by lake and mountain views.',
    category: 'food',
    season: 'Year-round',
    image:
      'https://images.unsplash.com/photo-1529042355633-0f06f01cf1b4?w=400&h=300&fit=crop',
    rating: 4.6,
    priceRange: '$$$',
    features: ['Handmade pasta', 'Italian', 'Scenic views'],
    nearestCity: 'Jasper',
    distanceFromCalgary: '4.5 hours',
    distanceFromEdmonton: '3.5 hours',
    isHidden: false,
    operatorUrl: 'https://www.jasper-park-lodge.com/dine/orso-trattoria/',
  },
  {
    id: 'f11',
    name: 'Ellis Bird Farm Tea House',
    location: 'Lacombe',
    coordinates: { lat: 52.4667, lng: -113.7333 },
    description:
      'Tea house at a working bird conservation farm offering simple local fare ideal for exploring the grounds.',
    category: 'food',
    season: 'May–September',
    image:
      'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=400&h=300&fit=crop',
    rating: 4.5,
    priceRange: '$',
    features: ['Tea house', 'Conservation farm', 'Family-friendly'],
    nearestCity: 'Lacombe',
    distanceFromCalgary: '2 hours',
    distanceFromEdmonton: '1.5 hours',
    isHidden: true,
    operatorUrl: 'https://www.ellisbirdfarm.ca/',
  },
  {
    id: 'f12',
    name: 'Prairie Gardens Farm Kitchen',
    location: 'Bon Accord',
    coordinates: { lat: 53.8307, lng: -113.4188 },
    description:
      'Farm-to-table kitchen hosting dinners cooked with produce from its own CSA gardens.',
    category: 'food',
    season: 'Seasonal',
    image:
      'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?w=400&h=300&fit=crop',
    rating: 4.6,
    priceRange: '$$',
    features: ['Farm-to-table', 'CSA produce', 'Pop-up dinners'],
    nearestCity: 'Edmonton',
    distanceFromCalgary: '3 hours',
    distanceFromEdmonton: '45 minutes',
    isHidden: true,
    operatorUrl: 'https://prairiegardens.org/',
  },
  {
    id: 'f13',
    name: 'Jack’s Burger Shack',
    location: 'St. Albert',
    coordinates: { lat: 53.6305, lng: -113.6256 },
    description:
      'Beloved burger spot with custom-baked buns and indulgent milkshakes in playful flavors.',
    category: 'food',
    season: 'Year-round',
    image:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop',
    rating: 4.7,
    priceRange: '$',
    features: ['Burgers', 'Milkshakes', 'Casual'],
    nearestCity: 'Edmonton',
    distanceFromCalgary: '3 hours',
    distanceFromEdmonton: '20 minutes',
    isHidden: false,
    operatorUrl: 'https://jacksburgershack.com/',
  },
  {
    id: 'f14',
    name: 'Last Chance Saloon',
    location: 'Wayne (near Drumheller)',
    coordinates: { lat: 51.4206, lng: -112.5852 },
    description:
      'Character-rich saloon in a 1913 hotel with live music, homemade pies, mason-jar cocktails, and quirky décor.',
    category: 'food',
    season: 'Year-round',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    rating: 4.6,
    priceRange: '$$',
    features: ['Live music', 'Homemade pies', 'Historic venue'],
    nearestCity: 'Drumheller',
    distanceFromCalgary: '1.5 hours',
    distanceFromEdmonton: '3 hours',
    isHidden: false,
    operatorUrl: 'https://lastchancesaloon.ca/',
  },
  {
    id: 'f15',
    name: 'Camp Cookhouse and General Store',
    location: 'Elkwater, Cypress Hills',
    coordinates: { lat: 49.6547, lng: -110.2853 },
    description:
      'Cozy camp-style café with homemade meals and nostalgic general-store atmosphere.',
    category: 'food',
    season: 'Year-round',
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
    rating: 4.5,
    priceRange: '$$',
    features: ['Homemade meals', 'Camp vibe', 'Nostalgia'],
    nearestCity: 'Medicine Hat',
    distanceFromCalgary: '3 hours',
    distanceFromEdmonton: '5 hours',
    isHidden: true,
    operatorUrl: 'https://campcookhouse.com/',
  },
  {
    id: 'f16',
    name: 'PD3 by Blake',
    location: 'Canmore',
    coordinates: { lat: 51.089, lng: -115.352 },
    description:
      'Former food bus turned eatery serving Asian-style street eats with second-level outdoor seating.',
    category: 'food',
    season: 'Year-round',
    image:
      'https://images.unsplash.com/photo-1543332164-6e82f355bad8?w=400&h=300&fit=crop',
    rating: 4.6,
    priceRange: '$$',
    features: ['Street eats', 'Outdoor seating', 'Casual'],
    nearestCity: 'Canmore',
    distanceFromCalgary: '1.5 hours',
    distanceFromEdmonton: '4.5 hours',
    isHidden: false,
    operatorUrl: 'https://blakerestaurants.com/pd3/',
  },
  {
    id: 'f17',
    name: 'Le Fournil',
    location: 'Canmore',
    coordinates: { lat: 51.089, lng: -115.352 },
    description:
      'French bakery offering croissants, baguettes, quiches, and more—perfect for breakfast or trail snacks.',
    category: 'food',
    season: 'Year-round',
    image:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=300&fit=crop',
    rating: 4.7,
    priceRange: '$',
    features: ['French bakery', 'Pastries', 'Grab-and-go'],
    nearestCity: 'Canmore',
    distanceFromCalgary: '1.5 hours',
    distanceFromEdmonton: '4.5 hours',
    isHidden: false,
    operatorUrl: 'https://www.lefournil.ca/',
  },
  {
    id: 'f18',
    name: 'The Westwood',
    location: 'Black Diamond',
    coordinates: { lat: 50.6897, lng: -114.2368 },
    description:
      'Trendy café with salads, sandwiches, farmers’ plates, and a summer makers-and-growers market next door.',
    category: 'food',
    season: 'Year-round',
    image:
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
    rating: 4.5,
    priceRange: '$$',
    features: ['Café', 'Local market', 'Light fare'],
    nearestCity: 'Black Diamond',
    distanceFromCalgary: '1 hour',
    distanceFromEdmonton: '4 hours',
    isHidden: true,
  },
  {
    id: 'f19',
    name: 'Edgar Farms',
    location: 'Innisfail',
    coordinates: { lat: 52.0334, lng: -113.9509 },
    description:
      'Family-run farm store with fresh produce, grass-fed beef, Saskatoon and rhubarb pies, and preserves.',
    category: 'food',
    season: 'May–October',
    image:
      'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=300&fit=crop',
    rating: 4.6,
    priceRange: '$',
    features: ['Farm store', 'Fresh produce', 'Pies'],
    nearestCity: 'Red Deer',
    distanceFromCalgary: '1.5 hours',
    distanceFromEdmonton: '1.5 hours',
    isHidden: true,
    operatorUrl: 'https://edgarfarms.com/',
  },
  {
    id: 'f20',
    name: 'Roy’s Place',
    location: 'Claresholm',
    coordinates: { lat: 50.0204, lng: -113.5856 },
    description:
      'Famous highway stop for massive cinnamon buns the size of dinner plates—take-home frosting tubs included.',
    category: 'food',
    season: 'Year-round',
    image:
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
    rating: 4.5,
    priceRange: '$',
    features: ['Cinnamon buns', 'Road trip stop', 'Bakery'],
    nearestCity: 'Claresholm',
    distanceFromCalgary: '1.5 hours',
    distanceFromEdmonton: '4 hours',
    isHidden: false,
    operatorUrl: 'https://roysplace.ca/',
  },
  {
    id: 'f21',
    name: 'Zum’s Eatery and Mercantile',
    location: 'Waterton',
    coordinates: { lat: 49.0526, lng: -113.9108 },
    description:
      'Hidden gem serving beloved fried chicken and homemade pie in a relaxed seasonal setting.',
    category: 'food',
    season: 'Seasonal',
    image:
      'https://images.unsplash.com/photo-1481931715705-36f3f9a30f80?w=400&h=300&fit=crop',
    rating: 4.5,
    priceRange: '$$',
    features: ['Fried chicken', 'Homemade pie', 'Seasonal'],
    nearestCity: 'Waterton',
    distanceFromCalgary: '3 hours',
    distanceFromEdmonton: '6 hours',
    isHidden: true,
    operatorUrl: 'https://zumswaterton.com/',
  },
];

import { ALL_ADDITIONAL_ATTRACTIONS } from './additional-alberta-attractions';

export const ALL_ALBERTA_ATTRACTIONS = [
  ...ALBERTA_HIKING_TRAILS,
  ...ALBERTA_HOT_SPRINGS,
  ...ALBERTA_HIDDEN_GEMS,
  ...ALBERTA_CYCLING_TRAILS,
  ...ALBERTA_ACCOMMODATIONS,
  ...ALBERTA_FOOD_GEMS,
  ...ALL_ADDITIONAL_ATTRACTIONS,
];

export const getAttractionsByCategory = (category: string) => {
  return ALL_ALBERTA_ATTRACTIONS.filter(
    (attraction) => attraction.category === category,
  );
};

export const getHiddenGems = () => {
  return ALL_ALBERTA_ATTRACTIONS.filter((attraction) => attraction.isHidden);
};

export const getAttractionsByPriceRange = (priceRange: string) => {
  return ALL_ALBERTA_ATTRACTIONS.filter(
    (attraction) => attraction.priceRange === priceRange,
  );
};

export const getAttractionsByDifficulty = (difficulty: string) => {
  return ALL_ALBERTA_ATTRACTIONS.filter(
    (attraction) => attraction.difficulty === difficulty,
  );
};

export const searchAttractions = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return ALL_ALBERTA_ATTRACTIONS.filter(
    (attraction) =>
      attraction.name.toLowerCase().includes(lowercaseQuery) ||
      attraction.description.toLowerCase().includes(lowercaseQuery) ||
      attraction.location.toLowerCase().includes(lowercaseQuery) ||
      attraction.features.some((feature) =>
        feature.toLowerCase().includes(lowercaseQuery),
      ),
  );
};