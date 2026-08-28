import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { getRecommendations } from '../api/recommendationApi';
import PlaceCard from '../components/PlaceCard';
import { EmptyState, ErrorState, LoadingState } from '../components/StateView';
import { usePreferences } from '../state/PreferenceContext';
import { colors } from '../config/theme';

export default function ExploreMapScreen({ route, navigation }) {
  const { origin } = route.params;
  const { preferences } = usePreferences();
  const [state, setState] = useState({ loading: true, error: null, items: [] });

  useEffect(() => {
    let active = true;
    getRecommendations({ location: origin, ...preferences, limit: 10 })
      .then((result) => { if (active) setState({ loading: false, error: null, items: result.items || result }); })
      .catch((error) => { if (active) setState({ loading: false, error: error.message, items: [] }); });
    return () => { active = false; };
  }, [origin, preferences]);

  if (state.loading) return <LoadingState label="Finding nearby places..." />;
  if (state.error) return <ErrorState message={state.error} />;
  if (!state.items.length) return <EmptyState />;

  return <FlatList data={state.items} keyExtractor={(item) => String(item.placeId)} contentContainerStyle={styles.list}
    ListHeaderComponent={<View style={styles.header}><Text style={styles.kicker}>VOYAGE / WEB GUIDE</Text><Text style={styles.title}>Nearby places</Text><Text style={styles.copy}>The interactive crowd map is available in the native Android app. These are the same live recommendations from the backend.</Text></View>}
    renderItem={({ item, index }) => <PlaceCard place={item} rank={index + 1} onPress={() => navigation.navigate('PlaceDetails', { placeId: item.placeId, origin, preview: item })} />}
    ListFooterComponent={<Pressable style={styles.button} onPress={() => navigation.navigate('Preferences', { origin })}><Text style={styles.buttonText}>Refine preferences</Text></Pressable>}
  />;
}

const styles = StyleSheet.create({
  list: { backgroundColor: colors.canvas, paddingBottom: 28 },
  header: { paddingHorizontal: 22, paddingTop: 26, paddingBottom: 10 },
  kicker: { color: colors.forest, fontSize: 11, fontWeight: '700', letterSpacing: 1.1 },
  title: { color: colors.ink, fontSize: 34, fontWeight: '700', marginTop: 8 },
  copy: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 9, maxWidth: 560 },
  button: { alignSelf: 'center', backgroundColor: colors.forest, borderRadius: 12, marginTop: 10, paddingHorizontal: 16, paddingVertical: 12 },
  buttonText: { color: colors.white, fontWeight: '700' }
});
