import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Compass, Sparkles, Search, TrendingUp, Percent, Home, Car, Utensils } from 'lucide-react-native';
import { Stack, router } from 'expo-router';
import { Image } from 'expo-image';
import DiscountBanner from '@/components/shared/DiscountBanner';

interface Destination {
  id: string;
  name: string;
  location: string;
  description: string;
  category: string;
  image: string;
  rating: number;
}

const featuredDestinations: Destination[] = [
  {
    id: '1',
    name: 'Banff National Park',
    location: '1.5 hours from Calgary',
    description: 'Stunning mountain landscapes and pristine lakes',
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    rating: 4.9
  },
  {
    id: '2',
    name: 'Jasper National Park',
    location: '4 hours from Edmonton',
    description: 'Dark sky preserve with incredible wildlife',
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    rating: 4.8
  },
  {
    id: '3',
    name: 'Lake Louise',
    location: '2 hours from Calgary',
    description: 'Iconic turquoise lake surrounded by peaks',
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
    rating: 4.9
  }
];

const trendingCategories = [
  { name: 'Mountain Adventures', icon: '🏔️', count: 24 },
  { name: 'City Escapes', icon: '🏙️', count: 18 },
  { name: 'Winter Sports', icon: '⛷️', count: 15 },
  { name: 'Cultural Sites', icon: '🏛️', count: 12 }
];

const nearbyPlaces = [
  { name: 'Calgary Tower', distance: '2 km', type: 'Landmark' },
  { name: 'Prince\'s Island Park', distance: '3 km', type: 'Park' },
  { name: 'Heritage Park', distance: '8 km', type: 'Historical' },
  { name: 'Canada Olympic Park', distance: '12 km', type: 'Sports' },
  { name: 'Fish Creek Park', distance: '15 km', type: 'Nature' }
];

const trendingDestinations = [
  { name: 'Moraine Lake', popularity: '95%', category: 'Nature' },
  { name: 'Columbia Icefield', popularity: '88%', category: 'Adventure' },
  { name: 'Waterton Lakes', popularity: '82%', category: 'Nature' },
  { name: 'Drumheller Badlands', popularity: '76%', category: 'Geological' }
];

