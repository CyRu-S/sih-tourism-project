import { Platform } from 'react-native';

// 10.0.2.2 reaches the host machine from the Android emulator. Chrome on the
// same machine must use localhost; physical devices need the machine's LAN IP.
const defaultApiUrl = Platform.OS === 'web' ? 'http://localhost:8010' : 'http://10.0.2.2:8010';

// A physical device needs EXPO_PUBLIC_API_URL set to the computer's LAN address.
// A browser running on the computer must always use localhost: Windows may not
// route its own LAN address back to the local development server.
export const API_BASE_URL = Platform.OS === 'web'
  ? defaultApiUrl
  : (process.env.EXPO_PUBLIC_API_URL || defaultApiUrl);

// Real API calls are the default. Set this explicitly to true only for UI demos.
export const USE_MOCK_DATA = process.env.EXPO_PUBLIC_USE_MOCK_DATA === 'true';
