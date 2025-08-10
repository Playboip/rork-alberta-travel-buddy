import React from 'react';
import { Stack, router } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import WildlifeMap from '@/components/map/WildlifeMap';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { MapPin } from 'lucide-react-native';

export default function WildlifeMapScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Wildlife Alerts', headerStyle: { backgroundColor: '#111827' }, headerTintColor: '#ffffff' }} />
      <ErrorBoundary>
        <WildlifeMap />
      </ErrorBoundary>
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={() => router.back()} testID="close-map">
          <MapPin size={18} color="#111827" />
          <Text style={styles.fabText}>Back to Guide</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  fabContainer: { position: 'absolute', bottom: 20, left: 0, right: 0, alignItems: 'center' },
  fab: { flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: '#f3f4f6', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#e5e7eb' },
  fabText: { fontSize: 12, fontWeight: '700', color: '#111827' },
});