import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text as NativeText, View } from 'react-native';
import MapView, { Circle, Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { getRoute } from '../api/routeApi';
import { crowdData } from '../data/crowdData';
import { colors, fonts } from '../config/theme';

const Text = ({ style, ...props }) => <NativeText {...props} style={[{ fontFamily: fonts.book }, style]} />;

const crowdColors = {
  LOW: { strong: 'rgba(57, 184, 139, 0.5)', soft: 'rgba(57, 184, 139, 0.15)', text: '#198754', label: 'Calm / Quiet' },
  MEDIUM: { strong: 'rgba(242, 201, 76, 0.55)', soft: 'rgba(242, 201, 76, 0.16)', text: '#B8860B', label: 'Gentle Buzz' },
  HIGH: { strong: 'rgba(255, 107, 107, 0.5)', soft: 'rgba(255, 107, 107, 0.15)', text: '#DC3545', label: 'Busy / Crowded' }
};

const modes = [{ id: 'drive', label: 'Drive', multiplier: .72 }, { id: 'walk', label: 'Walk', multiplier: 1.35 }, { id: 'cycle', label: 'Cycle', multiplier: 1.04 }];

export default function MapRouteScreen({ route, navigation }) {
  const { place, origin } = route.params;
  const [routeData, setRouteData] = useState(null);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('drive');
  const [selectedPlace, setSelectedPlace] = useState(place);
  const [showAlternativePanel, setShowAlternativePanel] = useState(false);

  const mapRef = useRef(null);
  const sheetProgress = useRef(new Animated.Value(0)).current;

  const loadRoute = useCallback(async () => {
    setError(null);
    try {
      setRouteData(await getRoute(selectedPlace.placeId, origin));
    } catch {
      setError('We could not refresh the route. Your journey is still pinned on the map.');
    }
  }, [selectedPlace.placeId, origin]);

  useEffect(() => {
    loadRoute();
    Animated.timing(sheetProgress, { toValue: 1, duration: 560, useNativeDriver: true }).start();
  }, [loadRoute, sheetProgress]);

  const source = { latitude: origin.lat, longitude: origin.lng };
  const destination = { latitude: selectedPlace.location?.lat || selectedPlace.latitude, longitude: selectedPlace.location?.lng || selectedPlace.longitude };
  const routeCoordinates = routeData?.geometry?.coordinates?.map(([longitude, latitude]) => ({ latitude, longitude }));
  
  // Find current place info from crowdData
  const activeCrowdInfo = crowdData.find(c => c.placeId === selectedPlace.placeId) || {
    crowdLevel: selectedPlace.estimatedCrowd?.level || 'MEDIUM',
    crowdScore: Math.round((selectedPlace.estimatedCrowd?.index || 0.5) * 100),
    bestTime: selectedPlace.bestVisitTime || 'Morning hours'
  };

  const heat = crowdColors[activeCrowdInfo.crowdLevel] || crowdColors.MEDIUM;
  const activeMode = modes.find((item) => item.id === mode);
  const baseDuration = routeData?.durationMinutes || Math.max(12, Math.round(selectedPlace.distanceKm * 3));
  const duration = Math.round(baseDuration * activeMode.multiplier);
  const distance = routeData?.distanceKm || selectedPlace.distanceKm || 6.2;
  const sheetStyle = useMemo(() => ({ opacity: sheetProgress, transform: [{ translateY: sheetProgress.interpolate({ inputRange: [0, 1], outputRange: [190, 0] }) }] }), [sheetProgress]);

  const frameRoute = useCallback(() => mapRef.current?.fitToCoordinates([source, destination], { edgePadding: { top: 120, right: 24, bottom: 310, left: 24 }, animated: true }), [source.latitude, source.longitude, destination.latitude, destination.longitude]);
  const focusDestination = useCallback(() => mapRef.current?.animateCamera({ center: destination, zoom: 12.8 }, { duration: 700 }), [destination.latitude, destination.longitude]);

  const handlePlaceSelect = (p) => {
    setSelectedPlace(p);
    setShowAlternativePanel(false);
    mapRef.current?.animateCamera({ center: { latitude: p.latitude || p.location.lat, longitude: p.longitude || p.location.lng }, zoom: 12.8 }, { duration: 500 });
  };

  // Quieter Alternative logic (Burrabazar Spice Lane -> Kumartuli River Ghat)
  const isCrowded = activeCrowdInfo.crowdLevel === 'HIGH';
  const alternativePlace = crowdData.find(c => c.placeId === 101); // Kumartuli River Ghat

  return (
    <View style={styles.screen}>
      {/* Map View */}
      <MapView provider={PROVIDER_GOOGLE} ref={mapRef} style={styles.map} onMapReady={focusDestination} onPress={frameRoute} customMapStyle={mapStyle}>
        
        {/* Heatmap Overlays for all places */}
        {crowdData.map(c => {
          const cHeat = crowdColors[c.crowdLevel] || crowdColors.MEDIUM;
          const pos = { latitude: c.latitude, longitude: c.longitude };
          const scale = selectedPlace.placeId === c.placeId ? 1.2 : 0.6;
          return (
            <React.Fragment key={`heat-${c.placeId}`}>
              <Circle center={pos} radius={800 * scale} fillColor={cHeat.soft} strokeColor="transparent" />
              <Circle center={pos} radius={400 * scale} fillColor={cHeat.soft} strokeColor="transparent" />
              <Circle center={pos} radius={180 * scale} fillColor={cHeat.strong} strokeColor="rgba(255,255,255,.8)" strokeWidth={1} />
            </React.Fragment>
          );
        })}

        {/* Route Polyline */}
        {routeCoordinates?.length > 1 && <Polyline coordinates={routeCoordinates} strokeColor="rgba(255,255,255,.7)" strokeWidth={9} lineCap="round" lineJoin="round" />}
        {routeCoordinates?.length > 1 && <Polyline coordinates={routeCoordinates} strokeColor={colors.forest} strokeWidth={5} lineCap="round" lineJoin="round" />}
        
        {/* Origin Pin */}
        <Marker coordinate={source} title="Starting Point"><View style={styles.sourceMarker}><View style={styles.sourceInner} /></View></Marker>
        
        {/* Destination Pins for all */}
        {crowdData.map(c => {
          const isSelected = selectedPlace.placeId === c.placeId;
          const pos = { latitude: c.latitude, longitude: c.longitude };
          const cColor = c.crowdLevel === 'LOW' ? '#198754' : c.crowdLevel === 'HIGH' ? '#DC3545' : '#F2C94C';
          return (
            <Marker key={`pin-${c.placeId}`} coordinate={pos} onPress={() => handlePlaceSelect(c)}>
              <View style={[styles.destMarker, isSelected && styles.destMarkerSelected, { borderColor: cColor }]}>
                <Text style={styles.destMarkerText}>{c.crowdLevel.slice(0, 1)}</Text>
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* Screen Header */}
      <View style={styles.mapHeader}>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Crowd & Experience Map</Text>
          <Text style={styles.headerSubtitle}>See visitor concentrations and find quieter trails.</Text>
        </View>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Close</Text>
        </Pressable>
      </View>

      {/* Crowd Legend */}
      <View style={styles.legendCard}>
        <Text style={styles.legendTitle}>DEMO CROWD HEAT</Text>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: '#198754' }]} /><Text style={styles.legendText}>Low</Text></View>
          <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: '#F2C94C' }]} /><Text style={styles.legendText}>Moderate</Text></View>
          <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: '#DC3545' }]} /><Text style={styles.legendText}>High</Text></View>
        </View>
      </View>

      {/* Interactive Sheet at the bottom */}
      <Animated.View style={[styles.sheet, sheetStyle]}>
        <View style={styles.grip} />
        
        {/* Selected Place Stats */}
        <View style={styles.selectedPlaceRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.selectedLabel}>SELECTED DESTINATION</Text>
            <Text style={styles.selectedTitle} numberOfLines={1}>{selectedPlace.name || selectedPlace.placeName}</Text>
          </View>
          <View style={styles.badgeCol}>
            <View style={[styles.levelBadge, { backgroundColor: heat.soft, borderColor: heat.strong }]}>
              <Text style={[styles.levelBadgeText, { color: heat.text }]}>🟢 {activeCrowdInfo.crowdLevel} CROWD</Text>
            </View>
            <Text style={styles.scoreText}>Est: {activeCrowdInfo.crowdScore}/100</Text>
          </View>
        </View>

        {/* Warning card for High Crowds */}
        {isCrowded && (
          <View style={styles.warningCard}>
            <Text style={styles.warningText}>⚠️ Peak visitor activity detected in this demo scenario.</Text>
            <Pressable onPress={() => setShowAlternativePanel(true)} style={styles.alternativeBtn}>
              <Text style={styles.alternativeBtnText}>Find a Quieter Option</Text>
            </Pressable>
          </View>
        )}

        {/* Quieter Alternative Comparison Panel */}
        {showAlternativePanel && (
          <View style={styles.alternativePanel}>
            <Text style={styles.alternativeLabel}>QUIETER HERITAGE ALTERNATIVE</Text>
            <View style={styles.comparisonRow}>
              <View style={styles.comparisonCol}>
                <Text style={styles.comparisonName}>Spice Lane</Text>
                <Text style={{ color: '#DC3545', fontSize: 10, fontWeight: 'bold' }}>🔴 HIGH CROWD</Text>
              </View>
              <Text style={styles.swapArrow}>➔</Text>
              <View style={styles.comparisonCol}>
                <Text style={styles.comparisonName}>{alternativePlace.placeName}</Text>
                <Text style={{ color: '#198754', fontSize: 10, fontWeight: 'bold' }}>💎 🟢 LOW CROWD</Text>
              </View>
            </View>
            <Text style={styles.comparisonNotice}>Matches similar history and photography tags with fewer crowds.</Text>
            <Pressable 
              onPress={() => handlePlaceSelect(alternativePlace)} 
              style={styles.alternativeSelectBtn}
            >
              <Text style={styles.alternativeSelectText}>Open Quieter Alternative</Text>
            </Pressable>
          </View>
        )}

        {/* Route Travel Modes */}
        <View style={styles.modeRow}>
          {modes.map((item) => (
            <Pressable key={item.id} onPress={() => setMode(item.id)} style={[styles.modeBtn, mode === item.id && styles.modeActive]}>
              <Text style={[styles.modeLabelText, mode === item.id && styles.modeLabelActive]}>{item.label}</Text>
              <Text style={[styles.modeTimeText, mode === item.id && styles.modeTimeActive]}>{Math.round(baseDuration * item.multiplier)} min</Text>
            </Pressable>
          ))}
        </View>

        {/* Routing Details Summary */}
        <View style={styles.detailSummary}>
          <Text style={styles.summaryTitle}>ARRIVE IN {duration} MIN ({distance} KM)</Text>
          <Text style={styles.summaryDesc}>Best time today: {activeCrowdInfo.bestTime}. Best visits are early morning.</Text>
        </View>

        {/* Primary Action Buttons */}
        <View style={styles.ctaRow}>
          <Pressable 
            style={[styles.ctaBtn, { backgroundColor: colors.moss }]} 
            onPress={() => navigation.navigate('PlaceDetails', { placeId: selectedPlace.placeId, origin, preview: selectedPlace })}
          >
            <Text style={[styles.ctaBtnText, { color: colors.forestDark }]}>View Place Story</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.ctaBtn, { backgroundColor: colors.forest }]} 
            onPress={() => navigation.navigate('ItineraryImproviser', { place: selectedPlace, origin })}
          >
            <Text style={[styles.ctaBtnText, { color: colors.white }]}>Improve My Experience</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const mapStyle = [{ elementType: 'geometry', stylers: [{ color: '#e6f2fb' }] }, { elementType: 'labels.text.fill', stylers: [{ color: '#45627d' }] }, { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#b7e4f9' }] }, { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] }, { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#d8ecf7' }] }];

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  map: { flex: 1 },
  mapHeader: { position: 'absolute', top: 22, left: 16, right: 16, backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: 12, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderVertical: 1, borderColor: colors.line, shadowColor: colors.ink, shadowOpacity: .1, shadowRadius: 8, elevation: 4 },
  headerInfo: { flex: 1, paddingRight: 10 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: colors.ink },
  headerSubtitle: { fontSize: 9, color: colors.muted, marginTop: 2 },
  backBtn: { paddingHorizontal: 11, paddingVertical: 7, backgroundColor: colors.canvas, borderRadius: 10 },
  backBtnText: { color: colors.forest, fontSize: 11, fontWeight: 'bold' },
  
  legendCard: { position: 'absolute', right: 16, top: 96, backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: 10, borderRadius: 11, borderWidth: 1, borderColor: colors.line, shadowColor: colors.ink, shadowOpacity: .08, shadowRadius: 6, elevation: 2 },
  legendTitle: { fontSize: 7, fontWeight: '900', color: colors.muted, letterSpacing: 0.8, marginBottom: 6 },
  legendRow: { flexDirection: 'row', gap: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { height: 6, width: 6, borderRadius: 3 },
  legendText: { fontSize: 9, color: colors.ink, fontWeight: 'bold' },

  sourceMarker: { alignItems: 'center', backgroundColor: colors.white, borderColor: colors.forest, borderRadius: 17, borderWidth: 3, height: 26, justifyContent: 'center', width: 26 },
  sourceInner: { width: 8, height: 8, borderRadius: 5, backgroundColor: colors.forest },
  
  destMarker: { alignItems: 'center', backgroundColor: colors.white, borderRadius: 16, borderWidth: 3, height: 28, justifyContent: 'center', width: 28 },
  destMarkerSelected: { scale: 1.25, elevation: 6 },
  destMarkerText: { fontSize: 10, fontWeight: '900', color: colors.ink },

  sheet: { backgroundColor: 'rgba(255,255,255,.98)', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 25, borderTopLeftRadius: 28, borderTopRightRadius: 28, shadowColor: colors.ink, shadowOpacity: .18, shadowRadius: 22, shadowOffset: { width: 0, height: -5 }, elevation: 12 },
  grip: { width: 38, height: 4, borderRadius: 99, backgroundColor: '#A6D9EE', alignSelf: 'center', marginBottom: 12 },
  
  selectedPlaceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  selectedLabel: { color: colors.forest, fontSize: 8, fontWeight: '900', letterSpacing: 1.1 },
  selectedTitle: { fontSize: 20, fontWeight: '900', color: colors.ink, marginTop: 2, maxWidth: 200 },
  badgeCol: { alignItems: 'flex-end' },
  levelBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  levelBadgeText: { fontSize: 8, fontWeight: '900' },
  scoreText: { fontSize: 9, color: colors.muted, marginTop: 4, fontWeight: 'bold' },

  warningCard: { backgroundColor: '#FFF5F5', borderWidth: 1, borderColor: '#FFE3E3', borderRadius: 12, padding: 10, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  warningText: { color: '#DC3545', fontSize: 10, fontWeight: 'bold', flex: 1, paddingRight: 6 },
  alternativeBtn: { backgroundColor: '#DC3545', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  alternativeBtnText: { color: colors.white, fontSize: 9, fontWeight: 'bold' },

  alternativePanel: { backgroundColor: '#F0F9FF', borderWidth: 1, borderColor: '#CBE7FF', borderRadius: 12, padding: 12, marginBottom: 12 },
  alternativeLabel: { fontSize: 8, fontWeight: '900', color: colors.forest, letterSpacing: 0.8, marginBottom: 6 },
  comparisonRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  comparisonCol: { flex: 1 },
  comparisonName: { fontSize: 13, fontWeight: 'bold', color: colors.ink },
  swapArrow: { fontSize: 16, color: colors.muted, marginHorizontal: 8 },
  comparisonNotice: { fontSize: 10, color: colors.muted, lineHeight: 14, marginBottom: 8 },
  alternativeSelectBtn: { backgroundColor: colors.forest, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  alternativeSelectText: { color: colors.white, fontSize: 10, fontWeight: 'bold' },

  modeRow: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  modeBtn: { flex: 1, borderWidth: 1, borderColor: colors.line, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 6, alignItems: 'center' },
  modeActive: { backgroundColor: colors.forest, borderColor: colors.forest },
  modeLabelText: { color: colors.muted, fontSize: 9 },
  modeLabelActive: { color: colors.white },
  modeTimeText: { color: colors.ink, fontSize: 12, fontWeight: 'bold', marginTop: 2 },
  modeTimeActive: { color: colors.white },

  detailSummary: { borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line, paddingVertical: 8, marginBottom: 12 },
  summaryTitle: { fontSize: 10, fontWeight: '900', color: colors.ink, letterSpacing: 0.8 },
  summaryDesc: { fontSize: 11, color: colors.muted, marginTop: 2 },

  ctaRow: { flexDirection: 'row', gap: 10 },
  ctaBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  ctaBtnText: { fontSize: 12, fontWeight: 'bold', letterSpacing: 0.8 }
});
