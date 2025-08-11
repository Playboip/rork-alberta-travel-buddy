import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Linking, Alert } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { MapPin, Star, Clock, ShieldAlert, Bird, Fish, Droplets, Mountain, Eye, Train, Plane, Hotel, Car, ExternalLink, DollarSign, Send } from 'lucide-react-native';
import { ALL_ALBERTA_ATTRACTIONS, AlbertaAttraction } from '@/constants/alberta-attractions';

function getIconForCategory(category: AlbertaAttraction['category']) {
  switch (category) {
    case 'waterfall': return <Droplets size={18} color="#06b6d4" />;
    case 'fishing': return <Fish size={18} color="#0ea5e9" />;
    case 'birdwatching': return <Bird size={18} color="#eab308" />;
    case 'hiking': return <Mountain size={18} color="#22c55e" />;
    case 'hidden-gem': return <Eye size={18} color="#f59e0b" />;
    default: return <Mountain size={18} color="#6b7280" />;
  }
}

export default function DestinationDetailsScreen() {
  const params = useLocalSearchParams();
  const id = typeof params.id === 'string' ? params.id : '';

  const attraction = useMemo(() => ALL_ALBERTA_ATTRACTIONS.find(a => a.id === id), [id]);

  const handleAddToTrip = (a: AlbertaAttraction) => {
    try {
      const presetTypes = [
        { type: 'tour' },
        { type: 'hotel' },
        { type: 'car_rental' },
        { type: 'train' },
      ];
      const preset = encodeURIComponent(JSON.stringify(presetTypes));
      const name = encodeURIComponent(`${a.name} Getaway`);
      const destination = encodeURIComponent(a.nearestCity || a.location);
      const notes = encodeURIComponent(`Highlights: ${a.features.join(', ')}. Safety: ${(a.safetyWarnings ?? []).join('; ')}`);
      router.push(`/trip-planner?name=${name}&destination=${destination}&notes=${notes}&preset=${preset}`);
    } catch (e) {
      console.error('[Destination] Failed to prefill trip', e);
    }
  };

  if (!attraction) {
    return (
      <View style={styles.notFound} testID="destinationNotFound">
        <Text style={styles.notFoundTitle}>Destination not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container} testID={`destination-${attraction.id}`}>
      <Stack.Screen options={{ title: attraction.name }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: attraction.image }} style={styles.hero} />

        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{attraction.name}</Text>
            <View style={styles.ratingRow}>
              <Star size={16} color="#f59e0b" fill="#f59e0b" />
              <Text style={styles.ratingText}>{attraction.rating.toFixed(1)}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <MapPin size={16} color="#6b7280" />
            <Text style={styles.metaText}>{attraction.location}</Text>
          </View>

          <View style={styles.tagsRow}>
            <View style={styles.tag}>
              {getIconForCategory(attraction.category)}
              <Text style={styles.tagText}>{attraction.category.replace('-', ' ')}</Text>
            </View>
            {attraction.duration ? (
              <View style={styles.tag}>
                <Clock size={16} color="#6b7280" />
                <Text style={styles.tagText}>{attraction.duration}</Text>
              </View>
            ) : null}
            {attraction.priceRange ? (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{attraction.priceRange === 'free' ? 'FREE' : attraction.priceRange}</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.description}>{attraction.description}</Text>

          {(attraction.operatorName || attraction.priceMinCad || attraction.priceMaxCad) && (
            <View style={styles.operatorCard}>
              {attraction.operatorName ? (
                <View style={styles.operatorRow}>
                  <Text style={styles.operatorLabel}>Operator</Text>
                  <Text style={styles.operatorName}>{attraction.operatorName}</Text>
                </View>
              ) : null}

              {(typeof attraction.priceMinCad === 'number' || typeof attraction.priceMaxCad === 'number') && (
                <View style={styles.operatorRow}>
                  <View style={styles.priceRowLeft}>
                    <DollarSign size={16} color="#059669" />
                    <Text style={styles.operatorLabel}>Pricing</Text>
                  </View>
                  <Text style={styles.priceRangeText}>
                    {typeof attraction.priceMinCad === 'number' ? `${attraction.priceMinCad}` : '—'}
                    {typeof attraction.priceMaxCad === 'number' ? `–${attraction.priceMaxCad}` : ''} CAD
                  </Text>
                </View>
              )}

              {attraction.pricingNotes ? (
                <Text style={styles.pricingNotes}>{attraction.pricingNotes}</Text>
              ) : null}

              {attraction.operatorUrl ? (
                <TouchableOpacity
                  style={styles.operatorLinkBtn}
                  onPress={async () => {
                    try {
                      const supported = await Linking.canOpenURL(attraction.operatorUrl!);
                      if (!supported) {
                        Alert.alert('Unable to open link', 'Please try again later.');
                        return;
                      }
                      await Linking.openURL(attraction.operatorUrl!);
                    } catch (e) {
                      Alert.alert('Unable to open link', 'Please try again later.');
                    }
                  }}
                  testID="visitOperator"
                >
                  <ExternalLink size={16} color="#111827" />
                  <Text style={styles.operatorLinkText}>Visit Operator Website</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}
        </View>

        {(attraction.safetyWarnings?.length || attraction.dangerousAnimals?.length) ? (
          <View style={styles.alertsCard}>
            <View style={styles.alertsHeader}>
              <ShieldAlert size={18} color="#dc2626" />
              <Text style={styles.alertsTitle}>Safety Alerts</Text>
            </View>
            {attraction.dangerousAnimals?.length ? (
              <Text style={styles.alertsSubtitle}>Wildlife: {attraction.dangerousAnimals.join(', ')}</Text>
            ) : null}
            {attraction.safetyWarnings?.map((w, idx) => (
              <Text key={idx} style={styles.alertItem}>• {w}</Text>
            ))}
          </View>
        ) : null}

        {attraction.tips?.length ? (
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>Pro Tips</Text>
            {attraction.tips.map((t, idx) => (
              <Text key={idx} style={styles.tip}>• {t}</Text>
            ))}
          </View>
        ) : null}

        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Plan this trip</Text>
          <Text style={styles.ctaSubtitle}>We’ll pre-fill your planner with travel options</Text>
          <View style={styles.transportRow}>
            <View style={styles.transportPill}><Plane size={16} color="#3b82f6" /><Text style={styles.transportText}>Flights</Text></View>
            <View style={styles.transportPill}><Train size={16} color="#0ea5e9" /><Text style={styles.transportText}>Passenger trains</Text></View>
            <View style={styles.transportPill}><Hotel size={16} color="#f97316" /><Text style={styles.transportText}>Stays</Text></View>
            <View style={styles.transportPill}><Car size={16} color="#10b981" /><Text style={styles.transportText}>Car rental</Text></View>
          </View>

          {attraction.category === 'scenic-flight' && (
            <TouchableOpacity
              style={styles.requestFlightBtn}
              onPress={() => handleAddToTrip(attraction)}
              testID="requestFlight"
            >
              <Send size={16} color="#ffffff" />
              <Text style={styles.requestFlightText}>Request a Flight</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.addButton} onPress={() => handleAddToTrip(attraction)} testID="addToTrip">
            <Text style={styles.addButtonText}>Add to Trip Planner</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  hero: { width: '100%', height: 240, backgroundColor: '#e5e7eb' },
  header: { padding: 16, backgroundColor: '#ffffff' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', flex: 1, marginRight: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 14, fontWeight: '600', color: '#1f2937' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  metaText: { fontSize: 14, color: '#6b7280' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f3f4f6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
  tagText: { fontSize: 12, color: '#374151', fontWeight: '600', textTransform: 'capitalize' },
  description: { fontSize: 16, color: '#374151', lineHeight: 22 },
  operatorCard: { marginTop: 12, marginHorizontal: 16, backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', padding: 12, gap: 8 },
  operatorRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  operatorLabel: { fontSize: 12, color: '#6b7280', fontWeight: '700', textTransform: 'uppercase' },
  operatorName: { fontSize: 14, color: '#111827', fontWeight: '700' },
  priceRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  priceRangeText: { fontSize: 14, color: '#059669', fontWeight: '800' },
  pricingNotes: { fontSize: 12, color: '#6b7280' },
  operatorLinkBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10 },
  operatorLinkText: { fontSize: 12, fontWeight: '800', color: '#111827' },
  alertsCard: { marginTop: 12, marginHorizontal: 16, backgroundColor: '#fff1f2', borderColor: '#fecdd3', borderWidth: 1, borderRadius: 12 },
  alertsHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingTop: 12 },
  alertsTitle: { fontSize: 16, fontWeight: '800', color: '#be123c' },
  alertsSubtitle: { paddingHorizontal: 12, paddingVertical: 4, color: '#7f1d1d', fontWeight: '600' },
  alertItem: { paddingHorizontal: 12, paddingVertical: 4, color: '#7f1d1d' },
  tipsCard: { marginTop: 12, marginHorizontal: 16, backgroundColor: '#ecfeff', borderColor: '#a5f3fc', borderWidth: 1, borderRadius: 12, padding: 12 },
  tipsTitle: { fontSize: 16, fontWeight: '800', color: '#0e7490', marginBottom: 4 },
  tip: { color: '#0e7490', paddingVertical: 2 },
  ctaCard: { marginTop: 16, marginHorizontal: 16, backgroundColor: '#ffffff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  ctaTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  ctaSubtitle: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  transportRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  transportPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f3f4f6', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6 },
  transportText: { fontSize: 12, color: '#374151', fontWeight: '600' },
  addButton: { marginTop: 12, backgroundColor: '#10b981', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  addButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  requestFlightBtn: { marginTop: 12, backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  requestFlightText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  notFoundTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 12 },
  backButton: { backgroundColor: '#f3f4f6', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  backButtonText: { color: '#374151', fontWeight: '600' },
});
