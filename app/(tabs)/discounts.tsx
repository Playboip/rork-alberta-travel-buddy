import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Percent, Clock, Users, Star, Gift, MapPin, Calendar } from 'lucide-react-native';
import { Stack, router } from 'expo-router';
import DiscountBanner from '@/components/shared/DiscountBanner';
import { Image } from 'expo-image';

interface DiscountDeal {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'accommodation' | 'transport' | 'food' | 'activities' | 'flights';
  location: string;
  originalPrice: number;
  discountedPrice: number;
  currency: string;
  validUntil: string;
  discount: {
    percentage: number;
    code?: string;
    validUntil?: string;
    description: string;
    type: 'early_bird' | 'last_minute' | 'loyalty' | 'group' | 'seasonal' | 'partner';
  };
  provider: string;
  termsAndConditions: string[];
}

const mockDiscountDeals: DiscountDeal[] = [
  {
    id: '1',
    title: 'Uber Airport Transfers',
    description: 'Get 20% off your first airport transfer with Uber',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop',
    category: 'transport',
    location: 'All Major Cities',
    originalPrice: 150,
    discountedPrice: 120,
    currency: 'CAD',
    validUntil: '2024-12-31',
    discount: {
      percentage: 20,
      code: 'RIDE20',
      validUntil: '2024-12-31',
      description: 'New user discount on airport transfers!',
      type: 'partner'
    },
    provider: 'Uber',
    termsAndConditions: [
      'Valid for new users only',
      'One-time use per account',
      'Cannot be combined with other offers',
      'Valid for airport transfers only'
    ]
  },
  {
    id: '2',
    title: 'Local Restaurant Combo',
    description: 'Breakfast + Lunch at hidden gem restaurants',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    category: 'food',
    location: 'Banff, AB',
    originalPrice: 50,
    discountedPrice: 35,
    currency: 'CAD',
    validUntil: '2024-11-30',
    discount: {
      percentage: 30,
      code: 'FOODIE30',
      validUntil: '2024-11-30',
      description: 'Try local hidden gems with 30% off!',
      type: 'partner'
    },
    provider: 'Local Eats Network',
    termsAndConditions: [
      'Valid at participating restaurants only',
      'Must be used within 7 days of purchase',
      'Cannot be split across multiple days',
      'Advance booking recommended'
    ]
  },
  {
    id: '3',
    title: 'Hostel Adventure Package',
    description: 'Stay at adventure hostels with group activities included',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop',
    category: 'accommodation',
    location: 'Canadian Rockies',
    originalPrice: 60,
    discountedPrice: 45,
    currency: 'CAD',
    validUntil: '2024-11-30',
    discount: {
      percentage: 25,
      code: 'BACKPACK25',
      validUntil: '2024-11-30',
      description: 'Special rate for backpackers!',
      type: 'group'
    },
    provider: 'Adventure Hostels Network',
    termsAndConditions: [
      'Minimum 2-night stay required',
      'Valid for dorm beds only',
      'Group activities subject to weather',
      'Must show valid student/youth ID'
    ]
  },
  {
    id: '4',
    title: 'Last-Minute Flight Deals',
    description: 'Save on domestic flights booked within 48 hours',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop',
    category: 'flights',
    location: 'Canada-wide',
    originalPrice: 189,
    discountedPrice: 151,
    currency: 'CAD',
    validUntil: '2024-08-15',
    discount: {
      percentage: 20,
      code: 'LASTMIN20',
      validUntil: '2024-08-15',
      description: 'Last minute booking special!',
      type: 'last_minute'
    },
    provider: 'WestJet',
    termsAndConditions: [
      'Must book within 48 hours of departure',
      'Subject to seat availability',
      'No changes or cancellations allowed',
      'Valid for economy class only'
    ]
  },
  {
    id: '5',
    title: 'Car Rental Partner Deal',
    description: 'Exclusive discount on SUV and sedan rentals',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop',
    category: 'transport',
    location: 'Major Cities',
    originalPrice: 89,
    discountedPrice: 71,
    currency: 'CAD',
    validUntil: '2024-12-31',
    discount: {
      percentage: 20,
      code: 'DRIVE20',
      validUntil: '2024-12-31',
      description: 'Partner discount with Enterprise!',
      type: 'partner'
    },
    provider: 'Enterprise Rent-A-Car',
    termsAndConditions: [
      'Valid driver\'s license required',
      'Minimum age 25 years',
      'Insurance not included',
      'Fuel charges apply'
    ]
  },
  {
    id: '6',
    title: 'Seasonal Cabin Retreat',
    description: 'Escape to nature with cozy mountain cabins',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
    category: 'accommodation',
    location: 'Canmore, AB',
    originalPrice: 275,
    discountedPrice: 220,
    currency: 'CAD',
    validUntil: '2024-12-15',
    discount: {
      percentage: 20,
      code: 'NATURE20',
      validUntil: '2024-12-15',
      description: 'Escape to nature with 20% off!',
      type: 'seasonal'
    },
    provider: 'Mountain Cabins',
    termsAndConditions: [
      'Minimum 2-night stay',
      'Check-in after 4 PM',
      'Check-out before 11 AM',
      'Pet-friendly with additional fee'
    ]
  }
];

