import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Discovery" component={DiscoveryScreen} />
      <Stack.Screen name="Preferences" component={PreferencesScreen} />
      <Stack.Screen name="Recommendations" component={RecommendationsScreen} />
      <Stack.Screen name="ExploreMap" component={ExploreMapScreen} />
      <Stack.Screen name="PlaceDetails" component={PlaceDetailsScreen} />
      <Stack.Screen name="MapRoute" component={MapRouteScreen} />
      <Stack.Screen name="ItineraryImproviser" component={ItineraryImproviserScreen} />
    </Stack.Navigator>
  );
}
