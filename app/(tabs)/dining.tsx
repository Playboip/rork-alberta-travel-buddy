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
      seasonal: 'Hours may vary seasonally'
    },
    cuisine: 'Canadian',
    rating: 4.5,
    priceRange: '$$$',
    description: 'Upscale Canadian cuisine featuring locally sourced ingredients',
    specialties: ['Bison Tenderloin', 'Alberta Beef', 'Local Game']
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
      seasonal: 'Seasonal hours may vary'
    },
    cuisine: 'Fine Dining',
    rating: 4.7,
    priceRange: '$$$$',
    description: 'Elegant dining with spectacular lake views',
    specialties: ['Lake Views', 'Wine Selection', 'Afternoon Tea']
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
      seasonal: 'Hours may vary seasonally'
    },
    cuisine: 'Contemporary',
    rating: 4.2,
    priceRange: '$$',
    description: 'Contemporary casual dining with global influences',
    specialties: ['Cajun Chicken', 'Dynamite Roll', 'Truffle Fries']
  },
  {
    id: '4',
    name: 'River Cafe',
    area: 'Calgary - Prince\'s Island Park',
    phone: '(403) 261-7670',
    website: 'https://river-cafe.com',
    hours: {
      weekdays: '11:30 AM - 2:00 PM, 5:30 PM - 9:00 PM',
      weekends: '10:00 AM - 2:00 PM, 5:30 PM - 9:00 PM',
      seasonal: 'Closed Mondays in winter, hours may vary seasonally'
    },
    cuisine: 'Canadian',
    rating: 4.6,
    priceRange: '$$$$',
    description: 'Award-winning restaurant featuring Canadian cuisine',
    specialties: ['Seasonal Menu', 'Local Ingredients', 'River Views']
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
      seasonal: 'Hours may vary seasonally'
    },
    cuisine: 'Fondue',
    rating: 4.3,
    priceRange: '$$$',
    description: 'Famous fondue restaurant with exotic meats',
    specialties: ['Cheese Fondue', 'Exotic Meats', 'Chocolate Fondue']
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
      seasonal: 'Hours may vary seasonally'
    },
    cuisine: 'Steakhouse',
    rating: 4.4,
    priceRange: '$$$$',
    description: 'Premium steakhouse featuring Alberta beef',
    specialties: ['Alberta Beef', 'Seafood', 'Wine Selection']
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
      seasonal: 'Hours may vary seasonally'
    },
    cuisine: 'Pub Food',
    rating: 4.1,
    priceRange: '$$',
    description: 'Historic hotel pub with mountain atmosphere',
    specialties: ['Fish & Chips', 'Burgers', 'Local Beers']
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
      seasonal: 'Hours may vary seasonally'
    },
    cuisine: 'Brewpub',
    rating: 4.2,
    priceRange: '$$',
    description: 'Local brewery with hearty pub fare',
    specialties: ['Craft Beer', 'Pizza', 'Wings']
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
      seasonal: 'Closed Mondays, hours may vary seasonally'
    },
    cuisine: 'Steakhouse',
    rating: 4.5,
    priceRange: '$$$$',
    description: 'Ranch-style steakhouse in rural setting',
    specialties: ['Prime Rib', 'Ranch Atmosphere', 'Private Events']
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
      seasonal: 'Hours may vary seasonally'
    },
    cuisine: 'Farm-to-Table',
    rating: 4.4,
    priceRange: '$$$',
    description: 'Farm-to-table dining in peaceful rural setting',
    specialties: ['Local Ingredients', 'Seasonal Menu', 'Spa Cuisine']
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
      seasonal: 'Hours may vary seasonally'
    },
    cuisine: 'Cafe',
    rating: 4.6,
    priceRange: '$$',
    description: 'A bright red barn-turned-café serving burgers with hand-ground aged beef, scratch-made fries, and scratch-baked pies in a charming countryside setting',
    specialties: ['Hand-ground Aged Beef Burgers', 'Scratch-made Fries', 'Scratch-baked Pies']
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
      seasonal: 'Seasonal operation, hours may vary'
    },
    cuisine: 'Comfort Food',
    rating: 4.4,
    priceRange: '$$',
    description: 'Dine inside a restored 1887 railcar, enjoying comfort food surrounded by nostalgic train-era vibes',
    specialties: ['Historic Railcar Dining', 'Comfort Food', 'Train-era Atmosphere']
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
      seasonal: 'Seasonal operation May-October, hours may vary'
    },
    cuisine: 'Fine Dining',
    rating: 4.7,
    priceRange: '$$$$',
    description: 'A lodge-style restaurant offering refined, seasonal cuisine paired with sweeping views of the Miette Range and Athabasca Valley',
    specialties: ['Seasonal Cuisine', 'Mountain Views', 'Lodge Atmosphere']
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
      seasonal: 'Closed Mondays, hours may vary seasonally'
    },
    cuisine: 'Steakhouse',
    rating: 4.5,
    priceRange: '$$$',
    description: 'Elevated steakhouse fare paired with a classic rural backdrop—perfect for a memorable, low-key night out',
    specialties: ['Premium Steaks', 'Rural Atmosphere', 'Classic Fare']
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
      seasonal: 'Hours may vary seasonally'
    },
    cuisine: 'Steakhouse',
    rating: 4.4,
    priceRange: '$$$',
    description: 'Tucked off the beaten path beside an equestrian centre, this cozy steakhouse serves hearty, old-fashioned meals made to impress',
    specialties: ['Hearty Steaks', 'Equestrian Setting', 'Old-fashioned Meals']
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
      seasonal: 'Occasional public dinners, seasonal operation'
    },
    cuisine: 'Fine Dining',
    rating: 4.8,
    priceRange: '$$$$',
    description: 'A secluded retreat with occasional public dinners featuring seasonal dishes served in a serene forested setting—ideal for special occasions',
    specialties: ['Seasonal Dishes', 'Forest Setting', 'Special Occasions']
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
      seasonal: 'Closed Mondays, hours may vary seasonally'
    },
    cuisine: 'Québecois',
    rating: 4.6,
    priceRange: '$$$',
    description: 'A Québecois-inspired spot just outside Edmonton, known for its rustic vibe, house-baked bread, generous portions, and delightful cocktails',
    specialties: ['House-baked Bread', 'Québecois Cuisine', 'Craft Cocktails']
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
      seasonal: 'Seasonal operation, hours may vary'
    },
    cuisine: 'Italian',
    rating: 4.7,
    priceRange: '$$$',
    description: 'Located lakeside, this Northern Italian gem serves handmade pasta and imported ingredients, enhanced by mountain views and even Peroni on tap',
    specialties: ['Handmade Pasta', 'Imported Ingredients', 'Lakeside Views']
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
      seasonal: 'Seasonal operation May-September, hours may vary'
    },
    cuisine: 'Cafe',
    rating: 4.3,
    priceRange: '$',
    description: 'More than a café, this working bird conservation farm offers simple local fare and wicker-basketed treats perfect for exploring the grounds',
    specialties: ['Local Fare', 'Bird Conservation', 'Farm Setting']
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
      seasonal: 'Seasonal dinners, reservation required'
    },
    cuisine: 'Farm-to-Table',
    rating: 4.5,
    priceRange: '$$$',
    description: 'A farm-to-table kitchen that hosts dinners cooked with produce from its own community-supported agriculture (CSA) gardens',
    specialties: ['CSA Gardens', 'Farm-fresh Produce', 'Community Dinners']
  },
  {
    id: '21',
    name: 'Jack\'s Burger Shack',
    area: 'St. Albert',
    phone: '(780) 460-3344',
    website: 'https://jacksburgershack.ca',
    hours: {
      weekdays: '11:00 AM - 9:00 PM',
      weekends: '11:00 AM - 10:00 PM',
      seasonal: 'Hours may vary seasonally'
    },
    cuisine: 'Burgers',
    rating: 4.4,
    priceRange: '$$',
    description: 'Renowned for burgers on custom-baked buns and indulgent milkshakes (including cereal, orange creamsicle, Nutella flavors)—a local favorite with a playful twist',
    specialties: ['Custom-baked Buns', 'Specialty Milkshakes', 'Creative Flavors']
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
      seasonal: 'Hours may vary seasonally'
    },
    cuisine: 'Pub Food',
    rating: 4.6,
    priceRange: '$$',
    description: 'A tiny, character-rich saloon housed in a 1913 hotel, featuring live music, homemade pies, mason-jar cocktails, and quirky décor like gunshot holes in the walls',
    specialties: ['Homemade Pies', 'Mason-jar Cocktails', 'Live Music']
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
      seasonal: 'Seasonal operation, hours may vary'
    },
    cuisine: 'Comfort Food',
    rating: 4.3,
    priceRange: '$$',
    description: 'A cozy camp-style café serving homemade meals—from bacon and bread to lunch and dinner—in a nostalgic, charming general-store atmosphere',
    specialties: ['Homemade Meals', 'General Store Atmosphere', 'Camp-style Cooking']
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
      seasonal: 'Hours may vary seasonally'
    },
    cuisine: 'Asian Street Food',
    rating: 4.4,
    priceRange: '$$',
    description: 'Once a food bus turned permanent eatery, PD3 serves Asian-style street eats from a second-level outdoor seating area with a fun, casual vibe',
    specialties: ['Asian Street Food', 'Outdoor Seating', 'Casual Atmosphere']
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
      seasonal: 'Hours may vary seasonally'
    },
    cuisine: 'French Bakery',
    rating: 4.5,
    priceRange: '$$',
    description: 'A delightful French bakery offering croissants, baguettes, quiches, and more—the perfect pit stop for breakfast or a trail snack',
    specialties: ['Fresh Croissants', 'Artisan Baguettes', 'French Pastries']
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
      seasonal: 'Summer market next door, hours may vary seasonally'
    },
    cuisine: 'Cafe',
    rating: 4.3,
    priceRange: '$$',
    description: 'Trendy café featuring salads, sandwiches, farmers\' plates, and a summer makers-and-growers market right next door',
    specialties: ['Farmers\' Plates', 'Fresh Salads', 'Local Market']
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
      seasonal: 'Seasonal produce availability, hours may vary'
    },
    cuisine: 'Farm Store',
    rating: 4.6,
    priceRange: '$$',
    description: 'A family-run farm store known for fresh produce, grass-fed beef, Saskatoon berry and rhubarb pies, and preserves—a perfect rural treasure trove',
    specialties: ['Grass-fed Beef', 'Saskatoon Berry Pies', 'Fresh Preserves']
  },
  {
    id: '28',
    name: 'Roy\'s Place',
    area: 'Rural - Claresholm',
    phone: '(403) 625-3381',
    website: 'https://roysplace.ca',
    hours: {
      weekdays: '6:00 AM - 8:00 PM',
      weekends: '6:00 AM - 8:00 PM',
      seasonal: 'Hours may vary seasonally'
    },
    cuisine: 'Diner',
    rating: 4.7,
    priceRange: '$',
    description: 'Famous highway stop celebrated for massive cinnamon buns the size of dinner plates, complete with take-home cream cheese frosting tubs',
    specialties: ['Giant Cinnamon Buns', 'Cream Cheese Frosting', 'Highway Classic']
  },
  {
    id: '29',
    name: 'Zum\'s Eatery and Mercantile',
    area: 'Rural - Waterton',
    phone: '(403) 859-2388',
    website: 'https://zumseatery.com',
    hours: {
      weekdays: '11:00 AM - 8:00 PM',
      weekends: '11:00 AM - 9:00 PM',
      seasonal: 'Seasonal operation May-September, hours may vary'
    },
    cuisine: 'Comfort Food',
    rating: 4.5,
    priceRange: '$$',
    description: 'Hidden gem in a tiny town, serving beloved fried chicken and homemade pie in a relaxed seasonal setting',
    specialties: ['Fried Chicken', 'Homemade Pie', 'Small Town Charm']
  }
];

