import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Phone, Clock, ExternalLink, Star } from 'lucide-react-native';

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
    phone: '(780) 852-4111',
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
      seasonal: 'Occasional public dinners, seasonal operation',
    },
    cuisine: 'Fine Dining',
    rating: 4.8,
    priceRange: '$$$$',
    description:
      'A secluded retreat with occasional public dinners featuring seasonal dishes served in a serene forested setting—ideal for special occasions',
    specialties: ['Seasonal Dishes', 'Forest Setting', 'Special Occasions'],
  },
  {
    id: '17',
    name: 'Chartier',
    area: 'Rural - Beaumont',
    phone: '(780) 929-3202',
    website: 'https://chartierrestaurant.ca',
    hours: {
      weekdays: '5:00 PM - 9:00 PM',
      weekends: '5:00 PM - 10:00 PM',
      seasonal: 'Closed Mondays, hours may vary seasonally',
    },
    cuisine: 'Québecois',
    rating: 4.6,
    priceRange: '$$$',
    description:
      'A Québecois-inspired spot just outside Edmonton, known for its rustic vibe, house-baked bread, generous portions, and delightful cocktails',
    specialties: ['House-baked Bread', 'Québecois Cuisine', 'Craft Cocktails'],
  },
  {
    id: '18',
    name: 'Orso Trattoria',
    area: 'Jasper',
    phone: '(780) 852-3301',
    website: 'https://orsotrattoria.com',
    hours: {
      weekdays: '5:00 PM - 10:00 PM',
      weekends: '5:00 PM - 10:00 PM',
      seasonal: 'Seasonal operation, hours may vary',
    },
    cuisine: 'Italian',
    rating: 4.7,
    priceRange: '$$$',
    description:
      'Located lakeside, this Northern Italian gem serves handmade pasta and imported ingredients, enhanced by mountain views and even Peroni on tap',
    specialties: ['Handmade Pasta', 'Imported Ingredients', 'Lakeside Views'],
  },
  {
    id: '19',
    name: 'Ellis Bird Farm Tea House',
    area: 'Rural - Lacombe',
    phone: '(403) 885-4477',
    website: 'https://ellisbirdfarm.ca',
    hours: {
      weekdays: '10:00 AM - 4:00 PM',
      weekends: '10:00 AM - 5:00 PM',
      seasonal: 'Seasonal operation May-September, hours may vary',
    },
    cuisine: 'Cafe',
    rating: 4.3,
    priceRange: '$',
    description:
      'More than a café, this working bird conservation farm offers simple local fare and wicker-basketed treats perfect for exploring the grounds',
    specialties: ['Local Fare', 'Bird Conservation', 'Farm Setting'],
  },
  {
    id: '20',
    name: 'Prairie Gardens Farm Kitchen',
    area: 'Rural - Bon Accord',
    phone: '(780) 921-2272',
    website: 'https://prairiegardens.ca',
    hours: {
      weekdays: '6:00 PM - 9:00 PM',
      weekends: '6:00 PM - 9:00 PM',
      seasonal: 'Seasonal dinners, reservation required',
    },
    cuisine: 'Farm-to-Table',
    rating: 4.5,
    priceRange: '$$$',
    description:
      'A farm-to-table kitchen that hosts dinners cooked with produce from its own community-supported agriculture (CSA) gardens',
    specialties: ['CSA Gardens', 'Farm-fresh Produce', 'Community Dinners'],
  },
  {
    id: '21',
    name: "Jack's Burger Shack",
    area: 'St. Albert',
    phone: '(780) 460-3344',
    website: 'https://jacksburgershack.ca',
    hours: {
      weekdays: '11:00 AM - 9:00 PM',
      weekends: '11:00 AM - 10:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Burgers',
    rating: 4.4,
    priceRange: '$$',
    description:
      'Renowned for burgers on custom-baked buns and indulgent milkshakes (including cereal, orange creamsicle, Nutella flavors)—a local favorite with a playful twist',
    specialties: ['Custom-baked Buns', 'Specialty Milkshakes', 'Creative Flavors'],
  },
  {
    id: '22',
    name: 'Last Chance Saloon',
    area: 'Rural - Wayne (Near Drumheller)',
    phone: '(403) 823-2201',
    website: 'https://lastchancesaloon.ca',
    hours: {
      weekdays: '4:00 PM - 11:00 PM',
      weekends: '12:00 PM - 12:00 AM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Pub Food',
    rating: 4.6,
    priceRange: '$$',
    description:
      'A tiny, character-rich saloon housed in a 1913 hotel, featuring live music, homemade pies, mason-jar cocktails, and quirky décor like gunshot holes in the walls',
    specialties: ['Homemade Pies', 'Mason-jar Cocktails', 'Live Music'],
  },
  {
    id: '23',
    name: 'Camp Cookhouse and General Store',
    area: 'Rural - Elkwater (Cypress Hills)',
    phone: '(403) 893-3833',
    website: 'https://campcookhouse.ca',
    hours: {
      weekdays: '7:00 AM - 8:00 PM',
      weekends: '7:00 AM - 9:00 PM',
      seasonal: 'Seasonal operation, hours may vary',
    },
    cuisine: 'Comfort Food',
    rating: 4.3,
    priceRange: '$$',
    description:
      'A cozy camp-style café serving homemade meals—from bacon and bread to lunch and dinner—in a nostalgic, charming general-store atmosphere',
    specialties: ['Homemade Meals', 'General Store Atmosphere', 'Camp-style Cooking'],
  },
  {
    id: '24',
    name: 'PD3 by Blake',
    area: 'Canmore',
    phone: '(403) 678-6111',
    website: 'https://pd3byblake.com',
    hours: {
      weekdays: '11:30 AM - 9:00 PM',
      weekends: '11:30 AM - 10:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Asian Street Food',
    rating: 4.4,
    priceRange: '$$',
    description:
      'Once a food bus turned permanent eatery, PD3 serves Asian-style street eats from a second-level outdoor seating area with a fun, casual vibe',
    specialties: ['Asian Street Food', 'Outdoor Seating', 'Casual Atmosphere'],
  },
  {
    id: '25',
    name: 'Le Fournil',
    area: 'Canmore',
    phone: '(403) 678-8885',
    website: 'https://lefournil.ca',
    hours: {
      weekdays: '7:00 AM - 6:00 PM',
      weekends: '7:00 AM - 6:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'French Bakery',
    rating: 4.5,
    priceRange: '$$',
    description:
      'A delightful French bakery offering croissants, baguettes, quiches, and more—the perfect pit stop for breakfast or a trail snack',
    specialties: ['Fresh Croissants', 'Artisan Baguettes', 'French Pastries'],
  },
  {
    id: '26',
    name: 'The Westwood',
    area: 'Rural - Black Diamond',
    phone: '(403) 933-2226',
    website: 'https://thewestwoodcafe.ca',
    hours: {
      weekdays: '8:00 AM - 4:00 PM',
      weekends: '8:00 AM - 5:00 PM',
      seasonal: 'Summer market next door, hours may vary seasonally',
    },
    cuisine: 'Cafe',
    rating: 4.3,
    priceRange: '$$',
    description:
      "Trendy café featuring salads, sandwiches, farmers' plates, and a summer makers-and-growers market right next door",
    specialties: ["Farmers' Plates", 'Fresh Salads', 'Local Market'],
  },
  {
    id: '27',
    name: 'Edgar Farms',
    area: 'Rural - Innisfail',
    phone: '(403) 227-5525',
    website: 'https://edgarfarms.com',
    hours: {
      weekdays: '9:00 AM - 6:00 PM',
      weekends: '9:00 AM - 6:00 PM',
      seasonal: 'Seasonal produce availability, hours may vary',
    },
    cuisine: 'Farm Store',
    rating: 4.6,
    priceRange: '$$',
    description:
      'A family-run farm store known for fresh produce, grass-fed beef, Saskatoon berry and rhubarb pies, and preserves—a perfect rural treasure trove',
    specialties: ['Grass-fed Beef', 'Saskatoon Berry Pies', 'Fresh Preserves'],
  },
  {
    id: '28',
    name: "Roy's Place",
    area: 'Rural - Claresholm',
    phone: '(403) 625-3381',
    website: 'https://roysplace.ca',
    hours: {
      weekdays: '6:00 AM - 8:00 PM',
      weekends: '6:00 AM - 8:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Diner',
    rating: 4.7,
    priceRange: '$',
    description:
      'Famous highway stop celebrated for massive cinnamon buns the size of dinner plates, complete with take-home cream cheese frosting tubs',
    specialties: ['Giant Cinnamon Buns', 'Cream Cheese Frosting', 'Highway Classic'],
  },
  {
    id: '29',
    name: "Zum's Eatery and Mercantile",
    area: 'Rural - Waterton',
    phone: '(403) 859-2388',
    website: 'https://zumseatery.com',
    hours: {
      weekdays: '11:00 AM - 8:00 PM',
      weekends: '11:00 AM - 9:00 PM',
      seasonal: 'Seasonal operation May-September, hours may vary',
    },
    cuisine: 'Comfort Food',
    rating: 4.5,
    priceRange: '$$',
    description:
      'Hidden gem in a tiny town, serving beloved fried chicken and homemade pie in a relaxed seasonal setting',
    specialties: ['Fried Chicken', 'Homemade Pie', 'Small Town Charm'],
  },
  {
    id: '30',
    name: 'Willow Cafe',
    area: 'Rural - East Coulee',
    phone: '(403) 823-2220',
    website: 'https://willowcafe.ca',
    hours: {
      weekdays: '9:00 AM - 4:00 PM',
      weekends: '9:00 AM - 5:00 PM',
      seasonal: 'Seasonal operation, hours may vary',
    },
    cuisine: 'Cafe',
    rating: 4.2,
    priceRange: '$',
    description:
      'Housed within a preserved 1930s schoolhouse museum, this spot serves comforting homemade fare in a nostalgic setting',
    specialties: ['Homemade Fare', '1930s Schoolhouse Setting', 'Museum Atmosphere'],
  },
  {
    id: '31',
    name: 'Patricia Hotel & Water Hole',
    area: 'Rural - Patricia',
    phone: '(403) 378-4647',
    website: 'https://patriciahotel.ca',
    hours: {
      weekdays: '4:00 PM - 11:00 PM',
      weekends: '12:00 PM - 12:00 AM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Steakhouse',
    rating: 4.3,
    priceRange: '$$',
    description:
      'Cook your own steak over an open flame in a funky Old West saloon near Dinosaur Provincial Park',
    specialties: ['Cook Your Own Steak', 'Open Flame Grilling', 'Old West Atmosphere'],
  },
  {
    id: '32',
    name: 'Lake Agnes Teahouse',
    area: 'Lake Louise Area',
    phone: '(403) 522-3511',
    website: 'https://lakeagnesteahouse.com',
    hours: {
      weekdays: '9:00 AM - 6:00 PM',
      weekends: '9:00 AM - 6:00 PM',
      seasonal: 'Seasonal operation June-September, accessible via hike only',
    },
    cuisine: 'Tea House',
    rating: 4.6,
    priceRange: '$$',
    description:
      'Accessible via hike, this rustic tea stop on the Rockies trail offers stunning vistas and a cozy retreat',
    specialties: ['Mountain Views', 'Hiking Destination', 'Traditional Tea Service'],
  },
  {
    id: '33',
    name: 'Cilantro & Chive',
    area: 'Lacombe',
    phone: '(403) 782-3100',
    website: 'https://cilantroandchive.ca',
    hours: {
      weekdays: '11:00 AM - 9:00 PM',
      weekends: '11:00 AM - 10:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Contemporary',
    rating: 4.4,
    priceRange: '$$$',
    description:
      'Local-sourced cuisine in a trio of neighboring establishments known for quality and community atmosphere',
    specialties: ['Local-sourced Ingredients', 'Contemporary Cuisine', 'Community Atmosphere'],
  },
  {
    id: '34',
    name: "Sweet Capone's",
    area: 'Lacombe',
    phone: '(403) 782-4455',
    website: 'https://sweetcapones.ca',
    hours: {
      weekdays: '10:00 AM - 8:00 PM',
      weekends: '10:00 AM - 9:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Italian Desserts',
    rating: 4.5,
    priceRange: '$$',
    description: 'Specialty cannoli and Italian desserts in a charming local setting',
    specialties: ['Specialty Cannoli', 'Italian Desserts', 'Local Favorite'],
  },
  {
    id: '35',
    name: 'Blindman Brewing',
    area: 'Lacombe',
    phone: '(403) 782-4677',
    website: 'https://blindmanbrewing.com',
    hours: {
      weekdays: '3:00 PM - 10:00 PM',
      weekends: '12:00 PM - 11:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Brewpub',
    rating: 4.3,
    priceRange: '$$',
    description:
      'Lively brewery taproom with craft beers and pub fare in a community-focused atmosphere',
    specialties: ['Craft Beer', 'Taproom Atmosphere', 'Pub Fare'],
  },
  {
    id: '36',
    name: 'Von Essen German Bar & Cuisine',
    area: 'Bragg Creek',
    phone: '(403) 949-2694',
    website: 'https://vonessen.ca',
    hours: {
      weekdays: '4:00 PM - 9:00 PM',
      weekends: '12:00 PM - 10:00 PM',
      seasonal: 'Closed Mondays, hours may vary seasonally',
    },
    cuisine: 'German',
    rating: 4.4,
    priceRange: '$$',
    description:
      'Hearty schnitzels, sausages, and sauerkraut in a cozy, family-run German-style bar',
    specialties: ['Authentic Schnitzel', 'German Sausages', 'Traditional Sauerkraut'],
  },
  {
    id: '37',
    name: 'The Italian Farmhouse',
    area: 'Bragg Creek',
    phone: '(403) 949-2750',
    website: 'https://italianfarmhouse.ca',
    hours: {
      weekdays: '5:00 PM - 9:00 PM',
      weekends: '5:00 PM - 10:00 PM',
      seasonal: 'Closed Tuesdays, hours may vary seasonally',
    },
    cuisine: 'Italian',
    rating: 4.5,
    priceRange: '$$$',
    description:
      'Rustic, contemporary Italian fare such as pasta, pizzas, and desserts in a rustic setting',
    specialties: ['Rustic Italian Pasta', 'Wood-fired Pizza', 'Italian Desserts'],
  },
  {
    id: '38',
    name: 'Royal Rasoi',
    area: 'Nanton',
    phone: '(403) 646-2200',
    website: 'https://royalrasoi.ca',
    hours: {
      weekdays: '5:00 PM - 9:00 PM',
      weekends: '5:00 PM - 10:00 PM',
      seasonal: 'Closed Mondays, hours may vary seasonally',
    },
    cuisine: 'Indian',
    rating: 4.3,
    priceRange: '$$',
    description:
      'Indian cuisine with vibrant flavors and local ingredients—farmland meets fusion fare',
    specialties: ['Vibrant Indian Flavors', 'Local Ingredients', 'Fusion Cuisine'],
  },
  {
    id: '39',
    name: 'Saigon Moon',
    area: 'Rural - Black Diamond',
    phone: '(403) 933-4488',
    website: 'https://saigonmoon.ca',
    hours: {
      weekdays: '11:00 AM - 9:00 PM',
      weekends: '11:00 AM - 10:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Vietnamese',
    rating: 4.4,
    priceRange: '$$',
    description: 'A family-run gem delivering vegetarian-friendly Vietnamese eats',
    specialties: ['Vietnamese Cuisine', 'Vegetarian-friendly', 'Family-run'],
  },
  {
    id: '40',
    name: 'Rio Alto Mexican',
    area: 'High River',
    phone: '(403) 652-7770',
    website: 'https://rioaltomexican.ca',
    hours: {
      weekdays: '11:00 AM - 9:00 PM',
      weekends: '11:00 AM - 10:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Mexican',
    rating: 4.2,
    priceRange: '$$',
    description:
      'Authentic Mexican dishes like enchiladas, fajitas, and tacos in a warm small-town atmosphere',
    specialties: ['Authentic Enchiladas', 'Fresh Fajitas', 'Traditional Tacos'],
  },
  {
    id: '41',
    name: 'Rose of Sharon',
    area: 'Okotoks',
    phone: '(403) 938-8800',
    website: 'https://roseofsharon.ca',
    hours: {
      weekdays: '5:00 PM - 10:00 PM',
      weekends: '5:00 PM - 11:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Korean BBQ',
    rating: 4.6,
    priceRange: '$$$',
    description: 'Korean BBQ and fusion dishes in a recently opened space earning rave reviews',
    specialties: ['Korean BBQ', 'Fusion Dishes', 'Modern Korean Cuisine'],
  },
  {
    id: '42',
    name: 'The Social Kabob',
    area: 'Okotoks',
    phone: '(403) 938-5522',
    website: 'https://socialkabob.ca',
    hours: {
      weekdays: '11:00 AM - 9:00 PM',
      weekends: '11:00 AM - 10:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Indian',
    rating: 4.3,
    priceRange: '$$',
    description: 'Long-standing Indian family spot offering traditional, vegetarian-friendly meals',
    specialties: ['Traditional Indian', 'Vegetarian-friendly', 'Family Recipes'],
  },
  {
    id: '43',
    name: 'The 1906 Bistro Bar',
    area: 'Didsbury',
    phone: '(403) 335-9906',
    website: 'https://1906bistro.ca',
    hours: {
      weekdays: '4:00 PM - 10:00 PM',
      weekends: '4:00 PM - 11:00 PM',
      seasonal: 'Closed Mondays, hours may vary seasonally',
    },
    cuisine: 'European',
    rating: 4.5,
    priceRange: '$$$',
    description:
      'Sophisticated European-style dishes, tapas, and standout gelato in a historic brick setting',
    specialties: ['European Tapas', 'Artisan Gelato', 'Historic Setting'],
  },
  {
    id: '44',
    name: 'Sorso Lounge',
    area: 'Airdrie',
    phone: '(403) 948-7676',
    website: 'https://sorsolounge.ca',
    hours: {
      weekdays: '3:00 PM - 11:00 PM',
      weekends: '12:00 PM - 12:00 AM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Lounge',
    rating: 4.2,
    priceRange: '$$',
    description:
      'A lounge famed for its creative Caesars and shareable mains like BBQ tacos and chicken peanut bowls',
    specialties: ['Creative Caesars', 'BBQ Tacos', 'Chicken Peanut Bowls'],
  },
  {
    id: '45',
    name: 'Starlite Diner',
    area: 'Rural - Bowden',
    phone: '(403) 224-3663',
    website: 'https://starlitediner.ca',
    hours: {
      weekdays: '7:00 AM - 8:00 PM',
      weekends: '7:00 AM - 9:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Diner',
    rating: 4.1,
    priceRange: '$',
    description:
      'A UFO-themed train-car diner with kitsch, poutine, and sci-fi décor—not your average stop',
    specialties: ['UFO Theme', 'Poutine', 'Sci-fi Décor'],
  },
  {
    id: '46',
    name: "Jennie's Diner & Bakery",
    area: 'Rural - Bonnyville',
    phone: '(780) 826-3344',
    website: 'https://jenniesdiner.ca',
    hours: {
      weekdays: '6:00 AM - 8:00 PM',
      weekends: '6:00 AM - 9:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Diner',
    rating: 4.4,
    priceRange: '$',
    description:
      "Colorful, all-day breakfast and homemade baked goods you'd drive miles for",
    specialties: ['All-day Breakfast', 'Homemade Baked Goods', 'Colorful Atmosphere'],
  },
  {
    id: '47',
    name: "Evelyn's Memory Lane Cafe",
    area: 'High River',
    phone: '(403) 652-3311',
    website: 'https://memorylane.ca',
    hours: {
      weekdays: '7:00 AM - 8:00 PM',
      weekends: '7:00 AM - 9:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Diner',
    rating: 4.5,
    priceRange: '$',
    description:
      'Homey 50s-style diner with ice cream, pie, and "Diners, Drive-Ins & Dives" TV fame',
    specialties: ['50s-style Atmosphere', 'Homemade Pie', 'Ice Cream'],
  },
  {
    id: '48',
    name: "Angel's Drive In",
    area: 'Calgary - Bowness',
    phone: '(403) 288-5575',
    website: 'https://angelsdrivein.ca',
    hours: {
      weekdays: '11:00 AM - 10:00 PM',
      weekends: '11:00 AM - 11:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Burgers',
    rating: 4.3,
    priceRange: '$',
    description:
      'Iconic Bowness burger-and-shakes spot with curly fries and jukebox ambiance',
    specialties: ['Classic Burgers', 'Curly Fries', 'Jukebox Atmosphere'],
  },
  {
    id: '49',
    name: "Sylv's Retro Diner",
    area: 'Edmonton',
    phone: '(780) 444-3663',
    website: 'https://sylvsretrodiner.ca',
    hours: {
      weekdays: '8:00 AM - 9:00 PM',
      weekends: '8:00 AM - 10:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Diner',
    rating: 4.2,
    priceRange: '$$',
    description:
      'Inside a classic car museum, serving mega-burgers and nostalgic fun with a twist',
    specialties: ['Mega-burgers', 'Classic Car Museum', 'Nostalgic Atmosphere'],
  },
  {
    id: '50',
    name: "The Diner at Shorty's",
    area: 'Rural - Crossfield',
    phone: '(403) 946-5544',
    website: 'https://shortysrestaurant.ca',
    hours: {
      weekdays: '7:00 AM - 8:00 PM',
      weekends: '7:00 AM - 9:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Diner',
    rating: 4.3,
    priceRange: '$$',
    description:
      'Car-themed retro diner serving standout fish & chips in relaxed, memorabilia-filled surroundings',
    specialties: ['Fish & Chips', 'Car-themed Décor', 'Retro Atmosphere'],
  },
  {
    id: '51',
    name: 'Jukebox Diner',
    area: 'Leduc',
    phone: '(780) 986-2233',
    website: 'https://jukeboxdiner.ca',
    hours: {
      weekdays: '7:00 AM - 9:00 PM',
      weekends: '7:00 AM - 10:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Diner',
    rating: 4.1,
    priceRange: '$$',
    description:
      'Classic diner fare with evolving twists, including vegan and vegetarian options',
    specialties: ['Classic Diner Fare', 'Vegan Options', 'Vegetarian-friendly'],
  },
  {
    id: '52',
    name: 'Stacked Bistro and Bakery',
    area: 'Rural - Crossfield',
    phone: '(403) 946-7722',
    website: 'https://stackedbistro.ca',
    hours: {
      weekdays: '7:00 AM - 8:00 PM',
      weekends: '7:00 AM - 9:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Bistro',
    rating: 4.4,
    priceRange: '$$',
    description:
      'Rock-and-roll vibe, creative chowders and burgers, plus a feel-good community food bank',
    specialties: ['Creative Chowders', 'Gourmet Burgers', 'Community Focus'],
  },
  {
    id: '53',
    name: "Stella's Diner",
    area: 'Lethbridge',
    phone: '(403) 320-5544',
    website: 'https://stellasdiner.ca',
    hours: {
      weekdays: '7:00 AM - 3:00 PM',
      weekends: '7:00 AM - 4:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Diner',
    rating: 4.3,
    priceRange: '$',
    description:
      'Specializes in breakfast and brunch with a local following for quality morning fare',
    specialties: ['Breakfast Specialties', 'Brunch Menu', 'Morning Fare'],
  },
  {
    id: '54',
    name: 'Sweet Queen',
    area: 'Nanton',
    phone: '(403) 646-3377',
    website: 'https://sweetqueen.ca',
    hours: {
      weekdays: '11:00 AM - 8:00 PM',
      weekends: '11:00 AM - 9:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Burgers',
    rating: 4.2,
    priceRange: '$',
    description: 'Homemade-style burgers and shakes in a classic small-town setting',
    specialties: ['Homemade-style Burgers', 'Classic Shakes', 'Small-town Charm'],
  },
  // New additions
  {
    id: '55',
    name: 'Ten Foot Henry',
    area: 'Calgary - Beltline',
    phone: '(403) 475-5537',
    website: 'https://www.tenfoothenry.com',
    hours: {
      weekdays: '11:00 AM - 10:00 PM',
      weekends: '10:00 AM - 11:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Contemporary',
    rating: 4.6,
    priceRange: '$$$',
    description:
      'Vegetable-forward contemporary dining with share plates and a bright, modern room',
    specialties: ['Share Plates', 'Vegetable-forward Dishes', 'House-made Desserts'],
  },
  {
    id: '56',
    name: 'Native Tongues Taqueria',
    area: 'Calgary - Downtown',
    phone: '(403) 263-9444',
    website: 'https://www.nativetongues.ca',
    hours: {
      weekdays: '11:30 AM - 10:00 PM',
      weekends: '11:00 AM - 11:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Mexican',
    rating: 4.5,
    priceRange: '$$',
    description: 'Mexico City–style tacos, cocktails, and casual vibes in a lively taqueria',
    specialties: ['Al Pastor Tacos', 'Agave Cocktails', 'Salsas'],
  },
  {
    id: '57',
    name: 'Pigeonhole',
    area: 'Calgary - 17th Ave SW',
    phone: '(403) 452-4694',
    website: 'https://www.pigeonholeyyc.ca',
    hours: {
      weekdays: '5:00 PM - 11:00 PM',
      weekends: '5:00 PM - 12:00 AM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Contemporary',
    rating: 4.5,
    priceRange: '$$$',
    description: 'Creative small plates and natural wines in a chic, cozy space',
    specialties: ['Small Plates', 'Natural Wine', 'Inventive Flavors'],
  },
  {
    id: '58',
    name: 'UNA Pizza + Wine (17 Ave)',
    area: 'Calgary - 17th Ave SW',
    phone: '(403) 453-1183',
    website: 'https://www.unapizzeria.com',
    hours: {
      weekdays: '11:00 AM - 11:00 PM',
      weekends: '11:00 AM - 12:00 AM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Italian',
    rating: 4.4,
    priceRange: '$$',
    description: 'Popular neighborhood spot for thin-crust pizzas, salads, and wine',
    specialties: ['Thin-crust Pizza', 'Cacio e Pepe Pizza', 'Wine Selection'],
  },
  {
    id: '59',
    name: 'RGE RD',
    area: 'Edmonton',
    phone: '(780) 447-4577',
    website: 'https://www.rgerd.ca',
    hours: {
      weekdays: '5:00 PM - 10:00 PM',
      weekends: '5:00 PM - 11:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Canadian',
    rating: 4.7,
    priceRange: '$$$$',
    description:
      'Prairie-driven, nose-to-tail cooking with a focus on Alberta producers',
    specialties: ['Wood-fired Cooking', 'Prairie Ingredients', 'Tasting Menu'],
  },
  {
    id: '60',
    name: 'Uccellino',
    area: 'Edmonton',
    phone: '(780) 424-8881',
    website: 'https://uccellino.ca',
    hours: {
      weekdays: '5:00 PM - 10:00 PM',
      weekends: '5:00 PM - 11:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Italian',
    rating: 4.6,
    priceRange: '$$$$',
    description:
      'Refined southern Italian cooking with impeccable ingredients and pastas',
    specialties: ['Handmade Pasta', 'Italian Wines', 'Olive Oil–centric Dishes'],
  },
  {
    id: '61',
    name: 'Bündok',
    area: 'Edmonton',
    phone: '(780) 420-0192',
    website: 'https://bundokyeg.com',
    hours: {
      weekdays: '5:00 PM - 10:00 PM',
      weekends: '5:00 PM - 11:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Contemporary',
    rating: 4.5,
    priceRange: '$$$',
    description: 'Seasonal small plates and craft cocktails in a stylish downtown room',
    specialties: ['Seasonal Small Plates', 'Craft Cocktails', 'Local Produce'],
  },
  {
    id: '62',
    name: 'Sky Bistro',
    area: 'Banff - Sulphur Mountain',
    phone: '(403) 762-7486',
    website: 'https://www.skybistro.ca',
    hours: {
      weekdays: '11:00 AM - 9:00 PM',
      weekends: '11:00 AM - 9:00 PM',
      seasonal: 'Gondola access; hours may vary seasonally',
    },
    cuisine: 'Canadian',
    rating: 4.4,
    priceRange: '$$$',
    description:
      'Elevated Canadian plates at the summit with panoramic mountain views',
    specialties: ['Mountain Views', 'Canadian Classics', 'Cocktails'],
  },
  {
    id: '63',
    name: 'Three Ravens Restaurant & Wine Bar',
    area: 'Banff - Banff Centre',
    phone: '(403) 762-6300',
    website: 'https://www.banffcentre.ca/dining/three-ravens-restaurant',
    hours: {
      weekdays: '5:30 PM - 9:30 PM',
      weekends: '5:30 PM - 9:30 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Fine Dining',
    rating: 4.6,
    priceRange: '$$$$',
    description:
      'Refined seasonal menus with sweeping views over the Bow Valley',
    specialties: ['Seasonal Menus', 'Wine Pairings', 'Scenic Views'],
  },
  {
    id: '64',
    name: 'Crazyweed Kitchen',
    area: 'Canmore',
    phone: '(403) 609-2530',
    website: 'https://www.crazyweed.ca',
    hours: {
      weekdays: '11:30 AM - 10:00 PM',
      weekends: '11:30 AM - 10:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Contemporary',
    rating: 4.5,
    priceRange: '$$$',
    description:
      'Creative global flavors and a lively room beloved by locals and visitors',
    specialties: ['Global Flavors', 'Wood-fired Dishes', 'Vibrant Atmosphere'],
  },
  {
    id: '65',
    name: 'The Trough Dining Co.',
    area: 'Canmore',
    phone: '(403) 678-2820',
    website: 'https://www.thetrough.ca',
    hours: {
      weekdays: '5:00 PM - 10:00 PM',
      weekends: '5:00 PM - 10:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Fine Dining',
    rating: 4.6,
    priceRange: '$$$$',
    description:
      'Intimate spot for polished, seasonal plates and attentive service',
    specialties: ['Seasonal Canadian', 'Romantic Setting', 'Attentive Service'],
  },
  {
    id: '66',
    name: 'Tekarra Restaurant',
    area: 'Jasper',
    phone: '(780) 852-3058',
    website: 'https://www.tekarralodge.com/dining',
    hours: {
      weekdays: '5:00 PM - 9:00 PM',
      weekends: '5:00 PM - 9:00 PM',
      seasonal: 'Seasonal operation; hours may vary',
    },
    cuisine: 'Canadian',
    rating: 4.4,
    priceRange: '$$$',
    description: 'Historic lodge dining with rustic Canadian dishes and cabin charm',
    specialties: ['Rustic Canadian', 'Lodge Setting', 'Seasonal Game'],
  },
  {
    id: '67',
    name: 'Fiddle River Restaurant',
    area: 'Jasper',
    phone: '(780) 852-3032',
    website: 'https://fiddleriverrestaurant.com',
    hours: {
      weekdays: '5:00 PM - 10:00 PM',
      weekends: '5:00 PM - 10:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Seafood',
    rating: 4.4,
    priceRange: '$$$',
    description:
      'Cozy upstairs spot for Alberta trout, seafood, and mountain fare',
    specialties: ['Alberta Trout', 'Seafood', 'Mountain Fare'],
  },
  {
    id: '68',
    name: "Bo's Bar & Stage",
    area: 'Red Deer',
    phone: '(403) 340-3377',
    website: 'https://www.bosbar.com',
    hours: {
      weekdays: '11:00 AM - 11:00 PM',
      weekends: '11:00 AM - 1:00 AM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Pub Food',
    rating: 4.4,
    priceRange: '$$',
    description:
      'Lively kitchen and music venue with craft beers and elevated comfort food',
    specialties: ['Live Music', 'Burgers & Bowls', 'Craft Beer'],
  },
  {
    id: '69',
    name: 'Redwood Steakhouse & Bar',
    area: 'Medicine Hat',
    phone: '(403) 502-8176',
    website: 'https://redwoodsteakhouse.ca',
    hours: {
      weekdays: '5:00 PM - 10:00 PM',
      weekends: '5:00 PM - 11:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Steakhouse',
    rating: 4.3,
    priceRange: '$$$',
    description:
      'Classic steakhouse experience with Alberta beef and robust wine list',
    specialties: ['Alberta Beef', 'Seafood', 'Wine List'],
  },
  {
    id: '70',
    name: 'The Italian Table',
    area: 'Lethbridge',
    phone: '(403) 328-0228',
    website: 'https://www.italiantable.ca',
    hours: {
      weekdays: '11:30 AM - 9:00 PM',
      weekends: '11:30 AM - 10:00 PM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Italian',
    rating: 4.4,
    priceRange: '$$',
    description:
      'Modern Italian comfort food, pastas, and share plates for the whole table',
    specialties: ['House Pastas', 'Wood-fired Dishes', 'Italian Wines'],
  },
  {
    id: '71',
    name: "Brown's Socialhouse Grande Prairie Westgate",
    area: 'Grande Prairie',
    phone: '(587) 299-4490',
    website: 'https://brownssocialhouse.com',
    hours: {
      weekdays: '11:00 AM - 11:00 PM',
      weekends: '11:00 AM - 12:00 AM',
      seasonal: 'Hours may vary seasonally',
    },
    cuisine: 'Contemporary',
    rating: 4.1,
    priceRange: '$$',
    description: 'Casual modern eatery with a broad menu and social atmosphere',
    specialties: ['Burgers & Bowls', 'Social Plates', 'Cocktails'],
  },
];

const AREAS = [
  'All Areas',
  'Banff',
  'Calgary',
  'Canmore',
  'Jasper',
  'Lake Louise',
  'St. Albert',
  'Edmonton',
  'Lethbridge',
  'High River',
  'Okotoks',
  'Airdrie',
  'Leduc',
  'Didsbury',
  'Lacombe',
  'Nanton',
  'Bragg Creek',
  'Red Deer',
  'Medicine Hat',
  'Grande Prairie',
  'Rural',
];

const CUISINES = [
  'All Cuisines',
  'Canadian',
  'Fine Dining',
  'Contemporary',
  'Fondue',
  'Steakhouse',
  'Pub Food',
  'Brewpub',
  'Farm-to-Table',
  'Cafe',
  'Comfort Food',
  'Québecois',
  'Italian',
  'Burgers',
  'Asian Street Food',
  'French Bakery',
  'Farm Store',
  'Diner',
  'Tea House',
  'Italian Desserts',
  'German',
  'Indian',
  'Vietnamese',
  'Mexican',
  'Korean BBQ',
  'European',
  'Lounge',
  'Bistro',
  'Seafood',
];

export default function DiningScreen() {
  const [selectedArea, setSelectedArea] = useState<string>('All Areas');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All Cuisines');

  const filteredRestaurants = RESTAURANTS.filter((restaurant) => {
    const areaMatch =
      selectedArea === 'All Areas' ||
      restaurant.area.toLowerCase().includes(selectedArea.toLowerCase()) ||
      (selectedArea === 'Calgary' && restaurant.area.includes('Calgary')) ||
      (selectedArea === 'St. Albert' && restaurant.area.includes('St. Albert')) ||
      (selectedArea === 'Rural' && restaurant.area.includes('Rural'));

    const cuisineMatch =
      selectedCuisine === 'All Cuisines' || restaurant.cuisine === selectedCuisine;

    return areaMatch && cuisineMatch;
  });

  const handleCall = (phone: string) => {
    const phoneNumber = phone.replace(/[^0-9]/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleWebsite = (website: string) => {
    Linking.openURL(website).catch(() => {
      Alert.alert('Error', 'Unable to open website');
    });
  };

  const renderStars = (rating: number) => {
    const stars: JSX.Element[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={14} color="#FFD700" fill="#FFD700" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" size={14} color="#FFD700" fill="#FFD700" />);
    }
    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Alberta Dining</Text>
        <Text style={styles.subtitle}>Discover the best restaurants across Alberta</Text>
        <Text style={styles.metaNote}>
          All hours are shown in Mountain Time (MT). Seasonal hours may vary.
        </Text>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {AREAS.map((area) => (
            <TouchableOpacity
              key={area}
              testID={`area-filter-${area}`}
              style={[styles.filterButton, selectedArea === area && styles.filterButtonActive]}
              onPress={() => setSelectedArea(area)}
            >
              <Text style={[styles.filterText, selectedArea === area && styles.filterTextActive]}>
                {area}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {CUISINES.map((cuisine) => (
            <TouchableOpacity
              key={cuisine}
              testID={`cuisine-filter-${cuisine}`}
              style={[styles.filterButton, selectedCuisine === cuisine && styles.filterButtonActive]}
              onPress={() => setSelectedCuisine(cuisine)}
            >
              <Text style={[styles.filterText, selectedCuisine === cuisine && styles.filterTextActive]}>
                {cuisine}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.restaurantsList}>
        {filteredRestaurants.map((restaurant) => (
          <View key={restaurant.id} style={styles.restaurantCard} testID={`restaurant-${restaurant.id}`}>
            <View style={styles.restaurantHeader}>
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <View style={styles.ratingContainer}>
                  <View style={styles.stars}>{renderStars(restaurant.rating)}</View>
                  <Text style={styles.rating}>{restaurant.rating.toFixed(1)}</Text>
                  <Text style={styles.priceRange}>{restaurant.priceRange}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.description}>{restaurant.description}</Text>
            <Text style={styles.cuisine}>{restaurant.cuisine}</Text>

            <View style={styles.locationContainer}>
              <MapPin size={16} color="#666" />
              <Text style={styles.area}>{restaurant.area}</Text>
            </View>

            <View style={styles.hoursContainer}>
              <Clock size={16} color="#666" />
              <View style={styles.hoursText}>
                <Text style={styles.hoursLabel}>Mon-Fri: {restaurant.hours.weekdays} MT</Text>
                <Text style={styles.hoursLabel}>Sat-Sun: {restaurant.hours.weekends} MT</Text>
                {restaurant.hours.seasonal && (
                  <Text style={styles.seasonalNote}>{restaurant.hours.seasonal}</Text>
                )}
              </View>
            </View>

            <View style={styles.specialtiesContainer}>
              <Text style={styles.specialtiesTitle}>Specialties:</Text>
              <View style={styles.specialtiesList}>
                {restaurant.specialties.map((specialty, index) => (
                  <Text key={index} style={styles.specialty}>
                    • {specialty}
                  </Text>
                ))}
              </View>
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                testID={`call-${restaurant.id}`}
                onPress={() => handleCall(restaurant.phone)}
              >
                <Phone size={18} color="#fff" />
                <Text style={styles.actionButtonText}>Call</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.websiteButton]}
                testID={`website-${restaurant.id}`}
                onPress={() => handleWebsite(restaurant.website)}
              >
                <ExternalLink size={18} color="#007AFF" />
                <Text style={[styles.actionButtonText, styles.websiteButtonText]}>Website</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  metaNote: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  filtersContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterScroll: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  restaurantsList: {
    flex: 1,
    padding: 16,
  },
  restaurantCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  rating: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginRight: 8,
  },
  priceRange: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  cuisine: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  area: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 6,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  hoursText: {
    flex: 1,
    marginLeft: 6,
  },
  hoursLabel: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 2,
  },
  seasonalNote: {
    fontSize: 12,
    color: '#f59e0b',
    fontStyle: 'italic',
    marginTop: 2,
  },
  specialtiesContainer: {
    marginBottom: 16,
  },
  specialtiesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  specialtiesList: {},
  specialty: {
    fontSize: 13,
    color: '#6b7280',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  websiteButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  websiteButtonText: {
    color: '#007AFF',
  },
});
