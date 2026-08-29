import React, { useState, useEffect } from 'react';
import { View, Text as NativeText, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../state/AuthContext';
import { fonts } from '../config/theme';
import { fetchDashboardStats, updatePlaceStatus } from '../api/adminApi';

const Text = ({ style, ...props }) => <NativeText {...props} style={[{ fontFamily: fonts.book }, style]} />;

export default function AdminDashboardScreen() {
  const { logout } = useAuth();
  const [recommendationsEnabled, setRecommendationsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState([]);
  const [placesData, setPlacesData] = useState([]);

  const loadData = async () => {
    try {
      const data = await fetchDashboardStats();
      const statsArray = [
        { label: 'TOTAL VERIFIED PLACES', value: data.stats.totalVerifiedPlaces || 0 },
        { label: 'PENDING SUBMISSIONS', value: data.stats.pendingSubmissions || 0 },
        { label: 'RECOMMENDATIONS TODAY', value: data.stats.recommendationsToday || 0 },
        { label: 'VERIFIED VISITS TODAY', value: data.stats.verifiedVisitsToday || 0 },
        { label: 'OVEREXPOSED DESTINATIONS', value: data.stats.overexposedDestinations || 0, alert: true },
        { label: 'UNDEREXPOSED DESTINATIONS', value: data.stats.underexposedDestinations || 0 }
      ];
      setStats(statsArray);
      setPlacesData(data.places || []);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await updatePlaceStatus(id, action);
      // Optimistic UI update or reload data
      loadData();
    } catch (e) {
      Alert.alert("Error", "Failed to update status");
    }
  };

  const handleEmergencyOverride = () => {
    Alert.alert(
      "Emergency Override",
      "Select an override reason:",
      [
        { text: "Place closed temporarily", onPress: () => console.log("Override: Closed") },
        { text: "Unsafe weather", onPress: () => console.log("Override: Weather") },
        { text: "Religious ceremony", onPress: () => console.log("Override: Ceremony") },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#327EA4" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.lightOne} /><View style={styles.lightTwo} /><View style={styles.lightThree} />
      
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Destination Manager</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.systemControl}>
          <Text style={styles.systemControlText}>Recommendation Engine</Text>
          <Switch 
            value={recommendationsEnabled} 
            onValueChange={setRecommendationsEnabled} 
            trackColor={{ false: "rgba(255,255,255,.5)", true: "#65C8EF" }}
            thumbColor={recommendationsEnabled ? "#234A65" : "#f4f3f4"}
          />
        </View>
        {!recommendationsEnabled && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>System is currently paused. No new recommendations are being served.</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Overview Stats</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={[styles.statValue, stat.alert && styles.statAlert]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.tableHeaderContainer}>
          <Text style={styles.sectionTitle}>Visitor Distribution</Text>
          <TouchableOpacity style={styles.overrideButton} onPress={handleEmergencyOverride}>
            <Text style={styles.overrideButtonText}>Emergency Override</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.glassTableWrapper}>
          <ScrollView horizontal style={styles.tableContainer}>
            <View>
              <View style={styles.tableRowHeader}>
                <Text style={[styles.tableCellHeader, { width: 120 }]}>Place</Text>
                <Text style={[styles.tableCellHeader, { width: 80 }]}>Crowd</Text>
                <Text style={[styles.tableCellHeader, { width: 100 }]}>Rec. Today</Text>
                <Text style={[styles.tableCellHeader, { width: 80 }]}>Visits</Text>
                <Text style={[styles.tableCellHeader, { width: 100 }]}>Status</Text>
                <Text style={[styles.tableCellHeader, { width: 230 }]}>Actions</Text>
              </View>

              {placesData.map((item) => (
                <View key={item.id} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: 120 }]} numberOfLines={1}>{item.place}</Text>
                  <Text style={[styles.tableCell, { width: 80 }]}>{item.crowd}</Text>
                  <Text style={[styles.tableCell, { width: 100 }]}>{item.recommended}</Text>
                  <Text style={[styles.tableCell, { width: 80 }]}>{item.visits}</Text>
                  <Text style={[styles.tableCell, { width: 100, fontWeight: 'bold' }]}>{item.status}</Text>
                  
                  <View style={[styles.tableCell, styles.actionCell, { width: 230 }]}>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#48bb78' }]} onPress={() => handleAction(item.id, 'PROMOTE')}>
                      <Text style={styles.actionBtnText}>PROM</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#ecc94b' }]} onPress={() => handleAction(item.id, 'NORMAL')}>
                      <Text style={styles.actionBtnText}>NORM</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#ed8936' }]} onPress={() => handleAction(item.id, 'REDUCE')}>
                      <Text style={styles.actionBtnText}>RED</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#f56565' }]} onPress={() => handleAction(item.id, 'PAUSE')}>
                      <Text style={styles.actionBtnText}>PAUS</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 23,
    paddingVertical: 16,
  },
  headerTitle: {
    color: '#234A65',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.9)',
  },
  logoutText: {
    color: '#234A65',
    fontSize: 12,
    fontWeight: 'bold',
  },
  systemControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 23,
    backgroundColor: 'rgba(255,255,255,.48)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.86)',
    borderRadius: 18,
    marginBottom: 10,
    shadowColor: '#91CDE9',
    shadowOpacity: .1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 2,
  },
  systemControlText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#234A65',
  },
  warningBox: {
    marginHorizontal: 23,
    backgroundColor: 'rgba(254, 215, 215, 0.8)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#feb2b2',
  },
  warningText: {
    color: '#c53030',
    textAlign: 'center',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#234A65',
    paddingHorizontal: 23,
    paddingTop: 16,
    paddingBottom: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
  },
  statCard: {
    width: '44%',
    margin: '3%',
    backgroundColor: 'rgba(255,255,255,.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.9)',
    padding: 16,
    borderRadius: 18,
    shadowColor: '#91CDE9',
    shadowOpacity: .1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#327EA4',
  },
  statAlert: {
    color: '#e53e3e',
  },
  statLabel: {
    fontSize: 10,
    color: '#708FA2',
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tableHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 23,
    marginTop: 10,
  },
  overrideButton: {
    backgroundColor: 'rgba(229, 62, 62, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 8,
  },
  overrideButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 11,
  },
  glassTableWrapper: {
    marginHorizontal: 23,
    backgroundColor: 'rgba(255,255,255,.55)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.9)',
    overflow: 'hidden',
    shadowColor: '#91CDE9',
    shadowOpacity: .1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 2,
    marginTop: 10,
  },
  tableContainer: {
    width: '100%',
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(151,223,255,.2)',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,.6)',
  },
  tableCellHeader: {
    fontWeight: '700',
    color: '#327EA4',
    fontSize: 12,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,.6)',
    alignItems: 'center',
  },
  tableCell: {
    color: '#234A65',
    fontSize: 13,
  },
  actionCell: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 6,
  },
  actionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
