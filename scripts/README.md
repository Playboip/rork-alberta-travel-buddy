# Supabase Restaurant Data Scripts

This directory contains scripts for managing restaurant and venue data in Supabase.

## Prerequisites

1. **Environment Variables**: Ensure your `.env` file contains:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **Dependencies**: Install project dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

## Available Scripts

### 1. Fetch Data from Supabase

**Script**: `fetch_data_from_supabase.ts`

Queries the Supabase venues table and displays restaurant data with statistics.

**Usage**:
```bash
npx tsx scripts/fetch_data_from_supabase.ts
```

**What it does**:
- Connects to your Supabase database
- Fetches all venues from the `venues` table
- Filters and displays restaurants specifically
- Shows summary statistics by category and city
- Displays sample restaurant details

**Example Output**:
```
🔗 Connecting to Supabase...
📊 Fetching all venues...
✅ Found 177 total venues

🍽️  Fetching restaurants...
✅ Found 89 restaurants

📈 Summary by category:
   restaurant: 89
   speakeasy: 45
   bar: 32
   cafe: 11
```

### 2. Migrate Test Data to Supabase

**Script**: `migrate_test_data.ts`

Migrates the hardcoded restaurant data from `app/(tabs)/dining.tsx` to the Supabase database.

**Usage**:
```bash
npx tsx scripts/migrate_test_data.ts
```

**What it does**:
- Reads the hardcoded `RESTAURANTS` array
- Transforms each restaurant into the Supabase venue format
- Upserts the data into the `venues` table (updates if exists, inserts if new)
- Uses `name` and `city` as unique identifiers to prevent duplicates
- Provides progress updates and summary statistics

**Data Transformation**:
The script converts the hardcoded restaurant format:
```typescript
{
  id: '1',
  name: 'The Bison Restaurant',
  area: 'Banff',
  cuisine: 'Canadian',
  rating: 4.5,
  // ... other fields
}
```

To the Supabase venue format:
```typescript
{
  name: 'The Bison Restaurant',
  city: 'Banff',
  region: 'Alberta',
  category: 'restaurant',
  type: 'Canadian',
  description: '...',
  known_for: 'Bison Tenderloin, Alberta Beef, Local Game',
  website: 'https://www.thebison.ca',
  // ... other fields
}
```

**Important Notes**:
- The script uses `upsert` with conflict resolution on `name` and `city`
- This means you can run it multiple times safely - it won't create duplicates
- Existing restaurants with the same name and city will be updated
- The script processes data in chunks of 10 to avoid rate limits

### 3. Backend Integration

The restaurant data can be accessed through tRPC routes:

#### List All Restaurants
```typescript
const { data } = trpc.restaurants.list.useQuery();
// Returns all restaurants from Supabase
```

#### Get Recommendations with Filters
```typescript
const { data } = trpc.restaurants.recommendations.useQuery({
  city: 'Calgary',
  cuisine: 'Steakhouse',
  limit: 10
});
// Returns filtered restaurant recommendations
```

## Frontend Integration

The dining screen (`app/(tabs)/dining.tsx`) automatically fetches restaurant data from Supabase using the tRPC routes. If no data is available in Supabase, it falls back to the hardcoded data.

## Troubleshooting

### "Missing Supabase credentials" Error
- Ensure your `.env` file exists in the project root
- Check that `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are set
- Make sure there are no typos in the variable names

### "Cannot find module" Errors
- Run `npm install --legacy-peer-deps` to install all dependencies
- Make sure you're running the scripts from the project root directory

### Network/Fetch Errors
- Verify your Supabase URL is correct and accessible
- Check your internet connection
- Ensure your Supabase project is active and not paused

### "Failed to upsert" Errors
- Check that the `venues` table exists in your Supabase database
- Verify the table schema matches the expected format (see `supabase/schema.sql`)
- Ensure Row Level Security (RLS) policies allow anonymous inserts if needed

## Database Schema

The `venues` table schema (from `supabase/schema.sql`):

```sql
CREATE TABLE IF NOT EXISTS public.venues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  region TEXT DEFAULT 'Alberta' NOT NULL,
  category TEXT NOT NULL,
  type TEXT,
  address TEXT,
  how_to_find TEXT,
  vibe TEXT,
  known_for TEXT,
  description TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  website TEXT,
  instagram TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, city)
);
```

## Next Steps

After successfully migrating the data:

1. **Verify the data**: Run the fetch script to confirm data was migrated
2. **Test the frontend**: Launch the app and check the dining tab
3. **Update or add more data**: You can manually add/edit restaurants in Supabase
4. **Add location data**: Consider adding latitude/longitude coordinates for map features

## Support

For issues or questions:
- Check the Supabase dashboard for table structure and data
- Review the SQL editor for any error messages
- Ensure all environment variables are correctly configured
