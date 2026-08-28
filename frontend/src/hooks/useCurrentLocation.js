import { useState } from 'react';
import { demoLocation } from '../data/mockPlaces';

export function useCurrentLocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function requestLocation() {
    setLoading(true);
    setError(null);
    setLocation(demoLocation);
    setLoading(false);
    return demoLocation;
  }

  function useDemoLocation() {
    setError(null);
    setLocation(demoLocation);
    return demoLocation;
  }

  return { location, loading, error, requestLocation, useDemoLocation };
}
