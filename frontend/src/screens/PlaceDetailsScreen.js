import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, ScrollView, StyleSheet, Text as NativeText, View } from 'react-native';
import { getPlace } from '../api/placeApi';
import CrowdBadge from '../components/CrowdBadge';
import { ErrorState, LoadingState } from '../components/StateView';
import { placeStories } from '../data/improviserData';
import { colors, fonts } from '../config/theme';

const Text = ({ style, ...props }) => <NativeText {...props} style={[{ fontFamily: fonts.book }, style]} />;

export default function PlaceDetailsScreen({ route, navigation }) {
  const { placeId, origin } = route.params;
  const [place, setPlace] = useState(route.params.preview);
  const [error, setError] = useState(null);
  const heroOpacity = useRef(new Animated.Value(0)).current;

  // Map database IDs 201-205 to mock story IDs 101-105
  const lookupId = (placeId >= 201 && placeId <= 205) ? placeId - 100 : placeId;

  // Retrieve matching mock stories for the demo place
  const storyData = placeStories[lookupId] || {
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

  const crowd = place.estimatedCrowd || { level: 'MEDIUM', index: 0.5, confidence: 'Estimated' };
  const crowdScore = Math.round((crowd.index || 0.5) * 100);
  const isCrowded = crowd.level === 'HIGH';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      
      {/* Hero Image */}
      {place.photo && (
        <Animated.View style={[styles.heroWrap, { opacity: heroOpacity }]}>
          <Image source={{ uri: place.photo.url }} style={styles.hero} resizeMode="cover" />
          <View style={styles.heroWash} />
          
          <View style={styles.heroBadgeRow}>
            <View style={styles.hiddenGemBadge}>
              <Text style={styles.hiddenGemText}>💎 HIDDEN GEM</Text>
            </View>
            <View style={styles.matchBadge}>
              <Text style={styles.matchText}>{place.score || 94}% MATCH</Text>
            </View>
          </View>

          <View style={styles.oneLinerWrap}>
            <Text style={styles.oneLinerText}>A quieter heritage experience with strong local character.</Text>
          </View>
        </Animated.View>
      )}

      {/* Intro Block */}
      <View style={styles.introContainer}>
        <Text style={styles.category}>{place.category} · {place.distanceKm || 5.8} KM FROM YOU</Text>
        <Text style={styles.title}>{place.name}</Text>
        <Text style={styles.description}>{place.description}</Text>
      </View>

      {/* Why Visit Grid (4 Visual Cards) */}
      <View style={styles.sectionCard}>
        <Text style={styles.containerLabel}>WHY VISIT THIS PLACE?</Text>
        <View style={styles.whyGrid}>
          <View style={styles.whyCard}>
            <Text style={styles.whyCardTitle}>🌸 Beauty</Text>
            <Text style={styles.whyCardText}>Quiet paths and unique aesthetic character.</Text>
          </View>
          <View style={styles.whyCard}>
            <Text style={styles.whyCardTitle}>🏛 History</Text>
            <Text style={styles.whyCardText}>Deep regional history and cultural stories.</Text>
          </View>
        </View>
        <View style={styles.whyGrid}>
          <View style={styles.whyCard}>
            <Text style={styles.whyCardTitle}>🎨 Culture</Text>
            <Text style={styles.whyCardText}>Traditional practices and active local arts.</Text>
          </View>
          <View style={styles.whyCard}>
            <Text style={styles.whyCardTitle}>🚶 Experience</Text>
            <Text style={styles.whyCardText}>Interact, explore and participate in workshops.</Text>
          </View>
        </View>
      </View>

      {/* The Story Behind the Place */}
      <View style={styles.sectionCard}>
        <Text style={styles.containerLabel}>THE STORY BEHIND THE PLACE (MORE THAN A LOCATION)</Text>
        
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

        <View style={styles.storySubCard}>
          <Text style={styles.storyCardHeader}>💡 Interesting Fact</Text>
          <Text style={styles.storyCardBody}>Constructed using organic local resources and traditional techniques passed down through families.</Text>
        </View>
      </View>

      {/* Experiences Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.containerLabel}>WHAT YOU'LL EXPERIENCE</Text>
        <View style={styles.experienceGrid}>
          {storyData.experiences.map((exp, index) => (
            <View key={index} style={styles.expItem}>
              <Text style={styles.expDot}>✦</Text>
              <Text style={styles.expText}>{exp}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Expect Grid (Before You Go) */}
      <View style={styles.factContainer}>
        <Text style={styles.containerLabel}>BEFORE YOU GO</Text>
        <View style={styles.expectGrid}>
          <View style={styles.expectCol}>
            <Text style={styles.expectLabel}>🕐 BEST TIME</Text>
            <Text style={styles.expectValue}>{place.bestVisitTime || '6:30 - 8:30 AM'}</Text>
          </View>
          <View style={styles.expectCol}>
            <Text style={styles.expectLabel}>🌦 CONDITIONS</Text>
            <Text style={styles.expectValue}>Mild & pleasant outdoors</Text>
          </View>
        </View>
        <View style={styles.expectGrid}>
          <View style={styles.expectCol}>
            <Text style={styles.expectLabel}>🚶 WALKING</Text>
            <Text style={styles.expectValue}>{place.walkingDifficulty || 'EASY'} walking trail</Text>
          </View>
          <View style={styles.expectCol}>
            <Text style={styles.expectLabel}>♿ ACCESSIBILITY</Text>
            <Text style={styles.expectValue}>{place.accessibility || 'Limited access'}</Text>
          </View>
        </View>
      </View>

      {/* Crowd Section */}
      <View style={styles.factContainer}>
        <Text style={styles.containerLabel}>CROWD RIGHT NOW</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <View>
            <View style={[styles.crowdTag, { backgroundColor: isCrowded ? '#FFF5F5' : '#E2F7EE' }]}>
              <Text style={[styles.crowdTagText, { color: isCrowded ? '#DC3545' : '#1D8357' }]}>
                {crowd.level === 'LOW' ? '🟢 LOW CROWD' : crowd.level === 'HIGH' ? '🔴 HIGH CROWD' : '🟡 MODERATE'}
              </Text>
            </View>
            <Text style={styles.crowdEstimateText}>{crowdScore || 28} / 100 Demo Estimate</Text>
          </View>
          <Pressable 
            style={styles.mapBtn}
            onPress={() => navigation.navigate('MapRoute', { place, origin })}
          >
            <Text style={styles.mapBtnText}>View Crowd Map</Text>
          </Pressable>
        </View>

        <Text style={styles.bestTimeHeading}>Best visiting window:</Text>
        <Text style={styles.bestTimeText}>6:00 AM – 9:00 AM (Calm moments)</Text>

        {isCrowded && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️ Recommended: Peak hours detected. Visit early morning or use the Experience Improviser to adjust timing.
            </Text>
          </View>
        )}
      </View>

      {/* Local Connections (Demo Partners) */}
      <View style={styles.sectionCard}>
        <Text style={styles.containerLabel}>EXPERIENCE IT LOCALLY (DEMO PARTNERS)</Text>
        
        <View style={styles.partnerCard}>
          <View style={styles.partnerAvatar}><Text style={styles.partnerAvatarText}>🧑🏫</Text></View>
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

        <Text style={styles.demoNoticeText}>Demo community connection</Text>
      </View>

      {/* Main Experience CTA */}
      <Pressable 
        style={({ pressed }) => [styles.primary, pressed && styles.primaryPressed]} 
        onPress={() => navigation.navigate('ItineraryImproviser', { place, origin })}
      >
        <View>
          <Text style={styles.primaryKicker}>GENERATE PERSONALIZED EXPERIENCE</Text>
          <Text style={styles.primaryText}>Build My Experience</Text>
        </View>
        <Text style={styles.primaryArrow}>→</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas }, 
  content: { paddingBottom: 40 }, 
  heroWrap: { height: 280, overflow: 'hidden', backgroundColor: colors.moss, position: 'relative' }, 
  hero: { width: '100%', height: '100%' }, 
  heroWash: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(3,20,46,.25)' }, 
  heroBadgeRow: { position: 'absolute', top: 18, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hiddenGemBadge: { borderRadius: 8, backgroundColor: 'rgba(6,27,58,0.85)', paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: colors.sky }, 
  hiddenGemText: { color: colors.sky, fontSize: 9, letterSpacing: 1.1, fontWeight: 'bold' }, 
  matchBadge: { borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 10, paddingVertical: 6 },
  matchText: { color: colors.forestDark, fontSize: 9, fontWeight: 'bold', letterSpacing: 0.8 },
  oneLinerWrap: { position: 'absolute', left: 16, right: 16, bottom: 16, backgroundColor: 'rgba(3,20,46,0.6)', padding: 12, borderRadius: 14 },
  oneLinerText: { color: colors.white, fontSize: 13, fontWeight: 'bold', lineHeight: 18 },
  
  introContainer: { marginTop: -23, marginHorizontal: 16, padding: 20, borderRadius: 25, backgroundColor: 'rgba(255,255,255,.98)', borderWidth: 1, borderColor: colors.line, shadowColor: '#7FC8E8', shadowOpacity: .17, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 3 }, 
  category: { color: colors.forest, fontSize: 10, letterSpacing: 1.1, fontWeight: 'bold' }, 
  title: { color: colors.ink, fontSize: 30, lineHeight: 36, letterSpacing: -.7, marginTop: 7, fontWeight: 'bold' }, 
  description: { color: colors.muted, fontSize: 13, lineHeight: 20, marginTop: 10 },
  
  sectionCard: { marginTop: 16, marginHorizontal: 16, padding: 18, borderRadius: 22, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  containerLabel: { color: colors.forest, fontSize: 9, letterSpacing: 1.1, fontWeight: '900', marginBottom: 12 },
  
  whyGrid: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  whyCard: { flex: 1, backgroundColor: colors.canvas, borderWidth: 1, borderColor: colors.line, padding: 12, borderRadius: 14 },
  whyCardTitle: { fontSize: 12, fontWeight: 'bold', color: colors.ink, marginBottom: 4 },
  whyCardText: { fontSize: 10, color: colors.muted, lineHeight: 14 },

  storySubCard: { marginBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line, paddingBottom: 12 },
  storyCardHeader: { fontSize: 13, fontWeight: 'bold', color: colors.ink },
  storyCardBody: { fontSize: 12, lineHeight: 18, color: colors.muted, marginTop: 4 },
  
  experienceGrid: { gap: 10 },
  expItem: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  expDot: { color: colors.forest, fontSize: 14 },
  expText: { color: colors.ink, fontSize: 13, fontWeight: '500' },

  factContainer: { marginTop: 16, marginHorizontal: 16, padding: 18, borderRadius: 20, backgroundColor: 'rgba(255,255,255,.7)', borderWidth: 1, borderColor: colors.line }, 
  expectGrid: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  expectCol: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: 10, borderRadius: 12 },
  expectLabel: { fontSize: 8, fontWeight: '900', color: colors.muted, letterSpacing: 0.8 },
  expectValue: { fontSize: 11, fontWeight: 'bold', color: colors.ink, marginTop: 4 },

  crowdTag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, alignSelf: 'flex-start' },
  crowdTagText: { fontSize: 10, fontWeight: '900' },
  crowdEstimateText: { fontSize: 11, color: colors.muted, marginTop: 4, fontWeight: 'bold' },
  mapBtn: { backgroundColor: colors.forest, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  mapBtnText: { color: colors.white, fontSize: 11, fontWeight: 'bold' },
  bestTimeHeading: { fontSize: 11, fontWeight: 'bold', color: colors.ink, marginTop: 10 },
  bestTimeText: { fontSize: 12, color: colors.muted, marginTop: 2 },
  warningBox: { backgroundColor: '#FFF5F5', borderWidth: 1, borderColor: '#FFE3E3', padding: 10, borderRadius: 10, marginTop: 10 },
  warningText: { color: '#DC3545', fontSize: 11, fontWeight: 'bold', lineHeight: 16 },

  partnerCard: { flexDirection: 'row', gap: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line, alignItems: 'center' },
  partnerAvatar: { height: 38, width: 38, borderRadius: 19, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center' },
  partnerAvatarText: { fontSize: 18 },
  partnerInfo: { flex: 1 },
  partnerName: { fontSize: 13, fontWeight: 'bold', color: colors.ink },
  partnerRole: { fontSize: 10, fontWeight: 'bold', color: colors.forest },
  partnerDetail: { fontSize: 11, color: colors.muted, marginTop: 2 },
  demoNoticeText: { fontSize: 8, color: colors.muted, alignSelf: 'flex-end', letterSpacing: 0.8, fontWeight: 'bold', marginTop: 10 },

  primary: { marginHorizontal: 16, marginTop: 20, paddingHorizontal: 18, paddingVertical: 14, borderRadius: 18, backgroundColor: colors.forest, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#61C2EA', shadowOpacity: .28, shadowRadius: 15, shadowOffset: { width: 0, height: 8 }, elevation: 4 }, 
  primaryPressed: { opacity: .85, transform: [{ scale: .985 }] }, 
  primaryKicker: { color: 'rgba(255,255,255,.72)', fontSize: 8, letterSpacing: .9, fontWeight: 'bold' }, 
  primaryText: { color: colors.white, fontSize: 16, marginTop: 3, fontWeight: 'bold' }, 
  primaryArrow: { color: colors.white, fontSize: 25 }
});
