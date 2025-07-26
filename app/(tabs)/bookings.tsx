import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, MapPin, CreditCard, Clock, CheckCircle, XCircle, Phone, Mail } from 'lucide-react-native';
import { Stack, router } from 'expo-router';
import { useAuth } from '@/hooks/auth-context';
import { Booking } from '@/types/booking';
import { Image } from 'expo-image';

const mockBookings: Booking[] = [
  {
    id: '1',
    userId: 'user1',
    tripPlanId: 'trip1',
    type: 'hotel',
    itemId: 'hotel1',
    itemName: 'Fairmont Banff Springs',
    itemDescription: 'Luxury castle hotel in the Canadian Rockies',
    location: 'Banff, AB',
    checkInDate: '2024-08-15',
    checkOutDate: '2024-08-18',
    bookingDate: '2024-07-20',
    guests: 2,
    totalPrice: 1200,
    currency: 'CAD',
    status: 'confirmed',
    confirmationNumber: 'FB-2024-001234',
    provider: 'Fairmont Hotels',
    paymentStatus: 'paid',
    createdAt: '2024-07-20T10:00:00Z',
    updatedAt: '2024-07-20T10:00:00Z'
  },
  {
    id: '2',
    userId: 'user1',
    type: 'flight',
    itemId: 'flight1',
    itemName: 'Calgary to Vancouver',
    itemDescription: 'Direct flight AC 219',
    location: 'YYC to YVR',
    checkInDate: '2024-08-15',
    bookingDate: '2024-08-15',
    guests: 1,
    totalPrice: 225,
    currency: 'CAD',
    status: 'confirmed',
    confirmationNumber: 'AC-219-789456',
    provider: 'Air Canada',
    paymentStatus: 'paid',
    createdAt: '2024-07-20T11:00:00Z',
    updatedAt: '2024-07-20T11:00:00Z'
  },
  {
    id: '3',
    userId: 'user1',
    type: 'car_rental',
    itemId: 'car1',
    itemName: 'Toyota RAV4 SUV',
    itemDescription: 'AWD SUV perfect for mountain adventures',
    location: 'Calgary, AB',
    checkInDate: '2024-08-15',
    checkOutDate: '2024-08-18',
    bookingDate: '2024-08-15',
    guests: 1,
    totalPrice: 267,
    currency: 'CAD',
    status: 'confirmed',
    confirmationNumber: 'ENT-RAV4-123789',
    provider: 'Enterprise Rent-A-Car',
    paymentStatus: 'paid',
    createdAt: '2024-07-20T12:00:00Z',
    updatedAt: '2024-07-20T12:00:00Z'
  },
  {
    id: '4',
    userId: 'user1',
    type: 'tour',
    itemId: 'tour1',
    itemName: 'Banff Wildlife Tour',
    itemDescription: 'Full-day guided wildlife spotting tour',
    location: 'Banff National Park, AB',
    bookingDate: '2024-08-16',
    guests: 2,
    totalPrice: 370,
    currency: 'CAD',
    status: 'confirmed',
    confirmationNumber: 'BA-WILD-456123',
    provider: 'Banff Adventures',
    paymentStatus: 'paid',
    createdAt: '2024-07-20T13:00:00Z',
    updatedAt: '2024-07-20T13:00:00Z'
  },
  {
    id: '5',
    userId: 'user1',
    type: 'restaurant',
    itemId: 'rest1',
    itemName: 'The Bison Restaurant',
    itemDescription: 'Farm-to-table dinner reservation',
    location: 'Banff, AB',
    bookingDate: '2024-08-16',
    guests: 2,
    totalPrice: 170,
    currency: 'CAD',
    status: 'confirmed',
    confirmationNumber: 'BISON-DIN-789',
    provider: 'The Bison Restaurant',
    paymentStatus: 'paid',
    createdAt: '2024-07-20T14:00:00Z',
    updatedAt: '2024-07-20T14:00:00Z'
  },
  {
    id: '6',
    userId: 'user1',
    type: 'experience',
    itemId: 'exp1',
    itemName: 'Lake Louise Canoe Adventure',
    itemDescription: 'Guided canoe experience on pristine lake',
    location: 'Lake Louise, AB',
    bookingDate: '2024-08-17',
    guests: 2,
    totalPrice: 190,
    currency: 'CAD',
    status: 'pending',
    provider: 'Lake Louise Activities',
    paymentStatus: 'pending',
    createdAt: '2024-07-25T14:00:00Z',
    updatedAt: '2024-07-25T14:00:00Z'
  }
];

