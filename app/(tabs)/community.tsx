import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert, Image, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, Star, Camera, MapPin, Calendar, MessageCircle, Heart, Share2, Plus, Facebook, Instagram, Twitter } from 'lucide-react-native';
import { Stack, router } from 'expo-router';
import { useAuth } from '@/hooks/auth-context';
import { useSubscription } from '@/hooks/subscription-context';

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  destinationName: string;
  location: string;
  rating: number;
  comment: string;
  images: string[];
  visitedDate: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
}

interface VisitedPlace {
  id: string;
  name: string;
  location: string;
  image: string;
  visitedDate: string;
  rating: number;
}

const mockReviews: Review[] = [
  {
    id: '1',
    userName: 'Sarah M.',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face',
    destinationName: 'Banff National Park',
    location: 'Alberta, Canada',
    rating: 5,
    comment: 'Absolutely breathtaking! The Lake Louise area was stunning in fall. Perfect weather and amazing hiking trails. Highly recommend the Plain of Six Glaciers trail!',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop'
    ],
    visitedDate: '2024-09-15',
    likes: 24,
    isLiked: false,
    createdAt: '2024-09-20'
  },
  {
    id: '2',
    userName: 'Mike R.',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    destinationName: 'Jasper National Park',
    location: 'Alberta, Canada',
    rating: 4,
    comment: 'Great for stargazing! The dark sky preserve is incredible. Saw the northern lights on our second night. Maligne Lake was beautiful but quite busy.',
    images: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop'
    ],
    visitedDate: '2024-08-22',
    likes: 18,
    isLiked: true,
    createdAt: '2024-08-25'
  },
  {
    id: '3',
    userName: 'Emma L.',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    destinationName: 'Whistler Village',
    location: 'British Columbia, Canada',
    rating: 5,
    comment: 'Perfect summer destination! Great hiking, mountain biking, and the village has amazing restaurants. The Peak 2 Peak gondola offers incredible views.',
    images: [
      'https://images.unsplash.com/photo-1551524164-6cf2ac531400?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop'
    ],
    visitedDate: '2024-07-10',
    likes: 31,
    isLiked: false,
    createdAt: '2024-07-15'
  }
];

