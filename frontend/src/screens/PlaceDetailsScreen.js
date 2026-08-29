import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, ScrollView, StyleSheet, Text as NativeText, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getPlace } from '../api/placeApi';
import CrowdBadge from '../components/CrowdBadge';
import { ErrorState, LoadingState } from '../components/StateView';
import { placeStories } from '../data/improviserData';
import { colors, fonts } from '../config/theme';

const Text = ({ style, ...props }) => <NativeText {...props} style={[{ fontFamily: fonts.book }, style]} />;

export default function PlaceDetailsScreen({ route, navigation }) {
  const { placeId, origin } = route.params;
  const [place, setPlace] = useState(route.params.preview);
  const [sharedPhotos, setSharedPhotos] = useState([]);
  const [error, setError] = useState(null);
  const heroOpacity = useRef(new Animated.Value(0)).current;

  // Retrieve matching mock stories for the demo place
  const storyData = placeStories[placeId] || {
    whyVisit: place?.why || 'A unique destination waiting to be explored.',
    story: {
      history: 'This location is steeped in rich historical narratives and regional development.',
      culture: 'Reflects local cultural practices, artwork, and traditional values.',
      legend: 'Folk stories and oral histories passed down through local generations.'
    },
    experiences: ['Sightseeing walk', 'Photography', 'Exploring surrounding lanes'],
    responsibleTips: ['Respect local traditions and custom rules.', 'Maintain cleanliness.', 'Support small local vendors.'],
    localConnections: {
      guide: { name: 'Local Resident Guide', role: 'Heritage Guide', detail: 'Local guide with deep knowledge.' },
      artisan: { name: 'Traditional Crafter', role: 'Artisan Helper', detail: 'Locally hand-crafted goods.' },
      food: { name: 'Local Food Stall', role: 'Regional Snack Hub', detail: 'Serving authentic local taste.' }
    }
  };

  useEffect(() => {
    getPlace(placeId)
      .then((nextPlace) => {
        if (nextPlace) setPlace(nextPlace);
      })
      .catch((err) => setError(err.message));
    Animated.timing(heroOpacity, { toValue: 1, duration: 460, useNativeDriver: true }).start();
  }, [placeId, heroOpacity]);

  if (error) return <ErrorState message={error} />;
  if (!place) return <LoadingState label="Opening place details..." />;

  const crowd = place.estimatedCrowd || { level: 'MEDIUM', confidence: 'Estimated' };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      {/* Hero Image */}
      {place.photo && (
        <Animated.View style={[styles.heroWrap, { opacity: heroOpacity }]}>
          <Image source={{ uri: place.photo.url }} style={styles.hero} resizeMode="cover" />
          <View style={styles.heroWash} />
          <View style={styles.photoFlag}>
            <Text style={styles.photoFlagText}>VOYAGE EXPERIENCE FILE</Text>
          </View>
          <Text style={styles.photoCredit}>Photo · {place.photo.credit}</Text>
        </Animated.View>
      )}

      {/* Intro Block */}
      <View style={styles.introContainer}>
        <Text style={styles.category}>{place.category} · {place.distanceKm} KM FROM YOU</Text>
        <Text style={styles.title}>{place.name}</Text>
        <Text style={styles.description}>{place.description}</Text>
      </View>

      {/* Section A — Why Visit */}
      <View style={styles.highlightContainer}>
        <Text style={styles.containerLabel}>WHY VISIT THIS PLACE?</Text>
        <Text style={styles.whyText}>💡 {storyData.whyVisit}</Text>
      </View>

      {/* Section B — The Story & Heritage */}
      <View style={styles.sectionCard}>
        <Text style={styles.containerLabel}>THE STORY & FOLK HERITAGE</Text>
        
        <View style={styles.storySubCard}>
          <Text style={styles.storyCardHeader}>📜 Historical Origins</Text>
          <Text style={styles.storyCardBody}>{storyData.story.history}</Text>
        </View>

        <View style={styles.storySubCard}>
          <Text style={styles.storyCardHeader}>🎭 Cultural Significance</Text>
          <Text style={styles.storyCardBody}>{storyData.story.culture}</Text>
        </View>

        <View style={styles.storySubCard}>
          <Text style={styles.storyCardHeader}>✨ Legend & Folklore</Text>
          <Text style={styles.storyCardBody}>{storyData.story.legend}</Text>
        </View>
      </View>

      {/* Section C — Experiences */}
      <View style={styles.sectionCard}>
        <Text style={styles.containerLabel}>WHAT YOU CAN EXPERIENCE</Text>
        <View style={styles.experienceGrid}>
          {storyData.experiences.map((exp, index) => (
            <View key={index} style={styles.expItem}>
              <Text style={styles.expDot}>✦</Text>
              <Text style={styles.expText}>{exp}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Section D — Before You Visit */}
      <View style={styles.factContainer}>
        <Text style={styles.containerLabel}>CROWD PROFILE & GOOD TO KNOW</Text>
        <View style={styles.factRow}>
          <Fact label="BEST TIME" value={place.bestVisitTime} />
          <Fact label="ACCESS" value={place.accessibility} />
          <View style={styles.factLast}>
            <Text style={styles.factLabel}>CROWD NOW</Text>
            <CrowdBadge crowd={crowd} />
          </View>
        </View>

        {/* Expose crowd score estimation */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, backgroundColor: colors.moss, borderRadius: 10, padding: 10 }}>
          <View>
            <Text style={{ fontSize: 8, color: colors.muted, fontWeight: 'bold', letterSpacing: 0.8 }}>DEMO CROWD ESTIMATE</Text>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: colors.ink, marginTop: 2 }}>
              Score: {crowd.level === 'LOW' ? '28' : crowd.level === 'HIGH' ? '82' : '49'} / 100
            </Text>
          </View>
          <Pressable 
            style={{ backgroundColor: colors.forest, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
            onPress={() => navigation.navigate('MapRoute', { place, origin })}
          >
            <Text style={{ color: colors.white, fontSize: 10, fontWeight: 'bold' }}>See Crowd Map</Text>
          </Pressable>
        </View>

        {/* Warning recommendations for high crowd */}
        {crowd.level === 'HIGH' && (
          <View style={{ backgroundColor: '#FFF5F5', borderWidth: 1, borderColor: '#FFE3E3', padding: 10, borderRadius: 10, marginBottom: 12 }}>
            <Text style={{ color: '#DC3545', fontSize: 11, fontWeight: 'bold', lineHeight: 16 }}>
              ⚠️ Recommended: Peak hours detected. Consider visiting before 9:00 AM or use the AI Improviser below to optimize timing.
            </Text>
          </View>
        )}

        <Text style={styles.tipsHeading}>Responsible Visitor Conduct:</Text>
        {storyData.responsibleTips.map((tip, index) => (
          <Text key={index} style={styles.tipText}>✓ {tip}</Text>
        ))}
      </View>

      {/* Section E — Local Connection */}
      <View style={styles.sectionCard}>
        <Text style={styles.containerLabel}>EXPERIENCE IT LOCALLY (DEMO PARTNERS)</Text>
        
        <View style={styles.partnerCard}>
          <View style={styles.partnerAvatar}><Text style={styles.partnerAvatarText}>👤</Text></View>
          <View style={styles.partnerInfo}>
            <Text style={styles.partnerName}>{storyData.localConnections.guide.name}</Text>
            <Text style={styles.partnerRole}>{storyData.localConnections.guide.role}</Text>
            <Text style={styles.partnerDetail}>{storyData.localConnections.guide.detail}</Text>
          </View>
        </View>

        <View style={styles.partnerCard}>
          <View style={styles.partnerAvatar}><Text style={styles.partnerAvatarText}>🎨</Text></View>
          <View style={styles.partnerInfo}>
            <Text style={styles.partnerName}>{storyData.localConnections.artisan.name}</Text>
            <Text style={styles.partnerRole}>{storyData.localConnections.artisan.role}</Text>
            <Text style={styles.partnerDetail}>{storyData.localConnections.artisan.detail}</Text>
          </View>
        </View>

        <View style={styles.partnerCard}>
          <View style={styles.partnerAvatar}><Text style={styles.partnerAvatarText}>🍲</Text></View>
          <View style={styles.partnerInfo}>
            <Text style={styles.partnerName}>{storyData.localConnections.food.name}</Text>
            <Text style={styles.partnerRole}>{storyData.localConnections.food.role}</Text>
            <Text style={styles.partnerDetail}>{storyData.localConnections.food.detail}</Text>
          </View>
        </View>
      </View>

      {/* Section F — CTA */}
      <Pressable 
        style={({ pressed }) => [styles.primary, pressed && styles.primaryPressed]} 
        onPress={() => navigation.navigate('ItineraryImproviser', { place, origin })}
      >
        <View>
          <Text style={styles.primaryKicker}>GENERATE PERSONALIZED TRAIL</Text>
          <Text style={styles.primaryText}>Create AI Experience Trail</Text>
        </View>
        <Text style={styles.primaryArrow}>→</Text>
      </Pressable>
    </ScrollView>
  );
}

