/* eslint prefer-const: "error" */
module.exports = ({ config }) => {
  return {
    ...config,
    name: "rork-alberta-travel-buddy",
    slug: "rork-alberta",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.example.rork"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      apiBaseUrl: process.env.EXPO_PUBLIC_RORK_API_BASE_URL || "http://192.168.1.23:3000",
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || "https://tzetdlokyqqdnxjntzkv.supabase.co",
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6ZXRkbG9reXFxZG54am50emt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwOTQ5OTAsImV4cCI6MjA2ODY3MDk5MH0.JsUIArqIyWvlrGhFhx1YR1vZMQgBHoPm6jnhlA68wLo"
    }
  };
};
