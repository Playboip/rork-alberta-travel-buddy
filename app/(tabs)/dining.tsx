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
  }
];

const AREAS = ['All Areas', 'Banff', 'Calgary', 'Canmore', 'Jasper', 'Lake Louise', 'Rural'];
const CUISINES = ['All Cuisines', 'Canadian', 'Fine Dining', 'Contemporary', 'Fondue', 'Steakhouse', 'Pub Food', 'Brewpub', 'Farm-to-Table'];

export default function DiningScreen() {
  const [selectedArea, setSelectedArea] = useState<string>('All Areas');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All Cuisines');

  const filteredRestaurants = RESTAURANTS.filter(restaurant => {
    const areaMatch = selectedArea === 'All Areas' || 
      restaurant.area.toLowerCase().includes(selectedArea.toLowerCase()) ||
      (selectedArea === 'Calgary' && restaurant.area.includes('Calgary')) ||
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