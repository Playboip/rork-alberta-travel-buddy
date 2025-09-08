#!/bin/bash

# Simple script to run the venue seeding
echo "🌱 Starting venue seeding..."
echo "📍 Seeding Alberta restaurants and speakeasies to Supabase..."

# Run the TypeScript seeding script with bun
bun run scripts/seed-venues.ts

echo "✅ Venue seeding completed!"
echo ""
echo "💡 You can also run this directly with: bun run scripts/seed-venues.ts"