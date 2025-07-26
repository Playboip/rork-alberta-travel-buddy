import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, MapPin, Filter, Star, Heart, Tag } from 'lucide-react-native';
import { Stack, router } from 'expo-router';
import { BookingItem, BookingSearchFilters } from '@/types/booking';
import { Image } from 'expo-image';
import DiscountBanner from '@/components/shared/DiscountBanner';

const mockBookingItems: BookingItem[] = [
  // Hotels
  {
    id: '1',
    type: 'hotel',
    name: 'Fairmont Banff Springs',
    description: 'Luxury castle hotel in the Canadian Rockies with world-class amenities',
    location: 'Banff, AB',
    price: 319,
    originalPrice: 399,
    currency: 'CAD',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop',
    rating: 4.8,
    availability: true,
    provider: 'Fairmont Hotels',
    features: ['Spa', 'Pool', 'Restaurant', 'WiFi', 'Parking'],
    roomType: 'Deluxe Mountain View',
    accommodationType: 'private_room',
    amenities: ['Spa', 'Pool', 'Fitness Center', 'Restaurant', 'Room Service'],
    discount: {
      percentage: 20,
      code: 'EARLY20',
      validUntil: '2024-12-31',
      description: 'Book 30 days in advance and save!',
      type: 'early_bird'
    }
  },
  {
    id: '2',
    type: 'hotel',
    name: 'Moraine Lake Lodge',
    description: 'Rustic luxury lodge with stunning lake views',
    location: 'Lake Louise, AB',
    price: 599,
    currency: 'CAD',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
    rating: 4.9,
    availability: true,
    provider: 'Mountain Lodges',
    features: ['Lake View', 'Restaurant', 'Hiking', 'WiFi'],
    roomType: 'Lakefront Suite',
    accommodationType: 'entire_place',
    amenities: ['Lake View', 'Restaurant', 'Hiking Trails', 'WiFi']
  },
  // Hostels
  {
    id: '2a',
    type: 'hostel',
    name: 'Banff Surf Hostel',
    description: 'Vibrant hostel with mountain views, perfect for adventure seekers',
    location: 'Banff, AB',
    price: 45,
    originalPrice: 60,
    currency: 'CAD',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop',
    rating: 4.3,
    availability: true,
    provider: 'Banff Hostels',
    features: ['Shared Kitchen', 'Common Area', 'WiFi', 'Lockers', 'Laundry'],
    roomType: 'Mixed Dorm',
    accommodationType: 'dorm_bed',
    amenities: ['Shared Kitchen', 'Common Area', 'WiFi', 'Lockers'],
    discount: {
      percentage: 25,
      code: 'BACKPACK25',
      validUntil: '2024-11-30',
      description: 'Special rate for backpackers!',
      type: 'group'
    }
  },
  {
    id: '2b',
    type: 'apartment',
    name: 'Downtown Banff Apartment',
    description: 'Cozy 2-bedroom apartment in the heart of Banff',
    location: 'Banff, AB',
    price: 180,
    currency: 'CAD',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
    rating: 4.6,
    availability: true,
    provider: 'Banff Rentals',
    features: ['Full Kitchen', 'WiFi', 'Parking', 'Mountain View'],
    roomType: '2-Bedroom Apartment',
    accommodationType: 'entire_place',
    amenities: ['Full Kitchen', 'WiFi', 'Parking', 'Mountain View']
  },
  {
    id: '2c',
    type: 'cabin',
    name: 'Rustic Mountain Cabin',
    description: 'Secluded cabin surrounded by nature, perfect for digital detox',
    location: 'Canmore, AB',
    price: 220,
    originalPrice: 275,
    currency: 'CAD',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
    rating: 4.7,
    availability: true,
    provider: 'Mountain Cabins',
    features: ['Fireplace', 'Hot Tub', 'BBQ', 'Nature Views'],
    roomType: 'Rustic Cabin',
    accommodationType: 'entire_place',
    amenities: ['Fireplace', 'Hot Tub', 'BBQ', 'Nature Views'],
    discount: {
      percentage: 20,
      code: 'NATURE20',
      validUntil: '2024-12-15',
      description: 'Escape to nature with 20% off!',
      type: 'seasonal'
    }
  },
  // Flights
  {
    id: '3',
    type: 'flight',
    name: 'Calgary to Vancouver',
    description: 'Direct flight with Air Canada',
    location: 'YYC to YVR',
    price: 180,
    originalPrice: 225,
    currency: 'CAD',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop',
    rating: 4.3,
    duration: '1h 30m',
    availability: true,
    provider: 'Air Canada',
    features: ['Direct Flight', 'Meal Service', 'WiFi', 'Entertainment'],
    departure: 'Calgary (YYC)',
    arrival: 'Vancouver (YVR)',
    flightNumber: 'AC 219',
    airline: 'Air Canada',
    discount: {
      percentage: 20,
      code: 'FLY20',
      validUntil: '2024-12-01',
      description: 'Limited time flight discount!',
      type: 'partner'
    }
  },
  {
    id: '4',
    type: 'flight',
    name: 'Toronto to Calgary',
    description: 'Direct flight with WestJet',
    location: 'YYZ to YYC',
    price: 151,
    originalPrice: 189,
    currency: 'CAD',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop',
    rating: 4.1,
    duration: '4h 15m',
    availability: true,
    provider: 'WestJet',
    features: ['Direct Flight', 'Snack Service', 'WiFi'],
    departure: 'Toronto (YYZ)',
    arrival: 'Calgary (YYC)',
    flightNumber: 'WS 705',
    airline: 'WestJet',
    discount: {
      percentage: 20,
      code: 'LASTMIN20',
      validUntil: '2024-08-15',
      description: 'Last minute booking special!',
      type: 'last_minute'
    }
  },
  // Car Rentals
  {
    id: '5',
    type: 'car_rental',
    name: 'SUV Rental - Toyota RAV4',
    description: 'Perfect for mountain adventures and city driving',
    location: 'Calgary, AB',
    price: 71,
    originalPrice: 89,
    currency: 'CAD',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop',
    rating: 4.5,
    availability: true,
    provider: 'Enterprise Rent-A-Car',
    features: ['AWD', 'GPS', 'Bluetooth', 'Fuel Efficient', 'Insurance'],
    carModel: 'Toyota RAV4',
    transmission: 'automatic',
    fuelType: 'Gasoline',
    discount: {
      percentage: 20,
      code: 'DRIVE20',
      validUntil: '2024-12-31',
      description: 'Partner discount with Enterprise!',
      type: 'partner'
    }
  },
  {
    id: '6',
    type: 'car_rental',
    name: 'Luxury Sedan - BMW 3 Series',
    description: 'Premium comfort for city exploration',
    location: 'Vancouver, BC',
    price: 149,
    currency: 'CAD',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
    rating: 4.7,
    availability: true,
    provider: 'Avis',
    features: ['Luxury Interior', 'GPS', 'Bluetooth', 'Premium Sound'],
    carModel: 'BMW 3 Series',
    transmission: 'automatic',
    fuelType: 'Gasoline'
  },
  // Uber & Transportation
  {
    id: '6a',
    type: 'uber',
    name: 'Airport Transfer - UberX',
    description: 'Convenient ride from Calgary Airport to Banff',
    location: 'Calgary Airport to Banff',
    price: 120,
    originalPrice: 150,
    currency: 'CAD',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop',
    rating: 4.4,
    availability: true,
    provider: 'Uber',
    features: ['Door-to-door', 'Professional Driver', 'Clean Vehicle', 'GPS Tracking'],
    vehicleType: 'UberX',
    estimatedTime: '1h 30m',
    discount: {
      percentage: 20,
      code: 'RIDE20',
      validUntil: '2024-12-31',
      description: 'New user discount on airport transfers!',
      type: 'partner'
    }
  },
  {
    id: '6b',
    type: 'meal_deal',
    name: 'Local Eats Combo',
    description: 'Breakfast + Lunch at partner restaurants',
    location: 'Banff, AB',
    price: 35,
    originalPrice: 50,
    currency: 'CAD',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    rating: 4.5,
    availability: true,
    provider: 'Local Eats Network',
    features: ['2 Meals Included', 'Local Restaurants', 'Flexible Timing', 'No Reservations Needed'],
    mealType: 'combo',
    restaurantPartner: 'Multiple Partners',
    discount: {
      percentage: 30,
      code: 'FOODIE30',
      validUntil: '2024-11-30',
      description: 'Try local hidden gems with 30% off!',
      type: 'partner'
    }
  },
  // Tours & Experiences
  {
    id: '7',
    type: 'tour',
    name: 'Banff National Park Wildlife Tour',
    description: 'Full-day guided tour to spot bears, elk, and mountain goats',
    location: 'Banff, AB',
    price: 185,
    currency: 'CAD',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    rating: 4.8,
    duration: '8 hours',
    availability: true,
    provider: 'Banff Adventures',
    features: ['Professional Guide', 'Transportation', 'Lunch Included', 'Binoculars'],
    groupSize: 12,
    difficulty: 'easy',
    includes: ['Transportation', 'Professional Guide', 'Lunch', 'Binoculars']
  },
  {
    id: '8',
    type: 'experience',
    name: 'Lake Louise Canoe Adventure',
    description: 'Paddle the pristine waters of Lake Louise with expert guides',
    location: 'Lake Louise, AB',
    price: 95,
    currency: 'CAD',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
    rating: 4.6,
    duration: '3 hours',
    availability: true,
    provider: 'Lake Louise Activities',
    features: ['Equipment Included', 'Life Jackets', 'Instruction', 'Scenic'],
    groupSize: 8,
    difficulty: 'easy',
    includes: ['Canoe & Paddle', 'Life Jacket', 'Basic Instruction', 'Photos']
  },
  // Activities
  {
    id: '9',
    type: 'activity',
    name: 'Banff Gondola Experience',
    description: 'Scenic gondola ride to the top of Sulphur Mountain',
    location: 'Banff, AB',
    price: 65,
    currency: 'CAD',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    rating: 4.7,
    duration: '2-3 hours',
    availability: true,
    provider: 'Banff Gondola',
    features: ['Mountain Views', 'Restaurant', 'Gift Shop', 'Accessible']
  },
  // Restaurants
  {
    id: '10',
    type: 'restaurant',
    name: 'The Bison Restaurant',
    description: 'Farm-to-table dining featuring local Alberta ingredients',
    location: 'Banff, AB',
    price: 85,
    currency: 'CAD',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    rating: 4.6,
    availability: true,
    provider: 'The Bison Restaurant',
    features: ['Farm-to-Table', 'Local Ingredients', 'Wine Pairing', 'Patio'],
    cuisine: 'Canadian',
    priceRange: '$$$'
  },
  {
    id: '11',
    type: 'restaurant',
    name: 'Chateau Lake Louise Dining',
    description: 'Fine dining with spectacular lake views',
    location: 'Lake Louise, AB',
    price: 125,
    currency: 'CAD',
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
    rating: 4.8,
    availability: true,
    provider: 'Fairmont Chateau Lake Louise',
    features: ['Lake Views', 'Fine Dining', 'Wine Selection', 'Dress Code'],
    cuisine: 'French-Canadian',
    priceRange: '$$$$'
  }
];

