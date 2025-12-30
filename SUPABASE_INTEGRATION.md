# Supabase Integration Guide

This guide explains how to set up and use the Supabase integration for dynamic restaurant and venue data in the Alberta Travel Buddy app.

## Overview

The app now integrates with Supabase for fetching and managing restaurant data dynamically, replacing the previous hardcoded data approach. This provides:

- **Dynamic Updates**: Restaurant data can be updated in Supabase without code changes
- **Scalability**: Easy to add new restaurants, venues, and locations
- **Backend API**: tRPC routes provide structured access to restaurant data
- **Fallback Support**: The app gracefully falls back to cached data if Supabase is unavailable

## What's Been Implemented

### 1. Database Schema
The `venues` table in Supabase stores all restaurant and venue data:
- Location: `supabase/schema.sql` (lines 345-375)
- Fields: name, city, region, category, type, description, website, coordinates, etc.
- Supports: restaurants, bars, cafes, speakeasies

### 2. Data Migration Script
Script to migrate hardcoded restaurant data to Supabase:
- Location: `scripts/migrate_test_data.ts`
- Purpose: One-time migration of existing restaurant data
- Features: Upsert with duplicate prevention, batch processing

### 3. Data Fetching Script
Script to query and display restaurant data from Supabase:
- Location: `scripts/fetch_data_from_supabase.ts`
- Purpose: Verify data, debug, and explore the database
- Features: Statistics by category/city, sample data display

### 4. Backend API Routes
tRPC routes for accessing restaurant data:
- Location: `backend/trpc/routes/restaurants/`
- Routes:
  - `list`: Get all restaurants
  - `recommendations`: Get filtered recommendations by city, cuisine, etc.
- Integration point: `backend/trpc/app-router.ts`

### 5. Frontend Integration
Updated dining screen to use dynamic data:
- Location: `app/(tabs)/dining.tsx`
- Features: 
  - Fetches data via tRPC
  - Loading states
  - Error handling with fallback to cached data
  - Transforms Supabase venue format to UI format

### 6. Environment Configuration
Enhanced `.env` file with documentation:
- Supabase URL and anonymous key
- Clear comments explaining each credential's purpose
- Instructions for where to find credentials in Supabase Dashboard

## Setup Instructions

### Step 1: Verify Environment Variables

Ensure your `.env` file contains the correct Supabase credentials:

```env
# Get these from: Settings -> API in your Supabase Dashboard
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 2: Install Dependencies

```bash
npm install --legacy-peer-deps
```

### Step 3: Verify Database Schema

1. Go to your Supabase Dashboard → SQL Editor
2. Run the schema from `supabase/schema.sql` if not already done
3. Verify the `venues` table exists with correct columns

### Step 4: Migrate Data (Optional)

If you want to populate the database with the existing restaurant data:

```bash
npx tsx scripts/migrate_test_data.ts
```

This will:
- Read the 16 hardcoded restaurants from `dining.tsx`
- Transform them to the Supabase venue format
- Insert/update them in the database
- Provide a migration summary

### Step 5: Verify Data

Check that data was migrated successfully:

```bash
npx tsx scripts/fetch_data_from_supabase.ts
```

You should see:
- Connection confirmation
- Count of total venues
- Count of restaurants
- Sample restaurant data
- Statistics by city

### Step 6: Test the App

1. Start the development server:
   ```bash
   npm start
   ```

2. Navigate to the Dining tab
3. You should see restaurants loaded from Supabase
4. The app will show a loading indicator while fetching
5. If Supabase is unavailable, it falls back to cached data

## How It Works

### Data Flow

```
Supabase Database (venues table)
         ↓
Backend tRPC Routes (restaurants.list / recommendations)
         ↓
Frontend React Query Hook (trpc.restaurants.list.useQuery)
         ↓
Dining Screen Component (app/(tabs)/dining.tsx)
         ↓
User Interface (displays restaurants)
```

### API Usage Examples

#### In React Components

```typescript
import { trpc } from '@/lib/trpc';

// Get all restaurants
const { data, isLoading, error } = trpc.restaurants.list.useQuery();

