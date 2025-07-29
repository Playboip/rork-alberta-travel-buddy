export interface User {
  id: string;
  email: string;
  name: string;
  location: string;
  emergencyContact?: string;
  subscriptionTier: 'free' | 'explorer' | 'adventurer';
  subscriptionStatus: 'active' | 'canceled' | 'past_due' | 'trialing';
  subscriptionId?: string;
  createdAt: string;
}

export interface SubscriptionTier {
  id: 'free' | 'explorer' | 'adventurer';
  name: string;
  price: number;
  interval: 'month';
  features: string[];
  stripePriceId: string;
  popular?: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  destinationName: string;
  rating: number;
  comment: string;
  images?: string[];
  visitedDate: string;
  createdAt: string;
}

export interface VisitedPlace {
  id: string;
  userId: string;
  name: string;
  location: string;
  visitedDate: string;
  rating: number;
  notes?: string;
  images?: string[];
  createdAt: string;
}