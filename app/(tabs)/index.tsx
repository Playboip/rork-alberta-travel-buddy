import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Compass, Sparkles, Search, TrendingUp, Percent, Home, Car, Utensils, Mountain, Waves, Eye, TreePine, Tent } from 'lucide-react-native';
import { Stack, router } from 'expo-router';
import { Image } from 'expo-image';
import DiscountBanner from '@/components/shared/DiscountBanner';
import Logo from '@/components/shared/Logo';
import { ALL_ALBERTA_ATTRACTIONS, getAttractionsByCategory, getHiddenGems, searchAttractions, AlbertaAttraction } from '@/constants/alberta-attractions';

const featuredDestinations = ALL_ALBERTA_ATTRACTIONS.slice(0, 6);

const trendingCategories = [
  { name: 'Hiking Trails', icon: Mountain, count: getAttractionsByCategory('hiking').length, category: 'hiking' },
  { name: 'Hot Springs', icon: Waves, count: getAttractionsByCategory('hotspring').length, category: 'hotspring' },
  { name: 'Hidden Gems', icon: Eye, count: getHiddenGems().length, category: 'hidden-gem' },
  { name: 'Cycling Routes', icon: TreePine, count: getAttractionsByCategory('cycling').length, category: 'cycling' },
  { name: 'Camping', icon: Tent, count: getAttractionsByCategory('camping').length, category: 'camping' },
  { name: 'Food & Dining', icon: Utensils, count: getAttractionsByCategory('food').length, category: 'food' }
];

const nearbyPlaces = [
  { name: 'Bow River Pathway', distance: 'Downtown Calgary', type: 'Cycling' },
  { name: 'Prince\'s Island Park', distance: '3 km', type: 'Walking' },
  { name: 'Fish Creek Park', distance: '15 km', type: 'Nature' },
  { name: 'Kananaskis Country', distance: '1 hour', type: 'Hiking' },
  { name: 'Canmore', distance: '1.5 hours', type: 'Mountain Town' }
];

const trendingDestinations = [
  { name: 'Abraham Lake (Bubble Lake)', popularity: '95%', category: 'Hidden Gem' },
  { name: 'Miette Hot Springs', popularity: '88%', category: 'Hot Springs' },
  { name: 'Writing-on-Stone Park', popularity: '82%', category: 'Cultural' },
  { name: 'Iceline Trail', popularity: '76%', category: 'Hiking' }
];

