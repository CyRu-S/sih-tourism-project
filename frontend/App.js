import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { PreferenceProvider } from './src/state/PreferenceContext';

export default function App() {
  return (
    <PreferenceProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <AppNavigator />
      </NavigationContainer>
    </PreferenceProvider>
  );
}
