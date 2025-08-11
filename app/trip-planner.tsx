import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Calendar, Users, Plus, Trash2, Plane, Hotel, Car, UtensilsCrossed, Camera, Map, Train, Bus } from 'lucide-react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { TripPlan, BookingItem } from '@/types/booking';
import { Image } from 'expo-image';

interface TripPlannerItem extends BookingItem {
  selected: boolean;
  tripDay?: number;
}

const mockAvailableItems: TripPlannerItem[] = [
  {
    id: '1',
    type: 'flight',
    name: 'Calgary to Vancouver',
    description: 'Direct flight with Air Canada',
    location: 'YYC to YVR',
    price: 225,
    currency: 'CAD',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop',
    rating: 4.3,
    duration: '1h 30m',
    availability: true,
    provider: 'Air Canada',
    features: ['Direct Flight', 'Meal Service', 'WiFi'],
    selected: false,
    tripDay: 1
  },
  {
    id: '2',
    type: 'hotel',
    name: 'Fairmont Banff Springs',
    description: 'Luxury castle hotel in the Canadian Rockies',
    location: 'Banff, AB',
    price: 399,
    currency: 'CAD',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop',
    rating: 4.8,
    availability: true,
    provider: 'Fairmont Hotels',
    features: ['Spa', 'Pool', 'Restaurant', 'WiFi'],
    selected: false,
    tripDay: 1
  },
  {
    id: '3',
    type: 'car_rental',
    name: 'Toyota RAV4 SUV',
    description: 'Perfect for mountain adventures',
    location: 'Calgary, AB',
    price: 89,
    currency: 'CAD',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop',
    rating: 4.5,
    availability: true,
    provider: 'Enterprise',
    features: ['AWD', 'GPS', 'Insurance'],
    selected: false,
    tripDay: 1
  },
  {
    id: '4',
    type: 'tour',
    name: 'Banff Wildlife Tour',
    description: 'Full-day guided wildlife spotting',
    location: 'Banff National Park, AB',
    price: 185,
    currency: 'CAD',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    rating: 4.8,
    duration: '8 hours',
    availability: true,
    provider: 'Banff Adventures',
    features: ['Guide', 'Transportation', 'Lunch'],
    selected: false,
    tripDay: 2
  },
  {
    id: '5',
    type: 'restaurant',
    name: 'The Bison Restaurant',
    description: 'Farm-to-table dining experience',
    location: 'Banff, AB',
    price: 85,
    currency: 'CAD',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    rating: 4.6,
    availability: true,
    provider: 'The Bison Restaurant',
    features: ['Farm-to-Table', 'Wine Pairing'],
    selected: false,
    tripDay: 2
  },
  {
    id: '6',
    type: 'train',
    name: 'Rocky Mountaineer Day Trip',
    description: 'Scenic passenger train through the Rockies',
    location: 'Banff to Lake Louise',
    price: 249,
    currency: 'CAD',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=300&fit=crop',
    rating: 4.9,
    availability: true,
    provider: 'Rocky Mountaineer',
    features: ['Panoramic Views', 'Dining Car'],
    selected: false,
    tripDay: 2
  },
  {
    id: '7',
    type: 'bus',
    name: 'Banff Airport Shuttle',
    description: 'Comfortable shuttle from YYC to Banff',
    location: 'Calgary to Banff',
    price: 65,
    currency: 'CAD',
    image: 'https://images.unsplash.com/photo-1521292270410-a8c4d716d518?w=400&h=300&fit=crop',
    rating: 4.4,
    availability: true,
    provider: 'Brewster Express',
    features: ['WiFi', 'Luggage'],
    selected: false,
    tripDay: 1
  }
];

