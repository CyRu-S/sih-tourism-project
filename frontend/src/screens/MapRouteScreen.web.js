import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getRoute } from '../api/routeApi';
import { ErrorState, LoadingState } from '../components/StateView';
import { colors } from '../config/theme';

export default function MapRouteScreen({ route, navigation }) {
  const { place, origin } = route.params;
  const [state, setState] = useState({ loading: true, error: null, route: null });

  useEffect(() => {
    let active = true;
    getRoute(place.placeId, origin).then((routeData) => {
      if (active) setState({ loading: false, error: null, route: routeData });
    }).catch((error) => {
      if (active) setState({ loading: false, error: error.message, route: null });
    });
    return () => { active = false; };
  }, [place.placeId, origin]);

  if (state.loading) return <LoadingState label="Planning your route..." />;
  if (state.error) return <ErrorState message={state.error} />;
  const routeData = state.route;
  return <View style={styles.screen}>
    <Text style={styles.kicker}>VOYAGE / ROUTE</Text>
    <Text style={styles.title}>{place.name}</Text>
    <Text style={styles.copy}>The full crowd map is available in the native Android app. Your live route summary is ready below.</Text>
    <View style={styles.card}><Text style={styles.label}>DISTANCE</Text><Text style={styles.value}>{routeData.distanceKm} km</Text><Text style={styles.label}>ESTIMATED WALK</Text><Text style={styles.value}>{Math.round(routeData.durationMinutes)} min</Text></View>
    <Pressable style={styles.button} onPress={() => navigation.navigate('PlaceDetails', { placeId: place.placeId, origin, preview: place })}><Text style={styles.buttonText}>Back to place</Text></Pressable>
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas, justifyContent: 'center', padding: 28 },
  kicker: { color: colors.forest, fontSize: 11, fontWeight: '700', letterSpacing: 1.1 },
  title: { color: colors.ink, fontSize: 34, fontWeight: '700', marginTop: 8 },
  copy: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 12 },
  card: { backgroundColor: colors.white, borderColor: colors.line, borderRadius: 18, borderWidth: 1, marginTop: 22, padding: 20 },
  label: { color: colors.muted, fontSize: 10, fontWeight: '700', letterSpacing: 1, marginTop: 10 },
  value: { color: colors.ink, fontSize: 24, fontWeight: '700', marginTop: 4 },
  button: { alignSelf: 'flex-start', backgroundColor: colors.forest, borderRadius: 12, marginTop: 22, paddingHorizontal: 16, paddingVertical: 12 },
  buttonText: { color: colors.white, fontWeight: '700' }
});
