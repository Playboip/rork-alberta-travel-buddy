export default {
  expo: {
    name: "Alberta Travel Buddy",
    slug: "alberta-travel-buddy",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#1e40af"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#1e40af"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      supabaseUrl: "https://tzetdlokyqqdnxjntzkv.supabase.co",
      supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6ZXRkbG9reXFxZG54am50emt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwOTQ5OTAsImV4cCI6MjA2ODY3MDk5MH0.JsUIArqIyWvlrGhFhx1YR1vZMQgBHoPm6jnhlA68wLo"
    }
  }
};