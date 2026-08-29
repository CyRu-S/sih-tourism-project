import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text as NativeText, View } from 'react-native';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { getRecommendations } from '../api/recommendationApi';
import { usePreferences } from '../state/PreferenceContext';
import { places as demoPlaces } from '../data/mockPlaces';
import { colors, fonts } from '../config/theme';

const Text = ({ style, ...props }) => <NativeText {...props} style={[{ fontFamily: fonts.book }, style]} />;

const crowdColors = { LOW: '#39B88B', MEDIUM: '#36A9E1', HIGH: '#FF6B6B' };
const crowdHeat = { LOW: ['rgba(57,184,139,.08)', 'rgba(57,184,139,.14)', 'rgba(57,184,139,.28)'], MEDIUM: ['rgba(54,169,225,.08)', 'rgba(54,169,225,.16)', 'rgba(54,169,225,.32)'], HIGH: ['rgba(255,107,107,.08)', 'rgba(255,107,107,.16)', 'rgba(255,107,107,.32)'] };
const nearestPlaces = (items) => [...items].sort((first, second) => first.distanceKm - second.distanceKm).slice(0, 4);
const nearbyDemoPlaces = nearestPlaces(demoPlaces);

export default function ExploreMapScreen({ route, navigation }) {
  const { origin } = route.params;
  const { preferences } = usePreferences();
  const [places, setPlaces] = useState(nearbyDemoPlaces);
  const [selected, setSelected] = useState(nearbyDemoPlaces[0]);
  const [status, setStatus] = useState('Finding places with a story');
  const mapRef = useRef(null);
  const sheet = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let active = true;
    getRecommendations({ location: origin, ...preferences, limit: 10 })
      .then((result) => {
        const nextPlaces = nearestPlaces(result.items || result);
        if (!active || !nextPlaces.length) return;
        setPlaces(nextPlaces);
        setSelected(nextPlaces[0]);
        setStatus(`${nextPlaces.length} places, picked for your pace`);
      })
      .catch(() => { if (active) setStatus('Four close-by stories, ready to explore'); });
    Animated.timing(sheet, { toValue: 1, duration: 580, useNativeDriver: true }).start();
    return () => { active = false; };
  }, [origin, preferences, sheet]);

  const frameAll = useCallback(() => {
    const coordinates = [
      { latitude: origin.lat, longitude: origin.lng },
      ...places.map((place) => ({ latitude: place.location.lat, longitude: place.location.lng }))
    ];
    mapRef.current?.fitToCoordinates(coordinates, { edgePadding: { top: 130, left: 44, right: 44, bottom: 300 }, animated: true });
  }, [origin.lat, origin.lng, places]);

  const selectPlace = useCallback((place) => {
    setSelected(place);
    mapRef.current?.animateCamera({ center: { latitude: place.location.lat, longitude: place.location.lng }, zoom: 12.4 }, { duration: 520 });
  }, []);

  const sheetStyle = useMemo(() => ({ opacity: sheet, transform: [{ translateY: sheet.interpolate({ inputRange: [0, 1], outputRange: [185, 0] }) }] }), [sheet]);
  const crowdColor = crowdColors[selected?.estimatedCrowd?.level] || colors.blueGlow;

  return <View style={styles.screen}>
    <MapView provider={PROVIDER_GOOGLE} ref={mapRef} style={styles.map} customMapStyle={mapStyle} onMapReady={frameAll}>
      {places.map((place) => <CrowdField key={`field-${place.placeId}`} place={place} active={selected?.placeId === place.placeId} />)}
      <Marker coordinate={{ latitude: origin.lat, longitude: origin.lng }} title="Demo starting point"><View style={styles.userMarker}><View style={styles.userMarkerCore} /></View></Marker>
      {places.map((place, index) => (
        <PlaceMarker
          key={place.placeId}
          place={place}
          index={index}
          selected={selected?.placeId === place.placeId}
          onPress={() => selectPlace(place)}
        />
      ))}
    </MapView>

    <View pointerEvents="none" style={styles.header}><View><Text style={styles.brand}>VOYAGE</Text><Text style={styles.headerLabel}>DISCOVER NEARBY</Text></View><View style={styles.live}><View style={styles.liveDot} /><Text style={styles.liveText}>MAP LIVE</Text></View></View>
    <View pointerEvents="none" style={styles.mapStatus}><Text style={styles.mapStatusText}>{status}</Text><Text style={styles.mapStatusSub}>Heat rings show the live crowd field</Text></View>
    <Pressable onPress={frameAll} style={styles.frameButton}><Text style={styles.frameButtonText}>⌖</Text></Pressable>

    <Animated.View style={[styles.sheet, sheetStyle]}>
      <View style={styles.grip} />
      <View style={styles.sheetTop}><View style={[styles.crowdDot, { backgroundColor: crowdColor }]} /><Text style={styles.category}>{selected.category} · {selected.distanceKm} KM AWAY</Text><Text style={styles.match}>{selected.score}% MATCH</Text></View>
      <View style={styles.storyRow}>{selected.photo && <Image source={{ uri: selected.photo.url }} style={styles.storyImage} />}<View style={styles.storyCopy}><Text style={styles.placeName} numberOfLines={2}>{selected.name}</Text><Text style={styles.description} numberOfLines={2}>{selected.description}</Text></View></View>
      <View style={styles.sheetFooter}><View><Text style={styles.crowdLabel}>CROWD NOW</Text><Text style={[styles.crowdValue, { color: crowdColor }]}>{selected.estimatedCrowd?.level || 'MEDIUM'}</Text></View><Pressable onPress={() => navigation.navigate('PlaceDetails', { placeId: selected.placeId, origin, preview: selected })} style={styles.storyButton}><Text style={styles.storyButtonText}>View place</Text><Text style={styles.storyArrow}>›</Text></Pressable></View>
    </Animated.View>
  </View>;
}

