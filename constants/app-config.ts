import Constants from 'expo-constants';

export const APP_CONFIG = {
  domain: 'albertatravelbuddy.com',
  url: 'https://albertatravelbuddy.com',
  name: 'Alberta Travel Buddy',
  description: 'Discover hidden gems and book your entire Alberta adventure',
  
  // Contact Information
  emails: {
    support: 'support@albertatravelbuddy.com',
    contact: 'hello@albertatravelbuddy.com',
    bookings: 'bookings@albertatravelbuddy.com',
  },
  
  // Social Media (update when you create accounts)
  social: {
    instagram: '@albertatravelbuddy',
    facebook: 'albertatravelbuddy',
    twitter: '@albertatravel',
  },
  
  // App Store Information
  appStore: {
    ios: 'https://apps.apple.com/app/alberta-travel-buddy',
    android: 'https://play.google.com/store/apps/details?id=com.albertatravelbuddy.app',
  },
  
  // Environment
  env: Constants.expoConfig?.extra?.env || 'development',
  version: Constants.expoConfig?.version || '1.0.0',
};

// Deep linking configuration
export const DEEP_LINK_CONFIG = {
  scheme: 'albertatravelbuddy',
  prefixes: [
    'https://albertatravelbuddy.com',
    'albertatravelbuddy://',
  ],
};

// SEO and Meta Information
export const SEO_CONFIG = {
  title: 'Alberta Travel Buddy - Discover Hidden Gems',
  description: 'Book your complete Alberta adventure - hidden gem accommodations, local experiences, flights, and rentals all in one app.',
  keywords: 'Alberta travel, hidden gems, booking, accommodations, experiences, flights, car rental',
  ogImage: 'https://albertatravelbuddy.com/og-image.png',
};