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
    id: 'explorer',
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
    id: 'adventurer',
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