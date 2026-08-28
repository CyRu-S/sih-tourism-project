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

export default function PreferencesScreen({ route, navigation }) {
  const { preferences, setPreferences } = usePreferences();
  const [draft, setDraft] = useState(preferences);
  const toggle = (interest) => setDraft((value) => ({ ...value, interests: value.interests.includes(interest) ? value.interests.filter((item) => item !== interest) : [...value.interests, interest] }));
  const discover = () => { setPreferences(draft); navigation.navigate('Recommendations', { origin: route.params.origin }); };

  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={styles.intro}><Text style={styles.eyebrow}>BUILD YOUR TRAIL</Text><Text style={styles.title}>Make the next place feel like yours.</Text><Text style={styles.help}>Choose a category, pace and distance. We’ll fetch places that match before you set out.</Text></View>
    <View style={styles.section}><Text style={styles.label}>Choose a category</Text><Text style={styles.helper}>Start with the kind of place you want to explore.</Text><View style={styles.categoryGrid}>{categories.map((category) => <Pressable key={category} onPress={() => setDraft({ ...draft, category })} style={[styles.categoryOption, draft.category === category && styles.categorySelected]}><Text style={[styles.categoryText, draft.category === category && styles.categoryTextSelected]}>{category === 'all' ? 'Everything' : category}</Text><Text style={[styles.categoryMark, draft.category === category && styles.categoryMarkSelected]}>{draft.category === category ? '✓' : '○'}</Text></Pressable>)}</View></View>
    <View style={styles.section}><Text style={styles.label}>What matters to you?</Text><Text style={styles.helper}>Fine-tune the mood without narrowing the category too much.</Text><View style={styles.chips}>{interests.map((interest) => <InterestChip key={interest} label={interest} selected={draft.interests.includes(interest)} onPress={() => toggle(interest)} />)}</View></View>
    <View style={styles.section}><Text style={styles.label}>How far feels right?</Text><View style={styles.options}>{distances.map((distance) => <Pressable key={distance} onPress={() => setDraft({ ...draft, maxDistanceKm: distance })} style={[styles.option, draft.maxDistanceKm === distance && styles.optionSelected]}><Text style={[styles.optionText, draft.maxDistanceKm === distance && styles.optionTextSelected]}>{distance} km</Text></Pressable>)}</View></View>
    <View style={styles.section}><Text style={styles.label}>Crowd preference</Text><View style={styles.options}>{crowds.map((crowd) => <Pressable key={crowd} onPress={() => setDraft({ ...draft, crowdPreference: crowd })} style={[styles.option, draft.crowdPreference === crowd && styles.optionSelected]}><Text style={[styles.optionText, draft.crowdPreference === crowd && styles.optionTextSelected]}>{crowd === 'ANY' ? 'Any level' : crowd}</Text></Pressable>)}</View></View>
    <Pressable style={({ pressed }) => [styles.primary, pressed && styles.primaryPressed]} onPress={discover}><View><Text style={styles.primaryHint}>READY TO SEARCH</Text><Text style={styles.primaryText}>Fetch matching places</Text></View><Text style={styles.primaryArrow}>→</Text></Pressable>
  </ScrollView>;
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.canvas }, content: { padding: 20, paddingBottom: 38 }, intro: { backgroundColor: 'rgba(255,255,255,.72)', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,.94)' }, eyebrow: { color: colors.forest, fontSize: 11, letterSpacing: 1.2 }, title: { fontSize: 29, lineHeight: 37, letterSpacing: -.55, color: colors.ink, marginTop: 8 }, help: { color: colors.muted, fontSize: 14, lineHeight: 22, marginTop: 10 },
  section: { marginTop: 27 }, label: { color: colors.ink, fontSize: 17, lineHeight: 23 }, helper: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 3, marginBottom: 11 }, categoryGrid: { gap: 9 }, categoryOption: { minHeight: 51, borderWidth: 1, borderColor: colors.line, backgroundColor: 'rgba(255,255,255,.72)', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, borderRadius: 15 }, categorySelected: { backgroundColor: colors.forest, borderColor: colors.forest }, categoryText: { color: colors.ink, fontSize: 14, textTransform: 'capitalize' }, categoryTextSelected: { color: colors.white }, categoryMark: { color: colors.muted, fontSize: 16 }, categoryMarkSelected: { color: colors.white },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 }, options: { flexDirection: 'row', gap: 8 }, option: { flex: 1, minHeight: 48, borderWidth: 1, borderColor: colors.line, backgroundColor: 'rgba(255,255,255,.72)', alignItems: 'center', justifyContent: 'center', borderRadius: 14 }, optionSelected: { backgroundColor: colors.forest, borderColor: colors.forest }, optionText: { color: colors.forestDark, fontSize: 11, textAlign: 'center' }, optionTextSelected: { color: colors.white },
  primary: { backgroundColor: colors.forest, minHeight: 62, paddingHorizontal: 18, borderRadius: 18, marginTop: 34, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#74C9EC', shadowOpacity: .25, shadowRadius: 15, shadowOffset: { width: 0, height: 8 }, elevation: 3 }, primaryPressed: { opacity: .84, transform: [{ scale: .985 }] }, primaryHint: { color: 'rgba(255,255,255,.72)', fontSize: 8, letterSpacing: 1 }, primaryText: { color: colors.white, fontSize: 17, marginTop: 3 }, primaryArrow: { color: colors.white, fontSize: 25 }
});
