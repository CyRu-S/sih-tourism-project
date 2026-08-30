import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text as NativeText, View } from 'react-native';
import InterestChip from '../components/InterestChip';
import { usePreferences } from '../state/PreferenceContext';
import { colors, fonts } from '../config/theme';

const Text = ({ style, ...props }) => <NativeText {...props} style={[{ fontFamily: fonts.book }, style]} />;

const categories = ['all', 'heritage', 'nature', 'food', 'adventure'];
const interests = ['photography', 'peaceful', 'craft', 'walking', 'street-food'];
const distances = [5, 10, 15, 25];
const crowds = ['LOW', 'MEDIUM', 'ANY'];
const budgets = ['5K', '10K', '15K', '25K+'];
const styles_list = ['relaxed', 'balanced', 'adventure', 'off-beat'];
const groups = ['solo', 'couple', 'family', 'friends'];
const discoveries = ['popular', 'mixed', 'hidden'];

export default function PreferencesScreen({ route, navigation }) {
  const { preferences, setPreferences } = usePreferences();
  const [draft, setDraft] = useState(preferences);

  const toggle = (interest) => 
    setDraft((value) => ({ 
      ...value, 
      interests: value.interests.includes(interest) 
        ? value.interests.filter((item) => item !== interest) 
        : [...value.interests, interest] 
    }));

  const discover = () => { 
    setPreferences(draft); 
    navigation.navigate('Recommendations', { origin: route.params.origin }); 
  };

  const getTravelProfileText = (pref) => {
    const groupLabel = { solo: 'Solo Traveler', couple: 'Couple Traveler', family: 'Family Group', friends: 'Friends Group' }[pref.groupType] || 'Solo Traveler';
    const styleLabel = { relaxed: 'Relaxed Explorer', balanced: 'Balanced Explorer', adventure: 'Adventure Enthusiast', 'off-beat': 'Off-Beat Explorer' }[pref.travelStyle] || 'Off-Beat Explorer';
    const categoryLabel = pref.category === 'all' ? 'Diverse Moods' : (pref.category.charAt(0).toUpperCase() + pref.category.slice(1) + ' Lover');
    const budgetLabel = `₹${pref.budget} Budget`;
    const crowdLabel = { LOW: 'Prefers Quiet Places', MEDIUM: 'Prefers Balanced Venues', ANY: 'No Crowd Preference' }[pref.crowdPreference] || 'Prefers Quiet Places';
    const hiddenLabel = { popular: 'Popular Spot Preference', mixed: 'Balanced Discovery', hidden: 'High Hidden-Gem Preference' }[pref.hiddenPreference] || 'High Hidden-Gem Preference';
    
    return [groupLabel, styleLabel, categoryLabel, budgetLabel, crowdLabel, hiddenLabel];
  };

  const profileSegments = getTravelProfileText(draft);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Intro Block */}
      <View style={styles.intro}>
        <Text style={styles.eyebrow}>TOURIST PROFILING</Text>
        <Text style={styles.title}>Tell us how you travel</Text>
        <Text style={styles.help}>We'll shape the experience around you.</Text>
      </View>

      {/* Category Section */}
      <View style={styles.section}>
        <Text style={styles.label}>What interests you?</Text>
        <Text style={styles.helper}>Start with the kind of place you want to explore.</Text>
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <Pressable 
              key={category} 
              onPress={() => setDraft({ ...draft, category })} 
              style={[styles.categoryOption, draft.category === category && styles.categorySelected]}
            >
              <Text style={[styles.categoryText, draft.category === category && styles.categoryTextSelected]}>
                {category === 'all' ? 'Everything' : category}
              </Text>
              <Text style={[styles.categoryMark, draft.category === category && styles.categoryMarkSelected]}>
                {draft.category === category ? '✓' : '○'}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Interests Chips */}
      <View style={styles.section}>
        <Text style={styles.label}>Fine-tune your mood</Text>
        <Text style={styles.helper}>Add specific tags to align recommendations.</Text>
        <View style={styles.chips}>
          {interests.map((interest) => (
            <InterestChip 
              key={interest} 
              label={interest} 
              selected={draft.interests.includes(interest)} 
              onPress={() => toggle(interest)} 
            />
          ))}
        </View>
      </View>

      {/* Distance Section */}
      <View style={styles.section}>
        <Text style={styles.label}>How far feels right?</Text>
        <View style={styles.options}>
          {distances.map((distance) => (
            <Pressable 
              key={distance} 
              onPress={() => setDraft({ ...draft, maxDistanceKm: distance })} 
              style={[styles.option, draft.maxDistanceKm === distance && styles.optionSelected]}
            >
              <Text style={[styles.optionText, draft.maxDistanceKm === distance && styles.optionTextSelected]}>
                {distance} km
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Travel Style Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Your travel style</Text>
        <View style={styles.options}>
          {styles_list.map((s) => (
            <Pressable 
              key={s} 
              onPress={() => setDraft({ ...draft, travelStyle: s })} 
              style={[styles.option, draft.travelStyle === s && styles.optionSelected]}
            >
              <Text style={[styles.optionText, draft.travelStyle === s && styles.optionTextSelected, { textTransform: 'capitalize' }]}>
                {s}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Budget Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Your budget</Text>
        <View style={styles.options}>
          {budgets.map((b) => (
            <Pressable 
              key={b} 
              onPress={() => setDraft({ ...draft, budget: b })} 
              style={[styles.option, draft.budget === b && styles.optionSelected]}
            >
              <Text style={[styles.optionText, draft.budget === b && styles.optionTextSelected]}>
                ₹{b}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Group Type Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Who are you travelling with?</Text>
        <View style={styles.options}>
          {groups.map((g) => (
            <Pressable 
              key={g} 
              onPress={() => setDraft({ ...draft, groupType: g })} 
              style={[styles.option, draft.groupType === g && styles.optionSelected]}
            >
              <Text style={[styles.optionText, draft.groupType === g && styles.optionTextSelected, { textTransform: 'capitalize' }]}>
                {g}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Discovery Preference */}
      <View style={styles.section}>
        <Text style={styles.label}>What do you want to discover?</Text>
        <Text style={styles.helper}>Discovery preference mapping</Text>
        <View style={styles.options}>
          {discoveries.map((d) => (
            <Pressable 
              key={d} 
              onPress={() => setDraft({ ...draft, hiddenPreference: d })} 
              style={[styles.option, draft.hiddenPreference === d && styles.optionSelected]}
            >
              <Text style={[styles.optionText, draft.hiddenPreference === d && styles.optionTextSelected, { textTransform: 'capitalize' }]}>
                {d === 'hidden' ? 'Hidden Gems' : d === 'popular' ? 'Popular' : 'Balanced'}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.sliderLineContainer}>
          <Text style={styles.sliderLabel}>Popular</Text>
          <View style={styles.sliderLine}>
            <View style={[
              styles.sliderThumb, 
              draft.hiddenPreference === 'popular' && { left: '10%' },
              draft.hiddenPreference === 'mixed' && { left: '50%' },
              draft.hiddenPreference === 'hidden' && { left: '90%' },
            ]} />
          </View>
          <Text style={styles.sliderLabel}>Hidden Gems</Text>
        </View>
      </View>

      {/* Crowd Preference Section */}
      <View style={styles.section}>
        <Text style={styles.label}>How do you feel about crowds?</Text>
        <View style={styles.options}>
          {crowds.map((crowd) => (
            <Pressable 
              key={crowd} 
              onPress={() => setDraft({ ...draft, crowdPreference: crowd })} 
              style={[styles.option, draft.crowdPreference === crowd && styles.optionSelected]}
            >
              <Text style={[styles.optionText, draft.crowdPreference === crowd && styles.optionTextSelected]}>
                {crowd === 'LOW' ? 'Prefer Quiet' : crowd === 'MEDIUM' ? 'Balanced' : "Don't Mind"}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Travel Profile Banner */}
      <View style={styles.profileCard}>
        <Text style={styles.profileHeading}>Your Travel Profile</Text>
        <View style={styles.profileSegments}>
          {profileSegments.map((segment, idx) => (
            <View key={idx} style={styles.segmentBadge}>
              <Text style={styles.segmentText}>{segment}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.profileIndicatorText}>Prototype Profiling Verified</Text>
      </View>

      {/* Primary Fetch CTA */}
      <Pressable 
        style={({ pressed }) => [styles.primary, pressed && styles.primaryPressed]} 
        onPress={discover}
      >
        <View>
          <Text style={styles.primaryHint}>READY TO SEARCH</Text>
          <Text style={styles.primaryText}>Fetch matching places</Text>
        </View>
        <Text style={styles.primaryArrow}>→</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.canvas }, 
  content: { padding: 20, paddingBottom: 38 }, 
  intro: { backgroundColor: 'rgba(255,255,255,.72)', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,.94)' }, 
  eyebrow: { color: colors.forest, fontSize: 11, letterSpacing: 1.2, fontWeight: 'bold' }, 
  title: { fontSize: 29, lineHeight: 37, letterSpacing: -.55, color: colors.ink, marginTop: 8, fontWeight: 'bold' }, 
  help: { color: colors.muted, fontSize: 14, lineHeight: 22, marginTop: 10 },
  section: { marginTop: 27 }, 
  label: { color: colors.ink, fontSize: 17, lineHeight: 23, fontWeight: 'bold' }, 
  helper: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 3, marginBottom: 11 }, 
  categoryGrid: { gap: 9 }, 
  categoryOption: { minHeight: 51, borderWidth: 1, borderColor: colors.line, backgroundColor: 'rgba(255,255,255,.72)', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, borderRadius: 15 }, 
  categorySelected: { backgroundColor: colors.forest, borderColor: colors.forest }, 
  categoryText: { color: colors.ink, fontSize: 14, textTransform: 'capitalize' }, 
  categoryTextSelected: { color: colors.white }, 
  categoryMark: { color: colors.muted, fontSize: 16 }, 
  categoryMarkSelected: { color: colors.white },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 }, 
  options: { flexDirection: 'row', gap: 8 }, 
  option: { flex: 1, minHeight: 48, borderWidth: 1, borderColor: colors.line, backgroundColor: 'rgba(255,255,255,.72)', alignItems: 'center', justifyContent: 'center', borderRadius: 14 }, 
  optionSelected: { backgroundColor: colors.forest, borderColor: colors.forest }, 
  optionText: { color: colors.forestDark, fontSize: 11, textAlign: 'center' }, 
  optionTextSelected: { color: colors.white },
  
  sliderLineContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  sliderLabel: { fontSize: 10, color: colors.muted, fontWeight: 'bold' },
  sliderLine: { flex: 1, height: 4, backgroundColor: 'rgba(45,156,219,.2)', borderRadius: 2, position: 'relative' },
  sliderThumb: { position: 'absolute', top: -5, height: 14, width: 14, borderRadius: 7, backgroundColor: colors.forest, marginLeft: -7 },

  profileCard: { marginTop: 30, padding: 16, backgroundColor: 'rgba(255,255,255,.94)', borderWidth: 1, borderColor: colors.line, borderRadius: 20, shadowColor: '#91CDE9', shadowOpacity: .1, shadowRadius: 10, elevation: 2 },
  profileHeading: { color: '#234A65', fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
  profileSegments: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  segmentBadge: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: colors.moss, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,.8)' },
  segmentText: { color: colors.forestDark, fontSize: 10, fontWeight: 'bold' },
  profileIndicatorText: { fontSize: 8, color: colors.muted, marginTop: 10, alignSelf: 'flex-end', letterSpacing: 0.8, fontWeight: 'bold' },

  primary: { backgroundColor: colors.forest, minHeight: 62, paddingHorizontal: 18, borderRadius: 18, marginTop: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#74C9EC', shadowOpacity: .25, shadowRadius: 15, shadowOffset: { width: 0, height: 8 }, elevation: 3 }, 
  primaryPressed: { opacity: .84, transform: [{ scale: .985 }] }, 
  primaryHint: { color: 'rgba(255,255,255,.72)', fontSize: 8, letterSpacing: 1 }, 
  primaryText: { color: colors.white, fontSize: 17, marginTop: 3, fontWeight: 'bold' }, 
  primaryArrow: { color: colors.white, fontSize: 25 }
});
