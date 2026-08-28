import { StyleSheet, Text as NativeText, View } from 'react-native';
import { colors, fonts } from '../config/theme';

const Text = ({ style, ...props }) => <NativeText {...props} style={[{ fontFamily: fonts.book }, style]} />;

export default function CrowdBadge({ crowd }) {
  const low = crowd.level === 'LOW';
  return <View style={[styles.badge, low ? styles.low : styles.medium]}><Text style={[styles.text, low ? styles.lowText : styles.mediumText]}>{crowd.level} CROWD · {crowd.confidence}</Text></View>;
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 99 },
  low: { backgroundColor: colors.moss }, medium: { backgroundColor: '#E5F4FF' },
  text: { fontSize: 10, letterSpacing: .5 },
  lowText: { color: colors.forestDark }, mediumText: { color: colors.forestDark }
});
