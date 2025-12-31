import { Redirect } from "expo-router";
import { useAuth } from "@/hooks/auth-context";
import { View, ActivityIndicator, TouchableOpacity, Text, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

// DEVELOPMENT MODE: Set to true to bypass authentication for testing
const DEV_MODE = true;

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const [devBypass, setDevBypass] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Development bypass: Allow entering app without authentication
  if (DEV_MODE && !isAuthenticated && !devBypass) {
    return (
      <View style={styles.devContainer}>
        <Text style={styles.devTitle}>Development Mode</Text>
        <Text style={styles.devText}>
          Authentication is currently blocking the app. Choose an option:
        </Text>
        
        <TouchableOpacity 
          style={styles.devButton}
          onPress={() => setDevBypass(true)}
        >
          <Text style={styles.devButtonText}>
            🚀 Skip Auth - Enter App (Dev Mode)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.devButton, styles.authButton]}
          onPress={() => {}} // This will redirect to auth below
        >
          <Text style={styles.devButtonText}>
            🔐 Continue to Login
          </Text>
        </TouchableOpacity>

        <Text style={styles.devNote}>
          Note: Set DEV_MODE to false in app/index.tsx when auth is working
        </Text>
      </View>
    );
  }

  // Allow dev bypass to access the app
  if (devBypass) {
    return <Redirect href="/(tabs)" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  devContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1e293b",
  },
  devTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fbbf24",
    marginBottom: 20,
  },
  devText: {
    fontSize: 16,
    color: "#e5e7eb",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  devButton: {
    backgroundColor: "#10b981",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginVertical: 10,
    minWidth: 280,
  },
  authButton: {
    backgroundColor: "#3b82f6",
  },
  devButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  devNote: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 30,
    fontStyle: "italic",
  },
});
