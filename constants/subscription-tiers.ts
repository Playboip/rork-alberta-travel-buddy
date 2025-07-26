import { SubscriptionTier } from '@/types/user';

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free Explorer',
    price: 0,
    interval: 'month',
    stripePriceId: '',
    features: [
      '3 AI trip plans per month',
      'Basic destination discovery',
      'Emergency safety contacts',
      'View community reviews',
      'Basic travel tips'
    ]
  },
  {
    id: 'starter',
    name: 'Starter Adventurer',
    price: 4.99,
    interval: 'month',
    stripePriceId: 'price_1234567890_starter', // Replace with your actual Stripe price ID
    popular: true,
    features: [
      'Unlimited AI trip plans',
      'Advanced safety alerts in itineraries',
      'Real-time weather updates',
      'Post reviews and photos',
      'Add visited places to profile',
      'Offline access to saved trips',
      'Priority customer support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Explorer',
    price: 9.99,
    interval: 'month',
    stripePriceId: 'price_1234567890_pro', // Replace with your actual Stripe price ID
    features: [
      'Everything in Starter',
      'Advanced route optimization',
      'Group trip planning & sharing',
      'Exclusive destination guides',
      'Personal travel concierge chat',
      'Custom itinerary exports (PDF)',
      'Early access to new features',
      'Community moderator privileges'
    ]
  }
];