import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, SafeAreaView, StyleSheet, Text as NativeText, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import VoyageLogo from '../components/VoyageLogo';
import { colors, fonts } from '../config/theme';

const Text = ({ style, ...props }) => <NativeText {...props} style={[{ fontFamily: fonts.book }, style]} />;

export default function HomeScreen({ navigation }) {
  const logoMotion = useRef(new Animated.Value(0)).current;
  const contentMotion = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(contentMotion, { toValue: .45, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(contentMotion, { toValue: 1, duration: 720, easing: Easing.out(Easing.cubic), useNativeDriver: true })
      ]),
      Animated.loop(Animated.sequence([
        Animated.timing(logoMotion, { toValue: 1, duration: 3200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(logoMotion, { toValue: 0, duration: 3200, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
      ]))
    ]).start();
  }, [contentMotion, logoMotion]);

  const logoStyle = { transform: [{ translateY: logoMotion.interpolate({ inputRange: [0, 1], outputRange: [-8, 9] }) }, { rotate: logoMotion.interpolate({ inputRange: [0, 1], outputRange: ['-2deg', '2deg'] }) }] };
  const contentStyle = { opacity: contentMotion, transform: [{ translateY: contentMotion.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }] };

  return <SafeAreaView style={styles.safe}>
    <StatusBar style="dark" />
    <View style={styles.lightOne} /><View style={styles.lightTwo} /><View style={styles.lightThree} />
    <View style={styles.nav}><View style={styles.navLogo}><VoyageLogo size={33} /></View><View style={styles.status}><View style={styles.statusDot} /><Text style={styles.statusText}>AI PROTOTYPE</Text></View></View>
    <View style={styles.hero}><View style={styles.logoHalo} /><Animated.View style={logoStyle}><VoyageLogo size={206} /></Animated.View><Text style={styles.heroCaption}>AI EXPERIENCE IMPROVISER</Text></View>
    <Animated.View style={[styles.content, contentStyle]}>
      <Text style={styles.title}>Discover places{`\n`}differently.</Text>
      <Text style={styles.copy}>Personalized journeys built around hidden destinations, local stories and meaningful experiences.</Text>
      <View style={styles.glassNote}><View style={styles.noteIcon}><Text style={styles.noteIconText}>✨</Text></View><View><Text style={styles.noteLabel}>PERSONALIZED FLOW</Text><Text style={styles.noteText}>Interests → Hidden Places → Local Stories</Text></View></View>
      <Pressable 
        style={({ pressed }) => [
          styles.glassNote, 
          { marginTop: 10, backgroundColor: 'rgba(255,107,107,.12)', borderColor: 'rgba(255,107,107,.2)' },
          pressed && { opacity: 0.8 }
        ]} 
        onPress={() => navigation.navigate('MapRoute', { place: { placeId: 101, name: 'Kumartuli River Ghat', distanceKm: 5.8 }, origin: demoLocation })}
      >
        <View style={[styles.noteIcon, { backgroundColor: 'rgba(255,107,107,.2)' }]}><Text style={[styles.noteIconText, { color: colors.coral }]}>📊</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.noteLabel, { color: colors.coral }]}>PLAN AROUND THE CROWD</Text>
          <Text style={styles.noteText}>Explore Crowd & Experience Map ›</Text>
        </View>
      </Pressable>
      <Pressable style={({ pressed }) => [styles.primary, pressed && styles.primaryPressed]} onPress={() => navigation.navigate('Discovery')}>
        <Text style={styles.primaryText}>Start exploring</Text><View style={styles.arrowGlass}><Text style={styles.arrow}>→</Text></View>
      </Pressable>
    </Animated.View>
    <View style={styles.footer}><View style={styles.footerLine} /><Text style={styles.footerText}>VOYAGE / EXPERIENCE IMPROVISER</Text></View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, overflow: 'hidden', backgroundColor: '#EFF9FF' },
  lightOne: { position: 'absolute', width: 470, height: 410, borderRadius: 230, backgroundColor: 'rgba(128,214,255,.3)', top: -180, right: -168 }, lightTwo: { position: 'absolute', width: 340, height: 340, borderRadius: 180, backgroundColor: 'rgba(255,255,255,.92)', top: 125, left: -190 }, lightThree: { position: 'absolute', width: 285, height: 285, borderRadius: 150, backgroundColor: 'rgba(159,227,255,.26)', bottom: -115, right: -105 },
  nav: { marginTop: 8, paddingHorizontal: 23, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, navLogo: { width: 35, height: 35, borderRadius: 18, backgroundColor: 'rgba(255,255,255,.56)', borderWidth: 1, borderColor: 'rgba(255,255,255,.9)', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }, status: { backgroundColor: 'rgba(255,255,255,.56)', borderWidth: 1, borderColor: 'rgba(255,255,255,.86)', borderRadius: 99, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 11, paddingVertical: 8 }, statusDot: { height: 6, width: 6, borderRadius: 4, backgroundColor: '#65C8EF' }, statusText: { color: '#4D7790', fontSize: 9, fontWeight: '600', letterSpacing: 1.2 },
  hero: { height: '45%', minHeight: 315, alignItems: 'center', justifyContent: 'center' }, logoHalo: { position: 'absolute', width: 225, height: 225, borderRadius: 114, backgroundColor: 'rgba(255,255,255,.54)', borderWidth: 1, borderColor: 'rgba(255,255,255,.88)', shadowColor: '#63C8F2', shadowOpacity: .27, shadowRadius: 27, shadowOffset: { width: 0, height: 11 }, elevation: 5 }, heroCaption: { position: 'absolute', bottom: 22, color: '#6B91A7', fontSize: 9, fontWeight: '600', letterSpacing: 1.35 },
  content: { paddingHorizontal: 23 }, title: { color: '#234A65', fontSize: 38, lineHeight: 42, letterSpacing: -1.5, fontWeight: '600' }, copy: { maxWidth: 330, marginTop: 12, color: '#708FA2', fontSize: 15, fontWeight: '400', lineHeight: 22 },
  glassNote: { marginTop: 21, backgroundColor: 'rgba(255,255,255,.48)', borderWidth: 1, borderColor: 'rgba(255,255,255,.86)', borderRadius: 18, minHeight: 62, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 10, shadowColor: '#91CDE9', shadowOpacity: .1, shadowRadius: 14, shadowOffset: { width: 0, height: 7 }, elevation: 2 }, noteIcon: { height: 38, width: 38, borderRadius: 13, backgroundColor: 'rgba(151,223,255,.36)', borderWidth: 1, borderColor: 'rgba(255,255,255,.9)', alignItems: 'center', justifyContent: 'center' }, noteIconText: { color: '#327EA4', fontSize: 12, fontWeight: '600' }, noteLabel: { color: '#77A2B9', fontSize: 8, fontWeight: '600', letterSpacing: 1.05 }, noteText: { color: '#42667B', fontSize: 13, fontWeight: '500', marginTop: 3 },
  primary: { marginTop: 16, minHeight: 58, borderRadius: 18, paddingLeft: 19, paddingRight: 9, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,.62)', borderWidth: 1, borderColor: 'rgba(255,255,255,.98)', shadowColor: '#6DBDDC', shadowOpacity: .22, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 4 }, primaryPressed: { opacity: .8, transform: [{ scale: .985 }] }, primaryText: { color: '#22638B', fontSize: 16, fontWeight: '600' }, arrowGlass: { height: 40, width: 40, borderRadius: 20, backgroundColor: 'rgba(102,202,244,.24)', borderWidth: 1, borderColor: 'rgba(255,255,255,.9)', justifyContent: 'center', alignItems: 'center' }, arrow: { color: '#287CA8', fontSize: 20, fontWeight: '400' },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 'auto', paddingHorizontal: 23, paddingBottom: 18 }, footerLine: { width: 17, height: 1, backgroundColor: '#9ED7EF' }, footerText: { color: '#87ABBD', fontSize: 8, letterSpacing: 1.25, fontWeight: '600' }
});
