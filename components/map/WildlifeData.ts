export type Species = 'bear' | 'cougar' | 'wolf' | 'moose' | 'elk' | 'bison' | 'coyote';

export interface WildlifeAlert {
  id: string;
  species: Species;
  severity: 'low' | 'medium' | 'high';
  season: 'spring' | 'summer' | 'fall' | 'winter';
  coordinates: { lat: number; lng: number };
  lastSeen: string;
  notes?: string;
}

export const SPECIES_COLORS: Record<Species, string> = {
  bear: '#b91c1c',
  cougar: '#7c2d12',
  wolf: '#334155',
  moose: '#92400e',
  elk: '#6b21a8',
  bison: '#1f2937',
  coyote: '#0e7490',
};

export const MOCK_WILDLIFE_ALERTS: WildlifeAlert[] = [
  { id: 'w1', species: 'bear', severity: 'high', season: 'summer', coordinates: { lat: 51.1784, lng: -115.5708 }, lastSeen: new Date().toISOString(), notes: 'Grizzly sow with cubs near trailhead.' },
  { id: 'w2', species: 'moose', severity: 'medium', season: 'fall', coordinates: { lat: 51.0486, lng: -114.0708 }, lastSeen: new Date().toISOString(), notes: 'Bull moose reported at dawn.' },
  { id: 'w3', species: 'wolf', severity: 'low', season: 'winter', coordinates: { lat: 52.8734, lng: -117.9543 }, lastSeen: new Date().toISOString(), notes: 'Distant howls; no aggressive behavior.' },
  { id: 'w4', species: 'elk', severity: 'medium', season: 'spring', coordinates: { lat: 51.4254, lng: -116.4816 }, lastSeen: new Date().toISOString(), notes: 'Calving season; keep distance.' },
];