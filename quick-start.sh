#!/bin/bash

# Quick Start Script for Alberta Travel Buddy
# This script helps you start the app with clear instructions

echo "🍁 Alberta Travel Buddy - Quick Start"
echo "======================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed!"
    echo ""
fi

echo "🚀 Starting the app..."
echo ""
echo "📱 Choose your platform:"
echo "   1. Web (Browser)"
echo "   2. iOS Simulator"
echo "   3. Android Emulator"
echo "   4. Expo Go (Scan QR Code)"
echo ""
echo "💡 DEV MODE is ENABLED!"
echo "   When the app loads, you'll see a screen with:"
echo "   - 🚀 Skip Auth - Enter App (Dev Mode) <- Click this!"
echo "   - 🔐 Continue to Login"
echo ""
echo "   To disable dev mode later, edit app/index.tsx"
echo "   and set: const DEV_MODE = false;"
echo ""
echo "======================================"
echo ""

# Start expo
npx expo start
