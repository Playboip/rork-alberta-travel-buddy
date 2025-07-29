import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Crown, Star, Zap } from 'lucide-react-native';
import { Stack } from 'expo-router';
import { useAuth } from '@/hooks/auth-context';
import { useSubscription } from '@/hooks/subscription-context';
import { SUBSCRIPTION_TIERS } from '@/constants/subscription-tiers';

export default function SubscriptionScreen() {
  const { user } = useAuth();
  const { createSubscription, isLoading, getCurrentTier } = useSubscription();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const currentTier = getCurrentTier();

  const handleSubscribe = async (priceId: string, tierName: string) => {
    if (!priceId) {
      Alert.alert('Free Tier', 'You are already on the free tier!');
      return;
    }

    setSelectedTier(priceId);
    try {
      // Open Stripe payment link
      const supported = await Linking.canOpenURL(priceId);
      if (supported) {
        await Linking.openURL(priceId);
      } else {
        Alert.alert('Error', 'Unable to open payment link');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open payment link. Please try again.');
    } finally {
      setSelectedTier(null);
    }
  };

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case 'free': return <Zap color="#6b7280" size={24} />;
      case 'explorer': return <Star color="#f97316" size={24} />;
      case 'adventurer': return <Crown color="#7c3aed" size={24} />;
      default: return <Zap color="#6b7280" size={24} />;
    }
  };

  const getTierGradient = (tierId: string) => {
    switch (tierId) {
      case 'free': return ['#f3f4f6', '#e5e7eb'];
      case 'explorer': return ['#fed7aa', '#fdba74'];
      case 'adventurer': return ['#ddd6fe', '#c4b5fd'];
      default: return ['#f3f4f6', '#e5e7eb'];
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Subscription Plans' }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Adventure</Text>
          <Text style={styles.subtitle}>Unlock premium features for your Alberta travels</Text>
          <Text style={styles.currentPlan}>Current Plan: {currentTier.name}</Text>
        </View>

        <View style={styles.tiersContainer}>
          {SUBSCRIPTION_TIERS.map((tier) => (
            <View key={tier.id} style={styles.tierCard}>
              {tier.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>Most Popular</Text>
                </View>
              )}
              
              <LinearGradient
                colors={getTierGradient(tier.id)}
                style={styles.tierGradient}
              >
                <View style={styles.tierHeader}>
                  {getTierIcon(tier.id)}
                  <Text style={styles.tierName}>{tier.name}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>
                      ${tier.price}
                      {tier.price > 0 && <Text style={styles.interval}>/{tier.interval}</Text>}
                    </Text>
                  </View>
                </View>

                <View style={styles.featuresContainer}>
                  {tier.features.map((feature, index) => (
                    <View key={index} style={styles.featureRow}>
                      <Check color="#059669" size={16} />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={[
                    styles.subscribeButton,
                    currentTier.id === tier.id && styles.currentTierButton,
                    (isLoading && selectedTier === tier.stripePriceId) && styles.loadingButton
                  ]}
                  onPress={() => handleSubscribe(tier.stripePriceId, tier.name)}
                  disabled={isLoading || currentTier.id === tier.id}
                >
                  <Text style={[
                    styles.subscribeButtonText,
                    currentTier.id === tier.id && styles.currentTierButtonText
                  ]}>
                    {currentTier.id === tier.id 
                      ? 'Current Plan' 
                      : isLoading && selectedTier === tier.stripePriceId
                        ? 'Processing...'
                        : tier.price === 0 
                          ? 'Free Forever' 
                          : 'Subscribe Now'
                    }
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            • Cancel anytime{'\n'}
            • 7-day free trial for paid plans{'\n'}
            • Secure payments powered by Stripe{'\n'}
            • All prices in CAD
          </Text>
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
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  currentPlan: {
    fontSize: 14,
    color: '#1e40af',
    fontWeight: '600',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tiersContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  tierCard: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f97316',
    paddingVertical: 8,
    zIndex: 1,
  },
  popularText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tierGradient: {
    padding: 24,
    paddingTop: 32,
  },
  tierHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  tierName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 12,
    marginBottom: 8,
  },
  priceContainer: {
    alignItems: 'center',
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  interval: {
    fontSize: 16,
    color: '#6b7280',
  },
  featuresContainer: {
    marginBottom: 24,
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  subscribeButton: {
    backgroundColor: '#1e40af',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  currentTierButton: {
    backgroundColor: '#e5e7eb',
  },
  loadingButton: {
    opacity: 0.7,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  currentTierButtonText: {
    color: '#6b7280',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});