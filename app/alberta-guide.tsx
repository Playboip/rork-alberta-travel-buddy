import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Search, MapPin, Star, Clock, Filter, Mountain, Waves, TreePine, Bike, Utensils, Bed, Eye, Fish, Droplets, Bird, Truck, AlertTriangle, Map, ChevronDown, ChevronUp, Maximize2 } from 'lucide-react-native';
import { ALL_ALBERTA_ATTRACTIONS, AlbertaAttraction } from '@/constants/alberta-attractions';
import WildlifeMap from '@/components/map/WildlifeMap';

type CategoryFilter = 'all' | 'hiking' | 'hotspring' | 'hidden-gem' | 'cycling' | 'walking' | 'adventure' | 'sightseeing' | 'accommodation' | 'food' | 'camping' | 'fishing' | 'waterfall' | 'birdwatching' | 'river' | 'lake' | 'foodtruck' | 'hidden-waters' | 'food-all';
type PriceFilter = 'all' | 'free' | '$' | '$$' | '$$$' | '$$$$';
type DifficultyFilter = 'all' | 'easy' | 'moderate' | 'difficult' | 'expert';

const categoryIcons = {
  hiking: TreePine,
  hotspring: Waves,
  'hidden-gem': Eye,
  cycling: Bike,
  walking: TreePine,
  adventure: Mountain,
  sightseeing: Mountain,
  accommodation: Bed,
  food: Utensils,
  camping: TreePine,
  fishing: Fish,
  waterfall: Droplets,
  birdwatching: Bird,
  river: Waves,
  lake: Waves,
  foodtruck: Truck,
  'hidden-waters': Waves,
  'food-all': Utensils,
};

const categoryColors = {
  hiking: '#22c55e',
  hotspring: '#3b82f6',
  'hidden-gem': '#f59e0b',
  cycling: '#ef4444',
  walking: '#10b981',
  adventure: '#8b5cf6',
  sightseeing: '#06b6d4',
  accommodation: '#f97316',
  food: '#ec4899',
  camping: '#84cc16',
  fishing: '#0ea5e9',
  waterfall: '#06b6d4',
  birdwatching: '#eab308',
  river: '#0891b2',
  lake: '#0284c7',
  foodtruck: '#dc2626',
  'hidden-waters': '#0891b2',
  'food-all': '#db2777',
};

const getDifficultyColor = (difficulty?: string) => {
  switch (difficulty) {
    case 'easy': return '#22c55e';
    case 'moderate': return '#f59e0b';
    case 'difficult': return '#ef4444';
    case 'expert': return '#7c2d12';
    default: return '#6b7280';
  }
};

const getPriceColor = (priceRange: string) => {
  switch (priceRange) {
    case 'free': return '#22c55e';
    case '$': return '#10b981';
    case '$$': return '#f59e0b';
    case '$$$': return '#ef4444';
    case '$$$$': return '#7c2d12';
    default: return '#6b7280';
  }
};

interface AttractionCardProps {
  attraction: AlbertaAttraction;
  onPress: () => void;
  showWildlifeBadge?: boolean;
}

