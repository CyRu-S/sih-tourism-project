import { createContext, useContext, useMemo, useState } from 'react';

const PreferenceContext = createContext(null);

const defaults = {
  interests: [],
  category: 'all',
  maxDistanceKm: 15,
  crowdPreference: 'LOW',
  accessibilityNeeds: [],
  budget: '15K',
  travelStyle: 'off-beat',
  groupType: 'solo',
  hiddenPreference: 'hidden'
};

export function PreferenceProvider({ children }) {
  const [preferences, setPreferences] = useState(defaults);
  const value = useMemo(() => ({ preferences, setPreferences }), [preferences]);
  return <PreferenceContext.Provider value={value}>{children}</PreferenceContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferenceContext);
  if (!context) throw new Error('usePreferences must be used inside PreferenceProvider');
  return context;
}