const categoryDestinations: { [key: string]: any[] } = {
  'Mountain Adventures': [
    { name: 'Mount Assiniboine', difficulty: 'Expert', season: 'Summer' },
    { name: 'Kananaskis Country', difficulty: 'Intermediate', season: 'All Year' },
    { name: 'Mount Rundle', difficulty: 'Advanced', season: 'Summer' }
  ],
  'City Escapes': [
    { name: 'Edmonton River Valley', type: 'Urban Nature', duration: '1 day' },
    { name: 'Calgary Stampede', type: 'Festival', duration: '10 days' },
    { name: 'Red Deer Discovery Canyon', type: 'Urban Adventure', duration: 'Half day' }
  ],
  'Winter Sports': [
    { name: 'Lake Louise Ski Resort', type: 'Skiing', season: 'Nov-May' },
    { name: 'Marmot Basin', type: 'Skiing', season: 'Nov-Apr' },
    { name: 'Nakiska Ski Area', type: 'Skiing', season: 'Dec-Apr' }
  ],
  'Cultural Sites': [
    { name: 'Head-Smashed-In Buffalo Jump', type: 'UNESCO Site', era: 'Ancient' },
    { name: 'Ukrainian Cultural Heritage Village', type: 'Living History', era: '1890s-1930s' },
    { name: 'Royal Tyrrell Museum', type: 'Paleontology', era: 'Prehistoric' }
  ]
};

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleAIPlanner = () => {
    router.push('/plan');
  };

  const handleNearby = () => {
    const nearbyList = nearbyPlaces.map(place => 
      `• ${place.name} (${place.distance}) - ${place.type}`
    ).join('\n');
    
    Alert.alert(
      'Nearby Places', 
      `Here are places near Calgary:\n\n${nearbyList}`,
      [
        { text: 'Close', style: 'cancel' },
        { text: 'Get Directions', onPress: () => Alert.alert('Directions', 'Opening maps...') }
      ]
    );
  };

  const handleTrending = () => {
    const trendingList = trendingDestinations.map(dest => 
      `• ${dest.name} - ${dest.popularity} popular (${dest.category})`
    ).join('\n');
    
    Alert.alert(
      'Trending Destinations', 
      `Most popular right now:\n\n${trendingList}`,
      [
        { text: 'Close', style: 'cancel' },
        { text: 'Plan Trip', onPress: () => router.push('/plan') }
      ]
    );
  };

  const handleCategoryPress = (category: any) => {
    const destinations = categoryDestinations[category.name] || [];
    const destList = destinations.map(dest => {
      if (category.name === 'Mountain Adventures') {
        return `• ${dest.name} - ${dest.difficulty} (${dest.season})`;
      } else if (category.name === 'City Escapes') {
        return `• ${dest.name} - ${dest.type} (${dest.duration})`;
      } else if (category.name === 'Winter Sports') {
        return `• ${dest.name} - ${dest.type} (${dest.season})`;
      } else if (category.name === 'Cultural Sites') {
        return `• ${dest.name} - ${dest.type} (${dest.era})`;
      }
      return `• ${dest.name}`;
    }).join('\n');
    
    Alert.alert(
      category.name,
      `${category.count} places available:\n\n${destList}`,
      [
        { text: 'Close', style: 'cancel' },
        { text: 'Plan Trip Here', onPress: () => router.push('/plan') }
      ]
    );
  };

  const handleDestinationPress = (destination: Destination) => {
    Alert.alert(
      destination.name,
      `${destination.description}

Location: ${destination.location}
Rating: ${destination.rating}/5`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Plan Trip Here', onPress: () => router.push('/plan') }
      ]
    );
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      Alert.alert('Search Results', `Searching for "${searchQuery}"...`);
    } else {
      Alert.alert('Search', 'Please enter a destination to search');
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: false
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={['#1e40af', '#7c3aed']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Ready to explore?</Text>
            <Text style={styles.subtitle}>Discover amazing destinations from Alberta</Text>
            
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Search color="#6b7280" size={20} />
              <TextInput
                style={styles.searchInput}
                placeholder="Where do you want to go?"
                placeholderTextColor="#6b7280"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              <TouchableOpacity onPress={handleSearch}>
                <Text style={styles.searchButton}>Search</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleAIPlanner}>
            <Sparkles color="#f97316" size={24} />
            <Text style={styles.actionText}>AI Planner</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/discounts')}>
            <Percent color="#dc2626" size={24} />
            <Text style={styles.actionText}>Deals</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/booking/search')}>
            <Home color="#059669" size={24} />
            <Text style={styles.actionText}>Book</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Discount Banner */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Hot Deals</Text>
          <DiscountBanner 
            discount={{
              percentage: 30,
              code: 'FOODIE30',
              validUntil: '2024-11-30',
              description: 'Try local hidden gems with 30% off meal combos!',
              type: 'partner'
            }}
            onPress={() => router.push('/discounts')}
          />
        </View>

        {/* Accommodation Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stay Your Way</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            <TouchableOpacity 
              style={styles.accommodationCard}
              onPress={() => router.push('/booking/search')}
            >
              <Home color="#1e40af" size={32} />
              <Text style={styles.accommodationName}>Hotels</Text>
              <Text style={styles.accommodationDesc}>Luxury & comfort</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.accommodationCard}
              onPress={() => router.push('/booking/search')}
            >
              <Text style={styles.accommodationIcon}>🏠</Text>
              <Text style={styles.accommodationName}>Hostels</Text>
              <Text style={styles.accommodationDesc}>Budget-friendly</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.accommodationCard}
              onPress={() => router.push('/booking/search')}
            >
              <Text style={styles.accommodationIcon}>🏢</Text>
              <Text style={styles.accommodationName}>Apartments</Text>
              <Text style={styles.accommodationDesc}>Home away from home</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.accommodationCard}
              onPress={() => router.push('/booking/search')}
            >
              <Text style={styles.accommodationIcon}>🏘️</Text>
              <Text style={styles.accommodationName}>Cabins</Text>
              <Text style={styles.accommodationDesc}>Nature retreats</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Transportation Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get Around</Text>
          <View style={styles.transportGrid}>
            <TouchableOpacity 
              style={styles.transportCard}
              onPress={() => router.push('/booking/search')}
            >
              <Car color="#f97316" size={24} />
              <Text style={styles.transportName}>Car Rentals</Text>
              <Text style={styles.transportDiscount}>20% off</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.transportCard}
              onPress={() => router.push('/booking/search')}
            >
              <Text style={styles.transportIcon}>🚕</Text>
              <Text style={styles.transportName}>Uber Rides</Text>
              <Text style={styles.transportDiscount}>New user deals</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.transportCard}
              onPress={() => router.push('/booking/search')}
            >
              <Utensils color="#059669" size={24} />
              <Text style={styles.transportName}>Meal Deals</Text>
              <Text style={styles.transportDiscount}>30% off combos</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Trending Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {trendingCategories.map((category, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.count} places</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Destinations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Destinations</Text>
          {featuredDestinations.map((destination) => (
            <TouchableOpacity 
              key={destination.id} 
              style={styles.destinationCard}
              onPress={() => handleDestinationPress(destination)}
            >
              <View style={styles.destinationImageContainer}>
                <Image
                  source={{ uri: destination.image }}
                  style={styles.destinationImage}
                  contentFit="cover"
                  transition={200}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={styles.imageOverlay}
                />
                <View style={styles.destinationInfo}>
                  <Text style={styles.destinationName}>{destination.name}</Text>
                  <View style={styles.locationRow}>
                    <MapPin color="#ffffff" size={16} />
                    <Text style={styles.destinationLocation}>{destination.location}</Text>
                  </View>
                </View>
                <View style={styles.ratingBadge}>
                  <Text style={styles.rating}>⭐ {destination.rating}</Text>
                </View>
              </View>
              <View style={styles.destinationDetails}>
                <Text style={styles.destinationDescription}>{destination.description}</Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{destination.category}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* AI Suggestions */}
        <View style={styles.section}>
          <View style={styles.aiSuggestionCard}>
            <LinearGradient
              colors={['#f97316', '#ea580c']}
              style={styles.aiGradient}
            >
              <Sparkles color="#ffffff" size={28} />
              <Text style={styles.aiTitle}>Get Personalized Recommendations</Text>
              <Text style={styles.aiSubtitle}>Let our AI create the perfect trip based on your preferences</Text>
              <TouchableOpacity style={styles.aiButton} onPress={handleAIPlanner}>
                <Text style={styles.aiButtonText}>Start Planning</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e2e8f0',
    marginBottom: 24,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
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
  searchButton: {
    color: '#1e40af',
    fontWeight: '600',
    fontSize: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  categoriesScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  categoryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  destinationCard: {
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
  destinationImageContainer: {
    height: 200,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  destinationImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  destinationInfo: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  destinationName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  destinationLocation: {
    fontSize: 14,
    color: '#e2e8f0',
    marginLeft: 4,
  },
  ratingBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rating: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  destinationDetails: {
    padding: 16,
  },
  destinationDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#eff6ff',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e40af',
  },
  aiSuggestionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  aiGradient: {
    padding: 24,
    alignItems: 'center',
  },
  aiTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  aiSubtitle: {
    fontSize: 14,
    color: '#fed7aa',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  aiButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  aiButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ea580c',
  },
  accommodationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accommodationIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  accommodationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  accommodationDesc: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
  },
  transportGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  transportCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transportIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  transportName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  transportDiscount: {
    fontSize: 10,
    color: '#dc2626',
    fontWeight: '600',
    textAlign: 'center',
  },
});