const AttractionCard: React.FC<AttractionCardProps> = ({ attraction, onPress, showWildlifeBadge = false }) => {
  const IconComponent = categoryIcons[attraction.category as keyof typeof categoryIcons] || Mountain;
  const categoryColor = categoryColors[attraction.category as keyof typeof categoryColors] || '#6b7280';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} testID={`attraction-${attraction.id}`}>
      <View>
        <Image source={{ uri: attraction.image }} style={styles.cardImage} />
        {showWildlifeBadge && attraction.dangerousAnimals && attraction.dangerousAnimals.length > 0 && (
          <View style={styles.wildlifeOverlay} testID={`wildlife-${attraction.id}`}>
            <AlertTriangle size={14} color="#b91c1c" />
            <Text style={styles.wildlifeText} numberOfLines={1}>
              {attraction.dangerousAnimals.join(', ')}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.titleRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>{attraction.name}</Text>
            {attraction.isHidden && (
              <View style={styles.hiddenBadge}>
                <Eye size={12} color="#f59e0b" />
                <Text style={styles.hiddenText}>Hidden</Text>
              </View>
            )}
          </View>
          
          <View style={styles.locationRow}>
            <MapPin size={14} color="#6b7280" />
            <Text style={styles.locationText} numberOfLines={1}>{attraction.location}</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>{attraction.description}</Text>

        <View style={styles.cardFooter}>
          <View style={styles.leftFooter}>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
              <IconComponent size={14} color={categoryColor} />
              <Text style={[styles.categoryText, { color: categoryColor }]}>
                {attraction.category.replace('-', ' ')}
              </Text>
            </View>
            
            {attraction.difficulty && (
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(attraction.difficulty) + '20' }]}>
                <Text style={[styles.difficultyText, { color: getDifficultyColor(attraction.difficulty) }]}>
                  {attraction.difficulty}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.rightFooter}>
            <View style={styles.ratingRow}>
              <Star size={14} color="#f59e0b" fill="#f59e0b" />
              <Text style={styles.ratingText}>{attraction.rating}</Text>
            </View>
            
            <View style={[styles.priceBadge, { backgroundColor: getPriceColor(attraction.priceRange) + '20' }]}>
              <Text style={[styles.priceText, { color: getPriceColor(attraction.priceRange) }]}>
                {attraction.priceRange === 'free' ? 'FREE' : attraction.priceRange}
              </Text>
            </View>
          </View>
        </View>

        {attraction.duration && (
          <View style={styles.durationRow}>
            <Clock size={12} color="#6b7280" />
            <Text style={styles.durationText}>{attraction.duration}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function AlbertaGuideScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
  const [showHiddenOnly, setShowHiddenOnly] = useState<boolean>(false);
  const [showWildlifeAlerts, setShowWildlifeAlerts] = useState<boolean>(false);
  const [showInlineMap, setShowInlineMap] = useState<boolean>(true);
  const filteredAttractions = useMemo(() => {
    return ALL_ALBERTA_ATTRACTIONS.filter(attraction => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          attraction.name.toLowerCase().includes(query) ||
          attraction.description.toLowerCase().includes(query) ||
          attraction.location.toLowerCase().includes(query) ||
          attraction.features.some(feature => feature.toLowerCase().includes(query)) ||
          attraction.nearestCity.toLowerCase().includes(query);
        
        if (!matchesSearch) return false;
      }

      // Category filter
      if (categoryFilter !== 'all') {
        if (categoryFilter === 'hidden-waters') {
          if (!(attraction.category === 'river' || attraction.category === 'lake')) return false;
        } else if (categoryFilter === 'food-all') {
          if (!(attraction.category === 'food' || attraction.category === 'foodtruck')) return false;
        } else if (attraction.category !== categoryFilter) {
          return false;
        }
      }

      // Price filter
      if (priceFilter !== 'all' && attraction.priceRange !== priceFilter) {
        return false;
      }

      // Difficulty filter
      if (difficultyFilter !== 'all' && attraction.difficulty !== difficultyFilter) {
        return false;
      }

      // Hidden gems filter
      if (showHiddenOnly && !attraction.isHidden) {
        return false;
      }

      return true;
    });
  }, [searchQuery, categoryFilter, priceFilter, difficultyFilter, showHiddenOnly]);

  const categories: { key: CategoryFilter; label: string; icon: any }[] = [
    { key: 'all', label: 'All', icon: Mountain },
    { key: 'waterfall', label: 'Waterfalls', icon: Droplets },
    { key: 'fishing', label: 'Fishing', icon: Fish },
    { key: 'birdwatching', label: 'Birding', icon: Bird },
    { key: 'hidden-waters', label: 'Hidden Rivers & Lakes', icon: Waves },
    { key: 'camping', label: 'Camps & Campgrounds', icon: TreePine },
    { key: 'food-all', label: 'Food Trucks & Local Eats', icon: Utensils },
    { key: 'hidden-gem', label: 'Hidden Gems', icon: Eye },
    { key: 'hotspring', label: 'Hot Springs', icon: Waves },
    { key: 'adventure', label: 'Adventure', icon: Mountain },
    { key: 'accommodation', label: 'Stay', icon: Bed },
  ];

  const handleAttractionPress = (attraction: AlbertaAttraction) => {
    console.log('Selected attraction:', attraction.name);
    try {
      router.push(`/destination/${attraction.id}`);
    } catch (e) {
      console.error('Failed to navigate to destination', e);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setPriceFilter('all');
    setDifficultyFilter('all');
    setShowHiddenOnly(false);
    setShowWildlifeAlerts(false);
  };

  const openWildlifeMap = useCallback(() => {
    try {
      router.push('/map/wildlife');
    } catch (e) {
      console.error('Failed to open wildlife map', e);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Alberta Travel Guide',
          headerStyle: { backgroundColor: '#1f2937' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Discover Alberta&apos;s Hidden Treasures</Text>
          <Text style={styles.subtitle}>
            From majestic waterfalls and hidden fishing spots to secret hot springs and bird watching havens, explore {ALL_ALBERTA_ATTRACTIONS.length} incredible destinations across Wild Rose Country. Includes dangerous animal warnings and safety tips.
          </Text>
          <View style={styles.quickRow}>
            <TouchableOpacity style={styles.quickButton} onPress={openWildlifeMap} testID="open-wildlife-map">
              <Map size={16} color="#111827" />
              <Text style={styles.quickText}>Wildlife Alert Map</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#6b7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search attractions, locations, activities..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        {/* Category Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          <View style={styles.categoryContainer}>
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isSelected = categoryFilter === category.key;
              
              return (
                <TouchableOpacity
                  key={category.key}
                  style={[styles.categoryButton, isSelected && styles.categoryButtonActive]}
                  onPress={() => setCategoryFilter(category.key)}
                >
                  <IconComponent 
                    size={16} 
                    color={isSelected ? '#ffffff' : '#6b7280'} 
                  />
                  <Text style={[styles.categoryButtonText, isSelected && styles.categoryButtonTextActive]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Additional Filters */}
        <View style={styles.filtersRow}>
          <TouchableOpacity
            style={[styles.filterButton, showHiddenOnly && styles.filterButtonActive]}
            onPress={() => setShowHiddenOnly(!showHiddenOnly)}
            testID="filter-hidden"
          >
            <Eye size={14} color={showHiddenOnly ? '#ffffff' : '#6b7280'} />
            <Text style={[styles.filterButtonText, showHiddenOnly && styles.filterButtonTextActive]}>
              Hidden Gems Only
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, showWildlifeAlerts && styles.wildlifeButtonActive]}
            onPress={() => setShowWildlifeAlerts(!showWildlifeAlerts)}
            testID="filter-wildlife"
          >
            <AlertTriangle size={14} color={showWildlifeAlerts ? '#ffffff' : '#b91c1c'} />
            <Text style={[styles.filterButtonText, showWildlifeAlerts && styles.filterButtonTextActive]}>
              Wildlife Alerts
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clearButton} onPress={clearFilters} testID="filter-clear">
            <Filter size={14} color="#ef4444" />
            <Text style={styles.clearButtonText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>

        {/* Results Count */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredAttractions.length} {filteredAttractions.length === 1 ? 'attraction' : 'attractions'} found
          </Text>
          {showHiddenOnly && (
            <Text style={styles.hiddenGemsNote}>
              🗿 Showing hidden gems - local secrets and lesser-known spots
            </Text>
          )}
        </View>

        {showWildlifeAlerts && (
          <View style={styles.miniMapCard} testID="inline-mini-map">
            <View style={styles.miniMapHeader}>
              <View style={styles.miniMapTitleRow}>
                <AlertTriangle size={16} color="#b91c1c" />
                <Text style={styles.miniMapTitle}>Wildlife alerts preview</Text>
              </View>
              <View style={styles.miniMapActions}>
                <TouchableOpacity style={styles.miniMapActionBtn} onPress={openWildlifeMap} testID="inline-map-open-full">
                  <Maximize2 size={14} color="#111827" />
                  <Text style={styles.miniMapActionText}>Open Map</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.miniMapActionBtn} onPress={() => setShowInlineMap(!showInlineMap)} testID="inline-map-toggle">
                  {showInlineMap ? <ChevronUp size={14} color="#111827" /> : <ChevronDown size={14} color="#111827" />}
                  <Text style={styles.miniMapActionText}>{showInlineMap ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              </View>
            </View>
            {showInlineMap && (
              <View style={styles.miniMapBody}>
                <WildlifeMap compact />
              </View>
            )}
          </View>
        )}

        {/* Attractions List */}
        <View style={styles.attractionsList}>
          {filteredAttractions.map((attraction) => (
            <AttractionCard
              key={attraction.id}
              attraction={attraction}
              onPress={() => handleAttractionPress(attraction)}
              showWildlifeBadge={showWildlifeAlerts}
            />
          ))}
        </View>

        {filteredAttractions.length === 0 && (
          <View style={styles.emptyState}>
            <Mountain size={48} color="#9ca3af" />
            <Text style={styles.emptyTitle}>No attractions found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search or filters to discover more amazing places in Alberta.
            </Text>
            <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
              <Text style={styles.clearFiltersButtonText}>Clear All Filters</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🍁 Alberta Travel Buddy - Your guide to Wild Rose Country&apos;s best kept secrets
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#1f2937',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#d1d5db',
    lineHeight: 24,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  categoryScroll: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    gap: 6,
  },
  categoryButtonActive: {
    backgroundColor: '#3b82f6',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    gap: 4,
  },
  filterButtonActive: {
    backgroundColor: '#f59e0b',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#fef2f2',
    gap: 4,
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ef4444',
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  hiddenGemsNote: {
    fontSize: 14,
    color: '#f59e0b',
    fontStyle: 'italic',
  },
  attractionsList: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f3f4f6',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  hiddenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
  },
  hiddenText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#f59e0b',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  leftFooter: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  rightFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  priceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#6b7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  clearFiltersButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  clearFiltersButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  quickRow: { marginTop: 12, flexDirection: 'row', gap: 8 },
  quickButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12 },
  quickText: { fontSize: 12, fontWeight: '700', color: '#111827' },
  wildlifeOverlay: {
    position: 'absolute',
    left: 8,
    top: 8,
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  wildlifeText: {
    fontSize: 12,
    color: '#991b1b',
    fontWeight: '600',
    maxWidth: 260,
  },
  wildlifeButtonActive: {
    backgroundColor: '#b91c1c',
  },
  miniMapCard: { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#ffffff', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb' },
  miniMapHeader: { paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#f9fafb', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  miniMapTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  miniMapTitle: { fontSize: 12, fontWeight: '800', color: '#111827' },
  miniMapActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  miniMapActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 10 },
  miniMapActionText: { fontSize: 12, fontWeight: '700', color: '#111827' },
  miniMapBody: { height: 180 },
}
);