function CrowdField({ place, active }) {
  const heat = crowdHeat[place.estimatedCrowd?.level] || crowdHeat.MEDIUM;
  const center = { latitude: place.location.lat, longitude: place.location.lng };
  const scale = active ? 1 : .48;
  return <><Circle center={center} radius={760 * scale} fillColor={heat[0]} strokeColor="transparent" /><Circle center={center} radius={420 * scale} fillColor={heat[1]} strokeColor="transparent" /><Circle center={center} radius={190 * scale} fillColor={heat[2]} strokeColor="transparent" /></>;
}

const PlaceMarker = ({ place, index, selected, onPress }) => {
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  // Re-enable tracking if selection state changes so the pin size animates properly on Android
  useEffect(() => {
    setTracksViewChanges(true);
  }, [selected]);

  return (
    <Marker 
      coordinate={{ latitude: place.location.lat, longitude: place.location.lng }} 
      onPress={onPress} 
      title={place.name} 
      description={place.category}
      tracksViewChanges={tracksViewChanges}
    >
      <View style={[styles.photoPin, selected && styles.photoPinSelected]}>
        {place.photo && (
          <Image 
            source={{ uri: place.photo.url }} 
            style={styles.pinImage} 
            onLoad={() => setTracksViewChanges(false)}
          />
        )}
        <View style={[styles.pinIndex, selected && styles.pinIndexSelected]}>
          <Text style={styles.pinIndexText}>0{index + 1}</Text>
        </View>
      </View>
    </Marker>
  );
};

