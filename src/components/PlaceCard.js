import { Image, Pressable, StyleSheet, Text as NativeText, View } from 'react-native';
import CrowdBadge from './CrowdBadge';
import { colors, fonts } from '../config/theme';

const Text = ({ style, ...props }) => <NativeText {...props} style={[{ fontFamily: fonts.book }, style]} />;

export default function PlaceCard({ place, rank, onPress }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.place, pressed && styles.pressed]}>
    <View style={styles.imageWrap}>
      {place.photo && <Image source={{ uri: place.photo.url }} style={styles.image} />}
      <View style={styles.imageWash} />
      <Text style={styles.rank}>0{rank}</Text>
      <View style={styles.imageMeta}><Text style={styles.category}>{place.category}</Text><Text style={styles.score}>{place.score}% MATCH</Text></View>
    </View>
    <View style={styles.body}>
      <Text style={styles.name}>{place.name}</Text>
      <Text style={styles.why} numberOfLines={2}>{place.why}</Text>
      <View style={styles.footer}><CrowdBadge crowd={place.estimatedCrowd} /><Text style={styles.distance}>{place.distanceKm} KM · TAP TO EXPLORE</Text></View>
    </View>
  </Pressable>;
}

const styles = StyleSheet.create({
  place: { marginHorizontal: 16, marginBottom: 18, backgroundColor: 'rgba(255,255,255,.76)', overflow: 'hidden', borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,.96)', shadowColor: '#70C6E9', shadowOpacity: .14, shadowRadius: 16, shadowOffset: { width: 0, height: 7 }, elevation: 3 }, pressed: { opacity: .88, transform: [{ scale: .985 }] },
  imageWrap: { height: 154, backgroundColor: colors.forestDark }, image: { width: '100%', height: '100%' }, imageWash: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(3,20,46,.18)' },
  rank: { position: 'absolute', top: 13, left: 14, color: colors.white, fontWeight: '900', fontSize: 21, letterSpacing: -.6, textShadowColor: 'rgba(0,0,0,.45)', textShadowRadius: 8 },
  imageMeta: { position: 'absolute', left: 14, right: 14, bottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, category: { color: colors.white, textTransform: 'uppercase', fontSize: 10, fontWeight: '900', letterSpacing: 1.2 }, score: { color: colors.white, fontSize: 10, letterSpacing: .7, fontWeight: '900' },
  body: { paddingHorizontal: 16, paddingTop: 15, paddingBottom: 14 }, name: { fontSize: 22, lineHeight: 28, color: colors.ink, letterSpacing: -.6 }, why: { fontSize: 14, lineHeight: 20, color: colors.muted, marginTop: 6 }, footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }, distance: { fontSize: 9, color: colors.muted, letterSpacing: .65 }
});
