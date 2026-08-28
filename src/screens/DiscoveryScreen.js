import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, SafeAreaView, StyleSheet, Text as NativeText, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { demoLocation } from '../data/mockPlaces';
import { colors, fonts } from '../config/theme';

const Text = ({ style, ...props }) => <NativeText {...props} style={[{ fontFamily: fonts.book }, style]} />;

const stages = [
  ['Setting your starting point', 'Using our Kolkata demo location for nearby routes'],
  ['Mapping the city pulse', 'Layering live crowd signals and local rhythm'],
  ['Curating your next stop', 'Matching stories, pace, and places nearby']
];

const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));

export default function DiscoveryScreen({ navigation }) {
  const [stage, setStage] = useState(0);
  const scan = useRef(new Animated.Value(0)).current;
  const reveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let active = true;
    Animated.loop(Animated.timing(scan, { toValue: 1, duration: 2100, easing: Easing.inOut(Easing.sin), useNativeDriver: true })).start();
    Animated.timing(reveal, { toValue: 1, duration: 500, useNativeDriver: true }).start();

    async function begin() {
      if (!active) return;
      setStage(1);
      await wait(850);
      if (!active) return;
      setStage(2);
      await wait(1250);
      if (active) navigation.replace('Preferences', { origin: demoLocation });
    }
    begin();
    return () => { active = false; scan.stopAnimation(); };
  }, [navigation, reveal, scan]);

  const scannerStyle = { transform: [{ translateY: scan.interpolate({ inputRange: [0, 1], outputRange: [-108, 108] }) }] };
  const screenStyle = { opacity: reveal, transform: [{ translateY: reveal.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }] };

  return <SafeAreaView style={styles.safe}><StatusBar style="dark" /><Animated.View style={[styles.screen, screenStyle]}>
    <View style={styles.header}><Text style={styles.brand}>VOYAGE</Text><Text style={styles.headerStatus}>DISCOVERY ENGINE</Text></View>
    <View style={styles.mapStage}>
      <View style={styles.grid} />
      <View style={styles.ringLarge} /><View style={styles.ringSmall} />
      <View style={styles.crossH} /><View style={styles.crossV} />
      <Animated.View style={[styles.scanner, scannerStyle]} />
      <View style={styles.locationPin}><View style={styles.locationCore} /></View>
      <Text style={styles.mapCaption}>LIVE SIGNAL SEARCH</Text>
    </View>
    <View style={styles.progress}>{stages.map((_, index) => <View key={index} style={[styles.progressSegment, index <= stage && styles.progressActive]} />)}</View>
    <View style={styles.copyBlock}>
      <View style={styles.stageNumber}><Text style={styles.stageNumberText}>0{stage + 1}</Text><ActivityIndicator color={colors.sky} size="small" /></View>
      <Text style={styles.title}>{stages[stage][0]}</Text>
      <Text style={styles.subtitle}>{stages[stage][1]}</Text>
    </View>
    <View style={styles.bottomLine}><View style={styles.pulse} /><Text style={styles.bottomText}>PERSONALISING YOUR VOYAGE</Text></View>
  </Animated.View></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas }, screen: { flex: 1, paddingHorizontal: 24, paddingTop: 12, backgroundColor: colors.canvas },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, brand: { color: colors.ink, fontSize: 13, letterSpacing: 4 }, headerStatus: { color: colors.forest, fontSize: 9, letterSpacing: 1.1 },
  mapStage: { height: 310, marginTop: 44, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 27, backgroundColor: 'rgba(214,243,255,.76)', borderWidth: 1, borderColor: 'rgba(255,255,255,.96)', shadowColor: '#74C9EC', shadowOpacity: .18, shadowRadius: 22, shadowOffset: { width: 0, height: 10 }, elevation: 4 },
  grid: { ...StyleSheet.absoluteFillObject, opacity: .55, backgroundColor: '#D5F1FF', borderWidth: 1, borderColor: 'rgba(102,191,230,.16)' },
  ringLarge: { position: 'absolute', height: 245, width: 245, borderRadius: 130, borderWidth: 1, borderColor: 'rgba(45,156,219,.26)' }, ringSmall: { position: 'absolute', height: 140, width: 140, borderRadius: 75, borderWidth: 1, borderColor: 'rgba(45,156,219,.4)' },
  crossH: { position: 'absolute', width: '100%', height: 1, backgroundColor: 'rgba(45,156,219,.16)' }, crossV: { position: 'absolute', height: '100%', width: 1, backgroundColor: 'rgba(45,156,219,.16)' },
  scanner: { position: 'absolute', width: '140%', height: 2, backgroundColor: colors.forest, shadowColor: colors.sky, shadowOpacity: .9, shadowRadius: 12, elevation: 6 },
  locationPin: { width: 43, height: 43, borderRadius: 25, borderWidth: 9, borderColor: colors.white, backgroundColor: colors.forest, alignItems: 'center', justifyContent: 'center', shadowColor: colors.sky, shadowOpacity: .9, shadowRadius: 20, elevation: 7 }, locationCore: { height: 8, width: 8, borderRadius: 5, backgroundColor: colors.coral },
  mapCaption: { position: 'absolute', left: 15, bottom: 15, color: colors.forestDark, fontSize: 9, letterSpacing: 1.25 },
  progress: { flexDirection: 'row', gap: 6, marginTop: 38 }, progressSegment: { height: 3, flex: 1, borderRadius: 3, backgroundColor: 'rgba(45,156,219,.16)' }, progressActive: { backgroundColor: colors.forest },
  copyBlock: { paddingTop: 20 }, stageNumber: { flexDirection: 'row', gap: 10, alignItems: 'center' }, stageNumberText: { color: colors.forest, fontSize: 11, letterSpacing: 1.5 }, title: { color: colors.ink, fontSize: 31, lineHeight: 37, letterSpacing: -1, marginTop: 11 }, subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 8, maxWidth: 315 },
  bottomLine: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 'auto', paddingBottom: 20 }, pulse: { height: 7, width: 7, borderRadius: 4, backgroundColor: colors.forest }, bottomText: { color: colors.muted, fontSize: 9, letterSpacing: 1.15 }
});
