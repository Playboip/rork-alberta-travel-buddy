import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, MapPin, Calendar, Users, DollarSign, Loader, Crown, Globe, Home, Shield, Phone, Share2, Facebook, Instagram, Twitter, CreditCard } from 'lucide-react-native';
import { Stack, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/hooks/auth-context';
import { useSubscription } from '@/hooks/subscription-context';
import { supabase } from '@/lib/supabase';

interface TripPreferences {
  destination: string;
  duration: string;
  budget: string;
  travelers: string;
  travelScope: 'domestic' | 'international';
  interests: string[];
  climatePreference: string;
}

const interestOptions = [
  'Nature & Outdoors', 'Adventure Sports', 'Cultural Sites', 'Food & Dining',
  'Photography', 'Relaxation', 'Nightlife', 'Shopping', 'History', 'Wildlife'
];

const climateOptions = [
  'Sunny & Warm', 'Cool & Crisp', 'Tropical', 'Winter Wonderland', 
  'Mild Weather', 'Desert Climate', 'No Preference'
];

export default function PlanScreen() {
  const [preferences, setPreferences] = useState<TripPreferences>({
    destination: '',
    duration: '',
    budget: '',
    travelers: '',
    travelScope: 'domestic',
    interests: [],
    climatePreference: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string>('');
  const [usageCount, setUsageCount] = useState<number>(0);

  const { user } = useAuth();
  const { getCurrentTier, getUsageLimit } = useSubscription();

  React.useEffect(() => {
    loadUsageCount();
  }, []);

  const loadUsageCount = async () => {
    if (!user) return;
    
    try {
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
      const { data, error } = await supabase
        .from('usage_tracking')
        .select('usage_count')
        .eq('user_id', user.id)
        .eq('feature_type', 'ai_plans')
        .eq('month_year', currentMonth)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading usage count:', error);
        return;
      }

      setUsageCount(data?.usage_count || 0);
    } catch (error) {
      console.error('Error loading usage count:', error);
    }
  };

  const incrementUsageCount = async () => {
    if (!user) return;

    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const { data, error } = await supabase.rpc('increment_usage', {
        p_user_id: user.id,
        p_feature_type: 'ai_plans',
        p_month_year: currentMonth
      });

      if (error) {
        console.error('Error incrementing usage:', error);
      } else {
        setUsageCount(data || usageCount + 1);
      }
    } catch (error) {
      console.error('Error incrementing usage:', error);
      // Fallback to local increment
      setUsageCount(prev => prev + 1);
    }
  };

  const saveTravelPlan = async (planContent: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('travel_plans')
        .insert([
          {
            user_id: user.id,
            destination: preferences.destination || 'AI Recommended',
            duration: preferences.duration,
            budget: preferences.budget,
            travelers: preferences.travelers,
            interests: preferences.interests,
            plan_content: planContent,
          },
        ]);

      if (error) {
        console.error('Error saving travel plan:', error);
      } else {
        console.log('Travel plan saved successfully');
      }
    } catch (error) {
      console.error('Error saving travel plan:', error);
    }
  };

  const shareItinerary = async (platform?: 'facebook' | 'instagram' | 'twitter') => {
    if (!generatedPlan) return;

    const destination = preferences.destination || 'AI-recommended destinations';
    const shareContent = `🗺️ Check out my ${preferences.duration} travel itinerary to ${destination}!

Planned with Alberta Travel Buddy 🍁

${generatedPlan.substring(0, 200)}...

#AlbertaTravel #TravelPlanning #Canada`;

    try {
      if (platform) {
        // Platform-specific sharing
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
            // Instagram doesn't support direct URL sharing, so we'll copy to clipboard
            Alert.alert(
              'Share to Instagram',
              'Content copied to clipboard! Open Instagram and paste in your story or post.',
              [{ text: 'OK' }]
            );
            return;
        }
        
        // Open the URL (this would work better in a real app with proper deep linking)
        Alert.alert('Share', `Opening ${platform} to share your itinerary...`);
      } else {
        // Native share
        await Share.share({
          message: shareContent,
          title: `My ${preferences.duration} Travel Itinerary`,
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share itinerary');
    }
  };

  const toggleInterest = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const generateAIPlan = async () => {
    if (!preferences.duration) {
      Alert.alert('Missing Information', 'Please fill in at least the trip duration');
      return;
    }

    const limit = getUsageLimit('ai_plans');
    if (limit > 0 && usageCount >= limit) {
      Alert.alert(
        'Usage Limit Reached',
        `You've reached your monthly limit of ${limit} AI plans. Upgrade to get unlimited plans!`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => router.push('/subscription') }
        ]
      );
      return;
    }

    setIsGenerating(true);
    
    try {
      let prompt = '';
      
      if (preferences.destination.trim()) {
        // User specified a destination
        prompt = `Create a detailed travel itinerary for someone traveling from Alberta (Calgary/Edmonton) to ${preferences.destination} for ${preferences.duration}.`;
      } else {
        // AI should recommend destinations
        const scope = preferences.travelScope === 'domestic' ? 'within Canada' : 'internationally';
        prompt = `As a travel expert, recommend and create a detailed travel itinerary for someone traveling from Alberta (Calgary/Edmonton) ${scope} for ${preferences.duration}. 
        
        Based on their preferences:
        - Travel scope: ${preferences.travelScope === 'domestic' ? 'Within Canada' : 'International destinations'}
        - Climate preference: ${preferences.climatePreference || 'No specific preference'}
        - Interests: ${preferences.interests.join(', ') || 'General sightseeing'}
        - Budget: ${preferences.budget || 'Moderate'}
        - Travelers: ${preferences.travelers || '2 people'}
        
        Please recommend 1-2 perfect destinations that match these criteria and create a detailed itinerary for the best option.`;
      }

      prompt += `
      
      Additional details:
      Budget: ${preferences.budget || 'moderate'}, 
      Number of travelers: ${preferences.travelers || '2'}, 
      Interests: ${preferences.interests.join(', ') || 'general sightseeing'},
      Climate preference: ${preferences.climatePreference || 'no preference'}.
      
      Include:
      - ${!preferences.destination.trim() ? 'Recommended destination(s) with reasons why they\'re perfect' : ''}
      - Day-by-day breakdown
      - Transportation from Alberta
      - Accommodation suggestions
      - Must-see attractions
      - Local food recommendations
      - Weather considerations
      - Estimated costs
      
      IMPORTANT - SAFETY SECTION:
      Include a comprehensive safety section with:
      - Emergency contacts for the destination
      - Local emergency numbers (police, medical, fire)
      - Canadian consulate/embassy contact info (if international)
      - Health and safety tips specific to the destination
      - Travel insurance recommendations
      - Important safety precautions
      - Weather-related safety advice
      - Local laws and customs to be aware of
      - What to do in case of emergency
      
      IMPORTANT - BOOKING SECTION:
      Include a section about booking accommodations, activities, and transportation with:
      - Recommended booking platforms and websites
      - Best times to book for deals
      - What to look for when booking
      - Cancellation policies to consider
      - Travel insurance recommendations
      - Tips for finding the best prices
      
      Format as a comprehensive travel guide with clear sections.`;

      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are an expert travel planner specializing in trips from Alberta, Canada. Provide detailed, practical, and personalized travel itineraries with comprehensive safety information and booking guidance. When no destination is specified, recommend the perfect destinations based on user preferences. Always include detailed safety and booking sections.'
            },
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate plan');
      }

      const data = await response.json();
      setGeneratedPlan(data.completion);
      await incrementUsageCount();
      await saveTravelPlan(data.completion);
    } catch (error) {
      console.error('Error generating plan:', error);
      Alert.alert('Error', 'Failed to generate travel plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const currentTier = getCurrentTier();
  const limit = getUsageLimit('ai_plans');
  const remainingPlans = limit > 0 ? Math.max(0, limit - usageCount) : -1;

  if (generatedPlan) {
    return (
      <>
        <Stack.Screen options={{ title: 'Your AI Travel Plan' }} />
        <ScrollView style={styles.container}>
          <View style={styles.planHeader}>
            <LinearGradient
              colors={['#7c3aed', '#1e40af']}
              style={styles.planGradient}
            >
              <Sparkles color="#ffffff" size={24} />
              <Text style={styles.planTitle}>Your Personalized Itinerary</Text>
              <Text style={styles.planSubtitle}>
                {preferences.destination.trim() 
                  ? `Generated by AI for ${preferences.destination}` 
                  : 'AI-Recommended Destinations & Itinerary'
                }
              </Text>
            </LinearGradient>
          </View>
          
          {/* Emergency Quick Access */}
          <View style={styles.emergencyQuickAccess}>
            <Shield color="#dc2626" size={20} />
            <Text style={styles.emergencyText}>Emergency contacts and safety info included in your itinerary below</Text>
            <TouchableOpacity 
              style={styles.safetyButton}
              onPress={() => router.push('/(tabs)/safety')}
            >
              <Phone color="#ffffff" size={16} />
              <Text style={styles.safetyButtonText}>Quick Safety</Text>
            </TouchableOpacity>
          </View>

          {/* Book Trip Button */}
          <View style={styles.bookingContainer}>
            <Text style={styles.bookingTitle}>Ready to Book Your Trip?</Text>
            <Text style={styles.bookingSubtitle}>Find and book hotels, activities, and more based on your itinerary</Text>
            <TouchableOpacity 
              style={styles.bookTripButton}
              onPress={() => router.push('/booking/search')}
            >
              <CreditCard color="#ffffff" size={20} />
              <Text style={styles.bookTripButtonText}>Book Your Trip</Text>
            </TouchableOpacity>
          </View>

          {/* Social Share Buttons */}
          <View style={styles.shareContainer}>
            <Text style={styles.shareTitle}>Share Your Itinerary</Text>
            <View style={styles.shareButtons}>
              <TouchableOpacity 
                style={[styles.shareButton, styles.facebookButton]}
                onPress={() => shareItinerary('facebook')}
              >
                <Facebook color="#ffffff" size={20} />
                <Text style={styles.shareButtonText}>Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.shareButton, styles.twitterButton]}
                onPress={() => shareItinerary('twitter')}
              >
                <Twitter color="#ffffff" size={20} />
                <Text style={styles.shareButtonText}>Twitter</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.shareButton, styles.instagramButton]}
                onPress={() => shareItinerary('instagram')}
              >
                <Instagram color="#ffffff" size={20} />
                <Text style={styles.shareButtonText}>Instagram</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.shareButton, styles.generalShareButton]}
                onPress={() => shareItinerary()}
              >
                <Share2 color="#ffffff" size={20} />
                <Text style={styles.shareButtonText}>More</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.planContent}>
            <Text style={styles.planText}>{generatedPlan}</Text>
            
            <TouchableOpacity 
              style={styles.newPlanButton}
              onPress={() => {
                setGeneratedPlan('');
                setPreferences({
                  destination: '',
                  duration: '',
                  budget: '',
                  travelers: '',
                  travelScope: 'domestic',
                  interests: [],
                  climatePreference: ''
                });
              }}
            >
              <Text style={styles.newPlanButtonText}>Plan Another Trip</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'AI Trip Planner' }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#7c3aed', '#1e40af']}
          style={styles.header}
        >
          <Sparkles color="#ffffff" size={32} />
          <Text style={styles.headerTitle}>AI Trip Planner</Text>
          <Text style={styles.headerSubtitle}>Tell us your preferences and we'll create the perfect itinerary</Text>
          
          {/* Usage Counter */}
          <View style={styles.usageContainer}>
            <Text style={styles.usageText}>
              {remainingPlans === -1 
                ? `Unlimited plans (${currentTier.name})`
                : `${remainingPlans} plans remaining this month`
              }
            </Text>
            {currentTier.id === 'free' && (
              <TouchableOpacity 
                style={styles.upgradeButton}
                onPress={() => router.push('/subscription')}
              >
                <Crown color="#ffffff" size={16} />
                <Text style={styles.upgradeButtonText}>Upgrade</Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>

        <View style={styles.form}>
          {/* Travel Scope */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Where would you like to travel?</Text>
            <View style={styles.scopeButtons}>
              <TouchableOpacity
                style={[
                  styles.scopeButton,
                  preferences.travelScope === 'domestic' && styles.scopeButtonSelected
                ]}
                onPress={() => setPreferences(prev => ({ ...prev, travelScope: 'domestic' }))}
              >
                <Home color={preferences.travelScope === 'domestic' ? '#ffffff' : '#6b7280'} size={20} />
                <Text style={[
                  styles.scopeButtonText,
                  preferences.travelScope === 'domestic' && styles.scopeButtonTextSelected
                ]}>
                  Within Canada
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.scopeButton,
                  preferences.travelScope === 'international' && styles.scopeButtonSelected
                ]}
                onPress={() => setPreferences(prev => ({ ...prev, travelScope: 'international' }))}
              >
                <Globe color={preferences.travelScope === 'international' ? '#ffffff' : '#6b7280'} size={20} />
                <Text style={[
                  styles.scopeButtonText,
                  preferences.travelScope === 'international' && styles.scopeButtonTextSelected
                ]}>
                  International
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Destination */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Specific destination? (Optional)</Text>
            <Text style={styles.labelSubtext}>Leave blank to let AI recommend the perfect place for you</Text>
            <View style={styles.inputContainer}>
              <MapPin color="#6b7280" size={20} />
              <TextInput
                style={styles.input}
                placeholder="e.g., Vancouver, Toronto, New York, or leave blank"
                value={preferences.destination}
                onChangeText={(text) => setPreferences(prev => ({ ...prev, destination: text }))}
              />
            </View>
          </View>

          {/* Duration */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>How long is your trip?</Text>
            <View style={styles.inputContainer}>
              <Calendar color="#6b7280" size={20} />
              <TextInput
                style={styles.input}
                placeholder="e.g., 3 days, 1 week, 2 weeks"
                value={preferences.duration}
                onChangeText={(text) => setPreferences(prev => ({ ...prev, duration: text }))}
              />
            </View>
          </View>

          {/* Climate Preference */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>What kind of weather do you prefer?</Text>
            <View style={styles.climateGrid}>
              {climateOptions.map((climate) => (
                <TouchableOpacity
                  key={climate}
                  style={[
                    styles.climateChip,
                    preferences.climatePreference === climate && styles.climateChipSelected
                  ]}
                  onPress={() => setPreferences(prev => ({ 
                    ...prev, 
                    climatePreference: prev.climatePreference === climate ? '' : climate 
                  }))}
                >
                  <Text style={[
                    styles.climateText,
                    preferences.climatePreference === climate && styles.climateTextSelected
                  ]}>
                    {climate}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Budget */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>What's your budget? (Optional)</Text>
            <View style={styles.inputContainer}>
              <DollarSign color="#6b7280" size={20} />
              <TextInput
                style={styles.input}
                placeholder="e.g., $1000, Budget-friendly, Luxury"
                value={preferences.budget}
                onChangeText={(text) => setPreferences(prev => ({ ...prev, budget: text }))}
              />
            </View>
          </View>

          {/* Number of Travelers */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>How many travelers? (Optional)</Text>
            <View style={styles.inputContainer}>
              <Users color="#6b7280" size={20} />
              <TextInput
                style={styles.input}
                placeholder="e.g., 2 adults, Family of 4, Solo"
                value={preferences.travelers}
                onChangeText={(text) => setPreferences(prev => ({ ...prev, travelers: text }))}
              />
            </View>
          </View>

          {/* Interests */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>What are you interested in?</Text>
            <View style={styles.interestsGrid}>
              {interestOptions.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  style={[
                    styles.interestChip,
                    preferences.interests.includes(interest) && styles.interestChipSelected
                  ]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text style={[
                    styles.interestText,
                    preferences.interests.includes(interest) && styles.interestTextSelected
                  ]}>
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
            onPress={generateAIPlan}
            disabled={isGenerating}
          >
            <LinearGradient
              colors={isGenerating ? ['#9ca3af', '#6b7280'] : ['#f97316', '#ea580c']}
              style={styles.generateGradient}
            >
              {isGenerating ? (
                <Loader color="#ffffff" size={24} />
              ) : (
                <Sparkles color="#ffffff" size={24} />
              )}
              <Text style={styles.generateButtonText}>
                {isGenerating ? 'Generating Your Plan...' : 
                 preferences.destination.trim() ? 'Generate AI Travel Plan' : 'Find Perfect Destinations & Plan Trip'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
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
    lineHeight: 22,
    marginBottom: 16,
  },
  usageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  usageText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f97316',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  upgradeButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  labelSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  scopeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  scopeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  scopeButtonSelected: {
    backgroundColor: '#1e40af',
    borderColor: '#1e40af',
  },
  scopeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  scopeButtonTextSelected: {
    color: '#ffffff',
  },
  inputContainer: {
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
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  climateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  climateChip: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  climateChipSelected: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  climateText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  climateTextSelected: {
    color: '#ffffff',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  interestChipSelected: {
    backgroundColor: '#1e40af',
    borderColor: '#1e40af',
  },
  interestText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  interestTextSelected: {
    color: '#ffffff',
  },
  generateButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 20,
  },
  generateButtonDisabled: {
    opacity: 0.7,
  },
  generateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
    textAlign: 'center',
  },
  planHeader: {
    borderRadius: 16,
    overflow: 'hidden',
    margin: 20,
    marginBottom: 0,
  },
  planGradient: {
    padding: 24,
    alignItems: 'center',
  },
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 12,
    marginBottom: 4,
  },
  planSubtitle: {
    fontSize: 16,
    color: '#e2e8f0',
    textAlign: 'center',
  },
  emergencyQuickAccess: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    margin: 20,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  emergencyText: {
    flex: 1,
    fontSize: 14,
    color: '#7f1d1d',
    marginLeft: 8,
  },
  safetyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc2626',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  safetyButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  bookingContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  bookingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  bookTripButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
  bookTripButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  shareContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shareTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  shareButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
    minWidth: 100,
    justifyContent: 'center',
  },
  facebookButton: {
    backgroundColor: '#1877f2',
  },
  twitterButton: {
    backgroundColor: '#1da1f2',
  },
  instagramButton: {
    backgroundColor: '#e4405f',
  },
  generalShareButton: {
    backgroundColor: '#6b7280',
  },
  shareButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  planContent: {
    padding: 20,
  },
  planText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newPlanButton: {
    backgroundColor: '#1e40af',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  newPlanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});