const AREAS = ['All Areas', 'Banff', 'Calgary', 'Canmore', 'Jasper', 'Lake Louise', 'St. Albert', 'Rural'];
const CUISINES = ['All Cuisines', 'Canadian', 'Fine Dining', 'Contemporary', 'Fondue', 'Steakhouse', 'Pub Food', 'Brewpub', 'Farm-to-Table', 'Cafe', 'Comfort Food', 'Québecois', 'Italian', 'Burgers', 'Asian Street Food', 'French Bakery', 'Farm Store', 'Diner'];

export default function DiningScreen() {
  const [selectedArea, setSelectedArea] = useState<string>('All Areas');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All Cuisines');

  const filteredRestaurants = RESTAURANTS.filter(restaurant => {
    const areaMatch = selectedArea === 'All Areas' || 
      restaurant.area.toLowerCase().includes(selectedArea.toLowerCase()) ||
      (selectedArea === 'Calgary' && restaurant.area.includes('Calgary')) ||
      (selectedArea === 'St. Albert' && restaurant.area.includes('St. Albert')) ||
      (selectedArea === 'Rural' && restaurant.area.includes('Rural'));
    
    const cuisineMatch = selectedCuisine === 'All Cuisines' || restaurant.cuisine === selectedCuisine;
    
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
    const stars = [];
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
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {AREAS.map((area) => (
            <TouchableOpacity
              key={area}
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
          <View key={restaurant.id} style={styles.restaurantCard}>
            <View style={styles.restaurantHeader}>
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <View style={styles.ratingContainer}>
                  <View style={styles.stars}>
                    {renderStars(restaurant.rating)}
                  </View>
                  <Text style={styles.rating}>{restaurant.rating}</Text>
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
                <Text style={styles.hoursLabel}>Mon-Fri: {restaurant.hours.weekdays}</Text>
                <Text style={styles.hoursLabel}>Sat-Sun: {restaurant.hours.weekends}</Text>
                {restaurant.hours.seasonal && (
                  <Text style={styles.seasonalNote}>{restaurant.hours.seasonal}</Text>
                )}
              </View>
            </View>

            <View style={styles.specialtiesContainer}>
              <Text style={styles.specialtiesTitle}>Specialties:</Text>
              <View style={styles.specialtiesList}>
                {restaurant.specialties.map((specialty, index) => (
                  <Text key={index} style={styles.specialty}>• {specialty}</Text>
                ))}
              </View>
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleCall(restaurant.phone)}
              >
                <Phone size={18} color="#fff" />
                <Text style={styles.actionButtonText}>Call</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.websiteButton]}
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
    gap: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  rating: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
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
    gap: 6,
  },
  area: {
    fontSize: 14,
    color: '#374151',
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 6,
  },
  hoursText: {
    flex: 1,
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
  specialtiesList: {
    gap: 2,
  },
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
    gap: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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