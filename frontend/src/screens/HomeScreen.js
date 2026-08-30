import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text as NativeText, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import VoyageLogo from '../components/VoyageLogo';
import { colors, fonts } from '../config/theme';
import { useAuth } from '../state/AuthContext';
import { demoLocation, places } from '../data/mockPlaces';

const Text = ({ style, ...props }) => <NativeText {...props} style={[{ fontFamily: fonts.book }, style]} />;

export default function HomeScreen({ navigation }) {
  const logoMotion = useRef(new Animated.Value(0)).current;
  const contentMotion = useRef(new Animated.Value(0)).current;
  const { logout } = useAuth();

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

  // Default target for "Explore Hidden Places"
  const defaultPlace = places[0] || { placeId: 201, name: 'Kumartuli River Ghat', location: { lat: 22.6201, lng: 88.3654 }, estimatedCrowd: { level: 'LOW' } };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.lightOne} /><View style={styles.lightTwo} /><View style={styles.lightThree} />
      
      {/* Navigation Header */}
      <View style={styles.nav}>
        <View style={styles.navLogo}><VoyageLogo size={33} /></View>
        <View style={styles.navRight}>
          <View style={styles.status}><View style={styles.statusDot} /><Text style={styles.statusText}>AI EXPERIENCE PLANNER</Text></View>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.logoHalo} />
          <Animated.View style={logoStyle}>
            <VoyageLogo size={180} />
          </Animated.View>
          <Text style={styles.heroCaption}>AI EXPERIENCE IMPROVISER</Text>
        </View>

        <Animated.View style={[styles.content, contentStyle]}>
          {/* Main Headings */}
          <Text style={styles.title}>Your Journey.{`\n`}Your Story.{`\n`}Your Experience.</Text>
          <Text style={styles.copy}>
            Discover lesser-known places, understand their stories, and let your journey adapt to what you want.
          </Text>

          {/* 4-Step Concept Flow */}
          <View style={styles.flowContainer}>
            <View style={styles.flowStep}><Text style={styles.flowIcon}>🎯</Text><Text style={styles.flowText}>Personalized</Text></View>
            <Text style={styles.flowArrow}>→</Text>
            <View style={styles.flowStep}><Text style={styles.flowIcon}>💎</Text><Text style={styles.flowText}>Hidden Places</Text></View>
            <Text style={styles.flowArrow}>→</Text>
            <View style={styles.flowStep}><Text style={styles.flowIcon}>📖</Text><Text style={styles.flowText}>Local Stories</Text></View>
            <Text style={styles.flowArrow}>→</Text>
            <View style={styles.flowStep}><Text style={styles.flowIcon}>✨</Text><Text style={styles.flowText}>Better Experiences</Text></View>
          </View>

          {/* Action CTAs */}
          <Pressable 
            style={({ pressed }) => [styles.primary, pressed && styles.primaryPressed]} 
            onPress={() => navigation.navigate('Discovery')}
          >
            <Text style={styles.primaryText}>Build My Experience</Text>
            <View style={styles.arrowGlass}><Text style={styles.arrow}>→</Text></View>
          </Pressable>

          <Pressable 
            style={({ pressed }) => [styles.secondary, pressed && styles.primaryPressed]} 
            onPress={() => navigation.navigate('MapRoute', { place: defaultPlace, origin: demoLocation })}
          >
            <Text style={styles.secondaryText}>Explore Hidden Places</Text>
            <Text style={styles.secondaryArrow}>🧭</Text>
          </Pressable>

          {/* Why This App? 2x2 Grid */}
          <View style={styles.gridSection}>
            <Text style={styles.gridHeading}>Not just another place recommender</Text>
            <View style={styles.grid}>
              <View style={styles.gridCard}>
                <Text style={styles.cardHeader}>💎 Discover Differently</Text>
                <Text style={styles.cardBody}>Find meaningful lesser-known destinations that fit you.</Text>
              </View>
              <View style={styles.gridCard}>
                <Text style={styles.cardHeader}>📖 Know Before You Go</Text>
                <Text style={styles.cardBody}>Understand the history, culture and stories behind places.</Text>
              </View>
            </View>
            <View style={styles.grid}>
              <View style={styles.gridCard}>
                <Text style={styles.cardHeader}>🧭 Experience, Not Visit</Text>
                <Text style={styles.cardBody}>Build authentic activities around your own interests.</Text>
              </View>
              <View style={styles.gridCard}>
                <Text style={styles.cardHeader}>🔄 Adapt as You Travel</Text>
                <Text style={styles.cardBody}>Change your journey when budget, crowds or interests shift.</Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.footerLine} />
            <Text style={styles.footerText}>VOYAGE / EXPERIENCE IMPROVISER</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, overflow: 'hidden', backgroundColor: '#EFF9FF' },
  lightOne: { position: 'absolute', width: 470, height: 410, borderRadius: 230, backgroundColor: 'rgba(128,214,255,.3)', top: -180, right: -168 }, 
  lightTwo: { position: 'absolute', width: 340, height: 340, borderRadius: 180, backgroundColor: 'rgba(255,255,255,.92)', top: 125, left: -190 }, 
  lightThree: { position: 'absolute', width: 285, height: 285, borderRadius: 150, backgroundColor: 'rgba(159,227,255,.26)', bottom: -115, right: -105 },
  nav: { marginTop: 8, paddingHorizontal: 23, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }, 
  navLogo: { width: 35, height: 35, borderRadius: 18, backgroundColor: 'rgba(255,255,255,.56)', borderWidth: 1, borderColor: 'rgba(255,255,255,.9)', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }, 
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 10 }, 
  status: { backgroundColor: 'rgba(255,255,255,.56)', borderWidth: 1, borderColor: 'rgba(255,255,255,.86)', borderRadius: 99, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 11, paddingVertical: 8 }, 
  statusDot: { height: 6, width: 6, borderRadius: 4, backgroundColor: '#39B88B' }, 
  statusText: { color: '#4D7790', fontSize: 9, fontWeight: '600', letterSpacing: 1.2 }, 
  logoutBtn: { backgroundColor: 'rgba(255,255,255,.6)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,.9)' }, 
  logoutBtnText: { color: '#234A65', fontSize: 10, fontWeight: 'bold' },
  scroll: { flexGrow: 1, paddingBottom: 30 },
  hero: { height: 270, alignItems: 'center', justifyContent: 'center' }, 
  logoHalo: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,.54)', borderWidth: 1, borderColor: 'rgba(255,255,255,.88)', shadowColor: '#63C8F2', shadowOpacity: .27, shadowRadius: 27, shadowOffset: { width: 0, height: 11 }, elevation: 5 }, 
  heroCaption: { position: 'absolute', bottom: 15, color: '#6B91A7', fontSize: 9, fontWeight: '600', letterSpacing: 1.35 },
  content: { paddingHorizontal: 23 }, 
  title: { color: '#234A65', fontSize: 34, lineHeight: 40, letterSpacing: -1.2, fontWeight: 'bold' }, 
  copy: { marginTop: 12, color: '#708FA2', fontSize: 15, fontWeight: '400', lineHeight: 22 },
  
  flowContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,.45)', borderWidth: 1, borderColor: 'rgba(255,255,255,.8)', paddingVertical: 12, paddingHorizontal: 10, borderRadius: 16, marginTop: 20, shadowColor: '#91CDE9', shadowOpacity: .08, shadowRadius: 10, elevation: 1 },
  flowStep: { alignItems: 'center', flex: 1 },
  flowIcon: { fontSize: 14 },
  flowText: { fontSize: 8, color: '#4D7790', fontWeight: 'bold', marginTop: 3, textAlign: 'center' },
  flowArrow: { color: '#A8D4EB', fontSize: 12, fontWeight: 'bold' },

  primary: { marginTop: 22, minHeight: 58, borderRadius: 18, paddingLeft: 19, paddingRight: 9, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.forest, borderWidth: 1, borderColor: colors.white, shadowColor: '#6DBDDC', shadowOpacity: .25, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 4 }, 
  primaryPressed: { opacity: .88, transform: [{ scale: .985 }] }, 
  primaryText: { color: colors.white, fontSize: 16, fontWeight: 'bold' }, 
  arrowGlass: { height: 40, width: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,.2)', justifyContent: 'center', alignItems: 'center' }, 
  arrow: { color: colors.white, fontSize: 20, fontWeight: 'bold' },
  
  secondary: { marginTop: 12, minHeight: 54, borderRadius: 18, paddingHorizontal: 19, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,.55)', borderWidth: 1, borderColor: 'rgba(255,255,255,.9)', shadowColor: '#91CDE9', shadowOpacity: .1, shadowRadius: 10, elevation: 2 },
  secondaryText: { color: '#22638B', fontSize: 14, fontWeight: '600' },
  secondaryArrow: { fontSize: 16 },

  gridSection: { marginTop: 35 },
  gridHeading: { color: '#234A65', fontSize: 17, fontWeight: 'bold', marginBottom: 14 },
  grid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  gridCard: { flex: 1, backgroundColor: 'rgba(255,255,255,.45)', borderWidth: 1, borderColor: 'rgba(255,255,255,.86)', padding: 14, borderRadius: 16, shadowColor: '#91CDE9', shadowOpacity: .06, shadowRadius: 10, elevation: 1 },
  cardHeader: { color: '#22638B', fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
  cardBody: { color: '#708FA2', fontSize: 10.5, lineHeight: 15 },

  footer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 40, paddingBottom: 10 }, 
  footerLine: { width: 17, height: 1, backgroundColor: '#9ED7EF' }, 
  footerText: { color: '#87ABBD', fontSize: 8, letterSpacing: 1.25, fontWeight: '600' }
});
