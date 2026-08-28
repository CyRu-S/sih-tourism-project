// 10.0.2.2 reaches the host machine from the Android emulator. For a physical
// phone, set EXPO_PUBLIC_API_URL to the host computer's LAN address.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8010';

// Real API calls are the default. Set this explicitly to true only for UI demos.
export const USE_MOCK_DATA = process.env.EXPO_PUBLIC_USE_MOCK_DATA === 'true';
