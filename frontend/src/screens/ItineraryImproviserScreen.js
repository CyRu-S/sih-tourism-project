import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text as NativeText, StyleSheet, Pressable, ActivityIndicator, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { itineraries } from '../data/improviserData';
import { colors, fonts } from '../config/theme';

const Text = ({ style, ...props }) => <NativeText {...props} style={[{ fontFamily: fonts.book }, style]} />;

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
          setExplanation('⚡ AI: Adjusted using demo crowd estimates. Shifted Kumartuli Ghat to 6:30 AM (LOW crowd) & Spice Lane to 8:00 AM (LOW crowd). Reduced peak afternoon exposures.');
        } else if (presetKey === 'local') {
          setExplanation('💎 AI: 2 active community experiences added! Replaced generic sightseeing with hands-on clay modeling (Gopal Pal) and cane weaving classes.');
        } else {
          setExplanation(null);
        }

        // Fade back in
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
      });
    }, 1200);
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
              <Text style={styles.aiBadgeText}>EXPERIENCE IMPROVISER</Text>
            </View>
          </View>
          <Text style={styles.title}>Your Experience</Text>
          <Text style={styles.subKicker}>
            A journey designed around you — and ready to adapt.
          </Text>
        </View>

        {/* Journey Summary Stats */}
        <View style={styles.summaryStatsCard}>
          <View style={styles.statGrid}>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>{itinerary.days} DAYS</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>₹{itinerary.cost.toLocaleString('en-IN')}</Text>
              <Text style={styles.statLabel}>Demo Estimate</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>{itinerary.stopsCount} HIDDEN STOPS</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>{itinerary.experiencesCount} LOCAL EXPS</Text>
            </View>
          </View>
          <View style={styles.profileMetaRow}>
            <Text style={styles.profileMetaLabel}>Designed for:</Text>
            <Text style={styles.profileMetaValue}>Solo • Off-beat • Heritage • Quiet</Text>
          </View>
        </View>

        {/* AI Thinking Loader Banner */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.forest} />
            <View style={styles.loadingTextContainer}>
              <Text style={styles.loadingHeading}>✨ Improving your experience...</Text>
              <Text style={styles.loadingSub}>✓ Checking preferences</Text>
              <Text style={styles.loadingSub}>✓ Finding better alternatives</Text>
              <Text style={styles.loadingSub}>✓ Rebuilding your journey</Text>
            </View>
          </View>
        )}

        {/* Before / After Comparison Showcase */}
        {activePreset !== 'default' && !loading && (
          <View style={styles.comparisonBox}>
            <Text style={styles.comparisonTitle}>AI IMPROVISATION RESULTS</Text>
            <View style={styles.comparisonRow}>
              {activePreset === 'crowd' && (
                <React.Fragment>
                  <View style={styles.comparisonItem}>
                    <Text style={styles.compTime}>2:00 PM</Text>
                    <Text style={{ color: '#E53E3E', fontSize: 10, fontWeight: 'bold' }}>🔴 HIGH CROWD</Text>
                  </View>
                  <Text style={styles.compArrow}>➔</Text>
                  <View style={styles.comparisonItem}>
                    <Text style={styles.compTime}>6:30 AM</Text>
                    <Text style={{ color: '#38A169', fontSize: 10, fontWeight: 'bold' }}>🟢 LOW CROWD</Text>
                  </View>
                </React.Fragment>
              )}
              {activePreset === 'budget' && (
                <React.Fragment>
                  <View style={styles.comparisonItem}>
                    <Text style={styles.compTime}>Private Taxi</Text>
                    <Text style={{ color: '#E53E3E', fontSize: 10, fontWeight: 'bold' }}>₹1,800 Cost</Text>
                  </View>
                  <Text style={styles.compArrow}>➔</Text>
                  <View style={styles.comparisonItem}>
                    <Text style={styles.compTime}>Scenic Train / Metro</Text>
                    <Text style={{ color: '#38A169', fontSize: 10, fontWeight: 'bold' }}>₹100 Cost</Text>
                  </View>
                </React.Fragment>
              )}
              {activePreset === 'local' && (
                <React.Fragment>
                  <View style={styles.comparisonItem}>
                    <Text style={styles.compTime}>Sightseeing Tour</Text>
                    <Text style={{ color: '#708FA2', fontSize: 10, fontWeight: 'bold' }}>Passive Visit</Text>
                  </View>
                  <Text style={styles.compArrow}>➔</Text>
                  <View style={styles.comparisonItem}>
                    <Text style={styles.compTime}>Gopal Pal Pottery</Text>
                    <Text style={{ color: '#38A169', fontSize: 10, fontWeight: 'bold' }}>🎨 Hands-on Craft</Text>
                  </View>
                </React.Fragment>
              )}
            </View>

            {/* Experience Updated Checklist */}
            <View style={styles.updatesChecklist}>
              <Text style={styles.checklistHeading}>Experience Updated</Text>
              {activePreset === 'crowd' && (
                <React.Fragment>
                  <Text style={styles.checklistText}>✓ Earlier heritage visits scheduled</Text>
                  <Text style={styles.checklistText}>✓ Quieter morning times selected</Text>
                  <Text style={styles.checklistText}>✓ Peak afternoon crowd exposure avoided</Text>
                </React.Fragment>
              )}
              {activePreset === 'budget' && (
                <React.Fragment>
                  <Text style={styles.checklistText}>✓ Local public transport preferred</Text>
                  <Text style={styles.checklistText}>✓ Village home-cook lunch substituted</Text>
                  <Text style={styles.checklistText}>✓ Overall trip budget reduced by ₹2,200</Text>
                </React.Fragment>
              )}
              {activePreset === 'local' && (
                <React.Fragment>
                  <Text style={styles.checklistText}>✓ Clay studio pottery workshop added</Text>
                  <Text style={styles.checklistText}>✓ Traditional cane weaving class added</Text>
                  <Text style={styles.checklistText}>✓ 100% direct spending to local artisans</Text>
                </React.Fragment>
              )}
            </View>
          </View>
        )}

        {/* Itinerary Timeline */}
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
                        <Text style={styles.crowdIndicatorText}>🟢 {item.crowd} CROWD</Text>
                      </View>
                    </View>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    
                    {/* Why it's here */}
                    <Text style={styles.whyItsHereText}>
                      💡 Why it's here: Chosen because you prefer quieter heritage experiences.
                    </Text>

                    <Text style={styles.itemDesc}>{item.desc}</Text>
                    <View style={styles.cardFooter}>
                      <Text style={styles.costText}>Cost: {item.cost}</Text>
                      <Text style={styles.responsibleSign}>🌱 Demo community guide</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </Animated.View>

        {/* Local Community Section */}
        <View style={styles.communityCard}>
          <Text style={styles.sectionLabel}>YOUR JOURNEY SUPPORTS LOCAL EXPERIENCES</Text>
          <View style={styles.localGrid}>
            <View style={styles.localItem}>
              <Text style={styles.localIcon}>🎨</Text>
              <Text style={styles.localLabel}>Artisan Workshop</Text>
            </View>
            <View style={styles.localItem}>
              <Text style={styles.localIcon}>🍲</Text>
              <Text style={styles.localLabel}>Local Food</Text>
            </View>
            <View style={styles.localItem}>
              <Text style={styles.localIcon}>🧑🏫</Text>
              <Text style={styles.localLabel}>Community Guide</Text>
            </View>
            <View style={styles.localItem}>
              <Text style={styles.localIcon}>🏠</Text>
              <Text style={styles.localLabel}>Local Stay</Text>
            </View>
          </View>
          <Text style={styles.demoBannerText}>Demo community connections</Text>
        </View>

        {/* Sustainable/SDG Indicators */}
        <View style={styles.sdgCard}>
          <Text style={styles.sectionLabel}>WHY THIS APPROACH MATTERS (SDG ALIGNMENT)</Text>
          <View style={styles.sdgBadge}>
            <Text style={styles.sdgNumber}>8</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.sdgTitle}>SDG 8 — Decent Work & Economic Growth</Text>
              <Text style={styles.sdgSub}>Encourages visitor spending and experiences connected with local communities.</Text>
            </View>
          </View>
          <View style={styles.sdgBadge}>
            <Text style={styles.sdgNumber}>11</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.sdgTitle}>SDG 11 — Sustainable Cities & Communities</Text>
              <Text style={styles.sdgSub}>Encourages discovery of local heritage and more balanced tourism.</Text>
            </View>
          </View>
          <View style={styles.sdgBadge}>
            <Text style={styles.sdgNumber}>12</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.sdgTitle}>SDG 12 — Responsible Consumption</Text>
              <Text style={styles.sdgSub}>Promotes responsible travel choices.</Text>
            </View>
          </View>
        </View>

        {/* Journey Impact Card */}
        <View style={styles.snapshotCard}>
          <Text style={styles.sectionLabel}>YOUR JOURNEY</Text>
          <View style={styles.snapGrid}>
            <Text style={styles.snapText}>💎 4 Lesser-Known Stops</Text>
            <Text style={styles.snapText}>🎨 2 Local Experiences</Text>
            <Text style={styles.snapText}>🟢 2 Peak Crowd Periods Avoided</Text>
            <Text style={styles.snapText}>🏛 3 Heritage Experiences</Text>
          </View>
          <Text style={styles.demoBannerText}>Prototype Journey Indicators</Text>
        </View>

        {/* Why This Journey is Different */}
        <View style={styles.diffCard}>
          <Text style={styles.sectionLabel}>NOT JUST A TRIP.</Text>
          <View style={styles.diffGrid}>
            <View style={styles.diffCol}>
              <Text style={styles.diffTitle}>Traditional Travel App</Text>
              <Text style={styles.diffNode}>Place</Text>
              <Text style={styles.diffArrow}>↓</Text>
              <Text style={styles.diffNode}>Visit</Text>
              <Text style={styles.diffArrow}>↓</Text>
              <Text style={styles.diffNode}>Leave</Text>
            </View>
            
            <View style={styles.diffCol}>
              <Text style={[styles.diffTitle, { color: colors.forest }]}>Our Approach</Text>
              <Text style={[styles.diffNode, styles.diffActive]}>Understand</Text>
              <Text style={styles.diffArrow}>↓</Text>
              <Text style={[styles.diffNode, styles.diffActive]}>Discover</Text>
              <Text style={styles.diffArrow}>↓</Text>
              <Text style={[styles.diffNode, styles.diffActive]}>Experience</Text>
              <Text style={styles.diffArrow}>↓</Text>
              <Text style={[styles.diffNode, styles.diffActive]}>Adapt</Text>
              <Text style={styles.diffArrow}>↓</Text>
              <Text style={[styles.diffNode, styles.diffActive]}>Connect</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Preset Action Panel at the bottom */}
      <View style={styles.actionPanel}>
        <Text style={styles.panelTitle}>✨ Improve your experience: Tell us what changed</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetsScroll}>
          <Pressable 
            onPress={() => handlePresetSelect('budget')} 
            style={[styles.presetBtn, activePreset === 'budget' && styles.presetBtnActive]}
          >
            <Text style={[styles.presetBtnText, activePreset === 'budget' && styles.presetBtnTextActive]}>
              ₹2,000 Less
            </Text>
          </Pressable>

          <Pressable 
            onPress={() => handlePresetSelect('crowd')} 
            style={[styles.presetBtn, activePreset === 'crowd' && styles.presetBtnActive]}
          >
            <Text style={[styles.presetBtnText, activePreset === 'crowd' && styles.presetBtnTextActive]}>
              Avoid Crowds
            </Text>
          </Pressable>

          <Pressable 
            onPress={() => handlePresetSelect('local')} 
            style={[styles.presetBtn, activePreset === 'local' && styles.presetBtnActive]}
          >
            <Text style={[styles.presetBtnText, activePreset === 'local' && styles.presetBtnTextActive]}>
              More Culture
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
  container: { flex: 1, backgroundColor: colors.canvas },
  scrollContent: { padding: 20, paddingBottom: 140 },
  header: { marginBottom: 20, backgroundColor: colors.surface, padding: 16, borderRadius: 20, borderWidth: 1, borderColor: colors.line },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  backButton: { paddingVertical: 4, paddingHorizontal: 8 },
  backText: { color: colors.forest, fontSize: 14, fontWeight: 'bold' },
  aiBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.moss, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, gap: 6 },
  pulseDot: { height: 7, width: 7, borderRadius: 4, backgroundColor: colors.coral },
  aiBadgeText: { color: colors.forestDark, fontSize: 9, fontWeight: 'bold', letterSpacing: 0.8 },
  title: { color: colors.ink, fontSize: 24, fontWeight: 'bold', lineHeight: 30 },
  subKicker: { color: colors.muted, fontSize: 11, marginTop: 6 },
  
  summaryStatsCard: { backgroundColor: 'rgba(255,255,255,.9)', borderWidth: 1, borderColor: colors.line, borderRadius: 18, padding: 14, marginBottom: 16 },
  statGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  statCol: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 12, fontWeight: '900', color: colors.ink },
  statLabel: { fontSize: 8, color: colors.muted, marginTop: 2 },
  profileMetaRow: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line, paddingTop: 8, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  profileMetaLabel: { fontSize: 9, color: colors.muted, fontWeight: 'bold' },
  profileMetaValue: { fontSize: 9, color: colors.forestDark, fontWeight: 'bold' },

  loadingContainer: { backgroundColor: 'rgba(255, 255, 255, 0.96)', padding: 18, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderVertical: 1, borderColor: colors.line, marginBottom: 16, flexDirection: 'row', gap: 14 },
  loadingTextContainer: { flex: 1 },
  loadingHeading: { color: colors.ink, fontSize: 12, fontWeight: 'bold' },
  loadingSub: { color: colors.muted, fontSize: 10, marginTop: 2 },

  comparisonBox: { backgroundColor: '#F0F9FF', borderWidth: 1, borderColor: '#CBE7FF', borderRadius: 18, padding: 14, marginBottom: 16 },
  comparisonTitle: { fontSize: 9, fontWeight: '900', color: colors.forest, letterSpacing: 0.8, marginBottom: 10 },
  comparisonRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 15, marginBottom: 12 },
  comparisonItem: { alignItems: 'center' },
  compTime: { fontSize: 13, fontWeight: 'bold', color: colors.ink },
  compArrow: { fontSize: 16, color: colors.muted },
  updatesChecklist: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#CBE7FF', paddingTop: 10 },
  checklistHeading: { fontSize: 11, fontWeight: 'bold', color: colors.ink, marginBottom: 6 },
  checklistText: { fontSize: 11, color: colors.forestDark, lineHeight: 17, marginBottom: 2 },

  timelineContainer: { marginBottom: 20 },
  dayBlock: { marginBottom: 24 },
  dayHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  dayLabel: { backgroundColor: colors.forest, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  dayLabelText: { color: colors.white, fontSize: 10, fontWeight: '900' },
  dayTitle: { color: colors.ink, fontSize: 16, fontWeight: 'bold' },
  schedItem: { flexDirection: 'row', marginBottom: 14 },
  timeCol: { width: 75, alignItems: 'flex-end', paddingRight: 12, position: 'relative' },
  timeText: { color: colors.muted, fontSize: 10, fontWeight: 'bold', marginTop: 2 },
  timelineNode: { position: 'absolute', right: -5, top: 5, width: 10, height: 10, borderRadius: 5, backgroundColor: colors.forest, borderWidth: 2, borderColor: colors.white, zIndex: 2 },
  timelineLine: { position: 'absolute', right: -1, top: 10, bottom: -25, width: 2, backgroundColor: colors.line, zIndex: 1 },
  itemCard: { flex: 1, backgroundColor: colors.surface, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: colors.line, marginLeft: 6 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  itemLocation: { color: colors.forest, fontSize: 8, fontWeight: 'bold', letterSpacing: 0.8 },
  crowdIndicator: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  crowdLow: { backgroundColor: '#E2F7EE' },
  crowdMed: { backgroundColor: '#E3F2FD' },
  crowdIndicatorText: { fontSize: 7, fontWeight: '900', color: colors.forestDark },
  itemTitle: { color: colors.ink, fontSize: 14, fontWeight: 'bold' },
  whyItsHereText: { fontSize: 10, color: colors.forestDark, fontWeight: 'bold', marginTop: 4 },
  itemDesc: { color: colors.muted, fontSize: 11, lineHeight: 16, marginTop: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line, marginTop: 8, paddingTop: 6 },
  costText: { color: colors.ink, fontSize: 9, fontWeight: 'bold' },
  responsibleSign: { color: colors.forestDark, fontSize: 8, fontWeight: 'bold' },

  communityCard: { backgroundColor: colors.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.line, marginBottom: 16 },
  localGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  localItem: { flex: 1, alignItems: 'center', backgroundColor: colors.canvas, borderWidth: 1, borderColor: colors.line, borderRadius: 12, paddingVertical: 10 },
  localIcon: { fontSize: 18 },
  localLabel: { fontSize: 8, fontWeight: 'bold', color: colors.ink, marginTop: 4 },
  demoBannerText: { fontSize: 8, color: colors.muted, alignSelf: 'flex-end', letterSpacing: 0.8, fontWeight: 'bold', marginTop: 12 },

  sdgCard: { backgroundColor: colors.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.line, marginBottom: 16, gap: 10 },
  sdgBadge: { flexDirection: 'row', backgroundColor: colors.moss, borderRadius: 10, padding: 8, alignItems: 'center', gap: 8 },
  sdgNumber: { backgroundColor: colors.forest, color: colors.white, height: 24, width: 24, borderRadius: 12, textAlign: 'center', lineHeight: 24, fontSize: 11, fontWeight: 'bold' },
  sdgTitle: { color: colors.ink, fontSize: 10, fontWeight: 'bold' },
  sdgSub: { color: colors.muted, fontSize: 8, marginTop: 2, lineHeight: 11 },

  snapshotCard: { backgroundColor: colors.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.line, marginBottom: 16 },
  snapGrid: { gap: 6, marginVertical: 8 },
  snapText: { fontSize: 12, fontWeight: 'bold', color: colors.ink },

  diffCard: { backgroundColor: colors.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.line, marginBottom: 16 },
  diffGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  diffCol: { flex: 1, alignItems: 'center' },
  diffTitle: { fontSize: 11, fontWeight: 'bold', color: colors.muted, marginBottom: 10 },
  diffNode: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: colors.canvas, borderWidth: 1, borderColor: colors.line, borderRadius: 8, fontSize: 10, fontWeight: 'bold', color: colors.ink },
  diffActive: { backgroundColor: colors.moss, borderColor: colors.forest, color: colors.forestDark },
  diffArrow: { color: colors.muted, fontSize: 12, marginVertical: 3 },

  actionPanel: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(255, 255, 255, 0.96)', borderTopWidth: 1, borderTopColor: colors.line, paddingVertical: 14, paddingHorizontal: 16 },
  panelTitle: { color: colors.ink, fontSize: 12, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  presetsScroll: { gap: 8 },
  presetBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: colors.canvas, borderWidth: 1, borderColor: colors.line },
  presetBtnActive: { backgroundColor: colors.forest, borderColor: colors.forest },
  presetBtnText: { color: colors.forestDark, fontSize: 11, fontWeight: 'bold' },
  presetBtnTextActive: { color: colors.white },
});
