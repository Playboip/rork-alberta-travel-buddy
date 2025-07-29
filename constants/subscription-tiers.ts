export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'explorer' | 'adventurer';

export interface SubscriptionTierInfo {
  id: SubscriptionTier;
  name: string;
  price: number;
  interval: 'month';
  features: string[];
  stripePriceId: string;
  popular?: boolean;
  gradient: readonly [string, string, ...string[]];
}

export const SUBSCRIPTION_TIERS: SubscriptionTierInfo[] = [
  {
    id: 'free' as const,
    gradient: ['#f3f4f6', '#e5e7eb'] as const,
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
    id: 'explorer' as const,
    gradient: ['#fed7aa', '#fdba74'] as const,
    name: 'Alberta Travel Buddy Explorer',
    price: 4.99,
    interval: 'month',
    stripePriceId: 'https://buy.stripe.com/5kQ00j4sIcu63DU9OC5AQ0W',
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
    id: 'adventurer' as const,
    gradient: ['#ddd6fe', '#c4b5fd'] as const,
    name: 'Alberta Travel Buddy Adventurer',
    price: 9.99,
    interval: 'month',
    stripePriceId: 'https://buy.stripe.com/8x27sL6AQ51E2zQbWK5AQ0X',
    features: [
      'Everything in Explorer',
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