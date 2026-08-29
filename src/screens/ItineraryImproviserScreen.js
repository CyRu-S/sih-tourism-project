import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, ActivityIndicator, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { itineraries } from '../data/improviserData';
import { colors, fonts } from '../config/theme';

export default function ItineraryImproviserScreen({ navigation }) {
  const [activePreset, setActivePreset] = useState('default'); // 'default', 'budget', 'crowd', 'local'
  const [itinerary, setItinerary] = useState(itineraries.default);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState(null);
  
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handlePresetSelect = (presetKey) => {
    if (presetKey === activePreset) return;
    setLoading(true);
    setExplanation(null);

    // Simulate AI computing/improvising state
    setTimeout(() => {
      // Fade out timeline
      Animated.timing(fadeAnim, { toValue: 0.1, duration: 150, useNativeDriver: true }).start(() => {
        setItinerary(itineraries[presetKey]);
        setActivePreset(presetKey);
        setLoading(false);

        // Set explanation text based on preset
        if (presetKey === 'budget') {
          setExplanation('🌱 AI: Budget adjusted to ₹9,800 (Saved ₹2,200). Private transport shifted to Metro line; premium hotel lunch replaced with village home-cooking (SDG 8).');
        } else if (presetKey === 'crowd') {
          setExplanation('⚡ AI: Shifted Kumartuli Ghat to 6:30 AM & Spice Lane to 8:00 AM. Reduced peak afternoon exposures. Estimated crowd level: LOW.');
        } else if (presetKey === 'local') {
          setExplanation('💎 AI: 2 active community experiences added! Replaced generic sightseeing with hands-on clay modeling (Gopal Pal) and cane weaving classes.');
        } else {
          setExplanation(null);
        }

        // Fade back in
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
      });
    }, 900);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.topRow}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backText}>‹ Back</Text>
            </Pressable>
            <View style={styles.aiBadge}>
              <View style={styles.pulseDot} />
              <Text style={styles.aiBadgeText}>AI TOUR IMPROVISER</Text>
            </View>
          </View>
          <Text style={styles.title}>{itinerary.title}</Text>
          <Text style={styles.subKicker}>
            {itinerary.days} DAYS · {itinerary.style.toUpperCase()} · {itinerary.stopsCount} STOPS
          </Text>
        </View>

        {/* AI Explanations / Banner */}
        {explanation && (
          <View style={styles.explanationBanner}>
            <Text style={styles.explanationText}>{explanation}</Text>
          </View>
        )}

        {/* Loading Overlay */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.forest} />
            <Text style={styles.loadingText}>Improvising your experience trail...</Text>
          </View>
        )}

        {/* Timeline */}
        <Animated.View style={[styles.timelineContainer, { opacity: fadeAnim }]}>
          {itinerary.timeline.map((dayData, dIndex) => (
            <View key={`day-${dayData.day}`} style={styles.dayBlock}>
              <View style={styles.dayHeader}>
                <View style={styles.dayLabel}>
                  <Text style={styles.dayLabelText}>DAY 0{dayData.day}</Text>
                </View>
                <Text style={styles.dayTitle}>{dayData.title}</Text>
              </View>

              {dayData.schedule.map((item, sIndex) => (
                <View key={`sched-${sIndex}`} style={styles.schedItem}>
                  <View style={styles.timeCol}>
                    <Text style={styles.timeText}>{item.time}</Text>
                    <View style={styles.timelineNode} />
                    {sIndex < dayData.schedule.length - 1 && <View style={styles.timelineLine} />}
                  </View>
                  <View style={styles.itemCard}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.itemLocation}>{item.location.toUpperCase()}</Text>
                      <View style={[styles.crowdIndicator, item.crowd === 'LOW' ? styles.crowdLow : styles.crowdMed]}>
                        <Text style={styles.crowdIndicatorText}>CROWD: {item.crowd}</Text>
                      </View>
                    </View>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemDesc}>{item.desc}</Text>
                    <View style={styles.cardFooter}>
                      <Text style={styles.costText}>Est. Cost: {item.cost}</Text>
                      <Text style={styles.responsibleSign}>🌱 Demo community guide</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </Animated.View>

        {/* Journey Snapshot */}
        <View style={styles.snapshotCard}>
          <Text style={styles.sectionLabel}>JOURNEY SNAPSHOT (DEMO ESTIMATES)</Text>
          <View style={styles.snapshotGrid}>
            <View style={styles.snapshotCol}>
              <Text style={styles.snapLabel}>TRIP DURATION</Text>
              <Text style={styles.snapValue}>{itinerary.days} Days</Text>
            </View>
            <View style={styles.snapshotCol}>
              <Text style={styles.snapLabel}>ESTIMATED BUDGET</Text>
              <Text style={styles.snapValue} style={{ color: colors.forest, fontWeight: '900', fontSize: 16 }}>
                ₹{itinerary.cost.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
          <View style={styles.snapshotGrid}>
            <View style={styles.snapshotCol}>
              <Text style={styles.snapLabel}>LESSER-KNOWN STOPS</Text>
              <Text style={styles.snapValue}>{itinerary.stopsCount} Off-beat</Text>
            </View>
            <View style={styles.snapshotCol}>
              <Text style={styles.snapLabel}>LOCAL EXPERIENCES</Text>
              <Text style={styles.snapValue}>{itinerary.experiencesCount} Guided</Text>
            </View>
          </View>
        </View>

        {/* Sustainable/SDG Indicators */}
        <View style={styles.sdgCard}>
          <Text style={styles.sectionLabel}>SUSTAINABLE JOURNEY ALIGNMENT</Text>
          <View style={styles.sdgRow}>
            <View style={styles.sdgBadge}>
              <Text style={styles.sdgNumber}>8</Text>
              <View>
                <Text style={styles.sdgTitle}>Decent Work</Text>
                <Text style={styles.sdgSub}>Local economic participation</Text>
              </View>
            </View>
            <View style={styles.sdgBadge}>
              <Text style={styles.sdgNumber}>11</Text>
              <View>
                <Text style={styles.sdgTitle}>Sustainable Cities</Text>
                <Text style={styles.sdgSub}>Heritage conservation support</Text>
              </View>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Preset Action Panel at the bottom */}
      <View style={styles.actionPanel}>
        <Text style={styles.panelTitle}>✨ Ask AI Companion to improvise trail</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetsScroll}>
          <Pressable 
            onPress={() => handlePresetSelect('budget')} 
            style={[styles.presetBtn, activePreset === 'budget' && styles.presetBtnActive]}
          >
            <Text style={[styles.presetBtnText, activePreset === 'budget' && styles.presetBtnTextActive]}>
              ₹2,000 less budget
            </Text>
          </Pressable>

          <Pressable 
            onPress={() => handlePresetSelect('crowd')} 
            style={[styles.presetBtn, activePreset === 'crowd' && styles.presetBtnActive]}
          >
            <Text style={[styles.presetBtnText, activePreset === 'crowd' && styles.presetBtnTextActive]}>
              Avoid crowds
            </Text>
          </Pressable>

          <Pressable 
            onPress={() => handlePresetSelect('local')} 
            style={[styles.presetBtn, activePreset === 'local' && styles.presetBtnActive]}
          >
            <Text style={[styles.presetBtnText, activePreset === 'local' && styles.presetBtnTextActive]}>
              More local culture
            </Text>
          </Pressable>

          <Pressable 
            onPress={() => handlePresetSelect('default')} 
            style={[styles.presetBtn, activePreset === 'default' && styles.presetBtnActive]}
          >
            <Text style={[styles.presetBtnText, activePreset === 'default' && styles.presetBtnTextActive]}>
              Reset Trail
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 130, // leave space for the preset panel
  },
  header: {
    marginBottom: 20,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  backText: {
    color: colors.forest,
    fontSize: 14,
    fontWeight: 'bold',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.moss,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
  },
  pulseDot: {
    height: 7,
    width: 7,
    borderRadius: 4,
    backgroundColor: colors.coral,
  },
  aiBadgeText: {
    color: colors.forestDark,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  title: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  subKicker: {
    color: colors.muted,
    fontSize: 10,
    letterSpacing: 1.1,
    marginTop: 6,
  },
  explanationBanner: {
    backgroundColor: '#EAF8FF',
    borderWidth: 1,
    borderColor: '#C6EAF9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  explanationText: {
    color: colors.forestDark,
    fontSize: 12,
    lineHeight: 18,
  },
  loadingContainer: {
    position: 'absolute',
    top: 150,
    left: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.ink,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.line,
  },
  loadingText: {
    color: colors.ink,
    fontSize: 13,
    marginTop: 12,
    fontWeight: 'bold',
  },
  timelineContainer: {
    marginBottom: 20,
  },
  dayBlock: {
    marginBottom: 24,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  dayLabel: {
    backgroundColor: colors.forest,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dayLabelText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '900',
  },
  dayTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: 'bold',
  },
  schedItem: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  timeCol: {
    width: 75,
    alignItems: 'flex-end',
    paddingRight: 12,
    position: 'relative',
  },
  timeText: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  timelineNode: {
    position: 'absolute',
    right: -5,
    top: 5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.forest,
    borderWidth: 2,
    borderColor: colors.white,
    zIndex: 2,
  },
  timelineLine: {
    position: 'absolute',
    right: -1,
    top: 10,
    bottom: -25,
    width: 2,
    backgroundColor: colors.line,
    zIndex: 1,
  },
  itemCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.line,
    marginLeft: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemLocation: {
    color: colors.forest,
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  crowdIndicator: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  crowdLow: {
    backgroundColor: '#E2F7EE',
  },
  crowdMed: {
    backgroundColor: '#E3F2FD',
  },
  crowdIndicatorText: {
    fontSize: 7,
    fontWeight: '900',
    color: colors.forestDark,
  },
  itemTitle: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemDesc: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    marginTop: 8,
    paddingTop: 6,
  },
  costText: {
    color: colors.ink,
    fontSize: 9,
    fontWeight: 'bold',
  },
  responsibleSign: {
    color: colors.forestDark,
    fontSize: 8,
    fontWeight: 'bold',
  },
  snapshotCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 16,
  },
  sectionLabel: {
    color: colors.forest,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.1,
    marginBottom: 12,
  },
  snapshotGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  snapshotCol: {
    flex: 1,
  },
  snapLabel: {
    color: colors.muted,
    fontSize: 8,
  },
  snapValue: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 2,
  },
  sdgCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 16,
  },
  sdgRow: {
    flexDirection: 'row',
    gap: 12,
  },
  sdgBadge: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.moss,
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    gap: 8,
  },
  sdgNumber: {
    backgroundColor: colors.forest,
    color: colors.white,
    height: 24,
    width: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 11,
    fontWeight: 'bold',
  },
  sdgTitle: {
    color: colors.ink,
    fontSize: 10,
    fontWeight: 'bold',
  },
  sdgSub: {
    color: colors.muted,
    fontSize: 8,
  },
  actionPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  panelTitle: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  presetsScroll: {
    gap: 8,
  },
  presetBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
  },
  presetBtnActive: {
    backgroundColor: colors.forest,
    borderColor: colors.forest,
  },
  presetBtnText: {
    color: colors.forestDark,
    fontSize: 11,
    fontWeight: 'bold',
  },
  presetBtnTextActive: {
    color: colors.white,
  },
});