export default function BookingSearchScreen() {
  const [searchFilters, setSearchFilters] = useState<BookingSearchFilters>({
    location: '',
    guests: 2,
  });
  const [activeCategory, setActiveCategory] = useState<'all' | 'hotel' | 'hostel' | 'apartment' | 'villa' | 'cabin' | 'activity' | 'flight' | 'car_rental' | 'tour' | 'experience' | 'restaurant' | 'uber' | 'meal_deal'>('all');
  const [bookingItems] = useState<BookingItem[]>(mockBookingItems);
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = [
    { id: 'all', name: 'All', icon: '🔍' },
    { id: 'hotel', name: 'Hotels', icon: '🏨' },
    { id: 'hostel', name: 'Hostels', icon: '🏠' },
    { id: 'apartment', name: 'Apartments', icon: '🏢' },
    { id: 'cabin', name: 'Cabins', icon: '🏘️' },
    { id: 'flight', name: 'Flights', icon: '✈️' },
    { id: 'car_rental', name: 'Cars', icon: '🚗' },
    { id: 'uber', name: 'Rides', icon: '🚕' },
    { id: 'tour', name: 'Tours', icon: '🗺️' },
    { id: 'experience', name: 'Experiences', icon: '🎯' },
    { id: 'activity', name: 'Activities', icon: '🎪' },
    { id: 'restaurant', name: 'Dining', icon: '🍽️' },
    { id: 'meal_deal', name: 'Meal Deals', icon: '🍱' },
  ];

  const filteredItems = bookingItems.filter(item => {
    if (activeCategory !== 'all' && item.type !== activeCategory) return false;
    if (searchFilters.location && !item.location.toLowerCase().includes(searchFilters.location.toLowerCase())) return false;
    return true;
  });

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleBookItem = (item: BookingItem) => {
    Alert.alert(
      'Book Now',
      `Book ${item.name} for $${item.price} ${item.currency}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Book Now', 
          onPress: () => {
            router.push({
              pathname: '/booking/confirm',
              params: { itemId: item.id }
            });
          }
        }
      ]
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        color={i < rating ? '#f59e0b' : '#e5e7eb'}
        fill={i < rating ? '#f59e0b' : 'transparent'}
      />
    ));
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Book Your Trip' }} />
      <View style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={['#f97316', '#ea580c']}
          style={styles.header}
        >
          <Search color="#ffffff" size={32} />
          <Text style={styles.headerTitle}>Book Your Trip</Text>
          <Text style={styles.headerSubtitle}>Complete trip booking - flights, hotels, cars, tours & dining</Text>
        </LinearGradient>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <MapPin color="#6b7280" size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Where do you want to go?"
              value={searchFilters.location}
              onChangeText={(text) => setSearchFilters(prev => ({ ...prev, location: text }))}
            />
            <TouchableOpacity style={styles.filterButton}>
              <Filter color="#6b7280" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <ScrollView horizontal style={styles.categoriesContainer} showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                activeCategory === category.id && styles.activeCategoryButton
              ]}
              onPress={() => setActiveCategory(category.id as any)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryText,
                activeCategory === category.id && styles.activeCategoryText
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results */}
        <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.resultsTitle}>
            {filteredItems.length} results found
          </Text>

          {filteredItems.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              {item.discount && (
                <DiscountBanner 
                  discount={item.discount} 
                  onPress={() => Alert.alert('Discount Applied!', `${item.discount?.description}\n\nCode: ${item.discount?.code || 'Auto-applied'}`)} 
                />
              )}
              <View style={styles.itemImageContainer}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.itemImage}
                  contentFit="cover"
                />
                <TouchableOpacity 
                  style={styles.favoriteButton}
                  onPress={() => toggleFavorite(item.id)}
                >
                  <Heart 
                    color={favorites.includes(item.id) ? '#dc2626' : '#ffffff'} 
                    size={20}
                    fill={favorites.includes(item.id) ? '#dc2626' : 'transparent'}
                  />
                </TouchableOpacity>
                <View style={styles.typeTag}>
                  <Text style={styles.typeTagText}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1).replace('_', ' ')}
                  </Text>
                </View>
                {item.discount && (
                  <View style={styles.discountTag}>
                    <Tag color="#ffffff" size={12} />
                    <Text style={styles.discountTagText}>{item.discount.percentage}% OFF</Text>
                  </View>
                )}
              </View>

              <View style={styles.itemInfo}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {item.rating && (
                    <View style={styles.ratingContainer}>
                      {renderStars(item.rating)}
                      <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.itemDescription}>{item.description}</Text>

                <View style={styles.itemDetails}>
                  <View style={styles.locationRow}>
                    <MapPin color="#6b7280" size={16} />
                    <Text style={styles.locationText}>{item.location}</Text>
                  </View>
                  {item.duration && (
                    <Text style={styles.durationText}>Duration: {item.duration}</Text>
                  )}
                </View>

                {item.features && (
                  <View style={styles.featuresContainer}>
                    {item.features.slice(0, 3).map((feature, index) => (
                      <View key={index} style={styles.featureTag}>
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                    {item.features.length > 3 && (
                      <Text style={styles.moreFeatures}>+{item.features.length - 3} more</Text>
                    )}
                  </View>
                )}

                <View style={styles.itemFooter}>
                  <View style={styles.priceContainer}>
                    {item.originalPrice && (
                      <Text style={styles.originalPrice}>${item.originalPrice}</Text>
                    )}
                    <Text style={styles.price}>${item.price}</Text>
                    <Text style={styles.currency}>{item.currency}</Text>
                    {(item.type === 'hotel' || item.type === 'hostel' || item.type === 'apartment' || item.type === 'cabin') && (
                      <Text style={styles.priceUnit}>per night</Text>
                    )}
                    {item.type === 'meal_deal' && (
                      <Text style={styles.priceUnit}>per combo</Text>
                    )}
                  </View>
                  <TouchableOpacity 
                    style={[
                      styles.bookButton,
                      !item.availability && styles.bookButtonDisabled
                    ]}
                    onPress={() => handleBookItem(item)}
                    disabled={!item.availability}
                  >
                    <Text style={styles.bookButtonText}>
                      {item.availability ? 'Book Now' : 'Unavailable'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 12,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fed7aa',
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: -15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  filterButton: {
    padding: 4,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  categoryButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeCategoryButton: {
    backgroundColor: '#f97316',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  activeCategoryText: {
    color: '#ffffff',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
  },
  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  itemImageContainer: {
    height: 200,
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  typeTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  typeTagText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  discountTag: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: '#dc2626',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  discountTagText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  itemInfo: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  itemDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  itemDetails: {
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 4,
  },
  durationText: {
    fontSize: 14,
    color: '#6b7280',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  featureTag: {
    backgroundColor: '#eff6ff',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '500',
  },
  moreFeatures: {
    fontSize: 12,
    color: '#6b7280',
    alignSelf: 'center',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  originalPrice: {
    fontSize: 16,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
  },
  currency: {
    fontSize: 16,
    color: '#059669',
    fontWeight: '600',
  },
  priceUnit: {
    fontSize: 14,
    color: '#6b7280',
  },
  bookButton: {
    backgroundColor: '#f97316',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  bookButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});