function Fact({ label, value }) { 
  return <View style={styles.fact}><Text style={styles.factLabel}>{label}</Text><Text style={styles.factValue} numberOfLines={2}>{value}</Text></View>; 
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas }, 
  content: { paddingBottom: 40 }, 
  heroWrap: { height: 260, overflow: 'hidden', backgroundColor: colors.moss, position: 'relative' }, 
  hero: { width: '100%', height: '100%' }, 
  heroWash: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(13,53,76,.12)' }, 
  photoFlag: { position: 'absolute', top: 18, left: 20, borderRadius: 99, backgroundColor: 'rgba(255,255,255,.86)', paddingHorizontal: 11, paddingVertical: 7 }, 
  photoFlagText: { color: colors.forestDark, fontSize: 9, letterSpacing: 1.1, fontWeight: 'bold' }, 
  photoCredit: { position: 'absolute', right: 20, bottom: 16, color: colors.white, fontSize: 10, textShadowColor: 'rgba(0,0,0,.5)', textShadowRadius: 6 },
  
  introContainer: { marginTop: -23, marginHorizontal: 16, padding: 20, borderRadius: 25, backgroundColor: 'rgba(255,255,255,.98)', borderWidth: 1, borderColor: colors.line, shadowColor: '#7FC8E8', shadowOpacity: .17, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 3 }, 
  category: { color: colors.forest, fontSize: 10, letterSpacing: 1.1, fontWeight: 'bold' }, 
  title: { color: colors.ink, fontSize: 30, lineHeight: 36, letterSpacing: -.7, marginTop: 7, fontWeight: 'bold' }, 
  description: { color: colors.muted, fontSize: 13, lineHeight: 20, marginTop: 10 },
  
  highlightContainer: { marginTop: 16, marginHorizontal: 16, padding: 18, borderRadius: 20, backgroundColor: '#DDF4FF', borderLeftWidth: 4, borderLeftColor: colors.forest }, 
  whyText: { color: colors.ink, fontSize: 15, lineHeight: 22, fontWeight: '700' },
  
  sectionCard: { marginTop: 16, marginHorizontal: 16, padding: 18, borderRadius: 22, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  containerLabel: { color: colors.forest, fontSize: 9, letterSpacing: 1.1, fontWeight: '900', marginBottom: 12 },
  
  storySubCard: { marginBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line, paddingBottom: 12 },
  storyCardHeader: { fontSize: 13, fontWeight: 'bold', color: colors.ink },
  storyCardBody: { fontSize: 12, lineHeight: 18, color: colors.muted, marginTop: 4 },
  
  experienceGrid: { gap: 10 },
  expItem: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  expDot: { color: colors.forest, fontSize: 14 },
  expText: { color: colors.ink, fontSize: 13, fontWeight: '500' },

  factContainer: { marginTop: 16, marginHorizontal: 16, padding: 18, borderRadius: 20, backgroundColor: 'rgba(255,255,255,.7)', borderWidth: 1, borderColor: colors.line }, 
  factRow: { flexDirection: 'row', marginTop: 8, marginBottom: 14 }, 
  fact: { flex: 1, paddingRight: 9, borderRightWidth: StyleSheet.hairlineWidth, borderColor: colors.line }, 
  factLast: { flex: .9, paddingLeft: 10 }, 
  factLabel: { color: colors.muted, fontSize: 8, letterSpacing: .8, fontWeight: 'bold' }, 
  factValue: { color: colors.ink, fontSize: 11, lineHeight: 16, marginTop: 5, fontWeight: 'bold' },
  
  tipsHeading: { fontSize: 12, fontWeight: 'bold', color: colors.ink, marginBottom: 6, marginTop: 10 },
  tipText: { fontSize: 11, color: colors.muted, lineHeight: 16, marginBottom: 4 },

  partnerCard: { flexDirection: 'row', gap: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line, alignItems: 'center' },
  partnerAvatar: { height: 38, width: 38, borderRadius: 19, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center' },
  partnerAvatarText: { fontSize: 18 },
  partnerInfo: { flex: 1 },
  partnerName: { fontSize: 13, fontWeight: 'bold', color: colors.ink },
  partnerRole: { fontSize: 10, fontWeight: 'bold', color: colors.forest },
  partnerDetail: { fontSize: 11, color: colors.muted, marginTop: 2 },

  primary: { marginHorizontal: 16, marginTop: 20, paddingHorizontal: 18, paddingVertical: 14, borderRadius: 18, backgroundColor: colors.forest, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#61C2EA', shadowOpacity: .28, shadowRadius: 15, shadowOffset: { width: 0, height: 8 }, elevation: 4 }, 
  primaryPressed: { opacity: .85, transform: [{ scale: .985 }] }, 
  primaryKicker: { color: 'rgba(255,255,255,.72)', fontSize: 8, letterSpacing: .9, fontWeight: 'bold' }, 
  primaryText: { color: colors.white, fontSize: 16, marginTop: 3, fontWeight: 'bold' }, 
  primaryArrow: { color: colors.white, fontSize: 25 }
});