// Get filtered recommendations
const { data } = trpc.restaurants.recommendations.useQuery({
  city: 'Calgary',
  cuisine: 'Steakhouse',
  limit: 10
});
```

#### Data Structure

**Supabase Venue Format**:
```typescript
{
  id: 'uuid',
  name: 'The Bison Restaurant',
  city: 'Banff',
  region: 'Alberta',
  category: 'restaurant',
  type: 'Canadian',
  description: 'Upscale Canadian cuisine...',
  known_for: 'Bison Tenderloin, Alberta Beef, Local Game',
  website: 'https://www.thebison.ca',
  // ... other fields
}
```

**Frontend Restaurant Format**:
```typescript
{
  id: 'uuid',
  name: 'The Bison Restaurant',
  area: 'Banff',
  cuisine: 'Canadian',
  rating: 4.5,
  priceRange: '$$$',
  description: 'Upscale Canadian cuisine...',
  specialties: ['Bison Tenderloin', 'Alberta Beef', 'Local Game'],
  website: 'https://www.thebison.ca',
  // ... other fields
}
```

## Adding New Restaurants

### Method 1: Through Supabase Dashboard (Recommended)

1. Go to Supabase Dashboard → Table Editor → venues
2. Click "Insert" → "Insert row"
3. Fill in the required fields:
   - `name`: Restaurant name
   - `city`: City/town name
   - `category`: 'restaurant'
   - `type`: Cuisine type (e.g., 'Italian', 'Steakhouse')
   - `description`: Brief description
   - `known_for`: Comma-separated specialties
   - `website`: Restaurant website URL
4. Click "Save"

### Method 2: Through SQL

```sql
INSERT INTO venues (name, city, region, category, type, description, known_for, website)
VALUES (
  'New Restaurant Name',
  'Calgary',
  'Alberta',
  'restaurant',
  'Italian',
  'Authentic Italian cuisine in downtown Calgary',
  'Handmade pasta, Wood-fired pizza, Wine selection',
  'https://example.com'
);
```

### Method 3: Update Migration Script

Add new restaurants to the `RESTAURANTS` array in `scripts/migrate_test_data.ts` and run the migration again.

## Troubleshooting

### Problem: "Cannot find module" errors
**Solution**: Run `npm install --legacy-peer-deps`

### Problem: "Missing Supabase credentials"
**Solution**: Check your `.env` file exists and contains the correct variables

### Problem: No restaurants showing in the app
**Solutions**:
1. Verify data exists: Run `npx tsx scripts/fetch_data_from_supabase.ts`
2. Check network connection to Supabase
3. Review browser/app console for errors
4. The app should fall back to cached data if Supabase is unavailable

### Problem: Duplicate restaurants after migration
**Solution**: The migration uses `upsert` with `(name, city)` as unique key. Duplicates are prevented automatically.

### Problem: Scripts fail with fetch errors
**Solution**: 
- Verify your Supabase project is active (not paused)
- Check the Supabase URL is correct
- Ensure your Supabase anonymous key is valid

## Project Structure

```
├── scripts/
│   ├── README.md                          # Detailed script documentation
│   ├── fetch_data_from_supabase.ts       # Query and display data
│   └── migrate_test_data.ts              # Migrate hardcoded data
├── backend/
│   └── trpc/
│       ├── app-router.ts                  # Main tRPC router (updated)
│       └── routes/
│           └── restaurants/
│               ├── list.ts                # Get all restaurants
│               └── recommendations.ts     # Get filtered restaurants
├── app/
│   └── (tabs)/
│       └── dining.tsx                     # Updated to use Supabase data
├── supabase/
│   └── schema.sql                         # Database schema (venues table)
├── .env                                   # Supabase credentials (updated with comments)
└── SUPABASE_INTEGRATION.md               # This file
```

## Benefits of This Approach

1. **No Code Deployments**: Update restaurant data without redeploying the app
2. **Centralized Data**: Single source of truth for all restaurant information
3. **Easy Maintenance**: Add/edit/remove restaurants through Supabase UI
4. **Scalability**: Easily extend to support more venue types (hotels, attractions, etc.)
5. **API-First**: Backend routes can be used by other services or apps
6. **Type Safety**: Full TypeScript support throughout the stack
7. **Offline Support**: Fallback to cached data when offline

## Future Enhancements

Potential improvements to consider:

1. **Add coordinates**: Include latitude/longitude for map integration
2. **User reviews**: Link to reviews table for user-generated content
3. **Images**: Add image URLs or integrate with Supabase Storage
4. **Advanced search**: Full-text search, filters by price range, ratings
5. **Favorites**: Let users save favorite restaurants
6. **Recommendations AI**: Use AI to suggest restaurants based on preferences
7. **Operating hours**: Store detailed business hours in structured format
8. **Contact info**: Add phone numbers, email, social media links

## Related Documentation

- [Database Setup Guide](./DATABASE_SETUP_GUIDE.md) - How to set up the database
- [Scripts README](./scripts/README.md) - Detailed script documentation
- [Supabase RLS Setup](./SUPABASE_RLS_SETUP.md) - Row-level security configuration

## Support

For questions or issues:
1. Check the Supabase Dashboard for data and errors
2. Review the console logs in the app for error messages
3. Verify all environment variables are set correctly
4. Test the scripts to ensure database connectivity

---

**Last Updated**: December 2024
**Integration Version**: 1.0