export default function DiscountsScreen() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'accommodation' | 'transport' | 'food' | 'activities' | 'flights'>('all');
  const [deals] = useState<DiscountDeal[]>(mockDiscountDeals);

  const categories = [
    { id: 'all', name: 'All Deals', icon: '🎯' },
    { id: 'accommodation', name: 'Stay', icon: '🏠' },
    { id: 'transport', name: 'Transport', icon: '🚗' },
    { id: 'flights', name: 'Flights', icon: '✈️' },
    { id: 'food', name: 'Food', icon: '🍽️' },
    { id: 'activities', name: 'Activities', icon: '🎪' },
  ];

  const filteredDeals = deals.filter(deal => 
    activeCategory === 'all' || deal.category === activeCategory
  );

  const handleClaimDeal = (deal: DiscountDeal) => {
    Alert.alert(
      'Claim Discount',
      `Claim ${deal.discount.percentage}% off ${deal.title}?\n\nCode: ${deal.discount.code}\nValid until: ${new Date(deal.validUntil).toLocaleDateString()}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Claim Deal', 
          onPress: () => {
            Alert.alert(
              'Deal Claimed!',
              `Your discount code ${deal.discount.code} has been saved to your account. Use it when booking!`,
              [
                { text: 'Book Now', onPress: () => router.push('/booking/search') },
                { text: 'OK', style: 'cancel' }
              ]
            );
          }
        }
      ]
    );
  };

  const handleViewTerms = (deal: DiscountDeal) => {
    Alert.alert(
      'Terms & Conditions',
      deal.termsAndConditions.join('\n\n• '),
      [{ text: 'OK' }]
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'accommodation': return '🏠';
      case 'transport': return '🚗';
      case 'flights': return '✈️';
      case 'food': return '🍽️';
      case 'activities': return '🎪';
      default: return '🎯';
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Exclusive Discounts' }} />
      <View style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={['#dc2626', '#b91c1c']}
          style={styles.header}
        >
          <Percent color="#ffffff" size={32} />
          <Text style={styles.headerTitle}>Exclusive Discounts</Text>
          <Text style={styles.headerSubtitle}>Save big on your next adventure with partner deals</Text>
        </LinearGradient>

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

        {/* Deals List */}
        <ScrollView style={styles.dealsContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.dealsTitle}>
            {filteredDeals.length} exclusive deals available
          </Text>

          {filteredDeals.map((deal) => (
            <View key={deal.id} style={styles.dealCard}>
              <DiscountBanner 
                discount={deal.discount}
                onPress={() => handleClaimDeal(deal)}
              />
              
              <View style={styles.dealImageContainer}>
                <Image
                  source={{ uri: deal.image }}
                  style={styles.dealImage}
                  contentFit="cover"
                />
                <View style={styles.categoryTag}>
                  <Text style={styles.categoryTagText}>
                    {getCategoryIcon(deal.category)} {deal.category.charAt(0).toUpperCase() + deal.category.slice(1)}
                  </Text>
                </View>
              </View>

              <View style={styles.dealInfo}>
                <Text style={styles.dealTitle}>{deal.title}</Text>
                <Text style={styles.dealDescription}>{deal.description}</Text>

                <View style={styles.dealDetails}>
                  <View style={styles.detailRow}>
                    <MapPin color="#6b7280" size={16} />
                    <Text style={styles.detailText}>{deal.location}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Calendar color="#6b7280" size={16} />
                    <Text style={styles.detailText}>
                      Valid until {new Date(deal.validUntil).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                <View style={styles.priceSection}>
                  <View style={styles.priceContainer}>
                    <Text style={styles.originalPrice}>${deal.originalPrice}</Text>
                    <Text style={styles.discountedPrice}>${deal.discountedPrice}</Text>
                    <Text style={styles.currency}>{deal.currency}</Text>
                  </View>
                  <Text style={styles.savings}>
                    Save ${deal.originalPrice - deal.discountedPrice}!
                  </Text>
                </View>

                <View style={styles.dealActions}>
                  <TouchableOpacity 
                    style={styles.termsButton}
                    onPress={() => handleViewTerms(deal)}
                  >
                    <Text style={styles.termsButtonText}>Terms</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.claimButton}
                    onPress={() => handleClaimDeal(deal)}
                  >
                    <Text style={styles.claimButtonText}>Claim Deal</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.provider}>Provided by {deal.provider}</Text>
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
    color: '#fecaca',
    textAlign: 'center',
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
    backgroundColor: '#dc2626',
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
  dealsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dealsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
  },
  dealCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  dealImageContainer: {
    height: 180,
    position: 'relative',
  },
  dealImage: {
    width: '100%',
    height: '100%',
  },
  categoryTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryTagText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  dealInfo: {
    padding: 16,
  },
  dealTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  dealDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  dealDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
  },
  priceSection: {
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 16,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  currency: {
    fontSize: 16,
    color: '#dc2626',
    fontWeight: '600',
  },
  savings: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
  dealActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  termsButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  termsButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  claimButton: {
    flex: 2,
    backgroundColor: '#dc2626',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  claimButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  provider: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
});