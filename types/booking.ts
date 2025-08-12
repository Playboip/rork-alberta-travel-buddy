export interface BookingItem {
  id: string;
  type: 'hotel' | 'hostel' | 'apartment' | 'villa' | 'cabin' | 'flight' | 'activity' | 'car_rental' | 'restaurant' | 'tour' | 'experience' | 'uber' | 'meal_deal' | 'train' | 'bus' | 'heli_tour';
  name: string;
  description: string;
  location: string;
  price: number;
  originalPrice?: number;
  currency: string;
  image: string;
  rating?: number;
  duration?: string;
  availability: boolean;
  provider: string;
  bookingUrl?: string;
  features?: string[];
  // Discount information
  discount?: {
    percentage: number;
    code?: string;
    validUntil?: string;
    description: string;
    type: 'early_bird' | 'last_minute' | 'loyalty' | 'group' | 'seasonal' | 'partner';
  };
  // Flight specific
  departure?: string;
  arrival?: string;
  flightNumber?: string;
  airline?: string;
  // Accommodation specific (hotels, hostels, apartments, etc.)
  roomType?: string;
  accommodationType?: 'private_room' | 'shared_room' | 'entire_place' | 'dorm_bed';
  amenities?: string[];
  checkInTime?: string;
  checkOutTime?: string;
  // Car rental specific
  carModel?: string;
  transmission?: 'automatic' | 'manual';
  fuelType?: string;
  // Restaurant specific
  cuisine?: string;
  priceRange?: string;
  // Tour/Experience specific
  groupSize?: number;
  difficulty?: 'easy' | 'moderate' | 'challenging';
  includes?: string[];
  // Transportation specific (Uber, etc.)
  vehicleType?: string;
  estimatedTime?: string;
  // Meal deal specific
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'combo';
  restaurantPartner?: string;
}

export interface Booking {
  id: string;
  userId: string;
  tripPlanId?: string;
  type: 'hotel' | 'hostel' | 'apartment' | 'villa' | 'cabin' | 'flight' | 'activity' | 'car_rental' | 'restaurant' | 'tour' | 'experience' | 'uber' | 'meal_deal' | 'train' | 'bus' | 'heli_tour';
  itemId: string;
  itemName: string;
  itemDescription: string;
  location: string;
  checkInDate?: string;
  checkOutDate?: string;
  bookingDate: string;
  guests: number;
  totalPrice: number;
  originalPrice?: number;
  discountApplied?: {
    amount: number;
    percentage: number;
    code?: string;
    type: string;
  };
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  confirmationNumber?: string;
  provider: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
  // Additional booking details
  specialRequests?: string;
  contactInfo?: {
    email: string;
    phone: string;
  };
  // Flight specific
  seatPreference?: string;
  mealPreference?: string;
  // Accommodation specific
  roomPreferences?: string[];
  accommodationType?: 'private_room' | 'shared_room' | 'entire_place' | 'dorm_bed';
  // Car rental specific
  pickupLocation?: string;
  dropoffLocation?: string;
  driverAge?: number;
}

export interface BookingSearchFilters {
  location: string;
  checkIn?: string;
  checkOut?: string;
  guests: number;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  amenities?: string[];
  // Flight specific
  departure?: string;
  arrival?: string;
  flightClass?: 'economy' | 'premium' | 'business' | 'first';
  // Car rental specific
  carType?: 'compact' | 'midsize' | 'suv' | 'luxury';
  // Activity/Tour specific
  difficulty?: 'easy' | 'moderate' | 'challenging';
  category?: string;
}

export interface TripPlan {
  id: string;
  userId: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalBudget?: number;
  bookings: Booking[];
  notes?: string;
  status: 'planning' | 'booked' | 'completed';
  createdAt: string;
  updatedAt: string;
}