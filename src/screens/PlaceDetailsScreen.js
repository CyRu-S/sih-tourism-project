import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, ScrollView, StyleSheet, Text as NativeText, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getPlace } from '../api/placeApi';
import CrowdBadge from '../components/CrowdBadge';
import { ErrorState, LoadingState } from '../components/StateView';
import { colors, fonts } from '../config/theme';

const Text = ({ style, ...props }) => <NativeText {...props} style={[{ fontFamily: fonts.book }, style]} />;
const seedReview = (place) => place?.visitorNote ? [{ id: 'local-note', author: place.visitorNote.author, text: place.visitorNote.quote, context: place.visitorNote.context }] : [];

export default function PlaceDetailsScreen({ route, navigation }) {
  const [place, setPlace] = useState(route.params.preview);
  const [reviews, setReviews] = useState(() => seedReview(route.params.preview));
  const [sharedPhotos, setSharedPhotos] = useState([]);
  const [composer, setComposer] = useState(null);
  const [draft, setDraft] = useState('');
  const [photoError, setPhotoError] = useState(null);
  const [error, setError] = useState(null);
  const heroOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getPlace(route.params.placeId, route.params.origin).then((nextPlace) => { setPlace(nextPlace); setReviews(seedReview(nextPlace)); }).catch((err) => setError(err.message));
    Animated.timing(heroOpacity, { toValue: 1, duration: 460, useNativeDriver: true }).start();
  }, [route.params.placeId, heroOpacity]);

  if (error) return <ErrorState message={error} />;
  if (!place) return <LoadingState label="Opening place details..." />;

  const crowd = place.estimatedCrowd || { level: 'MEDIUM', confidence: 'Estimated' };
  const closeComposer = () => { setComposer(null); setDraft(''); };
  const submitContribution = () => {
    const value = draft.trim();
    if (!value) return;
    setReviews((items) => [{ id: `review-${Date.now()}`, author: 'You', text: value, context: 'Just shared' }, ...items]);
    closeComposer();
  };
  const pickPhoto = async () => {
    setPhotoError(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { setPhotoError('Allow photo access to add a picture from your library.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: .82 });
    if (!result.canceled && result.assets?.[0]?.uri) setSharedPhotos((photos) => [{ id: `photo-${Date.now()}`, url: result.assets[0].uri }, ...photos]);
  };

  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
    {place.photo && <Animated.View style={[styles.heroWrap, { opacity: heroOpacity }]}>
      <Image source={{ uri: place.photo.url }} style={styles.hero} resizeMode="cover" /><View style={styles.heroWash} />
      <View style={styles.photoFlag}><Text style={styles.photoFlagText}>VOYAGE FIELD NOTE</Text></View><Text style={styles.photoCredit}>Photo · {place.photo.credit}</Text>
    </Animated.View>}

    <View style={styles.introContainer}>
      <Text style={styles.category}>{place.category} · {place.distanceKm} KM FROM YOU</Text><Text style={styles.title}>{place.name}</Text><Text style={styles.scriptLine}>A small detour with a story.</Text><Text style={styles.description}>{place.description}</Text>
    </View>

    <View style={styles.factContainer}>
      <Text style={styles.containerLabel}>AT A GLANCE</Text>
      <View style={styles.factRow}><Fact label="BEST TIME" value={place.bestVisitTime} /><Fact label="ACCESS" value={place.accessibility} /><View style={styles.factLast}><Text style={styles.factLabel}>CROWD NOW</Text><CrowdBadge crowd={crowd} /></View></View>
    </View>

    <View style={styles.highlightContainer}><Text style={styles.containerLabel}>WHY IT MADE YOUR LIST</Text><Text style={styles.whyText}>{place.why}</Text></View>

    <View style={styles.communityContainer}>
      <View style={styles.sectionHeading}><View><Text style={styles.containerLabel}>FROM THE COMMUNITY</Text><Text style={styles.sectionTitle}>{reviews.length} traveller {reviews.length === 1 ? 'note' : 'notes'}</Text></View><View style={styles.communityPulse}><View style={styles.pulseDot} /><Text style={styles.pulseText}>LOCAL</Text></View></View>
      <View style={styles.actionRow}><Pressable style={({ pressed }) => [styles.secondaryAction, pressed && styles.actionPressed]} onPress={() => setComposer('review')}><Text style={styles.actionIcon}>✦</Text><Text style={styles.secondaryActionText}>Write a review</Text></Pressable><Pressable style={({ pressed }) => [styles.secondaryAction, pressed && styles.actionPressed]} onPress={pickPhoto}><Text style={styles.actionIcon}>＋</Text><Text style={styles.secondaryActionText}>Post a photo</Text></Pressable></View>
      {composer && <View style={styles.composer}><Text style={styles.composerTitle}>Share what you noticed</Text><TextInput value={draft} onChangeText={setDraft} placeholder="A detail that may help the next visitor…" placeholderTextColor="#8AA9BA" multiline autoCapitalize="sentences" style={[styles.input, styles.reviewInput]} /><View style={styles.composerFooter}><Pressable onPress={closeComposer}><Text style={styles.cancelText}>Cancel</Text></Pressable><Pressable onPress={submitContribution} style={styles.shareButton}><Text style={styles.shareButtonText}>Post review</Text></Pressable></View></View>}
      {photoError && <Text style={styles.photoError}>{photoError}</Text>}
      {sharedPhotos.length > 0 && <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sharedPhotos}>{sharedPhotos.map((photo) => <Image key={photo.id} source={{ uri: photo.url }} style={styles.sharedPhoto} />)}</ScrollView>}
      <View style={styles.reviewList}>{reviews.map((review) => <View key={review.id} style={styles.review}><View style={styles.avatar}><Text style={styles.avatarText}>{review.author.slice(0, 1)}</Text></View><View style={styles.reviewCopy}><Text style={styles.reviewAuthor}>{review.author}</Text><Text style={styles.reviewText}>{review.text}</Text><Text style={styles.reviewContext}>{review.context}</Text></View></View>)}</View>
    </View>

    <View style={styles.tagsContainer}><Text style={styles.containerLabel}>KEEP AN EYE OUT FOR</Text><View style={styles.tags}>{place.tags.map((tag) => <Text key={tag} style={styles.tag}>#{tag}</Text>)}</View></View>
    <View style={styles.sourceLine}><Text style={styles.sourceText}>{place.photo?.source || 'Voyage'} · {place.sourceAttribution}</Text></View>
    <Pressable style={({ pressed }) => [styles.primary, pressed && styles.primaryPressed]} onPress={() => navigation.navigate('MapRoute', { place, origin: route.params.origin })}><View><Text style={styles.primaryKicker}>SEE THE ACTIVITY AROUND IT</Text><Text style={styles.primaryText}>Open journey & crowd map</Text></View><Text style={styles.primaryArrow}>→</Text></Pressable>
  </ScrollView>;
}

function Fact({ label, value }) { return <View style={styles.fact}><Text style={styles.factLabel}>{label}</Text><Text style={styles.factValue} numberOfLines={2}>{value}</Text></View>; }

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas }, content: { paddingBottom: 40 }, heroWrap: { height: 318, overflow: 'hidden', backgroundColor: colors.moss }, hero: { width: '100%', height: '100%' }, heroWash: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(13,53,76,.15)' }, photoFlag: { position: 'absolute', top: 18, left: 20, borderRadius: 99, backgroundColor: 'rgba(255,255,255,.82)', paddingHorizontal: 11, paddingVertical: 7 }, photoFlagText: { color: colors.forestDark, fontSize: 9, letterSpacing: 1.1 }, photoCredit: { position: 'absolute', right: 20, bottom: 16, color: colors.white, fontSize: 10, textShadowColor: 'rgba(0,0,0,.48)', textShadowRadius: 6 },
  introContainer: { marginTop: -23, marginHorizontal: 16, padding: 20, borderRadius: 25, backgroundColor: 'rgba(255,255,255,.96)', borderWidth: 1, borderColor: 'rgba(255,255,255,.98)', shadowColor: '#7FC8E8', shadowOpacity: .17, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 3 }, category: { color: colors.forest, fontSize: 10, letterSpacing: 1.1 }, title: { color: colors.ink, fontSize: 34, lineHeight: 41, letterSpacing: -.7, marginTop: 7 }, scriptLine: { color: colors.forestDark, fontSize: 16, lineHeight: 24, marginTop: 2 }, description: { color: colors.muted, fontSize: 14, lineHeight: 22, marginTop: 13 },
  factContainer: { marginTop: 20, marginHorizontal: 16, padding: 17, borderRadius: 20, backgroundColor: 'rgba(255,255,255,.7)', borderWidth: 1, borderColor: colors.line }, containerLabel: { color: colors.forest, fontSize: 9, letterSpacing: 1.1 }, factRow: { flexDirection: 'row', marginTop: 14 }, fact: { flex: 1, paddingRight: 9, borderRightWidth: StyleSheet.hairlineWidth, borderColor: colors.line }, factLast: { flex: .9, paddingLeft: 10 }, factLabel: { color: colors.muted, fontSize: 8, letterSpacing: .8 }, factValue: { color: colors.ink, fontSize: 12, lineHeight: 17, marginTop: 5 },
  highlightContainer: { marginTop: 16, marginHorizontal: 16, padding: 20, borderRadius: 20, backgroundColor: '#DDF4FF', borderLeftWidth: 4, borderLeftColor: colors.sky }, whyText: { color: colors.ink, fontSize: 18, lineHeight: 28, marginTop: 8 },
  communityContainer: { marginTop: 24, marginHorizontal: 16, padding: 18, borderRadius: 22, backgroundColor: 'rgba(255,255,255,.86)', borderWidth: 1, borderColor: 'rgba(255,255,255,.98)', shadowColor: '#7FC8E8', shadowOpacity: .1, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 2 }, sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }, sectionTitle: { color: colors.ink, fontSize: 18, marginTop: 4 }, communityPulse: { flexDirection: 'row', gap: 5, alignItems: 'center', paddingTop: 2 }, pulseDot: { height: 6, width: 6, borderRadius: 4, backgroundColor: '#5DCB9F' }, pulseText: { color: colors.forestDark, fontSize: 8, letterSpacing: .8 }, actionRow: { flexDirection: 'row', gap: 9, marginTop: 16 }, secondaryAction: { flex: 1, minHeight: 45, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, borderRadius: 13, backgroundColor: colors.moss, borderWidth: 1, borderColor: '#C6EAF9' }, actionPressed: { opacity: .76 }, actionIcon: { color: colors.forest, fontSize: 16 }, secondaryActionText: { color: colors.forestDark, fontSize: 11 },
  composer: { marginTop: 14, padding: 13, borderRadius: 15, backgroundColor: '#EAF8FF', borderWidth: 1, borderColor: '#C6EAF9' }, composerTitle: { color: colors.ink, fontSize: 14 }, input: { marginTop: 10, minHeight: 43, paddingHorizontal: 11, paddingVertical: 9, borderRadius: 11, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, color: colors.ink, fontFamily: fonts.book, fontSize: 13 }, reviewInput: { minHeight: 83, textAlignVertical: 'top' }, composerFooter: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 14, marginTop: 10 }, cancelText: { color: colors.muted, fontSize: 12 }, shareButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: colors.forest }, shareButtonText: { color: colors.white, fontSize: 11 }, photoError: { color: colors.coral, fontSize: 11, lineHeight: 16, marginTop: 11 }, sharedPhotos: { gap: 9, paddingTop: 14 }, sharedPhoto: { width: 92, height: 92, borderRadius: 13, backgroundColor: colors.moss },
  reviewList: { marginTop: 16, gap: 15 }, review: { flexDirection: 'row', gap: 10, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth, borderColor: colors.line }, avatar: { alignItems: 'center', backgroundColor: colors.forest, borderRadius: 99, height: 31, justifyContent: 'center', width: 31 }, avatarText: { color: colors.white, fontSize: 14 }, reviewCopy: { flex: 1 }, reviewAuthor: { color: colors.ink, fontSize: 12 }, reviewText: { color: colors.ink, fontSize: 14, lineHeight: 21, marginTop: 4 }, reviewContext: { color: colors.muted, fontSize: 10, marginTop: 5 },
  tagsContainer: { marginTop: 24, marginHorizontal: 16, padding: 18, borderRadius: 20, backgroundColor: 'rgba(221,244,255,.6)' }, tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 11 }, tag: { color: colors.forestDark, backgroundColor: 'rgba(255,255,255,.8)', paddingHorizontal: 11, paddingVertical: 8, borderRadius: 99, borderWidth: 1, borderColor: colors.line, fontSize: 11 }, sourceLine: { marginHorizontal: 20, marginTop: 20, paddingTop: 13, borderTopWidth: StyleSheet.hairlineWidth, borderColor: colors.line }, sourceText: { color: colors.muted, fontSize: 9, lineHeight: 15 },
  primary: { marginHorizontal: 16, marginTop: 20, paddingHorizontal: 18, paddingVertical: 14, borderRadius: 18, backgroundColor: colors.forest, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#61C2EA', shadowOpacity: .28, shadowRadius: 15, shadowOffset: { width: 0, height: 8 }, elevation: 4 }, primaryPressed: { opacity: .85, transform: [{ scale: .985 }] }, primaryKicker: { color: 'rgba(255,255,255,.72)', fontSize: 8, letterSpacing: .9 }, primaryText: { color: colors.white, fontSize: 16, marginTop: 3 }, primaryArrow: { color: colors.white, fontSize: 25 }
});
