import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Linking, Pressable, StyleSheet, Text as NativeText, View } from 'react-native';
import MapView, { Circle, Marker, Polyline } from 'react-native-maps';
import { getRoute } from '../api/routeApi';
import { colors, fonts } from '../config/theme';

const Text = ({ style, ...props }) => <NativeText {...props} style={[{ fontFamily: fonts.book }, style]} />;

const heatTones = {
  LOW: { strong: 'rgba(56, 196, 154, .40)', soft: 'rgba(56, 196, 154, .12)', label: 'Calm right now' },
  MEDIUM: { strong: 'rgba(88, 201, 245, .42)', soft: 'rgba(88, 201, 245, .14)', label: 'A gentle buzz' },
  HIGH: { strong: 'rgba(255, 107, 107, .42)', soft: 'rgba(255, 107, 107, .14)', label: 'Busy right now' }
};

const modes = [{ id: 'drive', label: 'Drive', multiplier: .72 }, { id: 'walk', label: 'Walk', multiplier: 1.35 }, { id: 'cycle', label: 'Cycle', multiplier: 1.04 }];

export default function MapRouteScreen({ route, navigation }) {
  const { place, origin } = route.params;
  const [routeData, setRouteData] = useState(null);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('drive');
  const mapRef = useRef(null);
  const sheetProgress = useRef(new Animated.Value(0)).current;

  const loadRoute = useCallback(async () => {
    setError(null);
    try { setRouteData(await getRoute(place.placeId, origin, { drive: 'driving-car', walk: 'foot-walking', cycle: 'cycling-regular' }[mode])); }
    catch { setError('We could not refresh the route. Your journey is still pinned on the map.'); }
  }, [place.placeId, origin, mode]);

  useEffect(() => {
    loadRoute();
    Animated.timing(sheetProgress, { toValue: 1, duration: 560, useNativeDriver: true }).start();
  }, [loadRoute, sheetProgress]);

  const source = { latitude: origin.lat, longitude: origin.lng };
  const destination = { latitude: place.location.lat, longitude: place.location.lng };
  const routeCoordinates = routeData?.geometry?.coordinates?.map(([longitude, latitude]) => ({ latitude, longitude }));
  const crowd = place.estimatedCrowd || { level: 'MEDIUM', confidence: 'ESTIMATED' };
  const heat = heatTones[crowd.level] || heatTones.MEDIUM;
  const activeMode = modes.find((item) => item.id === mode);
  const baseDuration = routeData?.durationMinutes || Math.max(12, Math.round(place.distanceKm * 3));
  const duration = Math.round(baseDuration * activeMode.multiplier);
  const distance = routeData?.distanceKm || place.distanceKm;
  const sheetStyle = useMemo(() => ({ opacity: sheetProgress, transform: [{ translateY: sheetProgress.interpolate({ inputRange: [0, 1], outputRange: [190, 0] }) }] }), [sheetProgress]);

  const frameRoute = useCallback(() => mapRef.current?.fitToCoordinates([source, destination], { edgePadding: { top: 80, right: 24, bottom: 285, left: 24 }, animated: true }), [source.latitude, source.longitude, destination.latitude, destination.longitude]);
  const openGoogleNavigation = useCallback(async () => {
    const travelMode = mode === 'drive' ? 'driving' : mode === 'cycle' ? 'bicycling' : 'walking';
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.latitude},${destination.longitude}&travelmode=${travelMode}`;
    try { await Linking.openURL(url); }
    catch { setError('Google Maps could not be opened on this device.'); }
  }, [destination.latitude, destination.longitude, mode, origin.lat, origin.lng]);
  return <View style={styles.screen}>
    <MapView ref={mapRef} style={styles.map} onMapReady={frameRoute} onPress={frameRoute} customMapStyle={mapStyle}>
      <Circle center={destination} radius={880} fillColor={heat.soft} strokeColor="transparent" />
      <Circle center={destination} radius={480} fillColor={heat.soft} strokeColor="transparent" />
      <Circle center={destination} radius={220} fillColor={heat.strong} strokeColor="rgba(255,255,255,.8)" strokeWidth={1} />
      {routeCoordinates?.length > 1 && <Polyline coordinates={routeCoordinates} strokeColor="rgba(255,255,255,.7)" strokeWidth={9} lineCap="round" lineJoin="round" />}
      {routeCoordinates?.length > 1 && <Polyline coordinates={routeCoordinates} strokeColor={colors.forest} strokeWidth={5} lineCap="round" lineJoin="round" />}
      <Marker coordinate={source} title="Demo starting point"><View style={styles.sourceMarker}><View style={styles.sourceInner} /></View></Marker>
      <Marker coordinate={destination} title={place.name}><View style={styles.destinationMarker}><View style={styles.destinationInner} /></View></Marker>
    </MapView>

    <View pointerEvents="none" style={styles.mapHeader}><Text style={styles.brand}>VOYAGE</Text><View style={styles.liveChip}><View style={styles.liveDot} /><Text style={styles.liveText}>LIVE MAP</Text></View></View>
    <View pointerEvents="none" style={styles.placePill}><Text style={styles.placePillLabel}>DESTINATION</Text><Text style={styles.placePillName} numberOfLines={1}>{place.name}</Text></View>
    <View pointerEvents="none" style={styles.heatLegend}><View style={[styles.legendDot, { backgroundColor: heat.strong }]} /><View><Text style={styles.legendLabel}>LIVE CROWD HEAT MAP</Text><Text style={styles.legendValue}>{heat.label} · rings show the spread</Text></View></View>

    <Animated.View style={[styles.sheet, sheetStyle]}>
      <View style={styles.grip} />
      <View style={styles.sheetTopline}><View><Text style={styles.kicker}>YOUR ROUTE</Text><Text style={styles.routeTitle}>{distance} km to go</Text></View><Pressable onPress={frameRoute} hitSlop={10}><Text style={styles.recenter}>Recenter</Text></Pressable></View>
      <View style={styles.modeRow}>{modes.map((item) => <Pressable key={item.id} onPress={() => setMode(item.id)} style={[styles.mode, mode === item.id && styles.modeActive]}><Text style={[styles.modeLabel, mode === item.id && styles.modeLabelActive]}>{item.label}</Text><Text style={[styles.modeTime, mode === item.id && styles.modeTimeActive]}>{Math.round(baseDuration * item.multiplier)} min</Text></Pressable>)}</View>
      <View style={styles.routeDetail}><View style={styles.routeIcon}><Text style={styles.routeIconText}>{mode === 'walk' ? 'W' : mode === 'cycle' ? 'C' : 'D'}</Text></View><View style={styles.routeDetailCopy}><Text style={styles.arrival}>ARRIVE IN ABOUT {duration} MIN</Text><Text style={styles.routeHint}>{mode === 'walk' ? 'A relaxed, street-level way to arrive.' : mode === 'cycle' ? 'An easy-paced ride through the city.' : 'The smoothest route based on the live map.'}</Text></View><Text style={styles.arrow}>›</Text></View>
      <Pressable onPress={openGoogleNavigation} style={styles.navigateButton}><Text style={styles.navigateButtonText}>Navigate with Google Maps</Text><Text style={styles.navigateArrow}>↗</Text></Pressable>
      <View style={styles.footerRow}><View style={styles.crowdStatus}><View style={[styles.crowdDot, { backgroundColor: heat.strong }]} /><Text style={styles.crowdText}>{crowd.level} CROWD</Text></View><Pressable onPress={() => navigation.navigate('PlaceDetails', { placeId: place.placeId, origin, preview: place })}><Text style={styles.storyLink}>Place story</Text></Pressable></View>
      {error && <Pressable onPress={loadRoute}><Text style={styles.error}>{error} Tap to retry.</Text></Pressable>}
    </Animated.View>
  </View>;
}

const mapStyle = [{ elementType: 'geometry', stylers: [{ color: '#e6f2fb' }] }, { elementType: 'labels.text.fill', stylers: [{ color: '#45627d' }] }, { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#b7e4f9' }] }, { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] }, { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#d8ecf7' }] }];

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas }, map: { flex: 1 },
  mapHeader: { position: 'absolute', top: 22, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, brand: { color: colors.ink, backgroundColor: 'rgba(255,255,255,.84)', overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12, letterSpacing: 2.5, fontSize: 12 }, liveChip: { backgroundColor: 'rgba(255,255,255,.84)', borderWidth: 1, borderColor: 'rgba(255,255,255,.96)', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 6 }, liveDot: { width: 6, height: 6, backgroundColor: colors.forest, borderRadius: 4 }, liveText: { color: colors.forestDark, letterSpacing: .9, fontSize: 9 },
  placePill: { position: 'absolute', top: 80, left: 20, maxWidth: 230, backgroundColor: 'rgba(255,255,255,.94)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 9, shadowColor: colors.ink, shadowOpacity: .1, shadowRadius: 9, shadowOffset: { width: 0, height: 4 }, elevation: 2 }, placePillLabel: { color: colors.forest, fontSize: 8, fontWeight: '900', letterSpacing: 1 }, placePillName: { color: colors.ink, fontSize: 13, fontWeight: '900', marginTop: 2 },
  heatLegend: { position: 'absolute', right: 18, top: 128, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,.93)', paddingVertical: 9, paddingHorizontal: 10, borderRadius: 11, shadowColor: colors.ink, shadowOpacity: .08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 }, legendDot: { width: 11, height: 11, borderRadius: 99, borderWidth: 2, borderColor: colors.white }, legendLabel: { color: colors.muted, fontSize: 8, letterSpacing: .8, fontWeight: '900' }, legendValue: { color: colors.ink, fontSize: 11, fontWeight: '800', marginTop: 1 },
  sourceMarker: { alignItems: 'center', backgroundColor: colors.white, borderColor: colors.forest, borderRadius: 17, borderWidth: 3, height: 28, justifyContent: 'center', width: 28 }, sourceInner: { width: 10, height: 10, borderRadius: 6, backgroundColor: colors.forest }, destinationMarker: { alignItems: 'center', backgroundColor: colors.navy, borderColor: colors.white, borderRadius: 20, borderWidth: 3, height: 34, justifyContent: 'center', width: 34 }, destinationInner: { width: 10, height: 10, borderRadius: 6, backgroundColor: colors.coral },
  sheet: { backgroundColor: 'rgba(255,255,255,.97)', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 25, borderTopLeftRadius: 28, borderTopRightRadius: 28, shadowColor: colors.ink, shadowOpacity: .18, shadowRadius: 22, shadowOffset: { width: 0, height: -5 }, elevation: 12 }, grip: { width: 38, height: 4, borderRadius: 99, backgroundColor: '#A6D9EE', alignSelf: 'center', marginBottom: 15 }, sheetTopline: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, kicker: { color: colors.forest, letterSpacing: 1.25, fontSize: 9 }, routeTitle: { color: colors.ink, fontSize: 22, letterSpacing: -.6, marginTop: 3 }, recenter: { color: colors.forest, fontSize: 12 },
  modeRow: { flexDirection: 'row', gap: 8, marginTop: 17 }, mode: { flex: 1, borderWidth: 1, borderColor: colors.line, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 9 }, modeActive: { backgroundColor: colors.forest, borderColor: colors.forest }, modeLabel: { color: colors.muted, fontSize: 11 }, modeLabelActive: { color: colors.white }, modeTime: { color: colors.ink, fontSize: 14, marginTop: 3 }, modeTimeActive: { color: colors.white },
  routeDetail: { flexDirection: 'row', alignItems: 'center', marginTop: 17, paddingVertical: 13, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line }, routeIcon: { width: 34, height: 34, backgroundColor: colors.moss, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 }, routeIconText: { color: colors.forestDark, fontSize: 13, fontWeight: '900' }, routeDetailCopy: { flex: 1 }, arrival: { color: colors.ink, fontSize: 10, fontWeight: '900', letterSpacing: .75 }, routeHint: { color: colors.muted, fontSize: 12, lineHeight: 16, marginTop: 3 }, arrow: { color: colors.forest, fontSize: 27, fontWeight: '300' },
  navigateButton: { marginTop: 13, minHeight: 44, paddingHorizontal: 14, borderRadius: 12, backgroundColor: colors.navy, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, navigateButtonText: { color: colors.white, fontSize: 12, fontWeight: '900' }, navigateArrow: { color: colors.white, fontSize: 18 },
  footerRow: { marginTop: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, crowdStatus: { flexDirection: 'row', gap: 6, alignItems: 'center' }, crowdDot: { height: 7, width: 7, borderRadius: 4 }, crowdText: { color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: .8 }, storyLink: { color: colors.forest, fontSize: 12, fontWeight: '900' }, error: { color: colors.coral, fontSize: 11, lineHeight: 16, marginTop: 11 }
});
