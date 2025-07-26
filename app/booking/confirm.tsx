import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, Calendar, Users, MapPin, CreditCard, Shield, Info } from 'lucide-react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { BookingItem } from '@/types/booking';
import { Image } from 'expo-image';

const mockItem: BookingItem = {
  id: '1',
  type: 'hotel',
  name: 'Fairmont Banff Springs',
  description: 'Luxury castle hotel in the Canadian Rockies with world-class amenities',
  location: 'Banff, AB',
  price: 399,
  currency: 'CAD',
  image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop',
  rating: 4.8,
  availability: true,
  provider: 'Fairmont Hotels',
  features: ['Spa', 'Pool', 'Restaurant', 'WiFi', 'Parking']
};

export default function BookingConfirmScreen() {
  const { itemId } = useLocalSearchParams();
  const [checkInDate, setCheckInDate] = useState('2024-08-15');
  const [checkOutDate, setCheckOutDate] = useState('2024-08-18');
  const [guests, setGuests] = useState('2');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  const item = mockItem; // In real app, fetch by itemId

  const nights = item.type === 'hotel' ? 3 : 0; // Calculate based on dates
  const subtotal = item.price * (nights || 1);
  const taxes = subtotal * 0.12; // 12% tax
  const total = subtotal + taxes;

  const handleConfirmBooking = async () => {
    setIsBooking(true);
    
    try {
      // Simulate booking process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Booking Confirmed!',
        `Your booking for ${item.name} has been confirmed. You will receive a confirmation email shortly.`,
        [
          { 
            text: 'View Bookings', 
            onPress: () => router.replace('/(tabs)/bookings')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Booking Failed', 'There was an error processing your booking. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Confirm Booking' }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Item Details */}
        <View style={styles.itemCard}>
          <Image
            source={{ uri: item.image }}
            style={styles.itemImage}
            contentFit="cover"
          />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <View style={styles.locationRow}>
              <MapPin color="#6b7280" size={16} />
              <Text style={styles.locationText}>{item.location}</Text>
            </View>
            <Text style={styles.provider}>Provided by {item.provider}</Text>
          </View>
        </View>

        {/* Booking Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          
          {item.type === 'hotel' && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Check-in Date</Text>
                <View style={styles.inputContainer}>
                  <Calendar color="#6b7280" size={20} />
                  <TextInput
                    style={styles.input}
                    value={checkInDate}
                    onChangeText={setCheckInDate}
                    placeholder="Select check-in date"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Check-out Date</Text>
                <View style={styles.inputContainer}>
                  <Calendar color="#6b7280" size={20} />
                  <TextInput
                    style={styles.input}
                    value={checkOutDate}
                    onChangeText={setCheckOutDate}
                    placeholder="Select check-out date"
                  />
                </View>
              </View>
            </>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Number of Guests</Text>
            <View style={styles.inputContainer}>
              <Users color="#6b7280" size={20} />
              <TextInput
                style={styles.input}
                value={guests}
                onChangeText={setGuests}
                placeholder="Number of guests"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Special Requests (Optional)</Text>
            <TextInput
              style={styles.textArea}
              value={specialRequests}
              onChangeText={setSpecialRequests}
              placeholder="Any special requests or requirements..."
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Breakdown</Text>
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                ${item.price} {item.currency} × {nights || 1} {item.type === 'hotel' ? 'nights' : 'item'}
              </Text>
              <Text style={styles.priceValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Taxes & Fees</Text>
              <Text style={styles.priceValue}>${taxes.toFixed(2)}</Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)} {item.currency}</Text>
            </View>
          </View>
        </View>

        {/* Safety & Policies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety & Policies</Text>
          <View style={styles.policyCard}>
            <Shield color="#059669" size={24} />
            <View style={styles.policyContent}>
              <Text style={styles.policyTitle}>Safe & Secure Booking</Text>
              <Text style={styles.policyText}>
                Your booking is protected by our secure payment system and cancellation policy.
              </Text>
            </View>
          </View>
          <View style={styles.policyCard}>
            <Info color="#1e40af" size={24} />
            <View style={styles.policyContent}>
              <Text style={styles.policyTitle}>Cancellation Policy</Text>
              <Text style={styles.policyText}>
                Free cancellation up to 24 hours before your booking. See full terms for details.
              </Text>
            </View>
          </View>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          style={[styles.confirmButton, isBooking && styles.confirmButtonDisabled]}
          onPress={handleConfirmBooking}
          disabled={isBooking}
        >
          <LinearGradient
            colors={isBooking ? ['#9ca3af', '#6b7280'] : ['#059669', '#047857']}
            style={styles.confirmGradient}
          >
            {isBooking ? (
              <Text style={styles.confirmButtonText}>Processing...</Text>
            ) : (
              <>
                <CheckCircle color="#ffffff" size={24} />
                <Text style={styles.confirmButtonText}>Confirm Booking - ${total.toFixed(2)}</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  itemCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  itemImage: {
    width: '100%',
    height: 200,
  },
  itemInfo: {
    padding: 16,
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 4,
  },
  provider: {
    fontSize: 12,
    color: '#9ca3af',
  },
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1f2937',
  },
  textArea: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 16,
    color: '#1f2937',
    textAlignVertical: 'top',
  },
  priceBreakdown: {
    gap: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  totalRow: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
  policyCard: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  policyContent: {
    flex: 1,
    marginLeft: 12,
  },
  policyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  policyText: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
  confirmButton: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 40,
  },
  confirmButtonDisabled: {
    opacity: 0.7,
  },
  confirmGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});