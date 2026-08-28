import { ActivityIndicator, Pressable, StyleSheet, Text as NativeText, View } from 'react-native';
import { colors, fonts } from '../config/theme';

const Text = ({ style, ...props }) => <NativeText {...props} style={[{ fontFamily: fonts.book }, style]} />;

export function LoadingState({ label = 'Curating places around you…' }) { return <View style={styles.wrap}><ActivityIndicator color={colors.forest} size="large" /><Text style={styles.text}>{label}</Text></View>; }
export function ErrorState({ message, onRetry }) { return <View style={styles.wrap}><Text style={styles.title}>Something went off route</Text><Text style={styles.text}>{message}</Text>{onRetry && <Pressable onPress={onRetry} style={styles.button}><Text style={styles.buttonText}>Try again</Text></Pressable>}</View>; }
export function EmptyState() { return <View style={styles.wrap}><Text style={styles.title}>No close matches yet</Text><Text style={styles.text}>Try increasing your distance or choosing ANY crowd.</Text></View>; }
const styles = StyleSheet.create({ wrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 11, backgroundColor: colors.canvas }, title: { color: colors.ink, fontSize: 20, textAlign: 'center' }, text: { color: colors.muted, textAlign: 'center', lineHeight: 20 }, button: { paddingHorizontal: 16, paddingVertical: 11, borderRadius: 14, backgroundColor: colors.forest, marginTop: 8 }, buttonText: { color: colors.white } });