const mapStyle = [{ elementType: 'geometry', stylers: [{ color: '#e8f4fc' }] }, { elementType: 'labels.text.fill', stylers: [{ color: '#4a6681' }] }, { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#aee1fa' }] }, { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] }, { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#d8eaf5' }] }, { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#d1e2ed' }] }];

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas }, map: { flex: 1 },
  header: { position: 'absolute', top: 23, left: 20, right: 20, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }, brand: { color: colors.ink, backgroundColor: 'rgba(255,255,255,.9)', overflow: 'hidden', paddingHorizontal: 11, paddingTop: 8, paddingBottom: 5, borderTopLeftRadius: 12, borderTopRightRadius: 12, fontSize: 13, letterSpacing: 3 }, headerLabel: { backgroundColor: 'rgba(255,255,255,.9)', color: colors.forest, paddingHorizontal: 11, paddingBottom: 8, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, fontSize: 8, letterSpacing: 1.05 }, live: { marginTop: 1, backgroundColor: 'rgba(255,255,255,.9)', borderWidth: 1, borderColor: 'rgba(255,255,255,.98)', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 9, flexDirection: 'row', gap: 6, alignItems: 'center' }, liveDot: { height: 6, width: 6, borderRadius: 4, backgroundColor: colors.forest }, liveText: { color: colors.forestDark, fontSize: 9, letterSpacing: .85 },
  mapStatus: { position: 'absolute', top: 104, left: 20, backgroundColor: 'rgba(255,255,255,.93)', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 11, shadowColor: colors.ink, shadowOpacity: .1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 }, mapStatusText: { color: colors.ink, fontSize: 11, fontWeight: '900' }, mapStatusSub: { color: colors.muted, fontSize: 10, marginTop: 2 },
  frameButton: { position: 'absolute', right: 20, bottom: 296, width: 42, height: 42, borderRadius: 13, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', shadowColor: colors.ink, shadowOpacity: .12, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3 }, frameButtonText: { color: colors.forest, fontSize: 23, fontWeight: '500' },
  userMarker: { height: 27, width: 27, backgroundColor: colors.white, borderRadius: 16, borderWidth: 3, borderColor: colors.forest, alignItems: 'center', justifyContent: 'center' }, userMarkerCore: { height: 9, width: 9, borderRadius: 5, backgroundColor: colors.forest },
  photoPin: { width: 51, height: 60, borderRadius: 26, backgroundColor: colors.white, borderWidth: 3, borderColor: colors.white, shadowColor: colors.ink, shadowOpacity: .24, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 5, overflow: 'hidden' }, photoPinSelected: { width: 64, height: 74, borderWidth: 4, borderColor: colors.forest }, pinImage: { width: '100%', height: '100%' }, pinIndex: { position: 'absolute', right: -1, bottom: -1, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.navy, borderWidth: 2, borderColor: colors.white, alignItems: 'center', justifyContent: 'center' }, pinIndexSelected: { backgroundColor: colors.coral }, pinIndexText: { color: colors.white, fontSize: 8, fontWeight: '900' },
  sheet: { backgroundColor: 'rgba(255,255,255,.97)', borderTopLeftRadius: 27, borderTopRightRadius: 27, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 27, shadowColor: colors.ink, shadowOpacity: .19, shadowRadius: 20, shadowOffset: { width: 0, height: -5 }, elevation: 10 }, grip: { width: 38, height: 4, borderRadius: 4, backgroundColor: '#A6D9EE', alignSelf: 'center', marginBottom: 13 }, sheetTop: { flexDirection: 'row', alignItems: 'center' }, crowdDot: { height: 7, width: 7, borderRadius: 4, marginRight: 6 }, category: { flex: 1, color: colors.forest, fontSize: 9, letterSpacing: .9, textTransform: 'uppercase' }, match: { color: colors.muted, fontSize: 9, letterSpacing: .7 },
  storyRow: { flexDirection: 'row', gap: 12, marginTop: 11, alignItems: 'center' }, storyImage: { height: 65, width: 65, borderRadius: 14, backgroundColor: colors.moss }, storyCopy: { flex: 1 }, placeName: { color: colors.ink, fontSize: 22, lineHeight: 25, letterSpacing: -.6, fontWeight: '900' }, description: { color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 3 },
  sheetFooter: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line, marginTop: 14, paddingTop: 13, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, crowdLabel: { color: colors.muted, fontSize: 8, letterSpacing: .9, fontWeight: '900' }, crowdValue: { marginTop: 2, fontSize: 12, letterSpacing: .6, fontWeight: '900' }, storyButton: { backgroundColor: colors.forest, borderRadius: 12, minHeight: 42, paddingLeft: 14, paddingRight: 10, flexDirection: 'row', gap: 8, alignItems: 'center' }, storyButtonText: { color: colors.white, fontSize: 12, fontWeight: '900' }, storyArrow: { color: colors.white, fontSize: 22, lineHeight: 20, fontWeight: '300' }
});
