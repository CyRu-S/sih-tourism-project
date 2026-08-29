import React from 'react';
import { StyleSheet, Text as NativeText, View } from 'react-native';
import { colors, fonts } from '../config/theme';

const Text = ({ style, ...props }) => <NativeText {...props} style={[{ fontFamily: fonts.book }, style]} />;

export default function CrowdBadge({ crowd }) {
  const level = crowd?.level || 'MEDIUM';
  
  const config = {
    LOW: { dot: '🟢', bg: '#E2F7EE', text: '#198754' },
    MEDIUM: { dot: '🟡', bg: '#FFFDE7', text: '#F2C94C' },
    HIGH: { dot: '🔴', bg: '#FFF5F5', text: '#DC3545' }
  }[level] || { dot: '🟡', bg: '#E5F4FF', text: colors.forestDark };

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text, fontWeight: 'bold' }]}>
        {config.dot} {level} CROWD
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { 
    alignSelf: 'flex-start', 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)'
  },
  text: { 
    fontSize: 9, 
    letterSpacing: .5 
  }
});
