import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../state/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import DiscoveryScreen from '../screens/DiscoveryScreen';
import ExploreMapScreen from '../screens/ExploreMapScreen';
import HomeScreen from '../screens/HomeScreen';
import MapRouteScreen from '../screens/MapRouteScreen';
import PlaceDetailsScreen from '../screens/PlaceDetailsScreen';
import PreferencesScreen from '../screens/PreferencesScreen';
import RecommendationsScreen from '../screens/RecommendationsScreen';
import ItineraryImproviserScreen from '../screens/ItineraryImproviserScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { userRole } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userRole === null ? (
        // No user is logged in
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : userRole === 'admin' ? (
        // Admin is logged in
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      ) : (
        // Tourist is logged in
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Discovery" component={DiscoveryScreen} />
          <Stack.Screen name="Preferences" component={PreferencesScreen} />
          <Stack.Screen name="Recommendations" component={RecommendationsScreen} />
          <Stack.Screen name="ExploreMap" component={ExploreMapScreen} />
          <Stack.Screen name="PlaceDetails" component={PlaceDetailsScreen} />
          <Stack.Screen name="MapRoute" component={MapRouteScreen} />
          <Stack.Screen name="ItineraryImproviser" component={ItineraryImproviserScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
