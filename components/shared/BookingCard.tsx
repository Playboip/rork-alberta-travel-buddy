import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { MapPin, Calendar, Star, Heart, CreditCard } from 'lucide-react-native';
import { BookingItem } from '@/types/booking';
import { Image } from 'expo-image';
import { router } from 'expo-router';

interface BookingCardProps {
  item: BookingItem;
  onFavorite?: (itemId: string) => void;
  isFavorite?: boolean;
  showBookButton?: boolean;
}

export default function BookingCard({ 
  item, 
  onFavorite, 
  isFavorite = false, 
  showBookButton = true 
}: BookingCardProps) {
  
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

  const handleBook = () => {
    router.push({
      pathname: '/booking/confirm',
      params: { itemId: item.id }
    });
  };

  const getTypeIcon = () => {
    switch (item.type) {
      case 'hotel': return '🏨';
      case 'flight': return '✈️';
      case 'activity': return '🎯';
      case 'car_rental': return '🚗';
      case 'restaurant': return '🍽️';
      default: return '📍';
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          contentFit="cover"
        />
        {onFavorite && (
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => onFavorite(item.id)}
          >
            <Heart 
              color={isFavorite ? '#dc2626' : '#ffffff'} 
              size={20}
              fill={isFavorite ? '#dc2626' : 'transparent'}
            />
          </TouchableOpacity>
        )}
        <View style={styles.typeTag}>
          <Text style={styles.typeIcon}>{getTypeIcon()}</Text>
          <Text style={styles.typeText}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1).replace('_', ' ')}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{item.name}</Text>
          {item.rating && (
            <View style={styles.ratingContainer}>
              {renderStars(item.rating)}
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          )}
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.details}>
          <View style={styles.locationRow}>
            <MapPin color="#6b7280" size={16} />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
          {item.duration && (
            <View style={styles.durationRow}>
              <Calendar color="#6b7280" size={16} />
              <Text style={styles.durationText}>{item.duration}</Text>
            </View>
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
              <Text style={styles.moreFeatures}>+{item.features.length - 3}</Text>
            )}
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${item.price}</Text>
            <Text style={styles.currency}>{item.currency}</Text>
            {item.type === 'hotel' && (
              <Text style={styles.priceUnit}>per night</Text>
            )}
          </View>
          {showBookButton && (
            <TouchableOpacity 
              style={[
                styles.bookButton,
                !item.availability && styles.bookButtonDisabled
              ]}
              onPress={handleBook}
              disabled={!item.availability}
            >
              <CreditCard color="#ffffff" size={16} />
              <Text style={styles.bookButtonText}>
                {item.availability ? 'Book' : 'N/A'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
  imageContainer: {
    height: 200,
    position: 'relative',
  },
  image: {
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  typeIcon: {
    fontSize: 14,
  },
  typeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
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
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  details: {
    marginBottom: 12,
    gap: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#374151',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f97316',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
  },
  bookButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});