const getCategoryDestinations = (category: string) => {
  return getAttractionsByCategory(category);
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
    const destinations = getCategoryDestinations(category.category);
    const destList = destinations.slice(0, 5).map(dest => {
      const difficultyText = dest.difficulty ? ` - ${dest.difficulty}` : '';
      const priceText = dest.priceRange !== 'free' ? ` (${dest.priceRange})` : ' (Free)';
      return `• ${dest.name}${difficultyText}${priceText}\n  ${dest.location} - ${dest.season}`;
    }).join('\n\n');
    
    Alert.alert(
      category.name,
      `${category.count} amazing ${category.name.toLowerCase()} in Alberta:\n\n${destList}${destinations.length > 5 ? '\n\n...and more!' : ''}`,
      [
        { text: 'Close', style: 'cancel' },
        { text: 'Explore All', onPress: () => router.push('/plan') }
      ]
    );
  };

  const handleDestinationPress = (destination: AlbertaAttraction) => {
    const features = destination.features.slice(0, 3).join(', ');
    const tips = destination.tips ? destination.tips.slice(0, 2).join('\n• ') : '';
    
    Alert.alert(
      destination.name,
      `${destination.description}\n\n📍 ${destination.location}\n⭐ ${destination.rating}/5 rating\n💰 ${destination.priceRange === 'free' ? 'Free' : destination.priceRange}\n🎯 ${features}${destination.duration ? `\n⏱️ ${destination.duration}` : ''}${tips ? `\n\n💡 Tips:\n• ${tips}` : ''}`,
      [
        { text: 'Close', style: 'cancel' },
        { text: 'Add to Trip', onPress: () => router.push('/plan') }
      ]
    );
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = searchAttractions(searchQuery);
      if (results.length > 0) {
        const resultsList = results.slice(0, 5).map(result => 
          `• ${result.name} - ${result.location} (${result.category})`
        ).join('\n');
        Alert.alert(
          `Found ${results.length} results`,
          `${resultsList}${results.length > 5 ? '\n\n...and more!' : ''}`,
          [
            { text: 'Close', style: 'cancel' },
            { text: 'View All', onPress: () => router.push('/plan') }
          ]
        );
      } else {
        Alert.alert('No Results', `No attractions found for "${searchQuery}". Try searching for hiking, hot springs, or hidden gems!`);
      }
    } else {
      Alert.alert('Search', 'Try searching for "hiking", "hot springs", "hidden gems", or any Alberta location!');
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
            <Logo size={80} style={styles.logo} />
            <Text style={styles.greeting}>Ready to explore?</Text>
            <Text style={styles.subtitle}>Discover Alberta&apos;s hidden gems, trails, hot springs & adventures</Text>
            
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Search color="#6b7280" size={20} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search hiking trails, hot springs, hidden gems..."
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
          <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Alberta Guide', `Browse all ${ALL_ALBERTA_ATTRACTIONS.length} Alberta attractions including:\n\n• ${getAttractionsByCategory('hiking').length} Hiking Trails\n• ${getAttractionsByCategory('hotspring').length} Hot Springs\n• ${getHiddenGems().length} Hidden Gems\n• ${getAttractionsByCategory('cycling').length} Cycling Routes\n• ${getAttractionsByCategory('food').length} Food & Dining\n• ${getAttractionsByCategory('accommodation').length} Accommodations\n\nUse the categories above to explore!`)}>
            <Mountain color="#7c3aed" size={24} />
            <Text style={styles.actionText}>Guide</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Discount Banner */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Alberta Adventure Deals</Text>
          <DiscountBanner 
            discount={{
              percentage: 25,
              code: 'ALBERTA25',
              validUntil: '2024-12-31',
              description: 'Discover Alberta&apos;s hidden gems with 25% off guided tours and experiences!',
              type: 'partner'
            }}
            onPress={() => router.push('/discounts')}
          />
        </View>

        {/* Alberta Accommodation Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stay in Alberta</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            <TouchableOpacity 
              style={styles.accommodationCard}
              onPress={() => router.push('/booking/search')}
            >
              <Home color="#1e40af" size={32} />
              <Text style={styles.accommodationName}>Mountain Lodges</Text>
              <Text style={styles.accommodationDesc}>Rockies luxury</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.accommodationCard}
              onPress={() => router.push('/booking/search')}
            >
              <Text style={styles.accommodationIcon}>🏕️</Text>
              <Text style={styles.accommodationName}>Campgrounds</Text>
              <Text style={styles.accommodationDesc}>Under the stars</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.accommodationCard}
              onPress={() => router.push('/booking/search')}
            >
              <Text style={styles.accommodationIcon}>🚐</Text>
              <Text style={styles.accommodationName}>RV Parks</Text>
              <Text style={styles.accommodationDesc}>Road trip ready</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.accommodationCard}
              onPress={() => router.push('/booking/search')}
            >
              <Text style={styles.accommodationIcon}>🏘️</Text>
              <Text style={styles.accommodationName}>Ranch Stays</Text>
              <Text style={styles.accommodationDesc}>Authentic Alberta</Text>
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
            {trendingCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <TouchableOpacity 
                  key={index} 
                  style={styles.categoryCard}
                  onPress={() => handleCategoryPress(category)}
                >
                  <IconComponent color="#1e40af" size={32} />
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryCount}>{category.count} places</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Featured Alberta Attractions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Alberta Attractions</Text>
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
              <Text style={styles.aiTitle}>Get Personalized Alberta Recommendations</Text>
              <Text style={styles.aiSubtitle}>Let our AI create the perfect Alberta adventure based on your interests - hiking, hot springs, hidden gems & more</Text>
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
  logo: {
    marginBottom: 16,
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
    paddingHorizontal: 16,
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