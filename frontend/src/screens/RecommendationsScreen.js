import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text as NativeText, View } from 'react-native';
import { getRecommendations } from '../api/recommendationApi';
import PlaceCard from '../components/PlaceCard';
import { EmptyState, ErrorState, LoadingState } from '../components/StateView';
import { usePreferences } from '../state/PreferenceContext';
import { colors, fonts } from '../config/theme';

const Text = ({ style, ...props }) => <NativeText {...props} style={[{ fontFamily: fonts.book }, style]} />;

export default function RecommendationsScreen({ route, navigation }) {
  const { preferences } = usePreferences();
  const [state, setState] = useState({ loading: true, error: null, items: [] });
  const load = useCallback(async () => {
    setState((old) => ({ ...old, loading: true, error: null }));
    try { const result = await getRecommendations({ location: route.params.origin, ...preferences, limit: 5 }); setState({ loading: false, error: null, items: result.items || result }); }
    catch (error) { setState({ loading: false, error: error.message, items: [] }); }
  }, [preferences, route.params.origin]);
  useEffect(() => { load(); }, [load]);
  if (state.loading) return <LoadingState />;
  if (state.error) return <ErrorState message={state.error} onRetry={load} />;
  if (!state.items.length) return <EmptyState />;

  const resultCount = String(state.items.length).padStart(2, '0');
  return <FlatList data={state.items} keyExtractor={(item) => String(item.placeId)} ListHeaderComponent={<View style={styles.header}><View style={styles.topline}><Text style={styles.brand}>VOYAGE</Text><View style={styles.live}><View style={styles.liveDot} /><Text style={styles.liveText}>LIVE PICKS</Text></View></View><Text style={styles.kicker}>CURATED FOR YOUR PACE</Text><Text style={styles.title}>Places that make the long way feel right.</Text><View style={styles.headerFoot}><Text style={styles.count}>{resultCount} MATCHES · WITHIN {preferences.maxDistanceKm} KM</Text><Pressable onPress={() => navigation.navigate('Preferences', { origin: route.params.origin })}><Text style={styles.change}>Tune route</Text></Pressable></View></View>} renderItem={({ item, index }) => <PlaceCard place={item} rank={index + 1} onPress={() => navigation.navigate('PlaceDetails', { placeId: item.placeId, origin: route.params.origin, preview: item })} />} contentContainerStyle={styles.list} />;
}

const styles = StyleSheet.create({
  list: { paddingBottom: 20, backgroundColor: colors.canvas }, header: { paddingHorizontal: 22, paddingTop: 18, paddingBottom: 21, backgroundColor: colors.canvas }, topline: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 35 }, brand: { color: colors.ink, fontSize: 14, letterSpacing: 3.5 }, live: { flexDirection: 'row', alignItems: 'center', gap: 6 }, liveDot: { width: 6, height: 6, borderRadius: 4, backgroundColor: colors.blueGlow }, liveText: { color: colors.forest, fontSize: 9, letterSpacing: 1 }, kicker: { color: colors.forest, letterSpacing: 1.35, fontSize: 10 }, title: { fontSize: 31, lineHeight: 40, letterSpacing: -1.1, color: colors.ink, marginTop: 8, maxWidth: 330 }, headerFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 19 }, count: { color: colors.muted, letterSpacing: .8, fontSize: 9 }, change: { color: colors.forest, fontSize: 12 }
});
