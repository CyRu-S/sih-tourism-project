import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MapView = forwardRef(({ children, style, onMapReady }, ref) => {
  useImperativeHandle(ref, () => ({
    fitToCoordinates: (coordinates, options) => {
      console.log('Mock fitToCoordinates:', coordinates);
    },
    animateCamera: (camera, options) => {
      console.log('Mock animateCamera:', camera);
    }
  }));

  useEffect(() => {
    if (onMapReady) {
      const timer = setTimeout(onMapReady, 300);
      return () => clearTimeout(timer);
    }
  }, [onMapReady]);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.mapLabel}>🗺️ Live Map Sandbox (Web Mock)</Text>
      <View style={styles.markerContainer}>
        {children}
      </View>
    </View>
  );
});

export const Marker = ({ children, onPress }) => {
  return (
    <View style={styles.marker} onStartShouldSetResponder={() => true} onResponderRelease={onPress}>
      {children}
    </View>
  );
};

export const Circle = () => {
  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d8eaf5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  mapLabel: {
    color: '#4a6681',
    fontWeight: 'bold',
    fontSize: 14,
    position: 'absolute',
    top: 150
  },
  markerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80
  },
  marker: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default MapView;
