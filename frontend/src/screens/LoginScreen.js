import React, { useState } from 'react';
import { View, Text as NativeText, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import VoyageLogo from '../components/VoyageLogo';
import { colors, fonts } from '../config/theme';
import { useAuth } from '../state/AuthContext';

const Text = ({ style, ...props }) => <NativeText {...props} style={[{ fontFamily: fonts.book }, style]} />;

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = () => {
    if (login(username, password)) {
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.lightOne} /><View style={styles.lightTwo} /><View style={styles.lightThree} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoHalo} />
            <VoyageLogo size={120} />
          </View>
          
          <Text style={styles.title}>Welcome back.</Text>
          <Text style={styles.subtitle}>Sign in to continue your journey</Text>

          <View style={styles.glassContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#708FA2"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#708FA2"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.primary} onPress={handleLogin}>
              <Text style={styles.primaryText}>Login</Text>
              <View style={styles.arrowGlass}><Text style={styles.arrow}>→</Text></View>
            </TouchableOpacity>
          </View>

          <View style={styles.demoInfo}>
            <Text style={styles.demoTitle}>Demo Accounts</Text>
            <Text style={styles.demoText}>Admin: <Text style={{fontWeight: 'bold'}}>admin / admin</Text></Text>
            <Text style={styles.demoText}>Tourist: <Text style={{fontWeight: 'bold'}}>user / user</Text></Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, overflow: 'hidden', backgroundColor: '#EFF9FF' },
  lightOne: { position: 'absolute', width: 470, height: 410, borderRadius: 230, backgroundColor: 'rgba(128,214,255,.3)', top: -180, right: -168 }, 
  lightTwo: { position: 'absolute', width: 340, height: 340, borderRadius: 180, backgroundColor: 'rgba(255,255,255,.92)', top: 125, left: -190 }, 
  lightThree: { position: 'absolute', width: 285, height: 285, borderRadius: 150, backgroundColor: 'rgba(159,227,255,.26)', bottom: -115, right: -105 },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 23,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoHalo: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,.54)', borderWidth: 1, borderColor: 'rgba(255,255,255,.88)', shadowColor: '#63C8F2', shadowOpacity: .27, shadowRadius: 27, shadowOffset: { width: 0, height: 11 }, elevation: 5 },
  title: { color: '#234A65', fontSize: 32, lineHeight: 38, letterSpacing: -1, fontWeight: '600', marginBottom: 8 },
  subtitle: { color: '#708FA2', fontSize: 15, fontWeight: '400', marginBottom: 30 },
  glassContainer: {
    backgroundColor: 'rgba(255,255,255,.48)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.86)',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#91CDE9',
    shadowOpacity: .1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 2,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.9)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    color: '#234A65',
    fontSize: 16,
  },
  errorText: {
    color: '#e53e3e',
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  primary: { minHeight: 58, borderRadius: 18, paddingLeft: 19, paddingRight: 9, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,.62)', borderWidth: 1, borderColor: 'rgba(255,255,255,.98)', shadowColor: '#6DBDDC', shadowOpacity: .22, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
  primaryText: { color: '#22638B', fontSize: 16, fontWeight: '600' },
  arrowGlass: { height: 40, width: 40, borderRadius: 20, backgroundColor: 'rgba(102,202,244,.24)', borderWidth: 1, borderColor: 'rgba(255,255,255,.9)', justifyContent: 'center', alignItems: 'center' },
  arrow: { color: '#287CA8', fontSize: 20, fontWeight: '400' },
  demoInfo: {
    marginTop: 40,
    alignItems: 'center',
  },
  demoTitle: {
    color: '#234A65',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 1,
  },
  demoText: {
    color: '#708FA2',
    fontSize: 13,
    marginBottom: 4,
  }
});
