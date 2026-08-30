import { Pressable, StyleSheet, Text as NativeText } from 'react-native';
import { colors, fonts } from '../config/theme';

const Text = ({ style, ...props }) => <NativeText {...props} style={[{ fontFamily: fonts.book }, style]} />;

export default function InterestChip({ label, selected, onPress }) {
  return <Pressable onPress={onPress} style={[styles.chip, selected && styles.selected]}><Text style={[styles.text, selected && styles.selectedText]}>{label}</Text></Pressable>;
}
const styles = StyleSheet.create({
  chip: { borderWidth: 1, borderColor: colors.line, borderRadius: 20, paddingHorizontal: 13, paddingVertical: 9, backgroundColor: 'rgba(255,255,255,.72)' },
  selected: { backgroundColor: colors.forest, borderColor: colors.forest },
  text: { color: colors.ink, textTransform: 'capitalize' }, selectedText: { color: colors.white }
});