const mockVisitedPlaces: VisitedPlace[] = [
  {
    id: '1',
    name: 'Lake Louise',
    location: 'Banff, AB',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=150&fit=crop',
    visitedDate: '2024-09-15',
    rating: 5
  },
  {
    id: '2',
    name: 'Maligne Lake',
    location: 'Jasper, AB',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=150&fit=crop',
    visitedDate: '2024-08-22',
    rating: 4
  },
  {
    id: '3',
    name: 'Moraine Lake',
    location: 'Banff, AB',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop',
    visitedDate: '2024-06-30',
    rating: 5
  }
];

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState<'reviews' | 'visited'>('reviews');
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [visitedPlaces, setVisitedPlaces] = useState<VisitedPlace[]>(mockVisitedPlaces);
  
  const { user } = useAuth();
  const { getCurrentTier, canUseFeature } = useSubscription();

  const currentTier = getCurrentTier();
  const canPost = canUseFeature('post reviews');

  const handleLike = (reviewId: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            isLiked: !review.isLiked,
            likes: review.isLiked ? review.likes - 1 : review.likes + 1
          }
        : review
    ));
  };

  const shareReview = async (review: Review, platform?: 'facebook' | 'instagram' | 'twitter') => {
    const shareContent = `🌟 ${review.rating}/5 stars for ${review.destinationName}!\n\n"${review.comment}"\n\n📍 ${review.location}\n🗓️ Visited: ${new Date(review.visitedDate).toLocaleDateString()}\n\nShared from Alberta Travel Buddy 🍁\n\n#AlbertaTravel #TravelReview #${review.destinationName.replace(/\s+/g, '')}`;

    try {
      if (platform) {
        let url = '';
        const encodedText = encodeURIComponent(shareContent);
        
        switch (platform) {
          case 'facebook':
            url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://albertatravelbuddy.com')}&quote=${encodedText}`;
            break;
          case 'twitter':
            url = `https://twitter.com/intent/tweet?text=${encodedText}`;
            break;
          case 'instagram':
            Alert.alert(
              'Share to Instagram',
              'Content copied to clipboard! Open Instagram and paste in your story or post.',
              [{ text: 'OK' }]
            );
            return;
        }
        
        Alert.alert('Share', `Opening ${platform} to share this review...`);
      } else {
        await Share.share({
          message: shareContent,
          title: `${review.userName}'s review of ${review.destinationName}`,
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share review');
    }
  };

  const sharePlace = async (place: VisitedPlace, platform?: 'facebook' | 'instagram' | 'twitter') => {
    const shareContent = `📍 Just visited ${place.name} in ${place.location}!\n\n⭐ Rated it ${place.rating}/5 stars\n🗓️ ${new Date(place.visitedDate).toLocaleDateString()}\n\nDiscovered through Alberta Travel Buddy 🍁\n\n#AlbertaTravel #${place.name.replace(/\s+/g, '')} #TravelMemories`;

    try {
      if (platform) {
        let url = '';
        const encodedText = encodeURIComponent(shareContent);
        
        switch (platform) {
          case 'facebook':
            url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://albertatravelbuddy.com')}&quote=${encodedText}`;
            break;
          case 'twitter':
            url = `https://twitter.com/intent/tweet?text=${encodedText}`;
            break;
          case 'instagram':
            Alert.alert(
              'Share to Instagram',
              'Content copied to clipboard! Open Instagram and paste in your story or post.',
              [{ text: 'OK' }]
            );
            return;
        }
        
        Alert.alert('Share', `Opening ${platform} to share this place...`);
      } else {
        await Share.share({
          message: shareContent,
          title: `My visit to ${place.name}`,
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share place');
    }
  };

  const showShareOptions = (type: 'review' | 'place', item: Review | VisitedPlace) => {
    Alert.alert(
      'Share Options',
      'Choose how you want to share:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Facebook', onPress: () => type === 'review' ? shareReview(item as Review, 'facebook') : sharePlace(item as VisitedPlace, 'facebook') },
        { text: 'Twitter', onPress: () => type === 'review' ? shareReview(item as Review, 'twitter') : sharePlace(item as VisitedPlace, 'twitter') },
        { text: 'Instagram', onPress: () => type === 'review' ? shareReview(item as Review, 'instagram') : sharePlace(item as VisitedPlace, 'instagram') },
        { text: 'More Options', onPress: () => type === 'review' ? shareReview(item as Review) : sharePlace(item as VisitedPlace) },
      ]
    );
  };

  const handleAddReview = () => {
    if (!canPost) {
      Alert.alert(
        'Upgrade Required',
        'Posting reviews and photos requires a Starter subscription or higher.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => router.push('/subscription') }
        ]
      );
      return;
    }
    
    Alert.alert('Add Review', 'Review posting feature coming soon!');
  };

  const handleAddVisitedPlace = () => {
    if (!canPost) {
      Alert.alert(
        'Upgrade Required',
        'Adding visited places requires a Starter subscription or higher.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => router.push('/subscription') }
        ]
      );
      return;
    }
    
    Alert.alert('Add Visited Place', 'Add visited place feature coming soon!');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        color={i < rating ? '#f59e0b' : '#e5e7eb'}
        fill={i < rating ? '#f59e0b' : 'transparent'}
      />
    ));
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Community' }} />
      <View style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={['#059669', '#047857']}
          style={styles.header}
        >
          <Users color="#ffffff" size={32} />
          <Text style={styles.headerTitle}>Travel Community</Text>
          <Text style={styles.headerSubtitle}>Share experiences and discover new places</Text>
        </LinearGradient>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
            onPress={() => setActiveTab('reviews')}
          >
            <MessageCircle color={activeTab === 'reviews' ? '#ffffff' : '#6b7280'} size={20} />
            <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
              Reviews
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'visited' && styles.activeTab]}
            onPress={() => setActiveTab('visited')}
          >
            <MapPin color={activeTab === 'visited' ? '#ffffff' : '#6b7280'} size={20} />
            <Text style={[styles.tabText, activeTab === 'visited' && styles.activeTabText]}>
              My Places
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'reviews' ? (
            <>
              {/* Add Review Button */}
              <TouchableOpacity style={styles.addButton} onPress={handleAddReview}>
                <Plus color="#ffffff" size={20} />
                <Text style={styles.addButtonText}>Share Your Experience</Text>
                {!canPost && (
                  <View style={styles.premiumBadge}>
                    <Text style={styles.premiumText}>Premium</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Reviews List */}
              {reviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Image source={{ uri: review.userAvatar }} style={styles.avatar} />
                    <View style={styles.reviewInfo}>
                      <Text style={styles.userName}>{review.userName}</Text>
                      <View style={styles.locationRow}>
                        <MapPin color="#6b7280" size={14} />
                        <Text style={styles.location}>{review.location}</Text>
                      </View>
                      <View style={styles.ratingRow}>
                        {renderStars(review.rating)}
                        <Text style={styles.visitedDate}>
                          Visited {new Date(review.visitedDate).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.destinationName}>{review.destinationName}</Text>
                  <Text style={styles.reviewComment}>{review.comment}</Text>

                  {/* Review Images */}
                  {review.images.length > 0 && (
                    <ScrollView horizontal style={styles.imagesContainer} showsHorizontalScrollIndicator={false}>
                      {review.images.map((image, index) => (
                        <Image key={index} source={{ uri: image }} style={styles.reviewImage} />
                      ))}
                    </ScrollView>
                  )}

                  {/* Review Actions */}
                  <View style={styles.reviewActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleLike(review.id)}
                    >
                      <Heart 
                        color={review.isLiked ? '#dc2626' : '#6b7280'} 
                        size={20}
                        fill={review.isLiked ? '#dc2626' : 'transparent'}
                      />
                      <Text style={[styles.actionText, review.isLiked && styles.likedText]}>
                        {review.likes}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => showShareOptions('review', review)}
                    >
                      <Share2 color="#6b7280" size={20} />
                      <Text style={styles.actionText}>Share</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </>
          ) : (
            <>
              {/* Add Visited Place Button */}
              <TouchableOpacity style={styles.addButton} onPress={handleAddVisitedPlace}>
                <Plus color="#ffffff" size={20} />
                <Text style={styles.addButtonText}>Add Visited Place</Text>
                {!canPost && (
                  <View style={styles.premiumBadge}>
                    <Text style={styles.premiumText}>Premium</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Visited Places Grid */}
              <View style={styles.placesGrid}>
                {visitedPlaces.map((place) => (
                  <View key={place.id} style={styles.placeCard}>
                    <Image source={{ uri: place.image }} style={styles.placeImage} />
                    <View style={styles.placeInfo}>
                      <Text style={styles.placeName}>{place.name}</Text>
                      <Text style={styles.placeLocation}>{place.location}</Text>
                      <View style={styles.placeRating}>
                        {renderStars(place.rating)}
                      </View>
                      <Text style={styles.placeDate}>
                        {new Date(place.visitedDate).toLocaleDateString()}
                      </Text>
                      <TouchableOpacity 
                        style={styles.shareButton}
                        onPress={() => showShareOptions('place', place)}
                      >
                        <Share2 color="#6b7280" size={16} />
                        <Text style={styles.shareButtonText}>Share</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>

              {/* Stats */}
              <View style={styles.statsContainer}>
                <Text style={styles.statsTitle}>Your Travel Stats</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{visitedPlaces.length}</Text>
                    <Text style={styles.statLabel}>Places Visited</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statNumber}>
                      {(visitedPlaces.reduce((sum, place) => sum + place.rating, 0) / visitedPlaces.length).toFixed(1)}
                    </Text>
                    <Text style={styles.statLabel}>Avg Rating</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statNumber}>2</Text>
                    <Text style={styles.statLabel}>Provinces</Text>
                  </View>
                </View>
              </View>
            </>
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
    color: '#d1fae5',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#059669',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
    gap: 8,
    position: 'relative',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  premiumBadge: {
    position: 'absolute',
    right: 12,
    backgroundColor: '#f97316',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  premiumText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  reviewCard: {
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
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  reviewInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  visitedDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  destinationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  imagesContainer: {
    marginBottom: 12,
  },
  reviewImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  likedText: {
    color: '#dc2626',
  },
  placesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  placeCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeImage: {
    width: '100%',
    height: 120,
  },
  placeInfo: {
    padding: 12,
  },
  placeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  placeLocation: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
  },
  placeRating: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  placeDate: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 8,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    paddingVertical: 6,
    gap: 4,
  },
  shareButtonText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  statsContainer: {
    marginTop: 24,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});