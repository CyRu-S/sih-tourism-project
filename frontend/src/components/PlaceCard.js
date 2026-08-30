import React from 'react';
import { Image, Pressable, StyleSheet, Text as NativeText, View } from 'react-native';
import CrowdBadge from './CrowdBadge';
import { usePreferences } from '../state/PreferenceContext';
import { colors, fonts } from '../config/theme';

const Text = ({ style, ...props }) => <NativeText {...props} style={[{ fontFamily: fonts.book }, style]} />;

export default function PlaceCard({ place, rank, onPress }) {
  const { preferences } = usePreferences();
  
  const isHiddenGem = place.scoreBreakdown?.hiddenness > 0.8 || place.hiddenScore > 80;
  
  // Custom travel style and group text mapping
  const styleText = preferences.travelStyle || 'off-beat';
  const groupText = preferences.groupType || 'solo';
  const crowdText = preferences.crowdPreference === 'LOW' ? 'quieter' : 'balanced';
  const categoryText = preferences.category === 'all' ? 'heritage' : preferences.category;
  
  const matchReason = `Matches your preference for ${styleText} ${categoryText} experiences and ${crowdText} places as a ${groupText} traveler.`;

  // Check if this is the primary demo destination (Kumartuli River Ghat - ID 201 or similar)
  const isPrimaryDemo = place.placeId === 201 || place.id === 201;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.place, pressed && styles.pressed]}>
      {/* Cover Image & Meta */}
      <View style={styles.imageWrap}>
        {place.photo && <Image source={{ uri: place.photo.url }} style={styles.image} />}
        <View style={styles.imageWash} />
        <Text style={styles.rank}>0{rank}</Text>
        <View style={styles.imageMeta}>
          <Text style={styles.category}>{place.category}</Text>
          <Text style={styles.score}>{place.score || 94}% MATCH</Text>
        </View>
        
        {isHiddenGem && (
          <View style={styles.hiddenBadge}>
            <Text style={styles.hiddenBadgeText}>💎 HIDDEN GEM</Text>
          </View>
        )}
      </View>

      {/* Card Details */}
      <View style={styles.body}>
        <Text style={styles.name}>{place.name}</Text>
        
        {/* Why this place? Rationale Card */}
        <View style={styles.rationaleBox}>
          <Text style={styles.rationaleLabel}>Why this place?</Text>
          <Text style={styles.rationaleText}>{matchReason}</Text>
        </View>

        {/* What you'll experience Section */}
        <View style={styles.experienceSection}>
          <Text style={styles.sectionLabel}>What you'll experience</Text>
          <View style={styles.experienceList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletText}>📖 Local history & traditions</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletText}>🚶 Heritage walking paths</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletText}>🎨 Artisan cultural exchange</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletText}>🍲 Authentic regional food</Text>
            </View>
          </View>
        </View>

        {/* Why not the popular option? Comparison Box */}
        {isPrimaryDemo && (
          <View style={styles.comparisonBox}>
            <Text style={styles.comparisonHeading}>Why not the popular option?</Text>
            <View style={styles.comparisonRow}>
              <View style={styles.comparisonCol}>
                <Text style={styles.compName}>Howrah Bridge Route</Text>
                <Text style={styles.compCrowdHigh}>🔴 High Crowd</Text>
              </View>
              <Text style={styles.compArrow}>➔</Text>
              <View style={styles.comparisonCol}>
                <Text style={styles.compName}>Your Discovery</Text>
                <Text style={styles.compCrowdLow}>💎 🟢 Lower Crowd</Text>
              </View>
            </View>
          </View>
        )}

        {/* Footer & Sustainability Indicator */}
        <View style={styles.footer}>
          <View style={styles.indicator}>
            <Text style={styles.indicatorText}>🌱 Local experience available</Text>
          </View>
          <Text style={styles.distance}>{place.distanceKm || 5.8} KM AWAY</Text>
        </View>
        <View style={styles.footerRow}>
          <CrowdBadge crowd={place.estimatedCrowd || { level: 'LOW' }} />
          <Text style={styles.tapPrompt}>TAP TO EXPLORE ›</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  place: {
    marginHorizontal: 16,
    marginBottom: 18,
    backgroundColor: 'rgba(255,255,255,.94)',
    overflow: 'hidden',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: '#70C6E9',
    shadowOpacity: .14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 7 },
    elevation: 3
  },
  pressed: {
    opacity: .88,
    transform: [{ scale: .985 }]
  },
  imageWrap: {
    height: 160,
    backgroundColor: colors.forestDark,
    position: 'relative'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  imageWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3,20,46,.15)'
  },
  rank: {
    position: 'absolute',
    top: 13,
    left: 14,
    color: colors.white,
    fontWeight: '900',
    fontSize: 21,
    letterSpacing: -.6,
    textShadowColor: 'rgba(0,0,0,.45)',
    textShadowRadius: 8
  },
  imageMeta: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  category: {
    color: colors.white,
    textTransform: 'uppercase',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2
  },
  score: {
    color: colors.white,
    fontSize: 10,
    letterSpacing: .7,
    fontWeight: '900'
  },
  hiddenBadge: {
    position: 'absolute',
    top: 13,
    right: 14,
    backgroundColor: 'rgba(6,27,58,0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.sky,
  },
  hiddenBadgeText: {
    color: colors.sky,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 14
  },
  name: {
    fontSize: 22,
    lineHeight: 28,
    color: colors.ink,
    letterSpacing: -.6,
    fontWeight: 'bold'
  },
  rationaleBox: {
    backgroundColor: colors.moss,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.forest,
  },
  rationaleLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.forestDark,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4
  },
  rationaleText: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.ink,
    fontWeight: '600'
  },
  experienceSection: {
    marginTop: 14,
    backgroundColor: 'rgba(255,255,255,.5)',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    padding: 10,
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.muted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6
  },
  experienceList: {
    gap: 4
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  bulletText: {
    fontSize: 11,
    color: colors.ink,
    fontWeight: '500'
  },
  comparisonBox: {
    marginTop: 14,
    backgroundColor: '#FFF8F8',
    borderWidth: 1,
    borderColor: '#FFE3E3',
    borderRadius: 12,
    padding: 10,
  },
  comparisonHeading: {
    fontSize: 9,
    fontWeight: '900',
    color: '#C53030',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  comparisonCol: {
    flex: 1
  },
  compName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.ink
  },
  compCrowdHigh: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#E53E3E',
    marginTop: 2
  },
  compCrowdLow: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#38A169',
    marginTop: 2
  },
  compArrow: {
    fontSize: 14,
    color: colors.muted,
    marginHorizontal: 8
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    paddingTop: 10
  },
  indicator: {
    backgroundColor: '#E2F7EE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  indicatorText: {
    color: '#1D8357',
    fontSize: 9,
    fontWeight: 'bold'
  },
  distance: {
    fontSize: 9,
    color: colors.muted,
    letterSpacing: .65,
    fontWeight: 'bold'
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8
  },
  tapPrompt: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.forest
  }
});
