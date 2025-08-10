import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Filter, X, AlertTriangle } from 'lucide-react-native';
import { Cluster } from './Cluster';
import { MOCK_WILDLIFE_ALERTS, SPECIES_COLORS, Species, WildlifeAlert } from './WildlifeData';

interface WildlifeMapProps {
  alerts?: WildlifeAlert[];
  selectedSpecies?: Species[];
  seasonFilter?: 'all' | 'spring' | 'summer' | 'fall' | 'winter';
  onFiltersChange?: (filters: { species: Species[]; season: 'all' | 'spring' | 'summer' | 'fall' | 'winter' }) => void;
}

export default function WildlifeMap({
  alerts = MOCK_WILDLIFE_ALERTS,
  selectedSpecies,
  seasonFilter = 'all',
  onFiltersChange,
}: WildlifeMapProps) {
  const [localSpecies, setLocalSpecies] = useState<Species[]>(selectedSpecies ?? ['bear', 'cougar', 'wolf', 'moose', 'elk', 'bison', 'coyote']);
  const [localSeason, setLocalSeason] = useState<'all' | 'spring' | 'summer' | 'fall' | 'winter'>(seasonFilter);

  const filtered = useMemo(() => alerts.filter(a => (localSpecies.includes(a.species)) && (localSeason === 'all' || a.season === localSeason)), [alerts, localSpecies, localSeason]);

  const clusters = useMemo(() => {
    const gridSize = 0.2;
    const map = new Map<string, WildlifeAlert[]>();
    filtered.forEach(a => {
      const gx = Math.round(a.coordinates.lat / gridSize);
      const gy = Math.round(a.coordinates.lng / gridSize);
      const key = `${gx}:${gy}`;
      const arr = map.get(key) ?? [];
      arr.push(a);
      map.set(key, arr);
    });
    return Array.from(map.entries()).map(([key, list]) => ({ key, list }));
  }, [filtered]);

  const toggleSpecies = useCallback((s: Species) => {
    setLocalSpecies(prev => {
      const has = prev.includes(s);
      const next = has ? prev.filter(p => p !== s) : [...prev, s];
      onFiltersChange?.({ species: next, season: localSeason });
      return next;
    });
  }, [onFiltersChange, localSeason]);

  const setSeason = useCallback((season: 'all' | 'spring' | 'summer' | 'fall' | 'winter') => {
    setLocalSeason(season);
    onFiltersChange?.({ species: localSpecies, season });
  }, [onFiltersChange, localSpecies]);

  return (
    <View style={styles.container} testID="wildlife-map">
      <View style={styles.mapArea}>
        <View style={styles.mapPlaceholder}>
          <AlertTriangle size={24} color="#b91c1c" />
          <Text style={styles.placeholderTitleText}>Map preview in Expo Go</Text>
          <Text style={styles.placeholderSubText}>Interactive maps require expo-maps dev client. We render clustered pins preview.</Text>
        </View>
        {clusters.map(({ key, list }) => {
          const top = (Math.random() * 60) + 20;
          const left = (Math.random() * 60) + 20;
          const color = SPECIES_COLORS[list[0]?.species ?? 'bear'];
          return (
            <View key={key} style={[styles.pin, { top: `${top}%`, left: `${left}%` }]}>
              {list.length > 1 ? (
                <Cluster count={list.length} color={color} />
              ) : (
                <View style={[styles.dot, { borderColor: color }]}> 
                  <MapPin size={18} color={color} />
                </View>
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.filters}>
        <View style={styles.filtersHeader}>
          <Filter size={16} color="#111827" />
          <Text style={styles.filtersTitle}>Filters</Text>
          <TouchableOpacity onPress={() => { setLocalSpecies(['bear','cougar','wolf','moose','elk','bison','coyote']); setSeason('all'); }} testID="filters-reset">
            <X size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.pillsRow}>
          {(Object.keys(SPECIES_COLORS) as Species[]).map(s => (
            <TouchableOpacity key={s} onPress={() => toggleSpecies(s)} style={[styles.pill, localSpecies.includes(s) ? { backgroundColor: SPECIES_COLORS[s] + '22', borderColor: SPECIES_COLORS[s] } : undefined]} testID={`species-${s}`}>
              <Text style={[styles.pillText, { color: SPECIES_COLORS[s] }]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.pillsRow}>
          {(['all','spring','summer','fall','winter'] as const).map(season => (
            <TouchableOpacity key={season} onPress={() => setSeason(season)} style={[styles.pill, localSeason === season ? { backgroundColor: '#11182711', borderColor: '#111827' } : undefined]} testID={`season-${season}`}>
              <Text style={[styles.pillText, { color: '#111827' }]}>{season}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  mapArea: { flex: 1, backgroundColor: '#e5e7eb' },
  mapPlaceholder: { position: 'absolute', top: 16, left: 16, right: 16, backgroundColor: '#ffffff', borderRadius: 12, padding: 12, gap: 6, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8 },
  pin: { position: 'absolute' },
  dot: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#ffffff', borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  filters: { borderTopWidth: 1, borderTopColor: '#e5e7eb', padding: 12 },
  filtersHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  filtersTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { borderWidth: 1, borderColor: '#d1d5db', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16 },
  pillText: { fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
  placeholderTitleText: { fontSize: 14, fontWeight: '700', color: '#111827' },
  placeholderSubText: { fontSize: 12, color: '#4b5563' },
});