export default function TripPlannerScreen() {
  const params = useLocalSearchParams();
  const [tripPlan, setTripPlan] = useState<Partial<TripPlan>>({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    totalBudget: 0,
    notes: '',
    status: 'planning'
  });
  const [availableItems, setAvailableItems] = useState<TripPlannerItem[]>(mockAvailableItems);
  const [selectedItems, setSelectedItems] = useState<TripPlannerItem[]>([]);
  const [currentStep, setCurrentStep] = useState<'details' | 'items' | 'review'>('details');

  useEffect(() => {
    try {
      console.log('[TripPlanner] incoming params', params);
      const rawName = typeof params.name === 'string' ? params.name : undefined;
      const rawDestination = typeof params.destination === 'string' ? params.destination : undefined;
      const rawStartDate = typeof params.startDate === 'string' ? params.startDate : undefined;
      const rawEndDate = typeof params.endDate === 'string' ? params.endDate : undefined;
      const rawNotes = typeof params.notes === 'string' ? params.notes : undefined;
      const itemsParam = typeof params.items === 'string' ? params.items : undefined;
      const presetParam = typeof params.preset === 'string' ? params.preset : undefined;

      const name = rawName ? decodeURIComponent(rawName) : undefined;
      const destination = rawDestination ? decodeURIComponent(rawDestination) : undefined;
      const startDate = rawStartDate ? decodeURIComponent(rawStartDate) : undefined;
      const endDate = rawEndDate ? decodeURIComponent(rawEndDate) : undefined;
      const notes = rawNotes ? decodeURIComponent(rawNotes) : undefined;

      let presetItems: Array<Partial<TripPlannerItem>> = [];
      if (presetParam) {
        try {
          const decoded = decodeURIComponent(presetParam);
          const parsed = JSON.parse(decoded) as unknown;
          if (Array.isArray(parsed)) {
            presetItems = parsed as Array<Partial<TripPlannerItem>>;
          }
        } catch (e) {
          console.warn('[TripPlanner] failed to parse preset json', e);
        }
      }

      let idsFromItemsParam: string[] = [];
      if (itemsParam) {
        idsFromItemsParam = itemsParam.split(',').map((s) => s.trim()).filter(Boolean);
      }

      const hasPrefill = Boolean(name || destination || startDate || endDate || notes || presetItems.length > 0 || idsFromItemsParam.length > 0);

      if (hasPrefill) {
        setTripPlan((prev) => ({
          ...prev,
          name: name ?? prev.name ?? '',
          destination: destination ?? prev.destination ?? '',
          startDate: startDate ?? prev.startDate ?? '',
          endDate: endDate ?? prev.endDate ?? '',
          notes: notes ?? prev.notes ?? '',
        }));

        // Map presets/ids into available items
        setAvailableItems((prev) => {
          const withSelections = prev.map((item) => {
            const matchedById = idsFromItemsParam.includes(item.id);
            const matchedByType = presetItems.find((p) => (p.id && p.id === item.id) || (p.type && p.type === item.type));
            const shouldSelect = matchedById || Boolean(matchedByType);
            return shouldSelect ? { ...item, selected: true } : item;
          });
          // Update selectedItems accordingly
          const selected = withSelections.filter((it) => it.selected);
          setSelectedItems(selected);
          return withSelections;
        });

        // Jump to review for a frictionless add-to-trip flow
        setCurrentStep('review');
      }
    } catch (e) {
      console.error('[TripPlanner] prefill error', e);
    }
  }, [params]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hotel': return <Hotel color="#f97316" size={20} />;
      case 'flight': return <Plane color="#3b82f6" size={20} />;
      case 'car_rental': return <Car color="#10b981" size={20} />;
      case 'restaurant': return <UtensilsCrossed color="#ef4444" size={20} />;
      case 'tour': return <Map color="#8b5cf6" size={20} />;
      case 'train': return <Train color="#0ea5e9" size={20} />;
      case 'bus': return <Bus color="#22c55e" size={20} />;
      case 'experience': return <Camera color="#f59e0b" size={20} />;
      default: return <MapPin color="#6b7280" size={20} />;
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setAvailableItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, selected: !item.selected } : item
    ));
    
    const item = availableItems.find(i => i.id === itemId);
    if (item) {
      if (item.selected) {
        setSelectedItems(prev => prev.filter(i => i.id !== itemId));
      } else {
        setSelectedItems(prev => [...prev, { ...item, selected: true }]);
      }
    }
  };

  const calculateTotalCost = () => {
    return selectedItems.reduce((total, item) => total + item.price, 0);
  };

  const handleCreateTrip = () => {
    if (!tripPlan.name || !tripPlan.destination || selectedItems.length === 0) {
      Alert.alert('Missing Information', 'Please fill in all trip details and select at least one item.');
      return;
    }

    const totalCost = calculateTotalCost();
    
    Alert.alert(
      'Create Trip Plan',
      `Create "${tripPlan.name}" with ${selectedItems.length} items for $${totalCost} CAD?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create Trip',
          onPress: () => {
            Alert.alert(
              'Trip Created!',
              'Your trip plan has been created. You can now book individual items or the entire package.',
              [
                { text: 'View Bookings', onPress: () => router.replace('/(tabs)/bookings') },
                { text: 'Book Now', onPress: () => router.push('/booking/search') }
              ]
            );
          }
        }
      ]
    );
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <View style={styles.stepContainer}>
        <View style={[styles.stepCircle, currentStep === 'details' && styles.activeStep]}>
          <Text style={[styles.stepNumber, currentStep === 'details' && styles.activeStepText]}>1</Text>
        </View>
        <Text style={styles.stepLabel}>Details</Text>
      </View>
      <View style={styles.stepLine} />
      <View style={styles.stepContainer}>
        <View style={[styles.stepCircle, currentStep === 'items' && styles.activeStep]}>
          <Text style={[styles.stepNumber, currentStep === 'items' && styles.activeStepText]}>2</Text>
        </View>
        <Text style={styles.stepLabel}>Select Items</Text>
      </View>
      <View style={styles.stepLine} />
      <View style={styles.stepContainer}>
        <View style={[styles.stepCircle, currentStep === 'review' && styles.activeStep]}>
          <Text style={[styles.stepNumber, currentStep === 'review' && styles.activeStepText]}>3</Text>
        </View>
        <Text style={styles.stepLabel}>Review</Text>
      </View>
    </View>
  );

  const renderDetailsStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.sectionTitle}>Trip Details</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Trip Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Banff Adventure Weekend"
          value={tripPlan.name}
          onChangeText={(text) => setTripPlan(prev => ({ ...prev, name: text }))}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Destination</Text>
        <View style={styles.inputContainer}>
          <MapPin color="#6b7280" size={20} />
          <TextInput
            style={styles.inputWithIcon}
            placeholder="Where are you going?"
            value={tripPlan.destination}
            onChangeText={(text) => setTripPlan(prev => ({ ...prev, destination: text }))}
          />
        </View>
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Start Date</Text>
          <View style={styles.inputContainer}>
            <Calendar color="#6b7280" size={20} />
            <TextInput
              style={styles.inputWithIcon}
              placeholder="Start date"
              value={tripPlan.startDate}
              onChangeText={(text) => setTripPlan(prev => ({ ...prev, startDate: text }))}
            />
          </View>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>End Date</Text>
          <View style={styles.inputContainer}>
            <Calendar color="#6b7280" size={20} />
            <TextInput
              style={styles.inputWithIcon}
              placeholder="End date"
              value={tripPlan.endDate}
              onChangeText={(text) => setTripPlan(prev => ({ ...prev, endDate: text }))}
            />
          </View>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Budget (Optional)</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.inputWithIcon}
            placeholder="Total budget"
            keyboardType="numeric"
            value={tripPlan.totalBudget?.toString()}
            onChangeText={(text) => setTripPlan(prev => ({ ...prev, totalBudget: parseInt(text) || 0 }))}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Any special notes or preferences..."
          multiline
          numberOfLines={3}
          value={tripPlan.notes}
          onChangeText={(text) => setTripPlan(prev => ({ ...prev, notes: text }))}
        />
      </View>

      <TouchableOpacity 
        style={styles.nextButton}
        onPress={() => setCurrentStep('items')}
      >
        <Text style={styles.nextButtonText}>Next: Select Items</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItemsStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.sectionTitle}>Select Trip Items</Text>
      <Text style={styles.sectionSubtitle}>
        Choose flights, hotels, activities, and more for your trip
      </Text>

      <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
        {availableItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.itemCard, item.selected && styles.selectedItemCard]}
            onPress={() => toggleItemSelection(item.id)}
            testID={`item-${item.id}`}
          >
            <View style={styles.itemImageContainer}>
              <Image
                source={{ uri: item.image }}
                style={styles.itemImage}
                contentFit="cover"
              />
              <View style={styles.itemTypeTag}>
                {getTypeIcon(item.type)}
              </View>
              {item.selected && (
                <View style={styles.selectedBadge}>
                  <Text style={styles.selectedBadgeText}>✓</Text>
                </View>
              )}
            </View>
            
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <View style={styles.itemFooter}>
                <Text style={styles.itemPrice}>${item.price} {item.currency}</Text>
                <Text style={styles.itemProvider}>{item.provider}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.selectionSummary}>
        <Text style={styles.selectionText}>
          {selectedItems.length} items selected • ${calculateTotalCost()} CAD
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentStep('details')}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={() => setCurrentStep('review')}
          testID="goToReview"
        >
          <Text style={styles.nextButtonText}>Review Trip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderReviewStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.sectionTitle}>Review Your Trip</Text>
      
      <View style={styles.reviewCard}>
        <Text style={styles.reviewTripName}>{tripPlan.name}</Text>
        <Text style={styles.reviewDestination}>{tripPlan.destination}</Text>
        <Text style={styles.reviewDates}>
          {tripPlan.startDate} - {tripPlan.endDate}
        </Text>
        {tripPlan.notes && (
          <Text style={styles.reviewNotes}>{tripPlan.notes}</Text>
        )}
      </View>

      <Text style={styles.reviewSectionTitle}>Selected Items ({selectedItems.length})</Text>
      
      <ScrollView style={styles.reviewItemsList} showsVerticalScrollIndicator={false}>
        {selectedItems.map((item) => (
          <View key={item.id} style={styles.reviewItem}>
            <View style={styles.reviewItemIcon}>
              {getTypeIcon(item.type)}
            </View>
            <View style={styles.reviewItemInfo}>
              <Text style={styles.reviewItemName}>{item.name}</Text>
              <Text style={styles.reviewItemProvider}>{item.provider}</Text>
            </View>
            <Text style={styles.reviewItemPrice}>${item.price}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.totalCostCard}>
        <Text style={styles.totalCostLabel}>Total Trip Cost</Text>
        <Text style={styles.totalCostAmount}>${calculateTotalCost()} CAD</Text>
        {tripPlan.totalBudget && tripPlan.totalBudget > 0 && (
          <Text style={[
            styles.budgetStatus,
            calculateTotalCost() <= tripPlan.totalBudget ? styles.underBudget : styles.overBudget
          ]}>
            {calculateTotalCost() <= tripPlan.totalBudget 
              ? `Under budget by $${tripPlan.totalBudget - calculateTotalCost()}`
              : `Over budget by $${calculateTotalCost() - tripPlan.totalBudget}`
            }
          </Text>
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentStep('items')}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateTrip}
          testID="createTrip"
        >
          <Text style={styles.createButtonText}>Create Trip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Trip Planner' }} />
      <View style={styles.container} testID="tripPlannerScreen">
        <LinearGradient
          colors={['#8b5cf6', '#7c3aed']}
          style={styles.header}
          testID="tripPlannerHeader"
        >
          <Plus color="#ffffff" size={32} />
          <Text style={styles.headerTitle}>Plan Your Trip</Text>
          <Text style={styles.headerSubtitle}>Create a complete travel package</Text>
        </LinearGradient>

        {renderStepIndicator()}

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} testID="tripPlannerContent">
          {currentStep === 'details' && renderDetailsStep()}
          {currentStep === 'items' && renderItemsStep()}
          {currentStep === 'review' && renderReviewStep()}
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
    color: '#e2e8f0',
    textAlign: 'center',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: -15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  activeStep: {
    backgroundColor: '#8b5cf6',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  activeStepText: {
    color: '#ffffff',
  },
  stepLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContent: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputWithIcon: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  currencySymbol: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  textArea: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    textAlignVertical: 'top',
  },
  nextButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemsList: {
    maxHeight: 400,
  },
  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedItemCard: {
    borderColor: '#8b5cf6',
  },
  itemImageContainer: {
    height: 120,
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemTypeTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 6,
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#10b981',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemInfo: {
    padding: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
  },
  itemProvider: {
    fontSize: 12,
    color: '#9ca3af',
  },
  selectionSummary: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    marginVertical: 16,
    alignItems: 'center',
  },
  selectionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewTripName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  reviewDestination: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  reviewDates: {
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: '600',
    marginBottom: 8,
  },
  reviewNotes: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  reviewSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  reviewItemsList: {
    maxHeight: 200,
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  reviewItemIcon: {
    marginRight: 12,
  },
  reviewItemInfo: {
    flex: 1,
  },
  reviewItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  reviewItemProvider: {
    fontSize: 12,
    color: '#6b7280',
  },
  reviewItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#059669',
  },
  totalCostCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  totalCostLabel: {
    fontSize: 16,
    color: '#0369a1',
    marginBottom: 4,
  },
  totalCostAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0c4a6e',
  },
  budgetStatus: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  underBudget: {
    color: '#059669',
  },
  overBudget: {
    color: '#dc2626',
  },
  createButton: {
    flex: 2,
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});