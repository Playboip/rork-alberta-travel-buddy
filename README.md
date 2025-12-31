# Alberta Travel Buddy 🍁

Your intelligent travel companion for exploring Alberta, Canada.

## ⚠️ IMPORTANT: Testing This PR

This branch contains fixes for the LinkingContext error. To test:

```bash
# Clone THIS PR branch (not main)
git clone -b copilot/fix-linkingcontext-error https://github.com/Playboip/rork-alberta-travel-buddy.git
cd rork-alberta-travel-buddy
npm install
npm start
```

**Don't download the main branch ZIP** - it doesn't have these fixes yet!

## 🚀 Quick Start (Get the App Running NOW!)

The app now includes **Development Mode** that lets you bypass authentication and see the app immediately!

### Option 1: Use the Quick Start Script
```bash
./quick-start.sh
```

### Option 2: Manual Start
```bash
# Install dependencies (if not already installed)
npm install

# Start the app
npm start
```

### When the App Loads
You'll see a **Development Mode** screen with two options:
- **🚀 Skip Auth - Enter App** - Click this to access the app immediately!
- **🔐 Continue to Login** - Use this to test authentication

## 📱 Platform Options

Once Metro bundler starts, press:
- **w** - Open in web browser
- **i** - Open in iOS simulator
- **a** - Open in Android emulator
- **Scan QR code** - Open in Expo Go on your phone

## 🔧 Development Mode

**Current Status**: DEV_MODE is **ENABLED** (authentication is bypassed)

This allows you to preview and test the app without being blocked by authentication issues.

### To Disable Dev Mode
When you're ready to test authentication:
1. Open `app/index.tsx`
2. Change: `const DEV_MODE = false;`
3. Restart the app

## 📖 Documentation

- **[Complete Fix Documentation](./LINKINGCONTEXT_FIX_COMPLETE.md)** - Full details on the LinkingContext fix
- **[Implementation Summary](./IMPLEMENTATION_COMPLETE.md)** - Feature overview
- **[Supabase Integration](./SUPABASE_INTEGRATION.md)** - Database setup

## 🐛 Troubleshooting

### App won't start?
```bash
# Clear cache and restart
npx expo start -c
```

### Still getting errors?
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
npm start
```

### Need help?
Check the [Complete Fix Documentation](./LINKINGCONTEXT_FIX_COMPLETE.md) for detailed troubleshooting.

## 🎯 What's Fixed

- ✅ **LinkingContext error resolved** - Navigation now works correctly
- ✅ **Dev mode added** - Immediate app access for testing
- ✅ **Proper navigation structure** - Following Expo Router best practices
- ✅ **Auth flow preserved** - Can still test authentication when needed

## 🏗️ Project Structure

```
app/
├── _layout.tsx          # Root layout
├── index.tsx           # Entry point with dev bypass
├── auth/               # Authentication screens
├── (tabs)/             # Main app tabs
├── booking/            # Booking flows
└── ...
```

## 📦 Tech Stack

- **Expo Router** - File-based routing
- **React Native** - Cross-platform mobile
- **Supabase** - Backend & Auth
- **TypeScript** - Type safety
- **TailwindCSS (NativeWind)** - Styling

---

Created by Rork
