import React from 'react';
import { Image, Pressable, StyleSheet, Text as NativeText, View } from 'react-native';
import CrowdBadge from './CrowdBadge';
import { usePreferences } from '../state/PreferenceContext';
import { colors, fonts } from '../config/theme';

const Text = ({ style, ...props }) => <NativeText {...props} style={[{ fontFamily: fonts.book }, style]} />;

export default function PlaceCard({ place, rank, onPress }) {
  const { preferences } = usePreferences();
  
  const isHiddenGem = place.scoreBreakdown?.hiddenness > 0.8;
  const styleText = preferences.travelStyle || 'off-beat';
  const groupText = preferences.groupType || 'solo';
  const crowdText = preferences.crowdPreference === 'LOW' ? 'peaceful' : 'active';
  
  // Custom generated recommendation reason
  const matchReason = `Matches your preference for ${styleText} trails as a ${groupText} traveler, seeking ${crowdText} spots.`;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.place, pressed && styles.pressed]}>
      {/* Cover Image & Meta */}
      <View style={styles.imageWrap}>
        {place.photo && <Image source={{ uri: place.photo.url }} style={styles.image} />}
        <View style={styles.imageWash} />
        <Text style={styles.rank}>0{rank}</Text>
        <View style={styles.imageMeta}>
          <Text style={styles.category}>{place.category}</Text>
          <Text style={styles.score}>{place.score}% MATCH</Text>
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
        
        {/* Recommendation Rationale */}
        <View style={styles.rationaleBox}>
          <Text style={styles.rationaleText}>💡 {matchReason}</Text>
        </View>

        <Text style={styles.why} numberOfLines={2}>{place.why}</Text>
        
        {/* Experience Primitives */}
        <View style={styles.experienceRow}>
          <Text style={styles.experienceLabel}>EXPERIENCE: </Text>
          <Text style={styles.experienceTags}>
            {place.tags ? place.tags.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(' • ') : 'Local Story'}
          </Text>
        </View>

        {/* Footer & Sustainability indicator */}
        <View style={styles.footer}>
          <View style={styles.indicator}>
            <Text style={styles.indicatorText}>🌱 Local experience available</Text>
          </View>
          <Text style={styles.distance}>{place.distanceKm} KM AWAY</Text>
        </View>
        <View style={styles.footerRow}>
          <CrowdBadge crowd={place.estimatedCrowd} />
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
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.forest,
  },
  rationaleText: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.forestDark,
    fontWeight: '600'
  },
  why: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
    marginTop: 8
  },
  experienceRow: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center'
  },
  experienceLabel: {
    fontSize: 8,
    color: colors.forest,
    fontWeight: '900',
    letterSpacing: 0.8
  },
  experienceTags: {
    fontSize: 11,
    color: colors.ink,
    fontWeight: '500'
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
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