export default function BookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle color="#059669" size={20} />;
      case 'pending':
        return <Clock color="#f59e0b" size={20} />;
      case 'cancelled':
        return <XCircle color="#dc2626" size={20} />;
      default:
        return <Clock color="#6b7280" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#059669';
      case 'pending':
        return '#f59e0b';
      case 'cancelled':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hotel':
        return '🏨';
      case 'flight':
        return '✈️';
      case 'activity':
        return '🎪';
      case 'car_rental':
        return '🚗';
      case 'restaurant':
        return '🍽️';
      case 'tour':
        return '🗺️';
      case 'experience':
        return '🎯';
      default:
        return '📍';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.checkInDate || booking.bookingDate);
    const today = new Date();
    
    switch (activeTab) {
      case 'upcoming':
        return bookingDate >= today;
      case 'past':
        return bookingDate < today;
      default:
        return true;
    }
  });

  const handleBookingPress = (booking: Booking) => {
    Alert.alert(
      'Booking Details',
      `${booking.itemName}
      
Status: ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
${booking.confirmationNumber ? `Confirmation: ${booking.confirmationNumber}` : ''}
Total: $${booking.totalPrice} ${booking.currency}
Guests: ${booking.guests}
Provider: ${booking.provider}`,
      [
        { text: 'Close', style: 'cancel' },
        { text: 'Contact Support', onPress: () => Alert.alert('Support', 'Support contact feature coming soon!') },
        booking.status === 'confirmed' && { 
          text: 'Cancel Booking', 
          style: 'destructive',
          onPress: () => handleCancelBooking(booking.id)
        }
      ].filter(Boolean) as any
    );
  };

  const handleCancelBooking = (bookingId: string) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? Cancellation fees may apply.',
      [
        { text: 'Keep Booking', style: 'cancel' },
        { 
          text: 'Cancel Booking', 
          style: 'destructive',
          onPress: () => {
            setBookings(prev => prev.map(booking => 
              booking.id === bookingId 
                ? { ...booking, status: 'cancelled' as const }
                : booking
            ));
            Alert.alert('Booking Cancelled', 'Your booking has been cancelled. You will receive a confirmation email shortly.');
          }
        }
      ]
    );
  };

  const handleNewBooking = () => {
    router.push('/booking/search');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'My Bookings' }} />
      <View style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={['#7c3aed', '#1e40af']}
          style={styles.header}
        >
          <CreditCard color="#ffffff" size={32} />
          <Text style={styles.headerTitle}>My Bookings</Text>
          <Text style={styles.headerSubtitle}>Manage your travel reservations</Text>
        </LinearGradient>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'past' && styles.activeTab]}
            onPress={() => setActiveTab('past')}
          >
            <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
              Past
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              All
            </Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.planTripButton} onPress={() => router.push('/trip-planner')}>
            <Text style={styles.planTripButtonText}>📋 Plan Complete Trip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.newBookingButton} onPress={handleNewBooking}>
            <Text style={styles.newBookingButtonText}>+ Quick Book</Text>
          </TouchableOpacity>
        </View>

        {/* Bookings List */}
        <ScrollView 
          style={styles.bookingsList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {filteredBookings.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No bookings found</Text>
              <Text style={styles.emptyStateText}>
                {activeTab === 'upcoming' 
                  ? "You don't have any upcoming bookings"
                  : activeTab === 'past'
                    ? "You don't have any past bookings"
                    : "You haven't made any bookings yet"
                }
              </Text>
              <TouchableOpacity style={styles.emptyStateButton} onPress={handleNewBooking}>
                <Text style={styles.emptyStateButtonText}>Start Booking</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredBookings.map((booking) => (
              <TouchableOpacity
                key={booking.id}
                style={styles.bookingCard}
                onPress={() => handleBookingPress(booking)}
              >
                <View style={styles.bookingHeader}>
                  <View style={styles.bookingType}>
                    <Text style={styles.typeIcon}>{getTypeIcon(booking.type)}</Text>
                    <Text style={styles.typeName}>
                      {booking.type.charAt(0).toUpperCase() + booking.type.slice(1).replace('_', ' ')}
                    </Text>
                  </View>
                  <View style={styles.statusContainer}>
                    {getStatusIcon(booking.status)}
                    <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.bookingName}>{booking.itemName}</Text>
                <Text style={styles.bookingDescription}>{booking.itemDescription}</Text>

                <View style={styles.bookingDetails}>
                  <View style={styles.detailRow}>
                    <MapPin color="#6b7280" size={16} />
                    <Text style={styles.detailText}>{booking.location}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Calendar color="#6b7280" size={16} />
                    <Text style={styles.detailText}>
                      {booking.checkInDate 
                        ? `${new Date(booking.checkInDate).toLocaleDateString()}${booking.checkOutDate ? ` - ${new Date(booking.checkOutDate).toLocaleDateString()}` : ''}`
                        : new Date(booking.bookingDate).toLocaleDateString()
                      }
                    </Text>
                  </View>
                </View>

                <View style={styles.bookingFooter}>
                  <Text style={styles.price}>${booking.totalPrice} {booking.currency}</Text>
                  {booking.confirmationNumber && (
                    <Text style={styles.confirmationNumber}>#{booking.confirmationNumber}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: -15,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#7c3aed',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#ffffff',
  },
  actionButtons: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  planTripButton: {
    flex: 1,
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  planTripButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  newBookingButton: {
    flex: 1,
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  newBookingButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookingsList: {
    flex: 1,
    padding: 20,
  },
  bookingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  typeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bookingName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  bookingDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  bookingDetails: {
    gap: 8,
    marginBottom: 12,
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
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
  confirmationNumber: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyStateButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyStateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});