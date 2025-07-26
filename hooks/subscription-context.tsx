import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { useAuth } from './auth-context';
import { SUBSCRIPTION_TIERS } from '@/constants/subscription-tiers';

interface SubscriptionState {
  isLoading: boolean;
  createSubscription: (priceId: string) => Promise<string>;
  cancelSubscription: () => Promise<void>;
  updateSubscription: (priceId: string) => Promise<void>;
  getCurrentTier: () => typeof SUBSCRIPTION_TIERS[0];
  canUseFeature: (feature: string) => boolean;
  getUsageLimit: (feature: string) => number;
}

export const [SubscriptionProvider, useSubscription] = createContextHook((): SubscriptionState => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUser } = useAuth();

  const getCurrentTier = () => {
    return SUBSCRIPTION_TIERS.find(tier => tier.id === user?.subscriptionTier) || SUBSCRIPTION_TIERS[0];
  };

  const canUseFeature = (feature: string): boolean => {
    if (!user) return false;
    
    const tier = getCurrentTier();
    
    // Check specific features based on subscription tier
    switch (feature.toLowerCase()) {
      case 'post reviews':
      case 'add visited places':
        return user.subscriptionTier !== 'free';
      case 'unlimited ai plans':
        return user.subscriptionTier !== 'free';
      case 'group planning':
        return user.subscriptionTier === 'pro';
      default:
        return tier.features.some(f => f.toLowerCase().includes(feature.toLowerCase()));
    }
  };

  const getUsageLimit = (feature: string): number => {
    if (!user) return 0;
    
    switch (feature) {
      case 'ai_plans':
        return user.subscriptionTier === 'free' ? 3 : -1; // -1 means unlimited
      default:
        return -1;
    }
  };

  const createSubscription = async (priceId: string): Promise<string> => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ priceId })
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      const data = await response.json();
      return data.clientSecret;
    } catch (error) {
      console.error('Create subscription error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      await updateUser({ subscriptionStatus: 'canceled' });
    } catch (error) {
      console.error('Cancel subscription error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubscription = async (priceId: string): Promise<void> => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('/api/subscription/update', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ priceId })
      });

      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }

      const newTier = SUBSCRIPTION_TIERS.find(tier => tier.stripePriceId === priceId);
      if (newTier) {
        await updateUser({ subscriptionTier: newTier.id });
      }
    } catch (error) {
      console.error('Update subscription error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createSubscription,
    cancelSubscription,
    updateSubscription,
    getCurrentTier,
    canUseFeature,
    getUsageLimit
  };
});