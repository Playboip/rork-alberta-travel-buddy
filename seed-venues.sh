#!/bin/bash

echo "🍽️  Seeding Alberta venues to Supabase..."
echo "This will add all the speakeasies and restaurants to your database."
echo ""

# Run the TypeScript seeding script
bun run scripts/seed-venues.ts

echo ""
echo "✅ Done! All venues have been added to your database."
echo "You can now see them in your app's dining section."